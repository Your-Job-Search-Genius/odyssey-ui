/**
 * The UI tree schema (design system plan, Section 5.1). The playground's
 * model never writes raw JSX -- it only ever emits this JSON tree, which
 * validate.ts checks against the registry, render.tsx renders, and
 * codegen.ts turns into the .tsx file the user copies or downloads. This
 * is the mechanism that makes the hard constraints in Section 1
 * unbypassable by construction, not just by convention.
 */
import { z } from "zod";

export const PrimitiveTagSchema = z.enum(["div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6"]);
export type PrimitiveTag = z.infer<typeof PrimitiveTagSchema>;

/**
 * A prop value on a "component" node. `"node"` is how a slot prop (e.g.
 * a `footer` render-prop, or Button's `iconLeading` when it's given as a
 * JSX element rather than a bare icon reference) points at another node
 * in the same tree by id, rendered in place -- see render.tsx's
 * resolvePropValue and codegen.ts's propValueToJsxExpression.
 */
export const PropValueSchema = z.discriminatedUnion("t", [
    z.object({ t: z.literal("string"), v: z.string() }),
    z.object({ t: z.literal("number"), v: z.number() }),
    z.object({ t: z.literal("boolean"), v: z.boolean() }),
    z.object({ t: z.literal("enum"), v: z.string() }),
    z.object({ t: z.literal("icon"), v: z.string() }),
    z.object({ t: z.literal("node"), v: z.string() }),
]);
export type PropValue = z.infer<typeof PropValueSchema>;

const NodeIdSchema = z.string().min(1);

export const ComponentNodeSchema = z.object({
    id: NodeIdSchema,
    kind: z.literal("component"),
    /** Registry component name -- e.g. "Input" or "Select.Item" (importName, not the bare export name). */
    name: z.string(),
    props: z.record(z.string(), PropValueSchema),
    children: z.array(NodeIdSchema),
});
export type ComponentNode = z.infer<typeof ComponentNodeSchema>;

export const PrimitiveNodeSchema = z.object({
    id: NodeIdSchema,
    kind: z.literal("primitive"),
    tag: PrimitiveTagSchema,
    className: z.array(z.string()),
    children: z.array(NodeIdSchema),
});
export type PrimitiveNode = z.infer<typeof PrimitiveNodeSchema>;

export const TextNodeSchema = z.object({
    id: NodeIdSchema,
    kind: z.literal("text"),
    value: z.string(),
});
export type TextNode = z.infer<typeof TextNodeSchema>;

export const IconNodeSchema = z.object({
    id: NodeIdSchema,
    kind: z.literal("icon"),
    name: z.string(),
    className: z.array(z.string()).optional(),
});
export type IconNode = z.infer<typeof IconNodeSchema>;

export const UINodeSchema = z.discriminatedUnion("kind", [ComponentNodeSchema, PrimitiveNodeSchema, TextNodeSchema, IconNodeSchema]);
export type UINode = z.infer<typeof UINodeSchema>;

export const UITreeSchema = z.object({
    rootId: NodeIdSchema,
    nodes: z.record(NodeIdSchema, UINodeSchema),
});
export type UITree = z.infer<typeof UITreeSchema>;

export function nodeKind(node: UINode): UINode["kind"] {
    return node.kind;
}
