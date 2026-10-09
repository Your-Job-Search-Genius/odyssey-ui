# MCP UI guidelines workflow, NVDA rules, and preview fullscreen/new-tab — design

Date: 2026-10-09 · Status: awaiting review

## Goal

1. When the ds-mcp server is enabled, an agent asked for UI ("a login page") follows: **plan → pick library components → select checklists → build → re-check checklists → validate/compile → completion record**, using `writesea-ui-agent-guidelines.md` as policy.
2. Every component is NVDA-accessible; the checklist gains an NVDA rule.
3. Every docs component preview gets **Fullscreen** and **Open in new tab** (component only, no chrome).

Out of scope here: docs-site visual redesign (separate, after a direction is approved).

## Decisions already made

- Guidelines and the existing `ux-rules.ts` are **merged; the new doc wins on conflicts** (no prescribed pixel values, breakpoints, or durations).
- NVDA: rule + static audit of all components + fixes. Real NVDA runs need Windows; anything not run in NVDA is reported **Not verified**, never Pass.

## Honest constraint

MCP cannot technically force an agent. Enforcement = make the workflow the default path: server `instructions` (injected into the client's system prompt by most MCP clients), a planning tool that returns exactly what to follow, and `validate_jsx` that hands back the post-build checklist + completion record.

## 1. Policy source and merge

- Copy the guidelines verbatim to `packages/registry/src/policy/ui-agent-guidelines.md` (single source of truth, human-editable markdown).
- Add a new category **Screen readers (NVDA)** (IDs `SR-01..`) and make it mandatory for every UI task alongside Color contrast (workflow step 3, routing table, category index). Rules cover: accessible name/role/state announced correctly in browse and focus mode; labels/errors/hints announced (aria-describedby); live regions for async feedback; dialogs announce title and trap focus; no `role="application"`; headings/landmarks navigable (H / D keys); state changes announced (expanded, selected, pressed, checked); verification = NVDA + Firefox/Chrome walkthrough, else **Not verified**.
- `registry/src/extract/guidelines.ts` parses the markdown by `##` headings into `{ id, title, appliesWhen, markdown }` plus the routing table, stored as `registry.guidelines` (schema + `registry.json` updated).
- `ux-rules.ts` edits (merge, new doc wins):
    - Soften fixed-value rules to direction-only: LAY-01..06, LAY-08, RES breakpoint values, STATE transition durations, CHK-m1, CHK-m3. Keep collapse prevention (LAY-09..15), ZOOM, KEY, ARIA, COL, FLOW, CODE.
    - Rename colliding prefixes: old `FORM-*` → `FIELD-*`, old `STATE-*` → `ISTATE-*` (the new doc owns FORM/STATE IDs); update CHK cross-references.
    - Add CHK-B9 [Blocker] NVDA walkthrough (SR-*), and an ARIA cross-ref.
    - Bump `RULE_SET_VERSION` to 4.0.0 (renamed IDs = breaking for anyone citing them).

## 2. ds-mcp changes

- `server.ts`: pass `instructions` to `McpServer` — short mandatory workflow: call `plan_ui_task` before writing UI; use only registry components; build; re-check the returned rule IDs; `validate_jsx`; type-check/compile; finish with the completion record. Unverified ≠ Pass.
- New tool **`plan_ui_task({ intent, categories? })`** returns markdown:
    1. Selected categories (keyword routing from the doc's task table, e.g. login → Forms, Login, Buttons and actions; always + Color contrast, Screen readers (NVDA), Accessibility, Visual hierarchy, Feedback, Typography, Responsive, Spacing) and their full rule tables. `categories` adds more explicitly.
    2. Candidate library components (reuses `suggestComposition` / `searchComponents`).
    3. Plan template (structure, states, content, responsive behavior, state ownership, cache/motion policy).
    4. Completion-record template pre-filled with the selected rule IDs.
- `validate_jsx`: append a "post-build" footer: re-verify the plan's rule IDs and return the completion record; compile/type-check before finishing.
- `get_rules`: mention `plan_ui_task` as step 2; `build-ui` prompt updated to the new sequence.
- New resource `ds://guidelines` (full markdown).
- Docs `/agent-rules` page: add a "UI task guidelines" section rendered from `registry.guidelines`.

## 3. Preview fullscreen + new tab (apps/docs)

- `PreviewFrame` gets a small toolbar (library `Button`s, icon-only with `aria-label`/tooltip): **Fullscreen** uses the native Fullscreen API on the frame element (toggle, Esc exits, button state `aria-pressed`); **Open in new tab** is a link (`target="_blank"`, `rel="noopener"`) to the new route.
- New route `apps/docs/app/preview/[demo]/[export]/page.tsx` (demo id URL-encoded) renders only the demo inside the preview theme class — no docs chrome. `generateStaticParams` over `demoRegistry` so it works with `output: "export"` / `NEXT_PUBLIC_BASE_PATH`.
- `ComponentPlayground`: Fullscreen only (its state is live props; a new tab would lose them).

## 4. NVDA audit (after 1–3)

- Static audit of every component folder under `packages/ui/components` against SR-* rules (names, roles, states, describedby, live regions, dialog labelling, decorative icons `aria-hidden`).
- Automated: axe-core over each demo (add `vitest-axe`/`axe-core` to the docs test setup only if no existing a11y test harness is present).
- Fix findings in place; report per component: Pass (static + axe) / Fixed / Not verified (NVDA run).

## 5. Docs theme: "Spatial Layers" (direction C, approved)

Reference: canvas https://claude.ai/artifact/SNXkZ4na9jNSY9o8mC91sc, page C.

- **Docs chrome only.** The library's own tokens (`packages/ui/styles/theme.css`) are untouched, so previews still show components exactly as shipped.
- Override Fumadocs' `--color-fd-*` variables in `apps/docs/app/global.css` to the C palette: ground `#F4F4FC`, ink `#1B1838`, muted `#4A4766`, brand `#563BDB` (hover `#441CBF`), hairline `#E1E0F2`. Add a matching dark variant (deep indigo ground, translucent glass), because the mockup only shows light mode.
- Fonts: Nunito Sans (UI/headings) and JetBrains Mono (code), self-hosted woff2 under `app/fonts/` like Inter today (OFL), so the build never fetches from Google.
- Shared visual language as a few CSS utilities in `global.css`: `.glass` panels (backdrop blur, white hairline, soft indigo shadow), blurred background orbs, spring easing `cubic-bezier(.34,1.56,.64,1)`, and `rise` / `orbit` / `drift` / `stackIn` keyframes. Everything is off under `prefers-reduced-motion`.
- Pages:
    - **Home:** C hero with real library components (Button, Input, Toggle, Badge, Sparkline) floating in a CSS 3D orbit, glass category cards, the MCP workflow cards stacking in, and an accessibility section.
    - **Docs layout:** glass sidebar, TOC and nav over the tinted ground, plus C article typography.
    - **Component pages:** glass preview frame with the section 3 toolbar.
    - **MCP / agent rules:** C cards, workflow stack and completion-record table.
    - **Playground:** C three-panel shell.
- No new runtime dependencies (CSS only; `motion` is already available if one effect truly needs JS).

## Testing

- registry: test the guidelines parser (category count, SR category present, routing rows).
- ds-mcp: `plan_ui_task("login page")` returns Forms, Login, Buttons, Color contrast, SR; `validate_jsx` output contains the post-build footer; server advertises `instructions`.
- `pnpm run test` (type-check, lint, prettier, unit) and `registry:check-drift` pass.
- Docs: preview route builds in `docs:build:static`; manual check of fullscreen + new tab.
