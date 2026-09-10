/**
 * Playground persistence shapes (design system plan, Section 6.4).
 * Timestamps are ISO strings (not Date objects) so these types are the
 * same on the server and once JSON-serialized to the client.
 */
import { TreeOpSchema, UITreeSchema } from "@your-job-search-genius/ui-tree";
import { z } from "zod";

export const PlaygroundSessionSchema = z.object({
    _id: z.string(),
    title: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    libraryVersion: z.string(),
    registryVersion: z.string(),
    currentTreeVersion: z.number().int().nonnegative(),
    selectedNodeId: z.string().optional(),
    /** Summary of messages older than the context window (see agent.ts's CONTEXT_MESSAGE_LIMIT); the tree itself is always the source of truth, so a long history never degrades tree accuracy. */
    sessionSummary: z.string().optional(),
});
export type PlaygroundSession = z.infer<typeof PlaygroundSessionSchema>;

export const ToolCallRecordSchema = z.object({
    id: z.string(),
    name: z.string(),
    arguments: z.string(),
});
export type ToolCallRecord = z.infer<typeof ToolCallRecordSchema>;

export const ToolResultRecordSchema = z.object({
    toolCallId: z.string(),
    name: z.string(),
    content: z.string(),
});
export type ToolResultRecord = z.infer<typeof ToolResultRecordSchema>;

export const PlaygroundMessageSchema = z.object({
    _id: z.string(),
    sessionId: z.string(),
    role: z.enum(["user", "assistant", "tool"]),
    content: z.string(),
    toolCalls: z.array(ToolCallRecordSchema).optional(),
    toolResults: z.array(ToolResultRecordSchema).optional(),
    treeVersionAfter: z.number().int().nonnegative().optional(),
    createdAt: z.string(),
});
export type PlaygroundMessage = z.infer<typeof PlaygroundMessageSchema>;

export const PlaygroundTreeVersionSchema = z.object({
    _id: z.string(),
    sessionId: z.string(),
    version: z.number().int().nonnegative(),
    tree: UITreeSchema,
    ops: z.array(TreeOpSchema),
    summary: z.string(),
    createdAt: z.string(),
});
export type PlaygroundTreeVersion = z.infer<typeof PlaygroundTreeVersionSchema>;
