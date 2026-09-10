import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import type { UITree } from "@your-job-search-genius/ui-tree";
import { beforeEach, describe, expect, it } from "vitest";
import { MAX_AGENT_ROUNDS, runAgentTurn } from "../lib/playground/agent.js";
import type { AgentClient, AgentCompletion } from "../lib/playground/groq-client.js";
import { MAX_PROPOSE_OPS_ATTEMPTS } from "../lib/playground/tool-executor.js";

const emptyTree: UITree = { rootId: "root", nodes: { root: { id: "root", kind: "primitive", tag: "div", className: [], children: [] } } };

let registry: Registry;
beforeEach(() => {
    registry = loadRegistry();
});

/** A fake client that replays a fixed script of responses, one per call(), regardless of the messages it's given -- enough to drive the loop's branching without a live model. */
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

describe("runAgentTurn: happy path", () => {
    it("discovers, proposes ops, then returns final text with the new tree", async () => {
        const client = scriptedClient([
            { content: null, toolCalls: [{ id: "1", name: "list_components", arguments: JSON.stringify({ category: "base" }) }] },
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
            { content: "I added a primary button to the canvas." },
        ]);

        const result = await runAgentTurn({ client, registry, tree: emptyTree, history: [], userMessage: "Add a button" });

        expect(result.assistantText).toBe("I added a primary button to the canvas.");
        expect(result.newTree?.nodes.btn).toBeDefined();
        expect(result.lastOpsSummary).toBe("Added a button.");
        expect(result.toolCalls.map((c) => c.name)).toEqual(["list_components", "propose_ops"]);
        expect(result.hitRoundLimit).toBe(false);
    });

    it("returns no newTree when the model never successfully calls propose_ops", async () => {
        const client = scriptedClient([{ content: "Here's some information about Button." }]);
        const result = await runAgentTurn({ client, registry, tree: emptyTree, history: [], userMessage: "What props does Button have?" });
        expect(result.newTree).toBeUndefined();
        expect(result.assistantText).toContain("Button");
    });
});

describe("runAgentTurn: propose_ops enforcement carries across the whole turn", () => {
    it("rejects propose_ops on an empty canvas before discovery, and the model can recover by discovering next", async () => {
        const client = scriptedClient([
            {
                content: null,
                toolCalls: [
                    { id: "1", name: "propose_ops", arguments: JSON.stringify({ ops: [{ op: "setClasses", id: "root", add: ["flex"] }], summary: "x" }) },
                ],
            },
            { content: null, toolCalls: [{ id: "2", name: "search_components", arguments: JSON.stringify({ intent: "button" }) }] },
            {
                content: null,
                toolCalls: [
                    {
                        id: "3",
                        name: "propose_ops",
                        arguments: JSON.stringify({ ops: [{ op: "setClasses", id: "root", add: ["flex"] }], summary: "Added flex layout." }),
                    },
                ],
            },
            { content: "Done." },
        ]);

        const result = await runAgentTurn({ client, registry, tree: emptyTree, history: [], userMessage: "Add a button" });
        expect(result.toolResults[0]?.content).toContain("list_components or search_components");
        expect(result.newTree?.nodes.root.kind === "primitive" && result.newTree.nodes.root.className).toEqual(["flex"]);
    });

    it("caps propose_ops attempts at MAX_PROPOSE_OPS_ATTEMPTS within one turn", async () => {
        const failingCall = { id: "x", name: "propose_ops", arguments: JSON.stringify({ ops: [{ op: "remove", id: "does-not-exist" }], summary: "x" }) };
        const script = [
            { content: null, toolCalls: [{ id: "0", name: "list_components", arguments: "{}" }] },
            ...Array.from({ length: MAX_PROPOSE_OPS_ATTEMPTS + 1 }, (_, i) => ({ content: null, toolCalls: [{ ...failingCall, id: String(i) }] })),
            { content: "I couldn't complete that." },
        ];
        const result = await runAgentTurn({ client: scriptedClient(script), registry, tree: emptyTree, history: [], userMessage: "Do something impossible" });
        const proposeResults = result.toolResults.filter((r) => r.name === "propose_ops").map((r) => JSON.parse(r.content));
        expect(proposeResults.at(-1).errors[0]).toContain("Maximum");
    });
});

describe("runAgentTurn: report_unavailable", () => {
    it("surfaces what was reported unavailable", async () => {
        const client = scriptedClient([
            {
                content: null,
                toolCalls: [{ id: "1", name: "report_unavailable", arguments: JSON.stringify({ what: "a rich text editor", alternatives: [] }) }],
            },
            { content: "The library has no rich text editor component." },
        ]);
        const result = await runAgentTurn({ client, registry, tree: emptyTree, history: [], userMessage: "Add a rich text editor" });
        expect(result.reportedUnavailable).toEqual({ what: "a rich text editor", alternatives: [] });
        expect(result.newTree).toBeUndefined();
    });
});

describe("runAgentTurn: round limit", () => {
    it("stops after MAX_AGENT_ROUNDS and reports hitRoundLimit, rather than looping forever", async () => {
        // MAX_AGENT_ROUNDS + 1 rounds of tool calls with no final text
        // response ever -- exceeds the round bound.
        const script = Array.from({ length: MAX_AGENT_ROUNDS + 1 }, (_, i) => ({
            content: null,
            toolCalls: [{ id: String(i), name: "get_rules", arguments: "{}" }],
        }));
        const result = await runAgentTurn({ client: scriptedClient(script), registry, tree: emptyTree, history: [], userMessage: "loop forever" });
        expect(result.hitRoundLimit).toBe(true);
        expect(result.assistantText).toContain("tool-call budget");
    });
});
