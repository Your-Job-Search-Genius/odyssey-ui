/**
 * POST /api/playground/chat (design system plan, Section 6.1/6.2). Runs
 * one agent turn and streams the result back as newline-delimited JSON
 * events: {type:"tool_call"|"tool_result"}, {type:"tree_updated"},
 * {type:"text"}, {type:"done"|"error"}.
 *
 * Known simplification (see agent.ts's own doc comment): the events
 * below are emitted only after the full turn completes, not
 * incrementally as tool calls happen -- true incremental streaming
 * during tool-calling rounds would need agent.ts to accept a
 * per-event callback, which was not worth building without a live
 * GROQ_API_KEY to verify the timing against. The UI still gets the same
 * information (tool activity chips, the tree update, the final text),
 * just delivered as one fast replay rather than as it happens live.
 */
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { z } from "zod";
import { runAgentTurn } from "~/lib/playground/agent";
import { getDb } from "~/lib/playground/db";
import { isPlaygroundEnabled, playgroundDisabledResponse } from "~/lib/playground/feature-flag";
import { createGroqAgentClient } from "~/lib/playground/groq-client";
import { getChatRateLimiter } from "~/lib/playground/rate-limit";
import { addMessage, appendTreeVersion, getLatestTreeVersion, getSession, listMessages, setSelectedNode } from "~/lib/playground/session-store";

export const runtime = "nodejs";

const CONTEXT_MESSAGE_LIMIT = 20;

const RequestSchema = z.object({
    sessionId: z.string(),
    message: z.string().min(1),
    selectedNodeId: z.string().optional(),
});

function sseLine(event: Record<string, unknown>): string {
    return `${JSON.stringify(event)}\n`;
}

export async function POST(request: Request) {
    if (!isPlaygroundEnabled()) return playgroundDisabledResponse();
    const body = await request.json().catch(() => null);
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const { sessionId, message, selectedNodeId } = parsed.data;

    const rateLimit = getChatRateLimiter().check(sessionId);
    if (!rateLimit.allowed) {
        const retryAfterSeconds = Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000);
        return new Response(JSON.stringify({ error: "Too many messages -- please wait a moment before sending another." }), {
            status: 429,
            headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterSeconds) },
        });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "GROQ_API_KEY is not set on the server." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const db = await getDb();
    const session = await getSession(db, sessionId);
    if (!session) {
        return new Response(JSON.stringify({ error: `Session "${sessionId}" does not exist.` }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const [latestTreeVersion, priorMessages] = await Promise.all([getLatestTreeVersion(db, sessionId), listMessages(db, sessionId)]);
    if (!latestTreeVersion) {
        return new Response(JSON.stringify({ error: `Session "${sessionId}" has no tree version -- this should never happen.` }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (selectedNodeId !== undefined) await setSelectedNode(db, sessionId, selectedNodeId);

    const registry = loadRegistry();
    const client = createGroqAgentClient(apiKey);
    // Only user/assistant text is replayed into the next turn's history --
    // a past turn's tool-call/tool-result exchange is scoped to that turn
    // (see agent.ts's doc comment) and is never itself persisted as a
    // separate "tool"-role message; its effect is already reflected in the
    // current tree outline the system prompt includes.
    const history: Array<{ role: "user" | "assistant"; content: string }> = priorMessages
        .filter((m): m is typeof m & { role: "user" | "assistant" } => m.role === "user" || m.role === "assistant")
        .slice(-CONTEXT_MESSAGE_LIMIT)
        .map((m) => ({ role: m.role, content: m.content }));

    await addMessage(db, { sessionId, role: "user", content: message });

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const encoder = new TextEncoder();
            const send = (event: Record<string, unknown>) => controller.enqueue(encoder.encode(sseLine(event)));

            try {
                const result = await runAgentTurn({
                    client,
                    registry,
                    tree: latestTreeVersion.tree,
                    selectedNodeId: selectedNodeId ?? session.selectedNodeId,
                    sessionSummary: session.sessionSummary,
                    history,
                    userMessage: message,
                });

                for (let i = 0; i < result.toolCalls.length; i++) {
                    const call = result.toolCalls[i];
                    const toolResult = result.toolResults[i];
                    if (call) send({ type: "tool_call", name: call.name });
                    if (toolResult) send({ type: "tool_result", name: toolResult.name, content: toolResult.content });
                }

                let newVersion: number | undefined;
                if (result.newTree && result.lastOps && result.lastOpsSummary) {
                    const versionDoc = await appendTreeVersion(db, { sessionId, tree: result.newTree, ops: result.lastOps, summary: result.lastOpsSummary });
                    newVersion = versionDoc.version;
                    send({ type: "tree_updated", version: newVersion, tree: result.newTree });
                }

                if (result.reportedUnavailable) send({ type: "unavailable", ...result.reportedUnavailable });

                await addMessage(db, {
                    sessionId,
                    role: "assistant",
                    content: result.assistantText,
                    toolCalls: result.toolCalls,
                    toolResults: result.toolResults,
                    treeVersionAfter: newVersion,
                });

                send({ type: "text", text: result.assistantText });
                send({ type: "done" });
            } catch (error) {
                send({ type: "error", message: error instanceof Error ? error.message : String(error) });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache" } });
}
