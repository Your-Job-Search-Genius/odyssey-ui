import { describe, expect, it } from "vitest";
import { applyOps } from "../src/ops.js";
import { buttonTree, selectTree } from "./fixtures.js";

describe("applyOps: insert", () => {
    it("inserts a new node as a child of an existing container", () => {
        const tree = buttonTree();
        const { tree: next, errors } = applyOps(tree, [{ op: "insert", parentId: "root", node: { id: "new", kind: "text", value: "hi" } }]);
        expect(errors).toEqual([]);
        expect(next.nodes.root.kind === "primitive" && next.nodes.root.children).toContain("new");
        expect(next.nodes.new).toEqual({ id: "new", kind: "text", value: "hi" });
    });

    it("inserts at a specific index", () => {
        const tree = buttonTree();
        const { tree: next } = applyOps(tree, [{ op: "insert", parentId: "root", index: 0, node: { id: "new", kind: "text", value: "hi" } }]);
        expect(next.nodes.root.kind === "primitive" && next.nodes.root.children[0]).toBe("new");
    });

    it("rejects inserting into a nonexistent parent, leaving the tree untouched", () => {
        const tree = buttonTree();
        const { tree: next, errors } = applyOps(tree, [{ op: "insert", parentId: "does-not-exist", node: { id: "new", kind: "text", value: "hi" } }]);
        expect(errors.length).toBeGreaterThan(0);
        expect(next).toEqual(tree);
    });

    it("rejects inserting a duplicate node id", () => {
        const tree = buttonTree();
        const { errors } = applyOps(tree, [{ op: "insert", parentId: "root", node: { id: "btn", kind: "text", value: "collide" } }]);
        expect(errors.length).toBeGreaterThan(0);
    });

    it("does not mutate the original tree (pure)", () => {
        const tree = buttonTree();
        const before = structuredClone(tree);
        applyOps(tree, [{ op: "insert", parentId: "root", node: { id: "new", kind: "text", value: "hi" } }]);
        expect(tree).toEqual(before);
    });
});

describe("applyOps: remove", () => {
    it("removes a node and its entire subtree", () => {
        const tree = buttonTree();
        const { tree: next, errors } = applyOps(tree, [{ op: "remove", id: "btn" }]);
        expect(errors).toEqual([]);
        expect(next.nodes.btn).toBeUndefined();
        expect(next.nodes.btnText).toBeUndefined(); // child of btn, removed with it
        expect(next.nodes.root.kind === "primitive" && next.nodes.root.children).not.toContain("btn");
    });

    it("refuses to remove the root node", () => {
        const tree = buttonTree();
        const { errors } = applyOps(tree, [{ op: "remove", id: "root" }]);
        expect(errors.length).toBeGreaterThan(0);
    });
});

describe("applyOps: replace", () => {
    it("swaps a node's data while keeping its id and position", () => {
        const tree = buttonTree();
        const { tree: next, errors } = applyOps(tree, [{ op: "replace", id: "btnText", node: { id: "btnText", kind: "text", value: "Submit" } }]);
        expect(errors).toEqual([]);
        expect(next.nodes.btnText).toEqual({ id: "btnText", kind: "text", value: "Submit" });
    });

    it("rejects a replacement whose id does not match the target id", () => {
        const tree = buttonTree();
        const { errors } = applyOps(tree, [{ op: "replace", id: "btnText", node: { id: "different-id", kind: "text", value: "Submit" } }]);
        expect(errors.length).toBeGreaterThan(0);
    });

    it("cleans up orphaned descendants when replacing a container with a non-container", () => {
        const tree = buttonTree();
        const { tree: next } = applyOps(tree, [{ op: "replace", id: "btn", node: { id: "btn", kind: "text", value: "just text now" } }]);
        expect(next.nodes.btnText).toBeUndefined(); // was btn's child, btn is no longer a container
    });
});

describe("applyOps: setProp", () => {
    it("sets a prop value", () => {
        const tree = buttonTree();
        const { tree: next } = applyOps(tree, [{ op: "setProp", id: "btn", prop: "color", value: { t: "enum", v: "secondary" } }]);
        expect(next.nodes.btn.kind === "component" && next.nodes.btn.props.color).toEqual({ t: "enum", v: "secondary" });
    });

    it("deletes a prop when value is null", () => {
        const tree = buttonTree();
        const { tree: next } = applyOps(tree, [{ op: "setProp", id: "btn", prop: "color", value: null }]);
        expect(next.nodes.btn.kind === "component" && "color" in next.nodes.btn.props).toBe(false);
    });

    it("rejects setProp on a non-component node", () => {
        const tree = buttonTree();
        const { errors } = applyOps(tree, [{ op: "setProp", id: "root", prop: "color", value: { t: "enum", v: "secondary" } }]);
        expect(errors.length).toBeGreaterThan(0);
    });
});

describe("applyOps: setClasses", () => {
    it("adds and removes classes without duplicating", () => {
        const tree = buttonTree();
        const { tree: next } = applyOps(tree, [{ op: "setClasses", id: "root", add: ["gap-2", "items-center"], remove: ["flex"] }]);
        const classes = next.nodes.root.kind === "primitive" ? next.nodes.root.className : [];
        expect(classes.sort()).toEqual(["gap-2", "items-center"]);
    });
});

describe("applyOps: move", () => {
    it("relocates a node to a new parent", () => {
        const tree = buttonTree();
        const { tree: next, errors } = applyOps(tree, [
            { op: "insert", parentId: "root", node: { id: "wrapper", kind: "primitive", tag: "span", className: [], children: [] } },
            { op: "move", id: "btn", newParentId: "wrapper" },
        ]);
        expect(errors).toEqual([]);
        expect(next.nodes.root.kind === "primitive" && next.nodes.root.children).not.toContain("btn");
        expect(next.nodes.wrapper.kind === "primitive" && next.nodes.wrapper.children).toEqual(["btn"]);
    });

    it("refuses to move the root node", () => {
        const tree = buttonTree();
        const { errors } = applyOps(tree, [{ op: "move", id: "root", newParentId: "btn" }]);
        expect(errors.length).toBeGreaterThan(0);
    });

    it("refuses to move a (non-root) node into its own subtree", () => {
        // outer(div) -> inner(div) -> leaf(span) -- try to move "inner" into "leaf".
        const tree = {
            rootId: "outer",
            nodes: {
                outer: { id: "outer", kind: "primitive" as const, tag: "div" as const, className: [], children: ["inner"] },
                inner: { id: "inner", kind: "primitive" as const, tag: "div" as const, className: [], children: ["leaf"] },
                leaf: { id: "leaf", kind: "primitive" as const, tag: "span" as const, className: [], children: [] },
            },
        };
        const { errors } = applyOps(tree, [{ op: "move", id: "inner", newParentId: "leaf" }]);
        expect(errors.length).toBeGreaterThan(0);
    });
});

describe("applyOps: wrap", () => {
    it("inserts a wrapper in the target's exact former position", () => {
        const tree = buttonTree();
        const { tree: next, errors } = applyOps(tree, [
            { op: "wrap", id: "btn", wrapper: { id: "sidebar", kind: "primitive", tag: "div", className: ["p-4"], children: [] } },
        ]);
        expect(errors).toEqual([]);
        expect(next.nodes.root.kind === "primitive" && next.nodes.root.children).toEqual(["sidebar"]);
        expect(next.nodes.sidebar.kind === "primitive" && next.nodes.sidebar.children).toEqual(["btn"]);
    });

    it("rejects wrapping with a non-container node", () => {
        const tree = buttonTree();
        const { errors } = applyOps(tree, [{ op: "wrap", id: "btn", wrapper: { id: "bad", kind: "text", value: "not a container" } }]);
        expect(errors.length).toBeGreaterThan(0);
    });
});

describe("applyOps: setText", () => {
    it("updates a text node's value", () => {
        const tree = buttonTree();
        const { tree: next } = applyOps(tree, [{ op: "setText", id: "btnText", value: "Submit" }]);
        expect(next.nodes.btnText).toEqual({ id: "btnText", kind: "text", value: "Submit" });
    });

    it("rejects setText on a non-text node", () => {
        const tree = buttonTree();
        const { errors } = applyOps(tree, [{ op: "setText", id: "btn", value: "nope" }]);
        expect(errors.length).toBeGreaterThan(0);
    });
});

describe("applyOps: batch atomicity", () => {
    it("rejects the whole batch if any op fails structurally, applying none of it", () => {
        const tree = buttonTree();
        const { tree: next, errors } = applyOps(tree, [
            { op: "setText", id: "btnText", value: "this should not stick" },
            { op: "remove", id: "does-not-exist" },
        ]);
        expect(errors.length).toBeGreaterThan(0);
        expect(next).toEqual(tree);
    });
});

describe("applyOps: compound tree fixture", () => {
    it("selectTree fixture applies no-op cleanly (sanity check for the fixture itself)", () => {
        const tree = selectTree();
        const { errors } = applyOps(tree, []);
        expect(errors).toEqual([]);
    });
});
