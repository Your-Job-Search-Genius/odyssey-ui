import { describe, expect, it } from "vitest";
import { TreeOpSchema, applyOps, flattenNestedNode } from "../src/ops.js";
import { buttonTree } from "./fixtures.js";

describe("TreeOpSchema: nested + loose input shapes", () => {
    it("parses an insert whose children are inline node objects", () => {
        const parsed = TreeOpSchema.safeParse({
            op: "insert",
            parentId: "root",
            node: {
                id: "card",
                kind: "primitive",
                tag: "div",
                className: ["flex", "flex-col", "gap-4"],
                children: [
                    { id: "title", kind: "primitive", tag: "h1", className: ["text-xl"], children: [{ id: "titleText", kind: "text", value: "Log in" }] },
                    { id: "email", kind: "component", name: "Input", props: { label: "Email" }, children: [] },
                ],
            },
        });
        expect(parsed.success).toBe(true);
    });

    it("coerces bare string/number/boolean prop values to tagged PropValues", () => {
        const parsed = TreeOpSchema.parse({
            op: "insert",
            parentId: "root",
            node: { id: "input1", kind: "component", name: "Input", props: { label: "Email", isRequired: true }, children: [] },
        });
        if (parsed.op !== "insert" || parsed.node.kind !== "component") throw new Error("unexpected shape");
        expect(parsed.node.props.label).toEqual({ t: "string", v: "Email" });
        expect(parsed.node.props.isRequired).toEqual({ t: "boolean", v: true });
    });

    it("defaults missing props/children/className on nested container nodes", () => {
        const parsed = TreeOpSchema.parse({ op: "insert", parentId: "root", node: { id: "box", kind: "primitive", tag: "div" } });
        if (parsed.op !== "insert" || parsed.node.kind !== "primitive") throw new Error("unexpected shape");
        expect(parsed.node.className).toEqual([]);
        expect(parsed.node.children).toEqual([]);
    });
});

describe("applyOps: nested insert", () => {
    it("flattens a whole subtree into id-linked nodes in one insert", () => {
        const { tree: next, errors } = applyOps(buttonTree(), [
            {
                op: "insert",
                parentId: "root",
                node: {
                    id: "card",
                    kind: "primitive",
                    tag: "div",
                    className: [],
                    children: [
                        { id: "heading", kind: "primitive", tag: "h2", className: [], children: [{ id: "headingText", kind: "text", value: "Welcome" }] },
                        "btnRef",
                    ],
                },
            },
        ]);
        expect(errors).toEqual([]);
        expect(next.nodes.card.kind === "primitive" && next.nodes.card.children).toEqual(["heading", "btnRef"]);
        expect(next.nodes.heading.kind === "primitive" && next.nodes.heading.children).toEqual(["headingText"]);
        expect(next.nodes.headingText).toEqual({ id: "headingText", kind: "text", value: "Welcome" });
    });

    it("rejects a nested insert that reuses an existing node id, leaving the tree untouched", () => {
        const tree = buttonTree();
        const { tree: next, errors } = applyOps(tree, [
            {
                op: "insert",
                parentId: "root",
                node: { id: "card", kind: "primitive", tag: "div", className: [], children: [{ id: "btn", kind: "text", value: "x" }] },
            },
        ]);
        expect(errors[0]).toContain('"btn" already exists');
        expect(next).toEqual(tree);
    });

    it("rejects duplicate ids within the inserted subtree itself", () => {
        const { errors } = applyOps(buttonTree(), [
            {
                op: "insert",
                parentId: "root",
                node: {
                    id: "card",
                    kind: "primitive",
                    tag: "div",
                    className: [],
                    children: [
                        { id: "dup", kind: "text", value: "a" },
                        { id: "dup", kind: "text", value: "b" },
                    ],
                },
            },
        ]);
        expect(errors[0]).toContain("more than once");
    });
});

describe("applyOps: wrap with a wrapper that declares its own children", () => {
    it("keeps declared children and appends the wrapped node", () => {
        const { tree: next, errors } = applyOps(buttonTree(), [
            {
                op: "wrap",
                id: "btn",
                wrapper: { id: "row", kind: "primitive", tag: "div", className: ["flex"], children: [{ id: "label", kind: "text", value: "Action:" }] },
            },
        ]);
        expect(errors).toEqual([]);
        expect(next.nodes.row.kind === "primitive" && next.nodes.row.children).toEqual(["label", "btn"]);
        expect(next.nodes.root.kind === "primitive" && next.nodes.root.children).toEqual(["row"]);
    });
});

describe("flattenNestedNode", () => {
    it("returns leaf nodes unchanged", () => {
        const { root, descendants } = flattenNestedNode({ id: "t", kind: "text", value: "hi" });
        expect(root).toEqual({ id: "t", kind: "text", value: "hi" });
        expect(descendants).toEqual([]);
    });
});
