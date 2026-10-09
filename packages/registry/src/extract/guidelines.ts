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
    // Specific phrases only: bare "grid"/"list" would send card grids and to-do lists to Data tables.
    { keywords: ["table", "tables", "data grid", "datagrid", "records", "rows"], categories: ["data-tables", "buttons-and-actions"] },
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
    // Not bare "state": "empty state" / "error state" are UI states, not state management.
    {
        keywords: ["global state", "app state", "application state", "state management", "redux", "redux store", "state store", "stateful"],
        categories: ["state-management-and-code-organization", "rendering-performance"],
    },
    { keywords: ["pwa", "offline", "service worker", "installable"], categories: ["progressive-web-apps-pwa", "navigation-and-menus"] },
    { keywords: ["button", "buttons", "action", "actions", "cta"], categories: ["buttons-and-actions"] },
];

/**
 * Prettier pads markdown table cells to align columns, which roughly doubles
 * their size; plan_ui_task returns these tables verbatim, so collapse the
 * padding (rendering is identical) to keep tool output within client limits.
 */
function compactTables(markdown: string): string {
    return markdown
        .split("\n")
        .map((line) => (line.startsWith("|") ? line.replace(/ {2,}/g, " ").replace(/-{4,}/g, "---") : line))
        .join("\n");
}

export function parseGuidelines(source: string): Guidelines {
    const markdown = compactTables(source);
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
