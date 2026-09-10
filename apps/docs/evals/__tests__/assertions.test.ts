import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import type { UITree } from "@your-job-search-genius/ui-tree";
import { beforeEach, describe, expect, it } from "vitest";
import type { RunAgentTurnResult } from "~/lib/playground/agent.js";
import { checkAssertion } from "../assertions.js";
import type { CheckContext } from "../assertions.js";

let registry: Registry;
beforeEach(() => {
    registry = loadRegistry();
});

function baseResult(overrides: Partial<RunAgentTurnResult> = {}): RunAgentTurnResult {
    return { assistantText: "Done.", toolCalls: [], toolResults: [], hitRoundLimit: false, ...overrides };
}

const treeWithButton: UITree = {
    rootId: "root",
    nodes: {
        root: { id: "root", kind: "primitive", tag: "div", className: ["flex"], children: ["btn"] },
        btn: {
            id: "btn",
            kind: "component",
            name: "Button",
            props: { color: { t: "enum", v: "primary" }, iconLeading: { t: "icon", v: "Check" } },
            children: [],
        },
    },
};

function ctx(overrides: Partial<CheckContext> = {}): CheckContext {
    return { result: baseResult(), finalTree: treeWithButton, registry, ...overrides };
}

describe("treeContainsComponent / treeExcludesComponent", () => {
    it("passes when the component is present", () => {
        expect(checkAssertion({ type: "treeContainsComponent", name: "Button" }, ctx()).pass).toBe(true);
    });

    it("fails when the component is absent", () => {
        expect(checkAssertion({ type: "treeContainsComponent", name: "Select" }, ctx()).pass).toBe(false);
    });

    it("respects minCount", () => {
        expect(checkAssertion({ type: "treeContainsComponent", name: "Button", minCount: 2 }, ctx()).pass).toBe(false);
    });

    it("treeExcludesComponent is the exact inverse", () => {
        expect(checkAssertion({ type: "treeExcludesComponent", name: "Button" }, ctx()).pass).toBe(false);
        expect(checkAssertion({ type: "treeExcludesComponent", name: "Select" }, ctx()).pass).toBe(true);
    });

    it("matches by registry id/name/importName, not just the tree's literal string", () => {
        // treeWithButton stores name "Button" -- also matches the registry id form.
        expect(checkAssertion({ type: "treeContainsComponent", name: "base/buttons/button" }, ctx()).pass).toBe(true);
    });
});

describe("onlyPrimitivesUsed", () => {
    it("passes when every primitive tag is in the allowed set", () => {
        expect(checkAssertion({ type: "onlyPrimitivesUsed", allowed: ["div"] }, ctx()).pass).toBe(true);
    });

    it("fails when a disallowed primitive tag is present", () => {
        const tree: UITree = { rootId: "r", nodes: { r: { id: "r", kind: "primitive", tag: "h1", className: [], children: [] } } };
        expect(checkAssertion({ type: "onlyPrimitivesUsed", allowed: ["div"] }, ctx({ finalTree: tree })).pass).toBe(false);
    });
});

describe("componentHasProp", () => {
    it("passes when the prop key exists on a matching component node", () => {
        expect(checkAssertion({ type: "componentHasProp", component: "Button", prop: "iconLeading" }, ctx()).pass).toBe(true);
    });

    it("fails when the prop is not set", () => {
        expect(checkAssertion({ type: "componentHasProp", component: "Button", prop: "isLoading" }, ctx()).pass).toBe(false);
    });
});

describe("firstAttemptAccepted", () => {
    it("passes when the first propose_ops result was ok:true", () => {
        const result = baseResult({ toolResults: [{ toolCallId: "1", name: "propose_ops", content: JSON.stringify({ ok: true, outline: [] }) }] });
        expect(checkAssertion({ type: "firstAttemptAccepted" }, ctx({ result })).pass).toBe(true);
    });

    it("fails when the first propose_ops result was ok:false, even if a later one succeeded", () => {
        const result = baseResult({
            toolResults: [
                { toolCallId: "1", name: "propose_ops", content: JSON.stringify({ ok: false, errors: ["x"] }) },
                { toolCallId: "2", name: "propose_ops", content: JSON.stringify({ ok: true, outline: [] }) },
            ],
        });
        expect(checkAssertion({ type: "firstAttemptAccepted" }, ctx({ result })).pass).toBe(false);
    });

    it("fails when propose_ops was never called", () => {
        expect(checkAssertion({ type: "firstAttemptAccepted" }, ctx({ result: baseResult() })).pass).toBe(false);
    });
});

describe("reportedUnavailable", () => {
    it("passes when the turn reported unavailable", () => {
        const result = baseResult({ reportedUnavailable: { what: "a rich text editor", alternatives: [] } });
        expect(checkAssertion({ type: "reportedUnavailable" }, ctx({ result })).pass).toBe(true);
    });

    it("fails when it wasn't", () => {
        expect(checkAssertion({ type: "reportedUnavailable" }, ctx()).pass).toBe(false);
    });
});

describe("noHallucinatedComponentsOrIcons", () => {
    it("passes when no tool result mentions an unknown component/icon", () => {
        expect(checkAssertion({ type: "noHallucinatedComponentsOrIcons" }, ctx()).pass).toBe(true);
    });

    it.each(["Unknown component", "Unknown icon", "not in the icon set", "not in the registry"])("fails when a tool result contains %s", (needle) => {
        const result = baseResult({
            toolResults: [{ toolCallId: "1", name: "propose_ops", content: JSON.stringify({ ok: false, errors: [`${needle} "Whatever"`] }) }],
        });
        expect(checkAssertion({ type: "noHallucinatedComponentsOrIcons" }, ctx({ result })).pass).toBe(false);
    });
});

describe("discoveredBeforeProposing", () => {
    it("passes when a discovery tool precedes the first propose_ops", () => {
        const result = baseResult({
            toolCalls: [
                { id: "1", name: "list_components", arguments: "{}" },
                { id: "2", name: "propose_ops", arguments: "{}" },
            ],
        });
        expect(checkAssertion({ type: "discoveredBeforeProposing" }, ctx({ result })).pass).toBe(true);
    });

    it("fails when propose_ops comes first", () => {
        const result = baseResult({
            toolCalls: [
                { id: "1", name: "propose_ops", arguments: "{}" },
                { id: "2", name: "list_components", arguments: "{}" },
            ],
        });
        expect(checkAssertion({ type: "discoveredBeforeProposing" }, ctx({ result })).pass).toBe(false);
    });

    it("passes vacuously when propose_ops was never called", () => {
        expect(checkAssertion({ type: "discoveredBeforeProposing" }, ctx({ result: baseResult() })).pass).toBe(true);
    });
});
