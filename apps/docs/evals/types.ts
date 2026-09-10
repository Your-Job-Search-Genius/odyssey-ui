/**
 * The golden prompt set's shape (design system plan, Section 7). Each
 * entry is a single-turn request against a fresh, empty canvas, with
 * hard assertions checked against the agent's actual output -- not a
 * vibe-based "looks right" judgment.
 */
import { z } from "zod";

export const AssertionSchema = z.discriminatedUnion("type", [
    /** The final tree contains at least one node of this component (by id, name, or importName). */
    z.object({ type: z.literal("treeContainsComponent"), name: z.string(), minCount: z.number().int().positive().optional() }),
    /** The final tree contains no node of this component. */
    z.object({ type: z.literal("treeExcludesComponent"), name: z.string() }),
    /** Every primitive node in the final tree uses only these tags (e.g. ["div"] for "just a container, no heading"). */
    z.object({ type: z.literal("onlyPrimitivesUsed"), allowed: z.array(z.string()) }),
    /** A component node exists with this prop set to something truthy/non-empty (e.g. Input.icon). */
    z.object({ type: z.literal("componentHasProp"), component: z.string(), prop: z.string() }),
    /** The very first propose_ops call in the turn succeeded -- no correction round needed. */
    z.object({ type: z.literal("firstAttemptAccepted") }),
    /** report_unavailable was called this turn (for prompts asking for something the library genuinely can't build). */
    z.object({ type: z.literal("reportedUnavailable") }),
    /** propose_ops was never rejected for referencing an unknown component or icon -- the strongest signal against hallucination. */
    z.object({ type: z.literal("noHallucinatedComponentsOrIcons") }),
    /** At least one discovery tool (list_components/search_components) was called before the first propose_ops. */
    z.object({ type: z.literal("discoveredBeforeProposing") }),
]);
export type Assertion = z.infer<typeof AssertionSchema>;

export const GoldenPromptSchema = z.object({
    id: z.string(),
    prompt: z.string(),
    category: z.enum(["basic", "compound", "styling", "editing", "impossible"]),
    expectedOutcome: z.string(),
    assertions: z.array(AssertionSchema).min(1),
});
export type GoldenPrompt = z.infer<typeof GoldenPromptSchema>;

export const GoldenPromptSetSchema = z.array(GoldenPromptSchema);
