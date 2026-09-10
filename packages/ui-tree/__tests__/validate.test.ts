import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import { beforeAll, describe, expect, it } from "vitest";
import type { UITree } from "../src/schema.js";
import { validateTree } from "../src/validate.js";
import { buttonTree, buttonWithIconTree, selectTree } from "./fixtures.js";

let registry: Registry;
beforeAll(() => {
    registry = loadRegistry();
});

describe("validateTree: valid trees", () => {
    it("accepts the Button fixture", () => {
        expect(validateTree(buttonTree(), registry)).toEqual({ ok: true, errors: [] });
    });

    it("accepts the icon-accepting Button fixture", () => {
        expect(validateTree(buttonWithIconTree(), registry)).toEqual({ ok: true, errors: [] });
    });

    it("accepts the compound Select fixture", () => {
        expect(validateTree(selectTree(), registry)).toEqual({ ok: true, errors: [] });
    });
});

describe("validateTree: structural integrity", () => {
    it("rejects a rootId that doesn't exist", () => {
        const tree: UITree = { rootId: "missing", nodes: {} };
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).toContain("does not exist");
    });

    it("rejects an orphaned node not reachable from root", () => {
        const tree = buttonTree();
        tree.nodes.floating = { id: "floating", kind: "text", value: "nobody references me" };
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("orphaned"))).toBe(true);
    });

    it("rejects a node referenced as a child by two different parents", () => {
        const tree = buttonTree();
        tree.nodes.root2 = { id: "root2", kind: "primitive", tag: "div", className: [], children: ["btn"] };
        (tree.nodes.root2 as { children: string[] }).children.push("btn");
        // "btn" is now a child of both "root" and "root2" -- but only "root"
        // is reachable from rootId, so also insert root2 somewhere reachable.
        (tree.nodes.root as { children: string[] }).children.push("root2");
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("more than one parent"))).toBe(true);
    });

    it("rejects a cycle", () => {
        const tree: UITree = {
            rootId: "a",
            nodes: {
                a: { id: "a", kind: "primitive", tag: "div", className: [], children: ["b"] },
                b: { id: "b", kind: "primitive", tag: "div", className: [], children: ["a"] },
            },
        };
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("Cycle"))).toBe(true);
    });
});

describe("validateTree: registry rules", () => {
    it("rejects an unknown component name", () => {
        const tree = buttonTree();
        (tree.nodes.btn as { name: string }).name = "TotallyMadeUp";
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("Unknown component"))).toBe(true);
    });

    it("rejects a required prop missing (Select.Item's id)", () => {
        const tree = selectTree();
        (tree.nodes.item1 as { props: Record<string, unknown> }).props = {};
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes('Missing required prop "id"'))).toBe(true);
    });

    it("rejects an invalid enum prop value", () => {
        const tree = buttonTree();
        (tree.nodes.btn as { props: Record<string, unknown> }).props.color = { t: "enum", v: "not-a-real-color" };
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("expected one of"))).toBe(true);
    });

    it("rejects a Select.Item outside of Select's allowedParents", () => {
        const tree: UITree = {
            rootId: "div",
            nodes: {
                div: { id: "div", kind: "primitive", tag: "div", className: [], children: ["item"] },
                item: { id: "item", kind: "component", name: "Select.Item", props: { id: { t: "string", v: "1" } }, children: [] },
            },
        };
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("may only appear inside"))).toBe(true);
    });

    it("rejects a non-Select.Item child inside Select's allowedChildren", () => {
        const tree = selectTree();
        tree.nodes.badChild = { id: "badChild", kind: "primitive", tag: "span", className: [], children: [] };
        (tree.nodes.select as { children: string[] }).children.push("badChild");
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("only allows these children"))).toBe(true);
    });

    it("rejects an arbitrary-value className on a primitive", () => {
        const tree = buttonTree();
        (tree.nodes.root as { className: string[] }).className = ["bg-[#ff0000]"];
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("Arbitrary Tailwind value"))).toBe(true);
    });

    it("rejects a non-token className on a primitive", () => {
        const tree = buttonTree();
        (tree.nodes.root as { className: string[] }).className = ["not-a-real-class"];
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("does not resolve to a design token"))).toBe(true);
    });

    it("rejects a prop value of t:icon referencing a nonexistent icon", () => {
        const tree = buttonWithIconTree();
        (tree.nodes.btn as { props: Record<string, unknown> }).props.iconLeading = { t: "icon", v: "TotallyFakeIcon" };
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("not in the icon set"))).toBe(true);
    });

    it("rejects a prop value of t:node referencing a nonexistent node id", () => {
        const tree = buttonWithIconTree();
        (tree.nodes.btn as { props: Record<string, unknown> }).props.iconLeading = { t: "node", v: "does-not-exist" };
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("does not exist"))).toBe(true);
    });

    it("rejects an unknown icon on a standalone icon node", () => {
        const tree: UITree = {
            rootId: "root",
            nodes: { root: { id: "root", kind: "icon", name: "TotallyFakeIcon" } },
        };
        const result = validateTree(tree, registry);
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).toContain("Unknown icon");
    });
});
