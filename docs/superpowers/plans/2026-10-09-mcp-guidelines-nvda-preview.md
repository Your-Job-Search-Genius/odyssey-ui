# MCP UI Guidelines, NVDA, Preview Controls, and Spatial Layers Theme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make ds-mcp drive agents through plan → checklist → build → re-check → compile using the Writesea UI guidelines (plus a new mandatory NVDA category), add Fullscreen / Open-in-new-tab to every docs preview, restyle the docs site in the approved "Spatial Layers" direction, and audit components for NVDA.

**Architecture:** The guidelines markdown is the single policy source in `packages/registry/src/policy/`. `registry:build` parses it into `registry.guidelines` (categories, mandatory list, keyword routes). ds-mcp exposes it through a new `plan_ui_task` tool, server `instructions`, a `ds://guidelines` resource, and a `nextSteps` field on `validate_jsx`. The docs site gets a standalone `/preview/[...slug]` route, a toolbar in `PreviewFrame`, and a CSS-only theme over Fumadocs variables.

**Tech Stack:** TypeScript, zod, vitest, `@modelcontextprotocol/sdk` ^1.30, Next.js + Fumadocs 16, Tailwind v4, React Aria.

**Spec:** `docs/superpowers/specs/2026-10-09-mcp-guidelines-nvda-preview-design.md`

## Global Constraints

- All new files kebab-case. `react-aria-components` imports prefixed `Aria*`.
- Library tokens in `packages/ui/styles/theme.css` are NOT changed by the theme work.
- No new runtime dependencies. Font files are self-hosted woff2 (OFL) under `apps/docs/app/fonts/`.
- All motion is disabled under `prefers-reduced-motion: reduce`.
- Unverified checks are reported "Not verified", never "Pass" (applies to tool copy and to the NVDA audit report).
- `RULE_SET_VERSION` becomes `4.0.0`. Old `FORM-*` → `FIELD-*`, old `STATE-*` → `ISTATE-*` in `ux-rules.ts`.
- Run from repo root: `pnpm run test` and `pnpm run registry:check-drift` must pass at the end. Commit only when the user asks.

## Review Focus

1. Intent with no keyword match ("make it nicer") → plan still returns the 8 mandatory categories, never an empty plan. (Task 4 test)
2. Keyword substring false positives ("platform" must not match "form", "table" must not trigger "tab") → word-boundary matching. (Task 4 test)
3. Guidelines markdown edited so a category index row has no matching section, or a route names a missing category → `registry:build` fails loudly. (Task 2 test)
4. Demo ids contain slashes (`base/buttons/buttons`) and the site runs under `NEXT_PUBLIC_BASE_PATH` → the new-tab URL and static params must round-trip. (Task 6 test)
5. Fullscreen exited by Esc (not the button) → button state must resync via `fullscreenchange`. (Task 6 manual check)

---

### Task 1: Policy file with the NVDA category

**Files:**

- Create: `packages/registry/src/policy/ui-agent-guidelines.md` (copy of `~/Downloads/writesea-ui-agent-guidelines.md`, then edits below)

- [ ] **Step 1: Copy the source doc**

```bash
mkdir -p packages/registry/src/policy
cp ~/Downloads/writesea-ui-agent-guidelines.md packages/registry/src/policy/ui-agent-guidelines.md
```

- [ ] **Step 2: Make NVDA mandatory in the workflow.** Replace step 3 of "Required task workflow":

```markdown
3. Always include **Color contrast** and **Screen readers (NVDA)** for every UI task. Include shared accessibility, hierarchy, typography, responsive, spacing, and feedback rules wherever applicable.
```

- [ ] **Step 3: Add the category index row** directly under the `| Color contrast | ...` row:

```markdown
| Screen readers (NVDA) | Every UI task; all interactive and informative content | Mandatory NVDA browse/focus-mode checklist below |
```

- [ ] **Step 4: Add A11Y-05** at the end of "Accessibility — shared baseline":

```markdown
- A11Y-05: Verify screen-reader behavior with the **Screen readers (NVDA)** checklist; it is mandatory for every UI task.
```

- [ ] **Step 5: Insert the NVDA section** immediately before `## Accessibility — shared baseline`:

```markdown
## Screen readers (NVDA) — mandatory for every UI task

Policy: every interactive or informative UI must be usable with NVDA on Windows (Firefox and Chrome) in browse mode and focus mode. Prefer the native semantics the library components already provide over custom ARIA; the simplest correct structure wins. Static review and automated tools (axe) are supporting evidence only; without an actual NVDA run, record SR rules as Not verified.

| ID    | Rule                                                                                                                                                                                                                | Verification                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| SR-01 | Every interactive control exposes a name, role, and state that NVDA announces correctly (for example "Save, button" or "Remember me, check box, not checked").                                                      | Tab through and arrow in browse mode with NVDA Speech Viewer on; each control is announced with name, role, and state. |
| SR-02 | Use library components and native semantics; add ARIA only to fill a real gap. Never set `role="application"` or ARIA that contradicts the native role.                                                             | The accessibility tree has no redundant or conflicting roles.                                                          |
| SR-03 | Form fields announce label, required state, current value, hint, and error on focus (label association, `aria-describedby`, `aria-invalid`).                                                                        | Tabbing into an invalid required field announces label, "required", "invalid entry", and the error text.               |
| SR-04 | Async feedback (submit errors, toasts, saved states, result counts, loading completion) is announced through a polite or assertive live region that exists before the update, without stealing focus unnecessarily. | Speech Viewer captures each message once, at the intended politeness.                                                  |
| SR-05 | Dialogs, drawers, sheets, and menus announce their name and role on open, move focus inside, contain it while modal, close on Escape, and return focus to the trigger.                                              | NVDA announces "<title>, dialog"; Escape closes; focus returns to the trigger.                                         |
| SR-06 | Headings form a logical outline (one h1, no skipped levels) and landmarks (main, navigation, banner, contentinfo) exist, so H, D, and NVDA+F7 navigation work.                                                      | NVDA Elements List shows a sensible heading and landmark outline.                                                      |
| SR-07 | State changes are announced while focused: expanded/collapsed, selected, pressed, checked, current page (`aria-current`), sort direction.                                                                           | Toggle each state; NVDA announces the new state.                                                                       |
| SR-08 | Decorative icons and images are hidden (`aria-hidden`, empty alt); meaningful images and icon-only buttons have text alternatives.                                                                                  | Browse mode reads no stray "graphic"; icon-only buttons have names.                                                    |
| SR-09 | Browse-mode reading order matches the visual order; no information exists only on hover; visually revealed content is reachable in browse mode.                                                                     | Arrow through the page; order and content match the screen.                                                            |
| SR-10 | Data tables use real table semantics with header cells, so NVDA announces row and column headers.                                                                                                                   | Ctrl+Alt+Arrow navigation announces headers.                                                                           |
| SR-11 | Composite widgets (combobox, tabs, grid, slider, listbox) follow the ARIA Authoring Practices pattern implemented by React Aria; NVDA switches to focus mode on them and Escape returns to browse mode.             | Arrow keys operate the widget; mode switching works.                                                                   |
| SR-12 | Record NVDA evidence: NVDA version, browser, and what was announced. Without an actual NVDA run, mark SR rules Not verified.                                                                                        | The completion record lists the NVDA environment, or Not verified with the remaining check.                            |
```

- [ ] **Step 6: Add a routing note** as the last row of the "Task-to-rule routing" table:

```markdown
| Any UI task | Color contrast; Screen readers (NVDA) — always, in addition to the rows above |
```

---

### Task 2: Registry parses the guidelines

**Files:**

- Create: `packages/registry/src/extract/guidelines.ts`
- Modify: `packages/registry/src/schema.ts` (add schemas, add `guidelines` to `RegistrySchema`)
- Modify: `packages/registry/src/build.ts:60-71` (add `guidelines: loadGuidelines()`)
- Modify: `packages/registry/src/index.ts` (re-export `slugifyCategory`? no: keep it in `schema.ts`, see below)
- Test: `packages/registry/__tests__/guidelines.test.ts`

**Interfaces:**

- Produces: `Guidelines = { preamble: string; categories: GuidelineCategory[]; mandatory: string[]; routes: { keywords: string[]; categories: string[] }[] }`, `GuidelineCategory = { id; name; title; appliesWhen; markdown }`, `registry.guidelines`, and `slugifyCategory(name: string): string` exported from `schema.ts` (so ds-mcp can import it from the package root).

- [ ] **Step 1: Write the failing test** `packages/registry/__tests__/guidelines.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { loadGuidelines, parseGuidelines } from "../src/extract/guidelines.js";

describe("guidelines", () => {
    const g = loadGuidelines();

    it("parses every category from the index, including NVDA", () => {
        const ids = g.categories.map((c) => c.id);
        expect(ids).toEqual(expect.arrayContaining(["forms", "login", "color-contrast", "screen-readers-nvda", "data-tables", "progressive-web-apps-pwa"]));
        expect(g.categories.find((c) => c.id === "screen-readers-nvda")?.markdown).toContain("SR-12");
    });

    it("keeps non-category sections in the preamble", () => {
        expect(g.preamble).toContain("## Required task workflow");
        expect(g.preamble).toContain("## Explicit defaults");
        expect(g.categories.some((c) => c.title.startsWith("Required task workflow"))).toBe(false);
    });

    it("every mandatory id and route target is a real category", () => {
        const ids = new Set(g.categories.map((c) => c.id));
        for (const id of g.mandatory) expect(ids.has(id)).toBe(true);
        for (const r of g.routes) for (const id of r.categories) expect(ids.has(id)).toBe(true);
    });

    it("fails loudly when the index lists a section that does not exist", () => {
        const md = "# T\n\n## Category index\n\n| Category | Applies when | Coverage |\n| --- | --- | --- |\n| Ghost | always | none |\n";
        expect(() => parseGuidelines(md)).toThrow(/Ghost/);
    });
});
```

- [ ] **Step 2: Run it, expect FAIL** (module not found)

Run: `pnpm --filter @your-job-search-genius/ds-registry exec vitest run __tests__/guidelines.test.ts`

- [ ] **Step 3: Add schemas** to `packages/registry/src/schema.ts` (before `RegistrySchema`), then add `guidelines: GuidelinesSchema,` to `RegistrySchema` after `rules`:

```ts
/** One category of the UI agent guidelines (packages/registry/src/policy/ui-agent-guidelines.md). */
export const GuidelineCategorySchema = z.object({
    /** Slug of the category name, e.g. "screen-readers-nvda". */
    id: z.string(),
    /** Name as written in the category index, e.g. "Screen readers (NVDA)". */
    name: z.string(),
    /** Full section heading. */
    title: z.string(),
    appliesWhen: z.string(),
    /** The section verbatim, heading included. */
    markdown: z.string(),
});
export type GuidelineCategory = z.infer<typeof GuidelineCategorySchema>;

export const GuidelinesSchema = z.object({
    /** Every non-category section (policy, workflow, defaults, routing, verification) verbatim. */
    preamble: z.string(),
    categories: z.array(GuidelineCategorySchema),
    /** Category ids included in every UI task. */
    mandatory: z.array(z.string()),
    /** Keyword -> category routing used by ds-mcp's plan_ui_task. */
    routes: z.array(z.object({ keywords: z.array(z.string()), categories: z.array(z.string()) })),
});
export type Guidelines = z.infer<typeof GuidelinesSchema>;

export function slugifyCategory(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
```

- [ ] **Step 4: Implement** `packages/registry/src/extract/guidelines.ts`

```ts
/**
 * Parses the hand-authored UI agent guidelines (../policy/ui-agent-guidelines.md)
 * into categories ds-mcp can route a task to. The markdown stays the single
 * source of truth: categories are the "## " sections named in its
 * "Category index" table; every other section is preamble. Routes and the
 * mandatory list are hand-authored here because the doc's routing table is
 * prose, not data.
 */
import fs from "node:fs";
import path from "node:path";
import type { GuidelineCategory, Guidelines } from "../schema.js";
import { slugifyCategory } from "../schema.js";

export const MANDATORY_CATEGORY_IDS = [
    "color-contrast",
    "screen-readers-nvda",
    "accessibility",
    "visual-hierarchy-and-consistency",
    "typography-and-content",
    "responsive-design",
    "spacing-and-layout",
    "feedback-and-recovery",
];

export const GUIDELINE_ROUTES: Guidelines["routes"] = [
    {
        keywords: ["login", "log in", "sign in", "signin", "sign-in", "auth", "authentication", "password"],
        categories: [
            "forms",
            "login",
            "buttons-and-actions",
            "api-requests-and-integration",
            "state-management-and-code-organization",
            "caching-and-server-data",
        ],
    },
    {
        keywords: [
            "sign up",
            "signup",
            "sign-up",
            "register",
            "registration",
            "form",
            "forms",
            "input",
            "inputs",
            "field",
            "fields",
            "settings",
            "checkout",
            "contact",
            "profile",
            "onboarding",
        ],
        categories: ["forms", "buttons-and-actions"],
    },
    {
        keywords: ["modal", "modals", "dialog", "dialogs", "drawer", "drawers", "sheet", "popup", "popover", "confirm", "confirmation"],
        categories: ["overlays-modals-and-drawers", "portal-integration", "buttons-and-actions"],
    },
    { keywords: ["table", "tables", "grid", "records", "list", "listing", "rows"], categories: ["data-tables", "buttons-and-actions"] },
    {
        keywords: ["header", "sidebar", "nav", "navigation", "menu", "menus", "navbar", "app shell", "shell"],
        categories: ["navigation-and-menus", "buttons-and-actions"],
    },
    { keywords: ["tab", "tabs"], categories: ["tabs-and-related-views"] },
    { keywords: ["filter", "filters", "archived", "status", "segmented"], categories: ["status-filters-and-content-switching"] },
    { keywords: ["animation", "animated", "animate", "transition", "transitions", "motion"], categories: ["animation-and-motion"] },
    {
        keywords: ["api", "fetch", "backend", "server", "endpoint", "crud", "dashboard"],
        categories: ["api-requests-and-integration", "caching-and-server-data", "state-management-and-code-organization", "rendering-performance"],
    },
    { keywords: ["state", "redux", "store", "stateful"], categories: ["state-management-and-code-organization", "rendering-performance"] },
    { keywords: ["pwa", "offline", "service worker", "installable"], categories: ["progressive-web-apps-pwa", "navigation-and-menus"] },
    { keywords: ["button", "buttons", "action", "actions", "cta"], categories: ["buttons-and-actions"] },
];

export function parseGuidelines(markdown: string): Guidelines {
    const [intro = "", ...rawSections] = markdown.split(/^## /m);
    const sections = rawSections.map((raw) => {
        const newline = raw.indexOf("\n");
        return { title: raw.slice(0, newline).trim(), body: raw.slice(newline + 1).trim() };
    });

    const index = sections.find((s) => s.title === "Category index");
    if (!index) throw new Error('[guidelines] missing "## Category index" section');

    const appliesWhen = new Map<string, string>();
    for (const line of index.body.split("\n")) {
        const cells = line.split("|").map((c) => c.trim());
        const [name, when] = [cells[1], cells[2]];
        if (!name || !when || name === "Category" || /^-+$/.test(name)) continue;
        appliesWhen.set(name, when);
    }

    const categories: GuidelineCategory[] = [];
    const preamble = [intro.trim()];
    for (const s of sections) {
        const name = s.title.split(" — ")[0]!.trim();
        const when = appliesWhen.get(name);
        const markdownBlock = `## ${s.title}\n\n${s.body}`;
        if (when) categories.push({ id: slugifyCategory(name), name, title: s.title, appliesWhen: when, markdown: markdownBlock });
        else preamble.push(markdownBlock);
    }

    const missing = [...appliesWhen.keys()].filter((name) => !categories.some((c) => c.name === name));
    if (missing.length > 0) throw new Error(`[guidelines] category index lists sections that do not exist: ${missing.join(", ")}`);

    return { preamble: preamble.join("\n\n"), categories, mandatory: MANDATORY_CATEGORY_IDS, routes: GUIDELINE_ROUTES };
}

export function loadGuidelines(filePath = path.join(import.meta.dirname, "..", "policy", "ui-agent-guidelines.md")): Guidelines {
    const guidelines = parseGuidelines(fs.readFileSync(filePath, "utf8"));
    const ids = new Set(guidelines.categories.map((c) => c.id));
    const unknown = [...guidelines.mandatory, ...guidelines.routes.flatMap((r) => r.categories)].filter((id) => !ids.has(id));
    if (unknown.length > 0) throw new Error(`[guidelines] routes/mandatory reference unknown categories: ${[...new Set(unknown)].join(", ")}`);
    return guidelines;
}
```

- [ ] **Step 5: Wire into build.** In `packages/registry/src/build.ts` add `import { loadGuidelines } from "./extract/guidelines.js";` and add `guidelines: loadGuidelines(),` after `rules,` in the registry object.

- [ ] **Step 6: Run test, expect PASS**; then `pnpm run registry:build` (regenerates `dist/registry.json`).

---

### Task 3: Merge ux-rules with the new policy (new doc wins)

**Files:**

- Modify: `packages/registry/src/extract/ux-rules.ts`
- Modify: `packages/registry/src/extract/rules.ts:12` (`RULE_SET_VERSION = "4.0.0"`)
- Test: `packages/registry/__tests__/guidelines.test.ts` (append)

- [ ] **Step 1: Append failing test**

```ts
import { buildRuleSet } from "../src/extract/rules.js";

describe("ux rules merged with guidelines", () => {
    const rules = buildRuleSet();
    const all = rules.uxSections.flatMap((s) => s.rules).join("\n");

    it("no longer owns the FORM/STATE prefixes the guidelines use", () => {
        expect(rules.uxSections.map((s) => s.id)).toEqual(expect.arrayContaining(["FIELD", "ISTATE"]));
        expect(all).not.toMatch(/\b(FORM|STATE)-\d/);
    });

    it("has an NVDA blocker and no prescribed breakpoint pixel values", () => {
        expect(all).toContain("CHK-B9");
        expect(all).not.toContain("Mobile: 0-599px");
        expect(rules.version).toBe("4.0.0");
    });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Rename prefixes** (only inside this file; verified no other references exist):

```bash
sed -i '' -e 's/\bFORM-\([0-9]\)/FIELD-\1/g; s/id: "FORM"/id: "FIELD"/; s/\bSTATE-\([0-9]\)/ISTATE-\1/g; s/id: "STATE"/id: "ISTATE"/; s/FORM (forms), STATE (interaction states\/feedback)/FIELD (form fields), ISTATE (interaction states\/feedback)/' packages/registry/src/extract/ux-rules.ts
```

(macOS sed has no `\b`; if it does not match, use `perl -pi -e 's/\bFORM-(\d)/FIELD-$1/g; s/id: "FORM"/id: "FIELD"/; s/\bSTATE-(\d)/ISTATE-$1/g; s/id: "STATE"/id: "ISTATE"/; s/FORM \(forms\), STATE \(interaction states\/feedback\)/FIELD (form fields), ISTATE (interaction states\/feedback)/' packages/registry/src/extract/ux-rules.ts`.) Then `grep -nE '\b(FORM|STATE)-[0-9]' packages/registry/src/extract/ux-rules.ts` must print nothing.

- [ ] **Step 4: Add a precedence line** as the second entry of `buildUxPreamble()`:

```ts
"Relationship to the UI agent guidelines (plan_ui_task / ds://guidelines): the guidelines are the primary policy and win any conflict. They give direction, not fixed values: where a rule below cites a pixel value, breakpoint, column count, or duration, treat it as an example of a good default, never as a pass/fail threshold. Accessibility minimums (WCAG 2.2 AA contrast, 24px target floor, reflow at 320px) remain hard requirements.",
```

- [ ] **Step 5: Soften fixed-value rules.** Replace these rule strings in full:

```ts
"LAY-01: Use the product's existing spacing scale (Tailwind's token scale in this library) and keep equivalent relationships consistent. Arbitrary values are not allowed, but no particular step is mandated. Verify: equivalent relationships use the same step; nothing touches or merges accidentally (guidelines SPACE-01).",
"LAY-02: Spacing roles are separate decisions: label-to-field, field group to field group, card padding, page gutters, section spacing. Verify: each role has deliberate, consistent spacing (guidelines SPACE-05).",
"LAY-03: Sibling gaps should make grouping obvious: tighter inside a group, looser between groups (list rows, card grids, stacked fields, button groups, toolbars). Verify: grouping is readable at a glance; gaps are uniform within a group.",
"LAY-04: Container padding scales with the container's role (chip < card < section/dialog). Verify: padding reads as deliberate and is symmetric unless intentionally asymmetric.",
"LAY-05: Major sections are separated more than items within a section; a heading sits closer to its content than to the previous section. Verify: section boundaries are obvious.",
"LAY-06: Use a column grid where it helps alignment; choose column counts and gutters that suit the content and viewport rather than a fixed universal grid. Verify: content aligns consistently and no column count is forced at narrow widths.",
"LAY-08: Keep body text at a comfortable reading measure on wide viewports (constrain with a max-w token or ch-based width). Verify: long-form text does not span the full width of large screens.",
"RES-01: Use the project's existing breakpoints (Tailwind's sm/md/lg/xl/2xl in this library) and change layout where the content needs it, not at a universal pixel set. Verify: no layout breaks between breakpoints; behavior is checked at narrow phone, tablet, and wide desktop widths.",
"RES-02: Author with the library's breakpoint tokens; never invent arbitrary breakpoint values. Verify: responsive classes use sm/md/lg/xl/2xl prefixes only.",
"ISTATE-08: Micro-interaction transitions should feel immediate and never block the user; the house default for small state changes is \"transition duration-100 ease-linear\". Longer motion needs a purpose (guidelines MOTION-*). Verify: routine transitions do not delay interaction.",
```

And in CHK:

```ts
"CHK-m1 [Minor] (LAY-01..05): Spacing comes from the token scale and reads as deliberate grouping.",
"CHK-m3 [Minor] (ISTATE-06, ISTATE-08): Reduced motion respected; routine transitions feel immediate.",
```

Also replace any remaining `RES-0[4-9]` occurrences of "at md (>=768px)" etc.? No: those describe what `SidebarLayout` actually does (component behavior, not a prescribed value). Leave them.

- [ ] **Step 6: Add NVDA rules.** Append to the ARIA section rules:

```ts
"ARIA-25: Screen readers (NVDA) checklist SR-01..SR-12 from the UI agent guidelines is mandatory for every screen. Verify: NVDA walkthrough per SR-12, otherwise record Not verified.",
```

Append to CHK after CHK-B8:

```ts
"CHK-B9 [Blocker] (ARIA-24, ARIA-25, guidelines SR-01..SR-12): NVDA (Firefox or Chrome) browse- and focus-mode walkthrough: every control announces name/role/state, errors and async feedback are announced, dialogs announce and return focus. Pass: walkthrough recorded with NVDA version and browser; without a real run this is Not verified, never Pass.",
```

- [ ] **Step 7: Bump version** in `rules.ts`: `export const RULE_SET_VERSION = "4.0.0";`

- [ ] **Step 8: Run tests, expect PASS;** `pnpm run registry:build`.

---

### Task 4: ds-mcp — plan_ui_task, instructions, resource, nextSteps

**Files:**

- Create: `packages/ds-mcp/src/plan-ui-task.ts`
- Modify: `packages/ds-mcp/src/tools.ts` (register `plan_ui_task`; `validate_jsx` adds `nextSteps`; `rulesToMarkdown` intro line)
- Modify: `packages/ds-mcp/src/server.ts` (instructions)
- Modify: `packages/ds-mcp/src/resources.ts` (`ds://guidelines`)
- Modify: `packages/ds-mcp/src/prompts.ts` (sequence)
- Test: `packages/ds-mcp/__tests__/plan-ui-task.test.ts`, `packages/ds-mcp/__tests__/server.test.ts` (tool list → 10, instructions)

**Interfaces:**

- Consumes: `registry.guidelines`, `slugifyCategory` from `@your-job-search-genius/ds-registry`, `searchComponents` from `tools.ts`.
- Produces: `routeCategories(guidelines, intent, extra?) → { categories: GuidelineCategory[]; unknown: string[] }`, `planUiTask(registry, intent, extra?) → string`, `POST_BUILD_STEPS: string[]`, `SERVER_INSTRUCTIONS: string`.

- [ ] **Step 1: Failing tests** `packages/ds-mcp/__tests__/plan-ui-task.test.ts`

```ts
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { describe, expect, it } from "vitest";
import { planUiTask, routeCategories } from "../src/plan-ui-task.js";

const registry = loadRegistry();
const ids = (intent: string, extra?: string[]) => routeCategories(registry.guidelines, intent, extra).categories.map((c) => c.id);

describe("routeCategories", () => {
    it("routes a login page to forms, login, buttons plus the mandatory set", () => {
        const got = ids("Build a login page");
        expect(got).toEqual(expect.arrayContaining(["forms", "login", "buttons-and-actions", "color-contrast", "screen-readers-nvda"]));
        expect(got).not.toContain("data-tables");
    });

    it("never returns an empty plan for an intent with no keywords", () => {
        expect(ids("make it nicer")).toEqual(expect.arrayContaining(registry.guidelines.mandatory));
    });

    it("matches whole words only", () => {
        expect(ids("a platform overview")).not.toContain("forms");
        expect(ids("a table of invoices")).not.toContain("tabs-and-related-views");
    });

    it("accepts extra categories by id or name and reports unknown ones", () => {
        const result = routeCategories(registry.guidelines, "page", ["Data tables", "pwa-nonsense"]);
        expect(result.categories.map((c) => c.id)).toContain("data-tables");
        expect(result.unknown).toEqual(["pwa-nonsense"]);
    });
});

describe("planUiTask", () => {
    const md = planUiTask(registry, "a login page");
    it("contains the workflow, selected rules, components, plan, and a completion record", () => {
        expect(md).toContain("## Workflow");
        expect(md).toContain("LOGIN-02");
        expect(md).toContain("SR-01");
        expect(md).toMatch(/\| LOGIN-01 \|/);
        expect(md).toContain("Not verified");
        expect(md).toMatch(/Input|Button/);
    });
});
```

In `server.test.ts`: add `"plan_ui_task"` to the sorted tool list, rename the test to "lists all 10 tools", and add:

```ts
it("advertises the mandatory workflow in server instructions", () => {
    expect(client.getInstructions()).toContain("plan_ui_task");
});

it("validate_jsx returns post-build next steps", async () => {
    const result = await client.callTool({ name: "validate_jsx", arguments: { code: "<div />" } });
    expect(JSON.parse(textOf(result)).nextSteps.join(" ")).toContain("completion record");
});
```

- [ ] **Step 2: Run, expect FAIL.** `pnpm --filter @your-job-search-genius/ds-mcp exec vitest run`

- [ ] **Step 3: Implement** `packages/ds-mcp/src/plan-ui-task.ts`

```ts
/**
 * plan_ui_task: turns a UI request ("a login page") into the plan the
 * guidelines' "Required task workflow" asks for -- selected rule
 * categories (keyword routes + the mandatory set), candidate library
 * components, a plan template, the rules themselves, and a completion
 * record pre-filled with every selected rule ID.
 */
import type { GuidelineCategory, Guidelines, Registry } from "@your-job-search-genius/ds-registry";
import { slugifyCategory } from "@your-job-search-genius/ds-registry";
import { searchComponents } from "./tools.js";

export const POST_BUILD_STEPS = [
    "Re-check every rule ID in the completion record from plan_ui_task against what you built; fix each Fail and re-run validate_jsx.",
    "Run the project's type-check/build (e.g. tsc --noEmit or the app's build script) and fix errors before finishing.",
    "Return the filled completion record (Rule ID | Applicability | Result | Evidence | Remaining action). Anything not actually checked -- e.g. no real NVDA run -- is Not verified, never Pass.",
];

function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function routeCategories(guidelines: Guidelines, intent: string, extra: string[] = []): { categories: GuidelineCategory[]; unknown: string[] } {
    const selected = new Set(guidelines.mandatory);
    for (const route of guidelines.routes) {
        if (route.keywords.some((k) => new RegExp(`\\b${escapeRegExp(k)}\\b`, "i").test(intent))) route.categories.forEach((id) => selected.add(id));
    }
    const unknown: string[] = [];
    for (const e of extra) {
        const match = guidelines.categories.find((c) => c.id === e || c.id === slugifyCategory(e));
        if (match) selected.add(match.id);
        else unknown.push(e);
    }
    return { categories: guidelines.categories.filter((c) => selected.has(c.id)), unknown };
}

function ruleIds(markdown: string): string[] {
    return [...markdown.matchAll(/^(?:\| |- )([A-Z0-9]+-\d+)\b/gm)].map((m) => m[1]!);
}

export function planUiTask(registry: Registry, intent: string, extra: string[] = []): string {
    const { categories, unknown } = routeCategories(registry.guidelines, intent, extra);
    const components = searchComponents(registry, intent).slice(0, 8);
    const ids = categories.flatMap((c) => ruleIds(c.markdown));

    return [
        `# UI task plan: "${intent}"`,
        "",
        "## Workflow (mandatory)",
        "1. Fill in the plan in section 3 before writing any code.",
        "2. Use only library components: confirm each with get_component (props, examples, a11y notes). If something is missing, say so; never invent a component, prop, or icon.",
        "3. Build with the rules in section 4 in view.",
        "4. Re-check every rule ID in section 5 against the result; fix Fail items.",
        "5. Call validate_jsx, then run the project's type-check/build and fix errors.",
        "6. Finish with the completion record from section 5. Unverified items are Not verified, never Pass.",
        "",
        "## 1. Selected rule categories",
        ...categories.map((c) => `- **${c.name}** (\`${c.id}\`) -- ${c.appliesWhen}`),
        ...(unknown.length > 0
            ? ["", `Unknown categories ignored: ${unknown.join(", ")}. Valid ids: ${registry.guidelines.categories.map((c) => c.id).join(", ")}.`]
            : []),
        "",
        "Add a category by calling plan_ui_task again with `categories` if the task introduces behavior not listed (see the routing table in section 0).",
        "",
        "## 2. Candidate library components",
        ...(components.length > 0
            ? components.map((c) => `- ${c.name} (\`${c.id}\`) -- ${c.description}`)
            : ["- No close keyword match. Use list_components / search_components with other terms."]),
        "",
        "## 3. Plan (fill in before writing code)",
        "- Goal and what happens after success:",
        "- Deliverable and supported environments:",
        "- Library components chosen (verified with get_component):",
        "- Structure and content (landmarks, heading outline, reading order):",
        "- States (default, focus, filled, invalid, loading, empty, error, success -- as applicable):",
        "- Responsive behavior:",
        "- Screen reader (NVDA) behavior (names, announcements, live regions, focus moves):",
        "- State ownership, data, and cache policy (if any):",
        "- Motion policy (if any):",
        "",
        "## 4. Rules",
        "",
        ...categories.map((c) => c.markdown),
        "",
        "## 5. Completion record (return this, filled in)",
        "",
        "Results: Pass | Fail | Not applicable (say why) | Not verified (say what is missing).",
        "",
        "| Rule ID | Applicability / context | Result | Evidence or reason | Remaining action |",
        "| --- | --- | --- | --- | --- |",
        ...ids.map((id) => `| ${id} | | | | |`),
        "",
        "## 0. Policy (applies to every task)",
        "",
        registry.guidelines.preamble,
    ].join("\n");
}
```

- [ ] **Step 4: Register the tool** in `tools.ts` `registerTools` (after `get_rules`), and add the import `import { POST_BUILD_STEPS, planUiTask } from "./plan-ui-task.js";`:

```ts
server.registerTool(
    "plan_ui_task",
    {
        title: "Plan a UI task",
        description:
            "Call this BEFORE writing any UI. Given the user's request (e.g. 'a login page'), returns the mandatory workflow, the rule categories that apply (always including Color contrast and Screen readers (NVDA)), candidate library components, a plan template to fill in, the full rules, and a completion-record table to return at the end.",
        inputSchema: {
            intent: z.string().describe("The user's UI request, verbatim or summarized."),
            categories: z.array(z.string()).optional().describe("Extra guideline category ids or names to include."),
        },
    },
    async ({ intent, categories }) => text(planUiTask(registryHolder.get(), intent, categories)),
);
```

Change the `validate_jsx` handler to:

```ts
async ({ code, strict }) => text({ ...validateJsx(code, registryHolder.get(), { strict }), nextSteps: POST_BUILD_STEPS }),
```

In `rulesToMarkdown`, replace the line `"Call this tool first in any UI-building task. Call validate_jsx last, before presenting generated code as final.",` with:

```ts
"Call this tool first in any UI-building task, then plan_ui_task with the user's request (it returns the checklists to follow). Call validate_jsx last, then type-check/build, then return the completion record.",
```

- [ ] **Step 5: Server instructions** in `server.ts`:

```ts
export const SERVER_INSTRUCTIONS = [
    "Writesea Odyssey design system. For ANY request that produces UI (page, screen, form, component, layout), this workflow is mandatory:",
    "1. Call get_rules, then plan_ui_task with the user's request. Fill in its plan before writing code.",
    "2. Discover components with list_components / search_components / get_component; use only library components and icons. Never invent components, props, or icons.",
    "3. Build with the plan's rules in view (Color contrast and Screen readers (NVDA) always apply).",
    "4. Re-check every rule ID in the plan's completion record; fix failures.",
    "5. Call validate_jsx, then run the project's type-check/build and fix errors.",
    "6. Finish with the filled completion record. Anything not actually verified is Not verified, never Pass.",
].join("\n");
```

and construct with `new McpServer({ name: SERVER_NAME, version: SERVER_VERSION }, { instructions: SERVER_INSTRUCTIONS })`. Bump `SERVER_VERSION` to `"0.4.0"`.

- [ ] **Step 6: Resource** in `resources.ts` (after `rules`):

```ts
server.registerResource(
    "guidelines",
    "ds://guidelines",
    { title: "UI agent guidelines", description: "The full UI design and implementation policy, including the NVDA checklist.", mimeType: "text/markdown" },
    async (uri) => {
        const g = registryHolder.get().guidelines;
        return { contents: [{ uri: uri.href, mimeType: "text/markdown", text: [g.preamble, ...g.categories.map((c) => c.markdown)].join("\n\n") }] };
    },
);
```

- [ ] **Step 7: Prompt** — in `prompts.ts` replace the numbered list with:

```ts
"1. Call get_rules first. Do not skip this even if you recall the rules from a previous turn in this session.",
`2. Call plan_ui_task with "${description}" and fill in its plan before writing code.`,
"3. If you are scaffolding or working in a consumer app, make sure @your-job-search-genius/odyssey-ui is installed per get_rules' setup section (.npmrc for GitHub Packages, install the package, wire the styles). Never copy component source into the app and never scan a local directory for components.",
"4. Call list_components / search_components / get_component to confirm what actually exists before assuming a component name.",
'5. Compose the UI from approved components and the allowed HTML primitives only, styled with token-backed Tailwind classes (see get_tokens). Import every component and icon from the @your-job-search-genius/odyssey-ui package specifier reported by get_component\'s importPath -- never from a local "@/" alias.',
"6. If something is genuinely missing from the library, say so explicitly and offer the closest available alternative -- never invent a component, prop, or icon.",
"7. Re-check every rule ID in the plan's completion record, call validate_jsx (fix and repeat until clean), run the project's type-check/build, and finish with the filled completion record. Unverified items are Not verified, never Pass.",
```

- [ ] **Step 8: Run tests, expect PASS.** Also update `packages/ds-mcp/README.md` tool list with one line for `plan_ui_task`.

---

### Task 5: Docs /agent-rules page lists the guideline categories

**Files:**

- Modify: `apps/docs/app/(home)/agent-rules/page.tsx`

- [ ] **Step 1:** After the existing rules content, add a section rendered from `registry.guidelines`:

```tsx
<h2 className="mt-12 text-display-xs font-semibold text-primary">UI task guidelines</h2>
<p className="mt-3 text-md text-tertiary">
    Agents call <code className="text-brand-secondary">plan_ui_task</code> with the request; it selects these categories (Color contrast and Screen readers (NVDA)
    always), returns their checklists, and a completion record to fill in. Full text: <code className="text-brand-secondary">ds://guidelines</code>.
</p>
<ul className="mt-6 flex flex-col gap-3">
    {registry.guidelines.categories.map((c) => (
        <li key={c.id} className="rounded-xl border border-secondary p-4">
            <p className="text-md font-semibold text-primary">
                {c.name} {registry.guidelines.mandatory.includes(c.id) && <Badge size="sm" color="brand">Always</Badge>}
            </p>
            <p className="mt-1 text-sm text-tertiary">{c.appliesWhen}</p>
        </li>
    ))}
</ul>
```

- [ ] **Step 2:** `pnpm --filter @your-job-search-genius/docs run type-check` passes.

---

### Task 6: Preview Fullscreen + Open in new tab

**Files:**

- Create: `apps/docs/app/preview/[...slug]/page.tsx`
- Create: `apps/docs/lib/preview-href.ts`
- Modify: `apps/docs/components/preview-frame.tsx` (toolbar, fullscreen)
- Modify: `apps/docs/components/component-preview.tsx` (pass `standaloneHref`)
- Test: `apps/docs/__tests__/preview-href.test.ts`

**Interfaces:**

- Produces: `previewHref(demo: string, exportName: string): string`, `parsePreviewSlug(slug: string[]): { demo: string; exportName: string } | null`; `PreviewFrame` prop `standaloneHref?: string`.

- [ ] **Step 1: Failing test** `apps/docs/__tests__/preview-href.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { parsePreviewSlug, previewHref } from "../lib/preview-href";

describe("preview href", () => {
    it("round-trips demo ids with slashes", () => {
        const href = previewHref("base/buttons/buttons", "Primary");
        expect(href.endsWith("/preview/base/buttons/buttons/Primary")).toBe(true);
        expect(parsePreviewSlug(["base", "buttons", "buttons", "Primary"])).toEqual({ demo: "base/buttons/buttons", exportName: "Primary" });
    });

    it("rejects slugs too short to name a demo and export", () => {
        expect(parsePreviewSlug(["Primary"])).toBeNull();
    });
});
```

- [ ] **Step 2: Run, expect FAIL.** `pnpm --filter @your-job-search-genius/docs exec vitest run __tests__/preview-href.test.ts`

- [ ] **Step 3:** `apps/docs/lib/preview-href.ts`

```ts
/** URL of the chrome-free standalone preview for one demo export (app/preview/[...slug]). Prefixed with the base path because it is opened via a plain <a target="_blank">. */
export function previewHref(demo: string, exportName: string): string {
    return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/preview/${demo}/${encodeURIComponent(exportName)}`;
}

export function parsePreviewSlug(slug: string[]): { demo: string; exportName: string } | null {
    if (slug.length < 2) return null;
    return { demo: slug.slice(0, -1).join("/"), exportName: decodeURIComponent(slug[slug.length - 1]!) };
}
```

- [ ] **Step 4:** `apps/docs/app/preview/[...slug]/page.tsx`

```tsx
import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewErrorBoundary } from "~/components/preview-error-boundary";
import { PreviewFrame } from "~/components/preview-frame";
import { demoRegistry } from "~/lib/demo-registry";
import { getDemoExportNames } from "~/lib/demo-sources";
import { parsePreviewSlug } from "~/lib/preview-href";

/** Standalone, chrome-free render of one demo export -- the target of PreviewFrame's "Open in new tab". */
export function generateStaticParams() {
    return Object.keys(demoRegistry).flatMap((demo) => getDemoExportNames(demo).map((name) => ({ slug: [...demo.split("/"), name] })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const parsed = parsePreviewSlug((await params).slug);
    return { title: parsed ? `${parsed.exportName} · ${parsed.demo}` : "Preview", robots: { index: false } };
}

export default async function StandalonePreviewPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const parsed = parsePreviewSlug((await params).slug);
    const Demo = parsed ? (demoRegistry[parsed.demo]?.[parsed.exportName] as ComponentType | undefined) : undefined;
    if (!parsed || !Demo) notFound();

    return (
        <main className="flex min-h-screen flex-col">
            <h1 className="sr-only">{`${parsed.exportName} preview`}</h1>
            <PreviewFrame align="center" variant="bare">
                <PreviewErrorBoundary label={`${parsed.demo}#${parsed.exportName}`}>
                    <Demo />
                </PreviewErrorBoundary>
            </PreviewFrame>
        </main>
    );
}
```

- [ ] **Step 5: PreviewFrame toolbar + fullscreen.** In `preview-frame.tsx`: extend `variant` to `"standalone" | "embedded" | "bare"` ("bare" = no border, no toolbar, fills the page: `min-h-screen`); add `standaloneHref?: string`; add:

```tsx
import { useEffect, useRef, useState } from "react";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { LinkExternal01, Maximize01, Minimize01 } from "@/components/foundations/icons";

// inside PreviewFrame:
const frameRef = useRef<HTMLDivElement>(null);
const [isFullscreen, setIsFullscreen] = useState(false);

useEffect(() => {
    // Resync on Esc / browser UI exits, not just our own button.
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
}, []);

const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frameRef.current?.requestFullscreen();
};
```

Render (inside the theme-class wrapper, wrapping the existing scroll box; put `ref={frameRef}` on a new outer `div` with `className="relative [&:fullscreen]:overflow-auto [&:fullscreen]:bg-primary"`):

```tsx
{
    variant !== "bare" && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
            <ButtonUtility
                size="xs"
                color="tertiary"
                icon={isFullscreen ? Minimize01 : Maximize01}
                tooltip={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                aria-pressed={isFullscreen}
                onPress={toggleFullscreen}
            />
            {standaloneHref && (
                <ButtonUtility
                    size="xs"
                    color="tertiary"
                    icon={LinkExternal01}
                    tooltip="Open in new tab"
                    href={standaloneHref}
                    target="_blank"
                    rel="noopener"
                />
            )}
        </div>
    );
}
```

(Verify `ButtonUtility` forwards `aria-pressed`, `target`, `rel` through `...props`; it spreads rest props onto the Aria Button/Link, so it does. If `aria-pressed` is not accepted by its types, drop it and rely on the changing tooltip/label.) In fullscreen the inner `contain` box should not keep `h-[700px]`: add `[:fullscreen_&]:h-full` to that class string.

- [ ] **Step 6:** In `component-preview.tsx` pass `standaloneHref={previewHref(demo, exportName)}` to `PreviewFrame` (import from `~/lib/preview-href`). `ComponentPlayground` passes nothing, so it gets Fullscreen only.

- [ ] **Step 7:** Run the test (PASS), `pnpm --filter @your-job-search-genius/docs run type-check`, then `pnpm run docs:dev` and check manually: Buttons page → Fullscreen toggles, Esc exits and icon resyncs, new tab shows only the component, light/dark follows the site theme.

---

### Task 7: Theme foundation — fonts, Fumadocs palette, shared utilities

**Files:**

- Create: `apps/docs/app/fonts/nunito-sans-latin-variable.woff2`, `apps/docs/app/fonts/jetbrains-mono-latin-variable.woff2`, `apps/docs/app/fonts/nunito-sans-OFL.txt`, `apps/docs/app/fonts/jetbrains-mono-OFL.txt`
- Create: `apps/docs/app/spatial.css`
- Modify: `apps/docs/app/layout.tsx` (load fonts), `apps/docs/app/global.css` (import `spatial.css`)

- [ ] **Step 1: Fetch the fonts once** (latin subset, variable weight) from the Google Fonts CSS API and save the woff2 files plus the OFL texts:

```bash
cd apps/docs/app/fonts
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
url=$(curl -sA "$UA" "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200..1000&display=swap" | awk '/\/\* latin \*\//{f=1} f&&/src:/{match($0,/https:[^)]+/); print substr($0,RSTART,RLENGTH); exit}')
curl -sL "$url" -o nunito-sans-latin-variable.woff2
url=$(curl -sA "$UA" "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap" | awk '/\/\* latin \*\//{f=1} f&&/src:/{match($0,/https:[^)]+/); print substr($0,RSTART,RLENGTH); exit}')
curl -sL "$url" -o jetbrains-mono-latin-variable.woff2
curl -sL https://raw.githubusercontent.com/googlefonts/NunitoSans/main/OFL.txt -o nunito-sans-OFL.txt
curl -sL https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/OFL.txt -o jetbrains-mono-OFL.txt
file *.woff2   # both must report "Web Open Font Format (Version 2)"
```

- [ ] **Step 2: Load them** in `layout.tsx` next to Inter, and add both variables to `<html className>`:

```ts
// Docs-chrome fonts for the "Spatial Layers" theme. Library previews keep Inter via --font-inter.
const nunitoSans = localFont({ src: "./fonts/nunito-sans-latin-variable.woff2", weight: "200 1000", variable: "--font-docs" });
const jetbrainsMono = localFont({ src: "./fonts/jetbrains-mono-latin-variable.woff2", weight: "100 800", variable: "--font-docs-mono" });
```

- [ ] **Step 3: `apps/docs/app/spatial.css`** (imported at the end of `global.css` with `@import "./spatial.css";`). Palette contrast: `#1B1838` on `#F4F4FC` ≈ 15:1, `#4A4766` on `#F4F4FC` ≈ 8:1, `#563BDB` on white ≈ 6.6:1; dark `#E9E8F7` on `#0F0D24` ≈ 15:1, `#A9A6C9` on `#0F0D24` ≈ 8:1, `#B2B5F8` on `#0F0D24` ≈ 9.6:1.

```css
/*
 * "Spatial Layers" docs theme (approved direction C). Docs chrome only:
 * overrides Fumadocs' --color-fd-* variables and adds a few utilities.
 * The library's own tokens (packages/ui/styles/theme.css) are untouched,
 * so live previews still render components exactly as shipped.
 */
:root {
    --color-fd-background: #f4f4fc;
    --color-fd-foreground: #1b1838;
    --color-fd-muted: #ecebf8;
    --color-fd-muted-foreground: #4a4766;
    --color-fd-popover: rgb(255 255 255 / 0.9);
    --color-fd-popover-foreground: #1b1838;
    --color-fd-card: rgb(255 255 255 / 0.66);
    --color-fd-card-foreground: #1b1838;
    --color-fd-border: #e1e0f2;
    --color-fd-primary: #563bdb;
    --color-fd-primary-foreground: #ffffff;
    --color-fd-secondary: #ecebf8;
    --color-fd-secondary-foreground: #1b1838;
    --color-fd-accent: rgb(86 59 219 / 0.08);
    --color-fd-accent-foreground: #441cbf;
    --color-fd-ring: #563bdb;
    --spatial-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --spatial-shadow: inset 0 1px 0 rgb(255 255 255 / 0.9), 0 24px 48px -24px rgb(38 8 117 / 0.22), 0 2px 8px rgb(38 8 117 / 0.06);
    --spatial-glass: rgb(255 255 255 / 0.66);
    --spatial-glass-border: rgb(255 255 255 / 0.95);
    --spatial-orb-1: rgb(140 139 246 / 0.35);
    --spatial-orb-2: rgb(255 196 160 / 0.35);
}

.dark {
    --color-fd-background: #0f0d24;
    --color-fd-foreground: #e9e8f7;
    --color-fd-muted: #1a1736;
    --color-fd-muted-foreground: #a9a6c9;
    --color-fd-popover: rgb(26 23 54 / 0.92);
    --color-fd-popover-foreground: #e9e8f7;
    --color-fd-card: rgb(27 24 56 / 0.6);
    --color-fd-card-foreground: #e9e8f7;
    --color-fd-border: rgb(178 181 248 / 0.14);
    --color-fd-primary: #b2b5f8;
    --color-fd-primary-foreground: #130445;
    --color-fd-secondary: #1a1736;
    --color-fd-secondary-foreground: #e9e8f7;
    --color-fd-accent: rgb(178 181 248 / 0.1);
    --color-fd-accent-foreground: #d3d6fa;
    --color-fd-ring: #8c8bf6;
    --spatial-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06), 0 24px 48px -24px rgb(0 0 0 / 0.6);
    --spatial-glass: rgb(27 24 56 / 0.6);
    --spatial-glass-border: rgb(178 181 248 / 0.14);
    --spatial-orb-1: rgb(110 98 239 / 0.28);
    --spatial-orb-2: rgb(255 160 120 / 0.12);
}

html,
body {
    font-family: var(--font-docs), var(--font-body);
}
code,
pre,
kbd {
    font-family: var(--font-docs-mono), ui-monospace, monospace;
}

/* Quiet tinted ground with two blurred orbs behind every page. */
body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(40rem 40rem at 85% -10%, var(--spatial-orb-1), transparent 60%),
        radial-gradient(32rem 32rem at -10% 30%, var(--spatial-orb-2), transparent 60%);
}

@utility glass {
    background: var(--spatial-glass);
    backdrop-filter: blur(18px) saturate(150%);
    -webkit-backdrop-filter: blur(18px) saturate(150%);
    border: 1px solid var(--spatial-glass-border);
    box-shadow: var(--spatial-shadow);
}

@utility ease-spring {
    transition-timing-function: var(--spatial-spring);
}

/* Fumadocs chrome as glass layers. */
#nd-sidebar,
#nd-nav,
#nd-toc {
    background: var(--spatial-glass);
    backdrop-filter: blur(18px) saturate(150%);
    -webkit-backdrop-filter: blur(18px) saturate(150%);
}

@keyframes spatial-rise {
    from {
        opacity: 0;
        transform: translateY(28px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: none;
    }
}
@keyframes spatial-orbit {
    0%,
    100% {
        transform: rotateX(14deg) rotateY(-20deg) rotateZ(2deg);
    }
    50% {
        transform: rotateX(10deg) rotateY(-12deg) rotateZ(0deg);
    }
}
@keyframes spatial-drift {
    0%,
    100% {
        transform: translate3d(0, 0, var(--z, 0));
    }
    50% {
        transform: translate3d(0, -16px, var(--z, 0));
    }
}
@keyframes spatial-stack-in {
    from {
        opacity: 0;
        transform: translateY(40px) rotateX(-35deg);
    }
    to {
        opacity: 1;
        transform: none;
    }
}

@utility animate-rise {
    animation: spatial-rise 0.9s var(--spatial-spring) both;
}
@utility animate-orbit {
    animation: spatial-orbit 18s ease-in-out infinite;
}
@utility animate-drift {
    animation: spatial-drift 7s ease-in-out infinite;
}
@utility animate-stack-in {
    animation: spatial-stack-in 0.9s var(--spatial-spring) both;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation: none !important;
        transition: none !important;
    }
}
```

- [ ] **Step 4:** `pnpm run docs:dev`; check the sidebar, TOC, search dialog and an article in light and dark: no unreadable text, and the library previews are unchanged (compare a Buttons preview with Storybook).

---

### Task 8: Home page in Spatial Layers

**Files:**

- Modify: `apps/docs/app/(home)/page.tsx` (full rewrite)

- [ ] **Step 1: Rewrite** with real library components floating in the orbit. Keep the existing `categories` array and base-path handling.

```tsx
"use client";

import Link from "next/link";
import { Sparkline } from "@/components/application/charts/sparkline";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { ArrowRight, CheckCircle, Grid01, LayersTwo01, Mail01, Package, PuzzlePiece01 } from "@/components/foundations/icons";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const categories = [
    {
        href: "/docs/base-components",
        title: "Base Components",
        description: "Buttons, inputs, selects, badges, and every other foundational form and display control.",
        icon: PuzzlePiece01,
    },
    {
        href: "/docs/application",
        title: "Application",
        description: "Higher-order patterns: modals, tables, date pickers, charts, navigation, and more.",
        icon: LayersTwo01,
    },
    {
        href: "/docs/foundations",
        title: "Foundations",
        description: "Icons, featured icons, logos, and the visual primitives everything else is built from.",
        icon: Grid01,
    },
    {
        href: "/docs/shared-assets",
        title: "Shared Assets",
        description: "Illustrations, credit cards, background patterns, and other reusable marketing assets.",
        icon: Package,
    },
];

const workflow = ["Plan the task", "Pick library components", "Select checklists", "Build", "Re-check checklists", "Validate & compile"];

const sparkline = [4, 6, 5, 8, 7, 10, 9, 12, 11, 14].map((value, i) => ({ i, value }));

export default function HomePage() {
    return (
        <main className="mx-auto flex w-full max-w-container flex-1 flex-col gap-28 px-4 py-16 md:py-24">
            {/* Hero */}
            <section className="grid items-center gap-12 lg:grid-cols-2">
                <div className="animate-rise">
                    <span className="glass text-fd-primary inline-flex rounded-full px-3 py-1 text-sm font-semibold">React 19 · Tailwind v4 · React Aria</span>
                    <h1 className="text-fd-foreground mt-6 text-display-md font-extrabold tracking-tight md:text-display-xl">Writesea Odyssey</h1>
                    <p className="text-fd-muted-foreground mt-5 max-w-xl text-lg">
                        An accessible component library, and an MCP server that teaches AI agents to build with it: plan, follow the checklists, build,
                        re-check.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button size="lg" href={`${base}/docs/base-components`} iconTrailing={ArrowRight}>
                            Browse components
                        </Button>
                        <Button size="lg" color="secondary" href={`${base}/docs/getting-started/installation`}>
                            Get started
                        </Button>
                    </div>
                </div>

                {/* Real components floating in a slow 3D orbit; flattened to a grid on small screens and under reduced motion (spatial.css). */}
                <div className="relative hidden h-[540px] [perspective:1600px] lg:block" aria-hidden="true" inert>
                    <div className="animate-orbit absolute inset-0 [transform-style:preserve-3d]">
                        <div className="glass animate-drift absolute top-4 left-6 w-72 rounded-3xl p-5 [--z:60px]">
                            <Input label="Email" placeholder="olivia@example.com" icon={Mail01} />
                        </div>
                        <div className="glass animate-drift absolute top-40 right-0 flex items-center gap-3 rounded-3xl p-5 [--z:120px] [animation-delay:-2s]">
                            <Button>Save changes</Button>
                            <Button color="secondary">Cancel</Button>
                        </div>
                        <div className="glass animate-drift absolute bottom-24 left-0 flex flex-col gap-3 rounded-3xl p-5 [--z:20px] [animation-delay:-4s]">
                            <Toggle label="Email notifications" defaultSelected />
                            <div className="flex gap-2">
                                <BadgeWithDot color="success" type="pill-color">
                                    Active
                                </BadgeWithDot>
                                <Badge color="brand">New</Badge>
                            </div>
                        </div>
                        <div className="glass animate-drift absolute right-10 bottom-0 w-64 rounded-3xl p-5 [--z:90px] [animation-delay:-1s]">
                            <p className="text-sm font-semibold text-secondary">Applications</p>
                            <Sparkline label="Applications per week" data={sparkline} xKey="i" yKey="value" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section aria-labelledby="explore">
                <h2 id="explore" className="text-fd-foreground text-display-xs font-bold">
                    Explore the library
                </h2>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    {categories.map((category, i) => (
                        <Link
                            key={category.href}
                            href={category.href}
                            className="glass group animate-rise ease-spring flex flex-col gap-4 rounded-3xl p-6 transition duration-500 hover:-translate-y-1.5"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <FeaturedIcon icon={category.icon} color="brand" theme="light" size="lg" />
                            <div>
                                <h3 className="text-fd-foreground text-lg font-bold">{category.title}</h3>
                                <p className="text-fd-muted-foreground mt-1 text-sm">{category.description}</p>
                            </div>
                            <span className="text-fd-primary mt-auto flex items-center gap-1 text-sm font-bold">
                                Explore <ArrowRight className="ease-spring size-4 transition duration-300 group-hover:translate-x-1" aria-hidden="true" />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* AI-native workflow */}
            <section aria-labelledby="agents" className="grid gap-10 lg:grid-cols-2">
                <div>
                    <h2 id="agents" className="text-fd-foreground text-display-xs font-bold">
                        Built for agents
                    </h2>
                    <p className="text-fd-muted-foreground mt-4 text-lg">
                        Connect the MCP server and every UI request runs the same workflow. <code>plan_ui_task</code> picks the checklists, and{" "}
                        <code>validate_jsx</code>
                        hands back the re-check before anything ships.
                    </p>
                    <Button className="mt-6" color="secondary" href={`${base}/docs/mcp`} iconTrailing={ArrowRight}>
                        Connect the MCP
                    </Button>
                </div>
                <ol className="flex flex-col gap-3 [perspective:1200px]">
                    {workflow.map((step, i) => (
                        <li
                            key={step}
                            className="glass animate-stack-in flex items-center gap-4 rounded-2xl px-5 py-4"
                            style={{ animationDelay: `${i * 120}ms` }}
                        >
                            <span className="bg-fd-primary text-fd-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                                {i + 1}
                            </span>
                            <span className="text-fd-foreground font-semibold">{step}</span>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Accessibility */}
            <section aria-labelledby="a11y" className="glass rounded-3xl p-8 md:p-12">
                <h2 id="a11y" className="text-fd-foreground text-display-xs font-bold">
                    Accessible by default
                </h2>
                <ul className="mt-6 grid gap-4 md:grid-cols-3">
                    {["Keyboard: every control, every overlay", "Screen readers: checked against NVDA", "WCAG 2.2 AA contrast in light and dark"].map(
                        (item) => (
                            <li key={item} className="text-fd-foreground flex items-start gap-3">
                                <CheckCircle className="text-fd-primary mt-0.5 size-5 shrink-0" aria-hidden="true" />
                                {item}
                            </li>
                        ),
                    )}
                </ul>
            </section>
        </main>
    );
}
```

Before writing, confirm the real prop names with the registry (`Sparkline` `data`/`xKey`/`yKey`/`label`, `Toggle` `label`, `Input` `icon`) via `grep -n "interface .*Props" -A15` on each file, and adjust. The `style={{ animationDelay }}` is docs-site code, not consumer output, so it is acceptable here.

- [ ] **Step 2:** `docs:dev` visual check at 375px, 768px, 1440px, light and dark, plus reduced motion on (macOS: Accessibility → Display → Reduce motion): no motion, layout intact.

---

### Task 9: Spatial Layers on docs pages, MCP page, playground

**Files:**

- Modify: `apps/docs/components/preview-frame.tsx` (glass frame)
- Modify: `apps/docs/app/(home)/agent-rules/page.tsx` (glass cards)
- Modify: `apps/docs/app/playground/layout.tsx` (glass panels)

- [ ] **Step 1:** PreviewFrame `standalone` variant: replace `rounded-xl border border-secondary` with `glass rounded-3xl` on the outer box, leaving the inner `bg-primary` content area so previews still sit on the library surface: wrap the content in `rounded-2xl bg-primary p-8` inside a `p-2` glass shell.
- [ ] **Step 2:** agent-rules page: the category `li` from Task 5 uses `glass rounded-2xl p-4` instead of `border border-secondary`; the page heading uses `text-fd-foreground`.
- [ ] **Step 3:** playground layout: each panel container gets `glass rounded-3xl`; read the file first and change only container classes.
- [ ] **Step 4:** `pnpm run docs:build:static` succeeds (proves the preview route's static params and the theme compile).

---

### Task 10: NVDA audit of components

**Files:**

- Create: `docs/superpowers/reports/2026-10-09-nvda-audit.md`
- Modify: component files where findings require fixes

- [ ] **Step 1: Static sweep** of `packages/ui/components/**` (not `*.demo.tsx` / `*.story.tsx`), recording file:line findings per SR rule:

```bash
cd packages/ui/components
# SR-08: icon-only buttons without a name; decorative icons without aria-hidden
grep -rnE '<(ButtonUtility|AriaButton)[^>]*>' --include='*.tsx' . | grep -v 'aria-label\|tooltip' | grep -v '\.demo\.\|\.story\.'
# SR-02: role="application" or redundant roles
grep -rn 'role="application"\|role="button"' --include='*.tsx' . | grep -v '\.demo\.\|\.story\.'
# SR-04: live regions present for async feedback
grep -rln 'aria-live\|role="status"\|role="alert"' --include='*.tsx' .
# SR-05: dialogs labelled
grep -rn 'AriaDialog\|<Dialog' --include='*.tsx' . | grep -v '\.demo\.\|\.story\.'
```

Then review by hand each component folder in `base/` and `application/` against SR-01..SR-11. React Aria provides most of it; look for wrappers that break it (non-semantic click targets, missing labels on icon-only controls, charts without names, missing `aria-hidden` on decorative SVG, toasts without live regions, custom tables).

- [ ] **Step 2: Automated check.** For each finding class, add a vitest + `@testing-library/react` + `axe-core` test in `packages/ui` only if those dev dependencies already exist (`grep -n 'axe-core\|testing-library' packages/ui/package.json`). If they do not exist, ask the user before adding dev dependencies; otherwise rely on the static review and mark axe as Not run.
- [ ] **Step 3: Fix** each confirmed finding in the component (smallest change: add the label, `aria-hidden`, live region, or semantic element). Run `pnpm run test` after each folder.
- [ ] **Step 4: Report** `docs/superpowers/reports/2026-10-09-nvda-audit.md`: per component — Static review: Pass / Fixed (what) ; axe: Pass / Not run ; NVDA run: Not verified (requires Windows + NVDA). Include a short manual NVDA script the user can run on Windows (Tab through Buttons, Input with error, Select, Modal, Table, Toast; expected announcements).

---

### Final verification

- [ ] `pnpm run test` (type-check, lint:check, prettier:check, unit tests) passes.
- [ ] `pnpm run registry:check-drift` passes (dist/registry.json regenerated and in sync).
- [ ] `pnpm run docs:build:static` passes.
- [ ] Report to the user with evidence; no commit unless asked.
