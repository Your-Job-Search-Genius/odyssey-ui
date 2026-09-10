/**
 * TreeOp + applyOps (design system plan, Section 5.2). Model edits are a
 * small op set, not full tree regenerations. applyOps is pure and
 * atomic: a batch with any structural problem (referencing a node that
 * doesn't exist, wrapping with a non-container node, ...) leaves the
 * input tree untouched and returns the errors instead -- it does not
 * check registry rules (required props, allowedChildren, ...), that is
 * validateTree's job, run separately by the caller after applyOps
 * succeeds structurally.
 */
import { z } from "zod";
import { IconNodeSchema, PrimitiveTagSchema, PropValueSchema, TextNodeSchema } from "./schema.js";
import type { PrimitiveTag, PropValue, UINode, UITree } from "./schema.js";

/**
 * PropValueSchema, but forgiving about shape: models routinely emit bare
 * JSON literals ("Email" instead of { t: "string", v: "Email" }) -- coerce
 * those instead of rejecting the whole batch over tagging ceremony.
 */
export const LoosePropValueSchema = z.union([
    PropValueSchema,
    z.string().transform((v): PropValue => ({ t: "string", v })),
    z.number().transform((v): PropValue => ({ t: "number", v })),
    z.boolean().transform((v): PropValue => ({ t: "boolean", v })),
]);

/**
 * A UINode as accepted *inside ops*: container children may be node ids
 * (strings, referencing nodes that already exist or are created earlier
 * in the same batch) or inline nested node objects, so a whole subtree
 * can be built in a single insert. applyOps flattens nested children
 * into ordinary id-linked nodes before they ever reach the tree --
 * stored trees always match the strict UINodeSchema.
 */
export interface NestedComponentNode {
    id: string;
    kind: "component";
    name: string;
    props: Record<string, PropValue>;
    children: Array<string | NestedUINode>;
}
export interface NestedPrimitiveNode {
    id: string;
    kind: "primitive";
    tag: PrimitiveTag;
    className: string[];
    children: Array<string | NestedUINode>;
}
export type NestedUINode = NestedComponentNode | NestedPrimitiveNode | z.infer<typeof TextNodeSchema> | z.infer<typeof IconNodeSchema>;

const NestedChildSchema: z.ZodType<string | NestedUINode, unknown> = z.lazy(() => z.union([z.string().min(1), NestedUINodeSchema]));

export const NestedUINodeSchema: z.ZodType<NestedUINode, unknown> = z.lazy(() =>
    z.discriminatedUnion("kind", [
        z.object({
            id: z.string().min(1),
            kind: z.literal("component"),
            name: z.string(),
            props: z.record(z.string(), LoosePropValueSchema).default({}),
            children: z.array(NestedChildSchema).default([]),
        }),
        z.object({
            id: z.string().min(1),
            kind: z.literal("primitive"),
            tag: PrimitiveTagSchema,
            className: z.array(z.string()).default([]),
            children: z.array(NestedChildSchema).default([]),
        }),
        TextNodeSchema,
        IconNodeSchema,
    ]),
);

export const TreeOpSchema = z.discriminatedUnion("op", [
    z.object({ op: z.literal("insert"), parentId: z.string(), index: z.number().int().nonnegative().optional(), node: NestedUINodeSchema }),
    z.object({ op: z.literal("remove"), id: z.string() }),
    z.object({ op: z.literal("replace"), id: z.string(), node: NestedUINodeSchema }),
    z.object({ op: z.literal("setProp"), id: z.string(), prop: z.string(), value: LoosePropValueSchema.nullable() }),
    z.object({ op: z.literal("setClasses"), id: z.string(), add: z.array(z.string()).optional(), remove: z.array(z.string()).optional() }),
    z.object({ op: z.literal("move"), id: z.string(), newParentId: z.string(), index: z.number().int().nonnegative().optional() }),
    z.object({ op: z.literal("wrap"), id: z.string(), wrapper: NestedUINodeSchema }),
    z.object({ op: z.literal("setText"), id: z.string(), value: z.string() }),
]);
export type TreeOp = z.infer<typeof TreeOpSchema>;

/**
 * Flattens a NestedUINode into a strict root UINode plus every inline
 * descendant as its own strict node. String children pass through as id
 * references; inline object children are replaced by their id.
 */
export function flattenNestedNode(nested: NestedUINode): { root: UINode; descendants: UINode[] } {
    const descendants: UINode[] = [];
    function flat(n: NestedUINode): UINode {
        if (n.kind === "text" || n.kind === "icon") return n;
        const childIds = n.children.map((child) => {
            if (typeof child === "string") return child;
            const flatChild = flat(child);
            descendants.push(flatChild);
            return flatChild.id;
        });
        return { ...n, children: childIds };
    }
    return { root: flat(nested), descendants };
}

export interface ApplyOpsResult {
    tree: UITree;
    errors: string[];
}

function isContainer(node: UINode | undefined): node is UINode & { children: string[] } {
    return node?.kind === "component" || node?.kind === "primitive";
}

function findParentId(tree: UITree, childId: string): string | undefined {
    for (const [id, node] of Object.entries(tree.nodes)) {
        if (isContainer(node) && node.children.includes(childId)) return id;
    }
    return undefined;
}

function removeFromParent(tree: UITree, id: string) {
    const parentId = findParentId(tree, id);
    if (parentId === undefined) return;
    const parent = tree.nodes[parentId];
    if (isContainer(parent)) parent.children = parent.children.filter((c) => c !== id);
}

function collectSubtreeIds(tree: UITree, id: string, out: Set<string>) {
    if (out.has(id)) return;
    out.add(id);
    const node = tree.nodes[id];
    if (isContainer(node)) {
        for (const childId of node.children) collectSubtreeIds(tree, childId, out);
    }
}

function applyOne(tree: UITree, op: TreeOp, errors: string[]) {
    switch (op.op) {
        case "insert": {
            const parent = tree.nodes[op.parentId];
            if (!isContainer(parent)) {
                errors.push(`insert: parentId "${op.parentId}" does not exist or cannot have children.`);
                return;
            }
            const { root, descendants } = flattenNestedNode(op.node);
            const newIds = new Set<string>();
            for (const node of [root, ...descendants]) {
                if (tree.nodes[node.id]) {
                    errors.push(`insert: node id "${node.id}" already exists.`);
                    return;
                }
                if (newIds.has(node.id)) {
                    errors.push(`insert: node id "${node.id}" is used more than once in the inserted subtree.`);
                    return;
                }
                newIds.add(node.id);
            }
            for (const node of descendants) tree.nodes[node.id] = node;
            tree.nodes[root.id] = root;
            const index = op.index ?? parent.children.length;
            parent.children.splice(index, 0, root.id);
            return;
        }
        case "remove": {
            if (op.id === tree.rootId) {
                errors.push(`remove: cannot remove the root node ("${op.id}").`);
                return;
            }
            if (!tree.nodes[op.id]) {
                errors.push(`remove: node "${op.id}" does not exist.`);
                return;
            }
            removeFromParent(tree, op.id);
            const toDelete = new Set<string>();
            collectSubtreeIds(tree, op.id, toDelete);
            for (const id of toDelete) delete tree.nodes[id];
            return;
        }
        case "replace": {
            if (!tree.nodes[op.id]) {
                errors.push(`replace: node "${op.id}" does not exist.`);
                return;
            }
            if (op.node.id !== op.id) {
                errors.push(`replace: replacement node id "${op.node.id}" must match the target id "${op.id}" -- use remove+insert to change a node's id.`);
                return;
            }
            const { root, descendants } = flattenNestedNode(op.node);
            for (const node of descendants) {
                if (tree.nodes[node.id]) {
                    errors.push(`replace: inline child node id "${node.id}" already exists.`);
                    return;
                }
            }
            // Preserve the existing children unless the replacement is
            // itself a container that specifies its own -- a non-container
            // replacement (text/icon) implicitly drops any previous children,
            // which must be cleaned up to avoid orphaning them.
            const previous = tree.nodes[op.id];
            if (isContainer(previous) && !isContainer(root)) {
                const toDelete = new Set<string>();
                for (const childId of previous.children) collectSubtreeIds(tree, childId, toDelete);
                for (const id of toDelete) delete tree.nodes[id];
            }
            for (const node of descendants) tree.nodes[node.id] = node;
            tree.nodes[op.id] = root;
            return;
        }
        case "setProp": {
            const node = tree.nodes[op.id];
            if (node?.kind !== "component") {
                errors.push(`setProp: node "${op.id}" does not exist or is not a component node.`);
                return;
            }
            if (op.value === null) delete node.props[op.prop];
            else node.props[op.prop] = op.value;
            return;
        }
        case "setClasses": {
            const node = tree.nodes[op.id];
            if (node?.kind !== "primitive") {
                errors.push(`setClasses: node "${op.id}" does not exist or is not a primitive node.`);
                return;
            }
            const toRemove = new Set(op.remove ?? []);
            const kept = node.className.filter((c) => !toRemove.has(c));
            const added = (op.add ?? []).filter((c) => !kept.includes(c));
            node.className = [...kept, ...added];
            return;
        }
        case "move": {
            const node = tree.nodes[op.id];
            const newParent = tree.nodes[op.newParentId];
            if (!node) {
                errors.push(`move: node "${op.id}" does not exist.`);
                return;
            }
            if (op.id === tree.rootId) {
                errors.push(`move: cannot move the root node.`);
                return;
            }
            if (!isContainer(newParent)) {
                errors.push(`move: newParentId "${op.newParentId}" does not exist or cannot have children.`);
                return;
            }
            const movingIntoOwnSubtree = new Set<string>();
            collectSubtreeIds(tree, op.id, movingIntoOwnSubtree);
            if (movingIntoOwnSubtree.has(op.newParentId)) {
                errors.push(`move: cannot move "${op.id}" into its own subtree ("${op.newParentId}").`);
                return;
            }
            removeFromParent(tree, op.id);
            const index = op.index ?? newParent.children.length;
            newParent.children.splice(index, 0, op.id);
            return;
        }
        case "wrap": {
            if (!tree.nodes[op.id]) {
                errors.push(`wrap: node "${op.id}" does not exist.`);
                return;
            }
            if (op.id === tree.rootId) {
                errors.push(`wrap: cannot wrap the root node -- insert a new root and move the current tree under it instead.`);
                return;
            }
            if (op.wrapper.kind !== "component" && op.wrapper.kind !== "primitive") {
                errors.push(`wrap: wrapper node must be a component or primitive (something that can have children).`);
                return;
            }
            const { root: wrapperRoot, descendants: wrapperDescendants } = flattenNestedNode(op.wrapper);
            for (const node of [wrapperRoot, ...wrapperDescendants]) {
                if (tree.nodes[node.id]) {
                    errors.push(`wrap: wrapper id "${node.id}" already exists.`);
                    return;
                }
            }
            if (!isContainer(wrapperRoot)) {
                errors.push(`wrap: wrapper node must be a component or primitive (something that can have children).`);
                return;
            }
            const parentId = findParentId(tree, op.id);
            const parent = parentId ? tree.nodes[parentId] : undefined;
            const positionInParent = isContainer(parent) ? parent.children.indexOf(op.id) : -1;

            for (const node of wrapperDescendants) tree.nodes[node.id] = node;
            // The wrapped node joins any children the wrapper itself declared
            // (an empty declaration keeps the classic wrap: children = [target]).
            const wrapperChildren = wrapperRoot.children.includes(op.id) ? wrapperRoot.children : [...wrapperRoot.children, op.id];
            const wrapper = { ...wrapperRoot, children: wrapperChildren };
            tree.nodes[wrapper.id] = wrapper;

            if (isContainer(parent) && positionInParent !== -1) {
                parent.children[positionInParent] = wrapper.id;
            }
            return;
        }
        case "setText": {
            const node = tree.nodes[op.id];
            if (node?.kind !== "text") {
                errors.push(`setText: node "${op.id}" does not exist or is not a text node.`);
                return;
            }
            node.value = op.value;
            return;
        }
    }
}

export function applyOps(tree: UITree, ops: TreeOp[]): ApplyOpsResult {
    const draft: UITree = structuredClone(tree);
    const errors: string[] = [];

    for (const op of ops) {
        applyOne(draft, op, errors);
        if (errors.length > 0) return { tree, errors }; // atomic: any structural failure rejects the whole batch, original tree untouched
    }

    return { tree: draft, errors: [] };
}
