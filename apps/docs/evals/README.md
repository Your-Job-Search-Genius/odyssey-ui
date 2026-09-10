# Playground accuracy program

The design system plan's Section 7: accuracy is a system property, not
a prompt property. 32 golden prompts, run through the real agent loop
against a fresh empty canvas, checked with hard assertions against
actual output -- never an LLM-judged "looks about right".

## Running

```bash
GROQ_API_KEY=... pnpm run evals
```

Requires a live `GROQ_API_KEY` -- there is no fake-client mode for the
CLI itself, since the entire point is measuring the real model's
behavior. Results are written to `evals/results/<timestamp>.json`
(gitignored). Exits non-zero if the targets below aren't met, so a CI
job with real credentials can gate merges on it (the plan's "regression
rule": a drop in first-attempt rate blocks the merge -- not wired into
`.github/workflows/ci.yml` yet, since that job has no `GROQ_API_KEY`
configured here).

## Targets (from the plan)

- **100% valid trees**: guaranteed by construction, not measured here --
  `propose_ops` can never accept an invalid tree (see
  `tool-executor.ts`), so there is nothing to regress.
- **>= 90% first-attempt acceptance**: the fraction of prompts (among
  those that called `propose_ops` at least once) whose _first_
  `propose_ops` call succeeded, with no correction round needed.
- **Zero hallucinated components or icons**: no `propose_ops` (or any
  other tool) result may ever mention an unknown component or icon
  across the whole prompt set.

## Files

- **`prompts.json`** -- the 32 golden prompts, across 5 categories
  (`basic`, `compound`, `styling`, `editing`, `impossible`). The
  `impossible` category (6 prompts: a rich text editor, a video player,
  a nonexistent icon, a raw HTML table, an arbitrary hex color, an
  inline style) exists specifically to check the agent says "can't do
  that" honestly rather than inventing something.
- **`types.ts`** -- the prompt/assertion schema (Zod).
- **`assertions.ts`** -- checks one assertion against a completed turn's
  result and final tree. Fully unit-tested (22 cases) without needing a
  live model -- these are pure functions over data.
- **`run.ts`** -- `runEvals(prompts, { client, registry })`, the runner
  itself. Takes an injected `AgentClient`, so it's testable with a
  scripted fake (see `__tests__/run.test.ts`) -- only `cli.ts` requires
  a real one.
- **`cli.ts`** -- the `pnpm run evals` entry point: loads
  `prompts.json`, builds a real Groq client, runs, writes results,
  prints a summary, exits non-zero on a target miss.

## Known gaps (tracked, not silent)

- Never run against a live model from this environment -- there was no
  `GROQ_API_KEY` available. `runEvals`'s logic (aggregation, pass/fail,
  rate computation, per-prompt error isolation) is fully tested against
  a scripted fake client; the CLI's missing-key path was verified
  directly (`GROQ_API_KEY= pnpm exec tsx evals/cli.ts` exits 1 with a
  clear message).
- No token-usage tracking, despite the plan mentioning it (Section 7,
  item 2: "average ... token usage"). `AgentCompletion` (see
  `lib/playground/groq-client.ts`) doesn't currently carry the Groq
  response's usage field through -- would need that plumbed through
  before this could be added.
- Each golden prompt is single-turn (one user message against an empty
  canvas). The `editing` category prompts (e.g. "add a button, then
  change its color") rely on the model making multiple `propose_ops`
  calls within that one turn, which the architecture already supports --
  no multi-turn eval harness was needed for the current prompt set.
- Not wired into CI, since `.github/workflows/ci.yml` doesn't have
  `GROQ_API_KEY` configured (and shouldn't be given one without you
  deciding to).
