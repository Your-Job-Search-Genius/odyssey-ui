#!/usr/bin/env tsx
/**
 * `pnpm run evals` (design system plan, Section 7). Requires a live
 * GROQ_API_KEY -- there is no fake-client mode here, since the entire
 * point is measuring the real model's behavior. runEvals() itself is
 * fake-client-testable (see __tests__/run.test.ts); this file is just
 * the thin CLI wrapper around it.
 *
 * Exits non-zero when the targets aren't met, so this can gate CI (the
 * plan's "regression rule": a drop in first-attempt rate blocks the
 * merge) once a CI job is wired to run it with real credentials.
 */
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import fs from "node:fs";
import path from "node:path";
import { createGroqAgentClient } from "../lib/playground/groq-client.js";
import { runEvals } from "./run.js";
import { GoldenPromptSetSchema } from "./types.js";

const EVALS_DIR = import.meta.dirname;
const RESULTS_DIR = path.join(EVALS_DIR, "results");

/** Section 7's stated pre-launch bar: valid trees are 100% by construction (guaranteed elsewhere -- validateTree makes an invalid tree unreachable), so the two measured targets here are first-attempt acceptance and zero hallucinations. */
const TARGETS = { firstAttemptAcceptanceRate: 0.9, hallucinationCount: 0 };

async function main() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("[evals] GROQ_API_KEY is not set -- evals need a live model to run against. See apps/docs/lib/playground/README.md.");
        process.exit(1);
    }

    const raw = JSON.parse(fs.readFileSync(path.join(EVALS_DIR, "prompts.json"), "utf8"));
    const prompts = GoldenPromptSetSchema.parse(raw);
    const registry = loadRegistry();
    const client = createGroqAgentClient(apiKey);

    console.log(`[evals] running ${prompts.length} golden prompts against ${registry.components.length} registry components...`);
    const summary = await runEvals(prompts, { client, registry });

    fs.mkdirSync(RESULTS_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.writeFileSync(path.join(RESULTS_DIR, `${stamp}.json`), `${JSON.stringify(summary, null, 2)}\n`);

    console.log(`[evals] ${summary.passed}/${summary.total} passed (${(summary.passRate * 100).toFixed(1)}%)`);
    console.log(
        `[evals] first-attempt acceptance: ${(summary.firstAttemptAcceptanceRate * 100).toFixed(1)}% (target: >= ${TARGETS.firstAttemptAcceptanceRate * 100}%)`,
    );
    console.log(`[evals] hallucinated components/icons: ${summary.hallucinationCount} (target: 0)`);

    for (const r of summary.results.filter((r) => !r.pass)) {
        const reason =
            r.error ??
            r.assertionResults
                .filter((a) => !a.pass)
                .map((a) => a.detail)
                .join("; ");
        console.log(`[evals] FAIL ${r.id}: ${reason}`);
    }

    const meetsTargets = summary.firstAttemptAcceptanceRate >= TARGETS.firstAttemptAcceptanceRate && summary.hallucinationCount === 0;
    if (!meetsTargets) console.log("[evals] targets not met.");
    process.exit(meetsTargets ? 0 : 1);
}

main().catch((error) => {
    console.error("[evals] fatal error:", error);
    process.exit(1);
});
