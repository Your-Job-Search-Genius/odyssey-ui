/**
 * Tool definitions handed to Groq's chat completions API (design system
 * plan, Section 6.2). Mirrors ds-mcp's 8 read-only tools (get_rules
 * through get_example -- validate_jsx is deliberately not included here,
 * see README's "Why not validate_jsx") plus the two playground-specific
 * tools: propose_ops (the only way the model changes the canvas) and
 * report_unavailable (forces an explicit, honest "can't be built" answer
 * instead of a silent failure or a hallucinated component).
 *
 * Hand-written JSON Schema, not generated from the ds-mcp Zod schemas --
 * there are only 10 tools and they change rarely; a zod-to-json-schema
 * dependency for this would be more machinery than the problem needs.
 */
import type Groq from "groq-sdk";

/** Caps propose_ops calls per turn (successful or not). Lives here (not tool-executor) so the tool descriptions below can reference it without a circular import; tool-executor re-exports it. */
export const MAX_PROPOSE_OPS_ATTEMPTS = 5;

export const PLAYGROUND_TOOLS: Groq.Chat.Completions.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "get_rules",
            description:
                "Returns the full hard-constraint text for building UI from this library. The essential rules are already in your instructions -- only call this if you need the complete detail; do not call it routinely.",
            parameters: { type: "object", properties: {} },
        },
    },
    {
        type: "function",
        function: {
            name: "list_components",
            description: "Cheap listing of every approved component, optionally filtered by category or a keyword query.",
            parameters: {
                type: "object",
                properties: {
                    category: { type: "string", enum: ["base", "application", "foundations", "shared-assets", "marketing"] },
                    query: { type: "string" },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_component",
            description: "Returns the full entry (props, slots, variants, compound structure, examples, doNot, a11y) for one component.",
            parameters: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
        },
    },
    {
        type: "function",
        function: {
            name: "search_components",
            description: "Natural-language intent -> ranked component matches with a reason.",
            parameters: { type: "object", properties: { intent: { type: "string" } }, required: ["intent"] },
        },
    },
    {
        type: "function",
        function: {
            name: "get_tokens",
            description: "Returns the design token set, optionally scoped to one group.",
            parameters: {
                type: "object",
                properties: { group: { type: "string", enum: ["colors", "breakpoints", "shadows", "animations", "radius", "allowedTailwindPatterns"] } },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "search_icons",
            description: "Finds icons by name or tag. Never invents an icon -- returns found:false with suggestions when nothing matches.",
            parameters: { type: "object", properties: { query: { type: "string" }, limit: { type: "number" } }, required: ["query"] },
        },
    },
    {
        type: "function",
        function: {
            name: "suggest_composition",
            description: "Given a natural-language intent, returns a short recipe of which components to combine.",
            parameters: { type: "object", properties: { intent: { type: "string" } }, required: ["intent"] },
        },
    },
    {
        type: "function",
        function: {
            name: "get_example",
            description: "Returns curated example code for one component.",
            parameters: { type: "object", properties: { name: { type: "string" }, title: { type: "string" } }, required: ["name"] },
        },
    },
    {
        type: "function",
        function: {
            name: "propose_ops",
            description:
                "The ONLY way to change the canvas. Applies the given tree ops and validates the result against the registry. Returns { ok: true, outline } on success or { ok: false, errors } on failure -- on failure, correct the ops and call again (up to " +
                MAX_PROPOSE_OPS_ATTEMPTS +
                " attempts per turn). You must call a discovery tool (list_components or search_components) at least once this turn before your first propose_ops call on an empty canvas. Prefer ONE call that builds the whole requested UI as a single insert with inline nested children over many small calls.",
            parameters: {
                type: "object",
                properties: {
                    ops: {
                        type: "array",
                        description:
                            'One op per entry. Op shapes: {op:"insert", parentId, index?, node} | {op:"remove", id} | {op:"replace", id, node} | {op:"setProp", id, prop, value} | {op:"setClasses", id, add?, remove?} | {op:"move", id, newParentId, index?} | {op:"wrap", id, wrapper} | {op:"setText", id, value}. A node is one of: {id, kind:"component", name, props, children} | {id, kind:"primitive", tag:"div|span|p|h1..h6", className:[...], children} | {id, kind:"text", value} | {id, kind:"icon", name}. Every entry in "children" is EITHER an existing node id (string) OR an inline nested node object -- inline nesting lets one insert build an entire subtree. Prop values are tagged: {t:"string"|"number"|"boolean"|"enum"|"icon"|"node", v:...}; bare strings/numbers/booleans are also accepted. Every node needs a unique id.',
                        items: { type: "object" },
                    },
                    summary: { type: "string", description: "One short sentence describing what this change does, for the version history." },
                },
                required: ["ops", "summary"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "report_unavailable",
            description:
                "Call this instead of guessing when the request genuinely cannot be met with the current library (no matching component, no matching icon). Forces an explicit, honest answer.",
            parameters: {
                type: "object",
                properties: {
                    what: { type: "string", description: "What was asked for that isn't available." },
                    alternatives: { type: "array", items: { type: "string" }, description: "The closest available alternatives, if any." },
                },
                required: ["what", "alternatives"],
            },
        },
    },
];

export const DISCOVERY_TOOL_NAMES = new Set(["list_components", "search_components"]);
export const READ_ONLY_TOOL_NAMES = new Set([
    "get_rules",
    "list_components",
    "get_component",
    "search_components",
    "get_tokens",
    "search_icons",
    "suggest_composition",
    "get_example",
]);
