/**
 * The 9 MCP tools from the design system plan (Section 4.2), split into
 * two layers: plain functions of (registry, input) -> output (this is
 * what actually implements each tool), and registerTools() which wraps
 * them onto an McpServer. The plain functions are exported so
 * apps/docs's playground agent loop (Phase 4) can call the exact same
 * logic directly, in-process, without round-tripping through MCP --
 * see that package's tool-executor.ts. No tool calls another LLM --
 * ranking in search_components/search_icons and the recipes in
 * suggest_composition are keyword/rule based, per the plan's "no LLM
 * inside the server".
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ComponentEntry, ComponentExample, IconEntry, Registry, TokenSet } from "@your-job-search-genius/ds-registry";
import { z } from "zod";
import type { RegistryHolder } from "./registry-holder.js";
import { validateJsx } from "./validator.js";

function text(payload: unknown): { content: [{ type: "text"; text: string }] } {
    return { content: [{ type: "text", text: typeof payload === "string" ? payload : JSON.stringify(payload, null, 2) }] };
}

function tokenize(s: string): string[] {
    return s
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

function score(haystack: string[], needleTokens: string[]): number {
    const set = new Set(haystack);
    return needleTokens.reduce((acc, t) => acc + (set.has(t) ? 1 : 0), 0);
}

function componentSearchTokens(c: ComponentEntry): string[] {
    return tokenize([c.id, c.name, c.category, c.description, ...c.doNot].join(" "));
}

function summarize(c: ComponentEntry) {
    return { name: c.name, id: c.id, category: c.category, description: c.description };
}

export function rulesToMarkdown(registry: Registry): string {
    const { rules } = registry;
    return [
        `# Agent rules (v${rules.version})`,
        "",
        'These rules govern UI generated in apps that consume the published package. They do not apply to development inside the odyssey-ui monorepo itself, where the repo\'s CLAUDE.md governs (library source necessarily uses native elements, the "@/" alias, and internal dependencies).',
        "",
        "Call this tool first in any UI-building task. Call validate_jsx last, before presenting generated code as final.",
        "",
        "## Allowed primitives",
        rules.allowedPrimitives.map((p) => `\`${p}\``).join(", "),
        "",
        "## Forbidden elements",
        rules.forbiddenElements.map((p) => `\`${p}\``).join(", "),
        "",
        "## Project setup (consuming apps)",
        ...rules.setupRules.map((r) => `- ${r}`),
        "",
        "## Style rules",
        ...rules.styleRules.map((r) => `- ${r}`),
        "",
        "## Composition rules",
        ...rules.compositionRules.map((r) => `- ${r}`),
    ].join("\n");
}

export interface ListComponentsInput {
    category?: "base" | "application" | "foundations" | "shared-assets" | "marketing";
    query?: string;
}
export function listComponents(registry: Registry, { category, query }: ListComponentsInput) {
    let results = registry.components;
    if (category) results = results.filter((c) => c.category === category);
    if (query) {
        const needle = tokenize(query);
        results = results.filter((c) => score(componentSearchTokens(c), needle) > 0);
    }
    return results.map(summarize);
}

export function getComponentEntry(registry: Registry, name: string): ComponentEntry | { found: false; message: string } {
    const entry = registry.components.find((c) => c.id === name || c.name === name || c.importName === name);
    return entry ?? { found: false, message: `No component matches "${name}". Use list_components / search_components to find an approved one.` };
}

export interface SearchComponentsResult {
    name: string;
    id: string;
    category: ComponentEntry["category"];
    description: string;
    matchScore: number;
    reason: string;
}
export function searchComponents(registry: Registry, intent: string): SearchComponentsResult[] {
    const needle = tokenize(intent);
    return registry.components
        .map((c) => ({ c, s: score(componentSearchTokens(c), needle) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 10)
        .map(({ c, s }) => ({
            ...summarize(c),
            matchScore: s,
            reason: `Matched on: ${needle.filter((t) => componentSearchTokens(c).includes(t)).join(", ")}`,
        }));
}

export function getTokens(registry: Registry, group?: keyof TokenSet): TokenSet | TokenSet[keyof TokenSet] {
    return group ? registry.tokens[group] : registry.tokens;
}

export interface SearchIconsResult {
    found: boolean;
    icons?: IconEntry[];
    suggestions?: IconEntry[];
}
export function searchIcons(registry: Registry, query: string, limit?: number): SearchIconsResult {
    const needle = query.toLowerCase().trim();
    const compact = needle.replace(/[^a-z0-9]/g, "");
    // Tokenized matching so multi-word intents ("password eye", "lock icon")
    // still land on Eye / Lock01 instead of a dead found:false round-trip.
    const tokens = needle.split(/[^a-z0-9]+/).filter((t) => t.length >= 2);

    const scored = registry.icons
        .map((icon) => {
            const name = icon.name.toLowerCase();
            let score = 0;
            if (compact.length > 0 && name === compact) score += 100;
            else if (compact.length >= 3 && name.includes(compact)) score += 10;
            for (const token of tokens) {
                if (name.startsWith(token)) score += 4;
                else if (name.includes(token)) score += 2;
                else if (icon.tags.some((tag) => tag === token)) score += 2;
                else if (icon.tags.some((tag) => tag.includes(token))) score += 1;
            }
            return { icon, score };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score || a.icon.name.length - b.icon.name.length || a.icon.name.localeCompare(b.icon.name));

    const matches = scored.slice(0, limit ?? 20).map((r) => r.icon);
    if (matches.length === 0) {
        // Last-resort suggestions: a query word that *contains* a tag
        // ("padlock" -> "lock") still hints at the closest real icons.
        const suggestions = registry.icons.filter((i) => i.tags.some((tag) => tag.length >= 3 && tokens.some((t) => t.includes(tag)))).slice(0, 5);
        return { found: false, suggestions };
    }
    return { found: true, icons: matches };
}

export interface SuggestCompositionResult {
    recipe: string;
    components: ReturnType<typeof summarize>[];
}
export function suggestComposition(registry: Registry, intent: string): SuggestCompositionResult {
    const needle = tokenize(intent);
    const relevant = registry.components
        .map((c) => ({ c, s: score(componentSearchTokens(c), needle) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 5)
        .map((r) => r.c);

    if (relevant.length === 0) {
        return {
            recipe: `No components matched "${intent}" closely. Use search_components with a broader term, or say this can't be built from the current library.`,
            components: [],
        };
    }

    const recipe = [
        `For "${intent}", consider combining: ${relevant.map((c) => c.importName).join(", ")}.`,
        ...relevant.filter((c) => c.examples.length > 0).map((c) => `- ${c.importName}: ${c.examples[0]?.title} -- \`${c.examples[0]?.code}\``),
        "",
        "General composition rules:",
        ...registry.rules.compositionRules.map((r) => `- ${r}`),
    ].join("\n");

    return { recipe, components: relevant.map(summarize) };
}

export function getExample(registry: Registry, name: string, title?: string): ComponentExample | { found: false; message: string } {
    const entry = registry.components.find((c) => c.id === name || c.name === name || c.importName === name);
    if (!entry) return { found: false, message: `No component matches "${name}".` };
    if (entry.examples.length === 0) return { found: false, message: `${entry.importName} has no curated examples yet.` };
    const example = title ? entry.examples.find((e) => e.title === title) : entry.examples[0];
    if (!example)
        return { found: false, message: `No example titled "${title}" for ${entry.importName}. Available: ${entry.examples.map((e) => e.title).join(", ")}` };
    return example;
}

export function registerTools(server: McpServer, registryHolder: RegistryHolder) {
    server.registerTool(
        "get_rules",
        {
            title: "Get agent rules",
            description:
                "Returns the hard constraints for building UI from this library (allowed primitives, forbidden elements, style and composition rules). Call this first in any UI-building task.",
            inputSchema: {},
        },
        async () => text(rulesToMarkdown(registryHolder.get())),
    );

    server.registerTool(
        "list_components",
        {
            title: "List components",
            description:
                "Cheap listing of every approved component, optionally filtered by category or a keyword query. Use to discover what exists before building.",
            inputSchema: {
                category: z.enum(["base", "application", "foundations", "shared-assets", "marketing"]).optional(),
                query: z.string().optional(),
            },
        },
        async (input) => text(listComponents(registryHolder.get(), input)),
    );

    server.registerTool(
        "get_component",
        {
            title: "Get component",
            description:
                "Returns the full entry (props, slots, variants, compound structure, examples, doNot, a11y notes) for one component, looked up by id, name, or importName.",
            inputSchema: { name: z.string() },
        },
        async ({ name }) => text(getComponentEntry(registryHolder.get(), name)),
    );

    server.registerTool(
        "search_components",
        {
            title: "Search components",
            description:
                "Natural-language intent -> ranked component matches with a reason. Keyword/tag matching only, not an LLM -- for fuzzy discovery ('something for picking a date') rather than an exact id lookup.",
            inputSchema: { intent: z.string() },
        },
        async ({ intent }) => text(searchComponents(registryHolder.get(), intent)),
    );

    server.registerTool(
        "get_tokens",
        {
            title: "Get design tokens",
            description:
                "Returns the design token set (colors, breakpoints, shadows, animations, radius, and the Tailwind class patterns the validator accepts), optionally scoped to one group.",
            inputSchema: { group: z.enum(["colors", "breakpoints", "shadows", "animations", "radius", "allowedTailwindPatterns"]).optional() },
        },
        async ({ group }) => text(getTokens(registryHolder.get(), group)),
    );

    server.registerTool(
        "search_icons",
        {
            title: "Search icons",
            description: "Finds icons by name or tag. Never invents an icon -- returns { found: false, suggestions: [] } when nothing matches closely.",
            inputSchema: { query: z.string(), limit: z.number().int().positive().max(50).optional() },
        },
        async ({ query, limit }) => text(searchIcons(registryHolder.get(), query, limit)),
    );

    server.registerTool(
        "validate_jsx",
        {
            title: "Validate generated JSX",
            description:
                "Validates a piece of TSX against every hard constraint (approved components/primitives only, token-backed classes only, no inline styles, correct compound nesting, ...). Call before presenting generated code as final.",
            inputSchema: { code: z.string(), strict: z.boolean().optional() },
        },
        async ({ code, strict }) => text(validateJsx(code, registryHolder.get(), { strict })),
    );

    server.registerTool(
        "suggest_composition",
        {
            title: "Suggest a composition",
            description:
                "Given a natural-language intent (e.g. 'a login form'), returns a short recipe of which components to combine and how, sourced from compositionRules and each component's own examples -- not generated by an LLM.",
            inputSchema: { intent: z.string() },
        },
        async ({ intent }) => text(suggestComposition(registryHolder.get(), intent)),
    );

    server.registerTool(
        "get_example",
        {
            title: "Get a component example",
            description: "Returns curated example code for one component, optionally filtered to a specific example title.",
            inputSchema: { name: z.string(), title: z.string().optional() },
        },
        async ({ name, title }) => text(getExample(registryHolder.get(), name, title)),
    );
}
