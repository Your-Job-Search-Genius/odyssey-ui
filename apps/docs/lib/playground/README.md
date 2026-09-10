# Playground backend

The AI playground's server-side logic (design system plan, Section 6).
Everything here is plain, framework-agnostic TypeScript -- the Next.js
route handlers under `app/api/playground/` and `app/playground/` are
thin wrappers that call into this directory, not where the logic lives.

## Modules

- **`db.ts`** -- MongoDB connection. Requires `MONGODB_URI`. No
  fallback: a session that looked like it saved but silently didn't
  would be worse than a clear startup error.
- **`session-store.ts`** -- CRUD for the three collections (`sessions`,
  `messages`, `treeVersions`). Every function takes a `Db` as its first
  argument rather than importing `db.ts`'s `getDb()` internally, so this
  is testable against a fake `Db` (see `__tests__/session-store.test.ts`
  and `__tests__/fake-db.ts`) without a live MongoDB.
- **`types.ts`** -- Zod schemas for the persisted shapes.
- **`tool-definitions.ts`** -- the 10 tools handed to Groq (8 read-only
  ds-mcp tools + `propose_ops` + `report_unavailable`), as hand-written
  JSON Schema.
- **`tool-executor.ts`** -- executes one tool call. The read-only tools
  call `@your-job-search-genius/ds-mcp`'s exact same pure functions (no
  duplicated logic). `propose_ops` is the actual enforcement point: it
  always goes through `applyOps` then `validateTree` before accepting a
  change to the draft tree.
- **`system-prompt.ts`** -- rebuilds the system prompt every turn from
  the current tree outline, never cached.
- **`groq-client.ts`** -- thin wrapper around the Groq SDK behind a small
  `AgentClient` interface, so `agent.ts` is testable with a scripted
  fake client. Requires `GROQ_API_KEY`. Model is `PLAYGROUND_MODEL`
  (default: `qwen/qwen3.8-27b`) -- confirm the exact id against Groq's
  current model list before deploying; it could not be verified live
  from this environment.
- **`agent.ts`** -- the turn loop: discover, propose_ops (up to 3
  attempts), or report_unavailable, then a final text response. Pure
  orchestration, no MongoDB access -- the chat route persists whatever
  this returns.

## Required environment variables

| Variable           | Required for            | Notes                                                             |
| ------------------ | ----------------------- | ----------------------------------------------------------------- |
| `MONGODB_URI`      | Any session persistence | No default; `getDb()` throws clearly if unset.                    |
| `GROQ_API_KEY`     | The chat endpoint       | The chat route returns a clear 500 if unset rather than crashing. |
| `PLAYGROUND_MODEL` | Optional                | Overrides the default Groq model id.                              |

## Known gaps (tracked, not silent)

- No live `MONGODB_URI` or `GROQ_API_KEY` was available while building
  this, so `db.ts`/`groq-client.ts` themselves are verified by code
  review and type-checking, not a live round-trip. Everything built on
  top of them (`session-store.ts`, `agent.ts`, `tool-executor.ts`) is
  fully unit-tested against fakes for both.
- `agent.ts`'s turns are non-streaming under the hood (tool-calling
  rounds need the complete `tool_calls` array, not fragments); the chat
  route delivers the final result as a fast NDJSON replay, not true
  token-level streaming from Groq. See `agent.ts`'s own doc comment.
