/**
 * Thin wrapper around the Groq SDK, behind a small interface so
 * agent.ts is testable with a scripted fake client -- there is no
 * GROQ_API_KEY in this environment to exercise the real one against.
 *
 * Model is configurable via PLAYGROUND_MODEL (default below is the
 * Groq-hosted Qwen model agreed on for this project). Confirm the exact
 * model id against Groq's current model list (console.groq.com/docs/models)
 * before deploying -- it was not possible to verify live here.
 */
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "groq-sdk/resources/chat/completions";

export const DEFAULT_PLAYGROUND_MODEL = "qwen/qwen3.8-27b";

export interface AgentCompletion {
    content: string | null;
    toolCalls?: Array<{ id: string; name: string; arguments: string }>;
}

export interface AgentClient {
    complete(messages: ChatCompletionMessageParam[], tools: ChatCompletionTool[]): Promise<AgentCompletion>;
}

export function createGroqAgentClient(apiKey: string, model: string = process.env.PLAYGROUND_MODEL ?? DEFAULT_PLAYGROUND_MODEL): AgentClient {
    const client = new Groq({ apiKey });

    return {
        async complete(messages, tools) {
            const response = await client.chat.completions.create({
                model,
                messages,
                tools,
                tool_choice: "auto",
                temperature: 0.2,
            });
            const message = response.choices[0]?.message;
            return {
                content: message?.content ?? null,
                toolCalls: message?.tool_calls?.map((tc) => ({ id: tc.id, name: tc.function.name, arguments: tc.function.arguments })),
            };
        },
    };
}
