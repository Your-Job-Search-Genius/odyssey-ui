/**
 * The agent loop (design system plan, Section 6.2). Pure orchestration
 * -- no MongoDB access here, so this is fully testable with a scripted
 * fake AgentClient (see __tests__/agent.test.ts). The caller (the chat
 * API route) is responsible for persisting whatever this returns.
 *
 * Deliberate simplification, documented rather than silent: turns are
 * driven by non-streaming Groq calls (tool-calling rounds need the
 * complete tool_calls array, not fragments), and the final assistant
 * text is a single complete string -- the chat route delivers it to the
 * client as a chunked/fenced stream, not token-level streaming from
 * Groq itself. True token streaming was not implementable-with-confidence
 * without a live GROQ_API_KEY to verify the chunk-accumulation logic
 * against.
 */
import type { Registry } from "@your-job-search-genius/ds-registry";
import type { TreeOp, UITree } from "@your-job-search-genius/ui-tree";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import type { AgentClient } from "./groq-client";
import { buildSystemPrompt } from "./system-prompt";
import { PLAYGROUND_TOOLS } from "./tool-definitions";
import { executeTool } from "./tool-executor";
import type { ToolExecutionState } from "./tool-executor";
import type { ToolCallRecord, ToolResultRecord } from "./types";

/** Bounds the tool-calling back-and-forth within one turn -- independent of MAX_PROPOSE_OPS_ATTEMPTS, which bounds propose_ops specifically; this bounds the whole round-trip count (read-only tool calls included) so a model that just keeps calling get_rules forever cannot hang a request. Sized so a realistic first build (a few discovery rounds + a couple of propose_ops repairs) finishes with room to spare. */
export const MAX_AGENT_ROUNDS = 16;

export interface RunAgentTurnInput {
    client: AgentClient;
    registry: Registry;
    tree: UITree;
    selectedNodeId?: string;
    sessionSummary?: string;
    /** Prior turns' messages, already trimmed to the context window by the caller -- the tree itself is always the source of truth, so trimming history never loses tree state. */
    history: ChatCompletionMessageParam[];
    userMessage: string;
}

export interface RunAgentTurnResult {
    assistantText: string;
    toolCalls: ToolCallRecord[];
    toolResults: ToolResultRecord[];
    /** Set to the final tree if propose_ops was accepted at least once this turn. */
    newTree?: UITree;
    lastOps?: TreeOp[];
    lastOpsSummary?: string;
    reportedUnavailable?: { what: string; alternatives: string[] };
    /** True if MAX_AGENT_ROUNDS was hit without the model producing a final text response. */
    hitRoundLimit: boolean;
}

export async function runAgentTurn(input: RunAgentTurnInput): Promise<RunAgentTurnResult> {
    const systemPrompt = buildSystemPrompt({ tree: input.tree, selectedNodeId: input.selectedNodeId, sessionSummary: input.sessionSummary });
    const messages: ChatCompletionMessageParam[] = [{ role: "system", content: systemPrompt }, ...input.history, { role: "user", content: input.userMessage }];

    const state: ToolExecutionState = {
        registry: input.registry,
        tree: structuredClone(input.tree),
        discoveryCalled: false,
        proposeOpsAttempts: 0,
    };

    const toolCalls: ToolCallRecord[] = [];
    const toolResults: ToolResultRecord[] = [];
    let acceptedOpsThisTurn: { ops: TreeOp[]; summary: string } | undefined;

    for (let round = 0; round < MAX_AGENT_ROUNDS; round++) {
        const completion = await input.client.complete(messages, PLAYGROUND_TOOLS);

        if (!completion.toolCalls || completion.toolCalls.length === 0) {
            return {
                assistantText: completion.content ?? "",
                toolCalls,
                toolResults,
                newTree: acceptedOpsThisTurn ? state.tree : undefined,
                lastOps: acceptedOpsThisTurn?.ops,
                lastOpsSummary: acceptedOpsThisTurn?.summary,
                reportedUnavailable: state.reportedUnavailable,
                hitRoundLimit: false,
            };
        }

        messages.push({
            role: "assistant",
            content: completion.content,
            tool_calls: completion.toolCalls.map((tc) => ({ id: tc.id, type: "function", function: { name: tc.name, arguments: tc.arguments } })),
        });

        for (const call of completion.toolCalls) {
            toolCalls.push({ id: call.id, name: call.name, arguments: call.arguments });
            const resultContent = executeTool(call.name, call.arguments, state);
            toolResults.push({ toolCallId: call.id, name: call.name, content: resultContent });
            messages.push({ role: "tool", tool_call_id: call.id, content: resultContent });

            if (state.lastAcceptedOps) {
                acceptedOpsThisTurn = state.lastAcceptedOps;
                state.lastAcceptedOps = undefined;
            }
        }
    }

    return {
        assistantText: acceptedOpsThisTurn
            ? `I applied part of the change (${acceptedOpsThisTurn.summary}) but ran out of tool-call budget before finishing. Tell me to continue and I'll pick up from the current canvas.`
            : "I wasn't able to finish this within the turn's tool-call budget. Please try a smaller request or continue in a follow-up message.",
        toolCalls,
        toolResults,
        newTree: acceptedOpsThisTurn ? state.tree : undefined,
        lastOps: acceptedOpsThisTurn?.ops,
        lastOpsSummary: acceptedOpsThisTurn?.summary,
        reportedUnavailable: state.reportedUnavailable,
        hitRoundLimit: true,
    };
}
