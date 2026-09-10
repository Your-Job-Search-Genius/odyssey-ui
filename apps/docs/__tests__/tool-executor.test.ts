import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import type { UITree } from "@your-job-search-genius/ui-tree";
import { beforeEach, describe, expect, it } from "vitest";
import { MAX_PROPOSE_OPS_ATTEMPTS, executeTool } from "../lib/playground/tool-executor.js";
import type { ToolExecutionState } from "../lib/playground/tool-executor.js";

let registry: Registry;
const emptyTree: UITree = { rootId: "root", nodes: { root: { id: "root", kind: "primitive", tag: "div", className: [], children: [] } } };

function freshState(tree: UITree = structuredClone(emptyTree)): ToolExecutionState {
    return { registry, tree, discoveryCalled: false, proposeOpsAttempts: 0 };
}

beforeEach(() => {
    registry = loadRegistry();
});

describe("executeTool: read-only tools reuse ds-mcp's real logic", () => {
    it("get_rules returns the markdown rules", () => {
        const result = executeTool("get_rules", "{}", freshState());
        expect(result).toContain("Forbidden elements");
    });

    it("list_components filters by category", () => {
        const result = JSON.parse(executeTool("list_components", JSON.stringify({ category: "base" }), freshState()));
        expect(result.length).toBeGreaterThan(0);
        expect(result.every((c: { category: string }) => c.category === "base")).toBe(true);
    });

    it("get_component finds Button by id", () => {
        const result = JSON.parse(executeTool("get_component", JSON.stringify({ name: "base/buttons/button" }), freshState()));
        expect(result.name).toBe("Button");
    });

    it("search_icons never invents an icon", () => {
        const result = JSON.parse(executeTool("search_icons", JSON.stringify({ query: "zzznotreal" }), freshState()));
        expect(result.found).toBe(false);
    });

    it("marks discoveryCalled for list_components and search_components, not for other tools", () => {
        const state = freshState();
        executeTool("get_rules", "{}", state);
        expect(state.discoveryCalled).toBe(false);
        executeTool("list_components", "{}", state);
        expect(state.discoveryCalled).toBe(true);
    });

    it("returns a JSON error rather than throwing on malformed arguments", () => {
        expect(() => executeTool("get_component", "{not valid json", freshState())).not.toThrow();
        const result = JSON.parse(executeTool("get_component", "{not valid json", freshState()));
        expect(result.error).toBeDefined();
    });
});

describe("executeTool: propose_ops", () => {
    it("rejects an empty-canvas propose_ops call before any discovery tool was called", () => {
        const state = freshState();
        const result = JSON.parse(
            executeTool(
                "propose_ops",
                JSON.stringify({
                    ops: [{ op: "insert", parentId: "root", node: { id: "btn", kind: "component", name: "Button", props: {}, children: [] } }],
                    summary: "Added a button.",
                }),
                state,
            ),
        );
        expect(result.ok).toBe(false);
        expect(result.errors[0]).toContain("list_components or search_components");
        expect(state.tree).toEqual(emptyTree); // unchanged
    });

    it("accepts a valid propose_ops call after discovery, mutating state.tree", () => {
        const state = freshState();
        executeTool("list_components", "{}", state); // discovery satisfied
        const result = JSON.parse(
            executeTool(
                "propose_ops",
                JSON.stringify({
                    ops: [
                        {
                            op: "insert",
                            parentId: "root",
                            node: { id: "btn", kind: "component", name: "Button", props: { color: { t: "enum", v: "primary" } }, children: [] },
                        },
                    ],
                    summary: "Added a button.",
                }),
                state,
            ),
        );
        expect(result.ok).toBe(true);
        expect(state.tree.nodes.btn).toBeDefined();
        expect(state.lastAcceptedOps?.summary).toBe("Added a button.");
    });

    it("rejects ops that fail registry validation (missing required prop) and leaves state.tree unchanged", () => {
        const state = freshState();
        state.discoveryCalled = true;
        const before = structuredClone(state.tree);
        const result = JSON.parse(
            executeTool(
                "propose_ops",
                JSON.stringify({
                    ops: [{ op: "insert", parentId: "root", node: { id: "item", kind: "component", name: "Select.Item", props: {}, children: [] } }], // missing required "id" prop
                    summary: "Added an item.",
                }),
                state,
            ),
        );
        expect(result.ok).toBe(false);
        expect(state.tree).toEqual(before);
    });

    it("caps attempts at MAX_PROPOSE_OPS_ATTEMPTS regardless of success or failure", () => {
        const state = freshState();
        state.discoveryCalled = true;
        for (let i = 0; i < MAX_PROPOSE_OPS_ATTEMPTS; i++) {
            executeTool("propose_ops", JSON.stringify({ ops: [{ op: "setClasses", id: "root", add: ["flex"] }], summary: `attempt ${i}` }), state);
        }
        const result = JSON.parse(executeTool("propose_ops", JSON.stringify({ ops: [], summary: "one too many" }), state));
        expect(result.ok).toBe(false);
        expect(result.errors[0]).toContain(`Maximum ${MAX_PROPOSE_OPS_ATTEMPTS}`);
    });

    it("rejects malformed ops without throwing", () => {
        const state = freshState();
        state.discoveryCalled = true;
        const result = JSON.parse(executeTool("propose_ops", JSON.stringify({ ops: "not an array", summary: "x" }), state));
        expect(result.ok).toBe(false);
    });
});

describe("executeTool: report_unavailable", () => {
    it("records what was unavailable and any alternatives", () => {
        const state = freshState();
        executeTool("report_unavailable", JSON.stringify({ what: "a date range picker with presets", alternatives: ["DateRangePicker"] }), state);
        expect(state.reportedUnavailable).toEqual({ what: "a date range picker with presets", alternatives: ["DateRangePicker"] });
    });
});

describe("executeTool: unknown tool name", () => {
    it("returns a JSON error rather than throwing", () => {
        const result = JSON.parse(executeTool("not_a_real_tool", "{}", freshState()));
        expect(result.error).toContain("Unknown tool");
    });
});

describe("executeTool: propose_ops model-mistake hints", () => {
    it("explains a bare node passed as an ops entry instead of a generic parse error", () => {
        const state = freshState();
        state.discoveryCalled = true;
        const result = JSON.parse(
            executeTool(
                "propose_ops",
                JSON.stringify({
                    ops: [
                        { op: "insert", parentId: "root", node: { id: "a", kind: "text", value: "hi" } },
                        { id: "b", kind: "primitive", tag: "p", className: [], children: [] },
                    ],
                    summary: "x",
                }),
                state,
            ),
        );
        expect(result.ok).toBe(false);
        expect(result.errors[0]).toContain("bare node");
        expect(result.errors[0]).toContain('{ op: "insert"');
    });

    it("accepts an insert with inline nested children and bare prop values", () => {
        const state = freshState();
        state.discoveryCalled = true;
        const result = JSON.parse(
            executeTool(
                "propose_ops",
                JSON.stringify({
                    ops: [
                        {
                            op: "insert",
                            parentId: "root",
                            node: {
                                id: "card",
                                kind: "primitive",
                                tag: "div",
                                className: ["min-h-screen", "max-w-md", "mx-auto", "sm:p-8"],
                                children: [{ id: "email", kind: "component", name: "Input", props: { label: "Email" }, children: [] }],
                            },
                        },
                    ],
                    summary: "Added a card with an email input.",
                }),
                state,
            ),
        );
        expect(result.ok).toBe(true);
        expect(state.tree.nodes.email).toBeDefined();
    });
});
