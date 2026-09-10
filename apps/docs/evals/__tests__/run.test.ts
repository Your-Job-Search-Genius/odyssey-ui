import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import { beforeEach, describe, expect, it } from "vitest";
import type { AgentClient, AgentCompletion } from "~/lib/playground/groq-client.js";
import { runEvals } from "../run.js";
import type { GoldenPrompt } from "../types.js";

let registry: Registry;
beforeEach(() => {
    registry = loadRegistry();
});

function scriptedClient(script: AgentCompletion[]): AgentClient {
    let i = 0;
    return {
        async complete() {
            const next = script[i];
            if (!next) throw new Error("scriptedClient: ran out of scripted responses");
            i += 1;
            return next;
        },
    };
}

const insertButtonPrompt: GoldenPrompt = {
    id: "p1",
    prompt: "Add a button",
    category: "basic",
    expectedOutcome: "A Button.",
    assertions: [{ type: "treeContainsComponent", name: "Button" }, { type: "firstAttemptAccepted" }],
};

describe("runEvals: aggregation", () => {
    it("reports pass for a prompt whose assertions all hold", async () => {
        const client = scriptedClient([
            { content: null, toolCalls: [{ id: "1", name: "list_components", arguments: "{}" }] },
            {
                content: null,
                toolCalls: [
                    {
                        id: "2",
                        name: "propose_ops",
                        arguments: JSON.stringify({
                            ops: [
                                {
                                    op: "insert",
                                    parentId: "root",
                                    node: { id: "btn", kind: "component", name: "Button", props: { color: { t: "enum", v: "primary" } }, children: [] },
                                },
                            ],
                            summary: "Added a button.",
                        }),
                    },
                ],
            },
            { content: "Added it." },
        ]);

        const summary = await runEvals([insertButtonPrompt], { client, registry });
        expect(summary.total).toBe(1);
        expect(summary.passed).toBe(1);
        expect(summary.passRate).toBe(1);
        expect(summary.firstAttemptAcceptanceRate).toBe(1);
        expect(summary.hallucinationCount).toBe(0);
    });

    it("reports fail for a prompt whose assertions don't hold", async () => {
        const client = scriptedClient([{ content: "Here's some unrelated text, no tree change." }]);
        const summary = await runEvals([insertButtonPrompt], { client, registry });
        expect(summary.passed).toBe(0);
        expect(summary.results[0]?.assertionResults.some((a) => !a.pass)).toBe(true);
    });

    it("computes firstAttemptAcceptanceRate only over prompts that called propose_ops at least once", async () => {
        const neverProposes: GoldenPrompt = { ...insertButtonPrompt, id: "p2", assertions: [{ type: "reportedUnavailable" }] };
        const client = scriptedClient([
            { content: "I can't do that.", toolCalls: [{ id: "1", name: "report_unavailable", arguments: JSON.stringify({ what: "x", alternatives: [] }) }] },
            { content: "Explained." },
        ]);
        const summary = await runEvals([neverProposes], { client, registry });
        expect(summary.firstAttemptAcceptanceRate).toBe(0); // no propose_ops calls -> denominator is 0 -> reported as 0, not NaN
        expect(Number.isNaN(summary.firstAttemptAcceptanceRate)).toBe(false);
    });

    it("counts a hallucination when a propose_ops rejection mentions an unknown component", async () => {
        const client = scriptedClient([
            { content: null, toolCalls: [{ id: "1", name: "list_components", arguments: "{}" }] },
            {
                content: null,
                toolCalls: [
                    {
                        id: "2",
                        name: "propose_ops",
                        arguments: JSON.stringify({
                            ops: [{ op: "insert", parentId: "root", node: { id: "x", kind: "component", name: "TotallyFake", props: {}, children: [] } }],
                            summary: "x",
                        }),
                    },
                ],
            },
            { content: "Couldn't do it." },
        ]);
        const withHallucinationCheck: GoldenPrompt = { ...insertButtonPrompt, id: "p3", assertions: [{ type: "noHallucinatedComponentsOrIcons" }] };
        const summary = await runEvals([withHallucinationCheck], { client, registry });
        expect(summary.hallucinationCount).toBe(1);
    });

    it("records a per-prompt error rather than throwing when the client itself fails", async () => {
        const client: AgentClient = {
            async complete() {
                throw new Error("network exploded");
            },
        };
        const summary = await runEvals([insertButtonPrompt], { client, registry });
        expect(summary.results[0]?.error).toContain("network exploded");
        expect(summary.results[0]?.pass).toBe(false);
    });

    it("runs every prompt even when an earlier one errors", async () => {
        let call = 0;
        const client: AgentClient = {
            async complete() {
                call += 1;
                if (call === 1) throw new Error("first prompt fails");
                return { content: "ok, second prompt handled" };
            },
        };
        const second: GoldenPrompt = { ...insertButtonPrompt, id: "p4", assertions: [{ type: "reportedUnavailable" }] };
        const summary = await runEvals([insertButtonPrompt, second], { client, registry });
        expect(summary.total).toBe(2);
        expect(summary.results[0]?.error).toBeDefined();
        expect(summary.results[1]?.error).toBeUndefined();
    });
});
