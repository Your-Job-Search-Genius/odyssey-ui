/**
 * The eval runner (design system plan, Section 7). Runs every golden
 * prompt through the real agent loop against a fresh, empty canvas and
 * checks its hard assertions. `runEvals` itself takes an injected
 * AgentClient so it's testable with a scripted fake (see
 * __tests__/run.test.ts); the CLI entry point (`main`, invoked via
 * `pnpm run evals`) is the only part that requires a live GROQ_API_KEY.
 */
import type { Registry } from "@your-job-search-genius/ds-registry";
import type { UITree } from "@your-job-search-genius/ui-tree";
import { runAgentTurn } from "~/lib/playground/agent.js";
import type { AgentClient } from "~/lib/playground/groq-client.js";
import { checkAssertion } from "./assertions.js";
import type { AssertionCheckResult } from "./assertions.js";
import type { GoldenPrompt } from "./types.js";

function emptyTree(): UITree {
    return { rootId: "root", nodes: { root: { id: "root", kind: "primitive", tag: "div", className: [], children: [] } } };
}

export interface EvalResult {
    id: string;
    prompt: string;
    category: GoldenPrompt["category"];
    pass: boolean;
    assertionResults: AssertionCheckResult[];
    firstAttemptAccepted: boolean;
    proposeOpsCallCount: number;
    toolCallCount: number;
    hitRoundLimit: boolean;
    assistantText: string;
    error?: string;
}

export interface EvalSummary {
    total: number;
    passed: number;
    passRate: number;
    /** Over only the prompts that called propose_ops at least once -- the plan's "90%+ first-attempt acceptance" target. */
    firstAttemptAcceptanceRate: number;
    /** Prompts where any tool result mentioned an unknown component/icon -- the plan's "zero hallucinated components or icons" target. */
    hallucinationCount: number;
    results: EvalResult[];
}

export interface RunEvalsOptions {
    client: AgentClient;
    registry: Registry;
}

export async function runEvals(prompts: GoldenPrompt[], options: RunEvalsOptions): Promise<EvalSummary> {
    const results: EvalResult[] = [];

    for (const prompt of prompts) {
        try {
            const result = await runAgentTurn({
                client: options.client,
                registry: options.registry,
                tree: emptyTree(),
                history: [],
                userMessage: prompt.prompt,
            });
            const finalTree = result.newTree ?? emptyTree();
            const assertionResults = prompt.assertions.map((a) => checkAssertion(a, { result, finalTree, registry: options.registry }));
            const proposeOpsCallCount = result.toolCalls.filter((c) => c.name === "propose_ops").length;

            results.push({
                id: prompt.id,
                prompt: prompt.prompt,
                category: prompt.category,
                pass: assertionResults.every((a) => a.pass),
                assertionResults,
                firstAttemptAccepted: checkAssertion({ type: "firstAttemptAccepted" }, { result, finalTree, registry: options.registry }).pass,
                proposeOpsCallCount,
                toolCallCount: result.toolCalls.length,
                hitRoundLimit: result.hitRoundLimit,
                assistantText: result.assistantText,
            });
        } catch (error) {
            results.push({
                id: prompt.id,
                prompt: prompt.prompt,
                category: prompt.category,
                pass: false,
                assertionResults: [],
                firstAttemptAccepted: false,
                proposeOpsCallCount: 0,
                toolCallCount: 0,
                hitRoundLimit: false,
                assistantText: "",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    const withProposeOps = results.filter((r) => r.proposeOpsCallCount > 0);
    const hallucinationCount = results.filter((r) => r.assertionResults.some((a) => a.assertion.type === "noHallucinatedComponentsOrIcons" && !a.pass)).length;

    return {
        total: results.length,
        passed: results.filter((r) => r.pass).length,
        passRate: results.length > 0 ? results.filter((r) => r.pass).length / results.length : 0,
        firstAttemptAcceptanceRate: withProposeOps.length > 0 ? withProposeOps.filter((r) => r.firstAttemptAccepted).length / withProposeOps.length : 0,
        hallucinationCount,
        results,
    };
}
