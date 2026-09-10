import type { UITree } from "@your-job-search-genius/ui-tree";
import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "../lib/playground/system-prompt.js";

const emptyTree: UITree = { rootId: "root", nodes: { root: { id: "root", kind: "primitive", tag: "div", className: [], children: [] } } };

describe("buildSystemPrompt", () => {
    it("states the tree-only, propose_ops-only constraint", () => {
        const prompt = buildSystemPrompt({ tree: emptyTree });
        expect(prompt).toContain("never write raw JSX");
        expect(prompt).toContain("propose_ops");
    });

    it("includes an empty-canvas marker for a tree with no real content", () => {
        expect(buildSystemPrompt({ tree: emptyTree })).toContain("(empty canvas)");
    });

    it("includes a compact outline of a non-empty tree", () => {
        const tree: UITree = {
            rootId: "root",
            nodes: {
                root: { id: "root", kind: "primitive", tag: "div", className: ["flex"], children: ["btn"] },
                btn: { id: "btn", kind: "component", name: "Button", props: { color: { t: "enum", v: "primary" } }, children: [] },
            },
        };
        const prompt = buildSystemPrompt({ tree });
        expect(prompt).toContain("btn");
        expect(prompt).toContain("Button");
        expect(prompt).not.toContain("(empty canvas)");
    });

    it("includes the selected node id only when one is given", () => {
        expect(buildSystemPrompt({ tree: emptyTree })).not.toContain("Selected node:");
        expect(buildSystemPrompt({ tree: emptyTree, selectedNodeId: "btn" })).toContain("Selected node: btn");
    });

    it("includes the session summary only when one is given", () => {
        expect(buildSystemPrompt({ tree: emptyTree })).not.toContain("Earlier in this session:");
        expect(buildSystemPrompt({ tree: emptyTree, sessionSummary: "Built a login form." })).toContain("Built a login form.");
    });

    it("is deterministic for the same input", () => {
        const a = buildSystemPrompt({ tree: emptyTree, selectedNodeId: "btn" });
        const b = buildSystemPrompt({ tree: structuredClone(emptyTree), selectedNodeId: "btn" });
        expect(a).toBe(b);
    });
});
