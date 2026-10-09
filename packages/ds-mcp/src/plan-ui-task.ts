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

/** Policy sections every plan carries; the rest of the preamble (routing table, category index, workflow) is already expressed by the plan itself and stays in ds://guidelines. */
const PLAN_POLICY_SECTIONS = ["Policy interpretation", "Explicit defaults"];

function planPolicy(preamble: string): string {
    return preamble
        .split(/\n(?=## )/)
        .filter((block) => PLAN_POLICY_SECTIONS.some((title) => block.startsWith(`## ${title}`)))
        .join("\n");
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
        "3. Build with the rules in section 5 in view.",
        "4. Re-check every rule ID in section 4 against the result; fix Fail items.",
        "5. Call validate_jsx, then run the project's type-check/build and fix errors.",
        "6. Finish with the completion record from section 4. Unverified items are Not verified, never Pass.",
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
        "## 4. Completion record (return this, filled in)",
        "",
        "Results: Pass | Fail | Not applicable (say why) | Not verified (say what is missing).",
        "",
        "| Rule ID | Applicability / context | Result | Evidence or reason | Remaining action |",
        "| --- | --- | --- | --- | --- |",
        ...ids.map((id) => `| ${id} | | | | |`),
        "",
        "## 5. Rules",
        "",
        ...categories.map((c) => c.markdown),
        "",
        "## 0. Policy (applies to every task)",
        "",
        "Full policy, including the task-to-rule routing table and verification guidance: resource ds://guidelines.",
        "",
        planPolicy(registry.guidelines.preamble),
    ].join("\n");
}
