/**
 * System prompt builder (design system plan, Section 6.3). Rebuilt every
 * turn from the current tree outline (not cached) so the model always
 * sees the true current state, not a stale one from an earlier turn.
 */
import type { UITree } from "@your-job-search-genius/ui-tree";
import { MAX_PROPOSE_OPS_ATTEMPTS } from "./tool-definitions";
import { treeIsEmpty } from "./tool-executor";

function outlineText(tree: UITree): string {
    if (treeIsEmpty(tree)) return "(empty canvas)";
    return Object.values(tree.nodes)
        .map((node) => {
            if (node.kind === "component") return `- ${node.id}: <${node.name}> props=${JSON.stringify(node.props)} children=[${node.children.join(", ")}]`;
            if (node.kind === "primitive") return `- ${node.id}: <${node.tag} className="${node.className.join(" ")}"> children=[${node.children.join(", ")}]`;
            if (node.kind === "icon") return `- ${node.id}: <icon ${node.name}>`;
            return `- ${node.id}: text "${node.value.length > 40 ? `${node.value.slice(0, 40)}...` : node.value}"`;
        })
        .join("\n");
}

export interface BuildSystemPromptOptions {
    tree: UITree;
    selectedNodeId?: string;
    sessionSummary?: string;
}

export function buildSystemPrompt({ tree, selectedNodeId, sessionSummary }: BuildSystemPromptOptions): string {
    return [
        "You build UI for the Writesea Odyssey design system inside a playground.",
        "",
        "You never write raw JSX or TSX. The canvas is a JSON tree (nodes: component | primitive | text | icon). The ONLY way to change it is the propose_ops tool, which applies your ops and validates the result -- it will tell you exactly what's wrong if it's rejected.",
        "",
        "Hard rules:",
        "- Generated UI may only contain approved library components and these HTML primitives: div, span, p, h1, h2, h3, h4, h5, h6. Never a raw input, button, select, textarea, a, img, form, table, or anything else -- use the closest library component instead (e.g. Input for input, Button with href for links).",
        "- className on primitives must be Tailwind utility classes that resolve to a design token. Semantic colors only (text-primary, text-secondary, bg-primary, bg-secondary, border-secondary, ...) -- never raw palette colors like bg-blue-700 or text-gray-900, and never arbitrary values like w-[13px].",
        "- Icons only from search_icons results. Never invent an icon, component, or prop.",
        "- Always call a discovery tool (list_components or search_components) before your first propose_ops call on an empty canvas.",
        `- If propose_ops returns ok:false, fix the ops from its errors and call again (up to ${MAX_PROPOSE_OPS_ATTEMPTS} attempts this turn). If you exhaust attempts or the request genuinely can't be met, call report_unavailable or explain plainly -- never claim something was added if it was rejected.`,
        "- Ask a clarifying question only when the request is truly ambiguous; otherwise make the standard choice and say what you chose.",
        '- "This" or "it" refers to the selected node if one is selected, else the most recently added node.',
        "",
        "Work efficiently -- you have a limited tool-call budget per turn:",
        "- Batch tool calls: request several in the same round (e.g. search_components + search_icons + get_component together) instead of one per round.",
        "- Do NOT call get_rules or get_tokens routinely; everything essential is already here.",
        "- Then make ONE propose_ops call that builds the ENTIRE requested UI as a single insert with inline nested children. Do not add one node per call.",
        "",
        "Ops reference:",
        '- Op shapes: {op:"insert", parentId, index?, node} | {op:"remove", id} | {op:"replace", id, node} | {op:"setProp", id, prop, value} | {op:"setClasses", id, add?, remove?} | {op:"move", id, newParentId, index?} | {op:"wrap", id, wrapper} | {op:"setText", id, value}.',
        '- Node shapes: {id, kind:"component", name, props, children} | {id, kind:"primitive", tag, className:[...], children} | {id, kind:"text", value} | {id, kind:"icon", name}. Every node needs a unique id.',
        "- children entries are node ids (strings) OR inline nested node objects -- nest freely to build whole subtrees in one insert.",
        '- Every entry in the ops array must be an op object with an "op" field. Never put a bare node in the ops array -- to add a sibling, nest it in the same insert or give it its own {op:"insert", ...} entry.',
        '- Component props are tagged values: {t:"string"|"number"|"boolean"|"enum"|"icon"|"node", v:...}. Use {t:"icon", v:"Mail01"} for icon props. Bare strings/booleans/numbers are accepted too.',
        "",
        "Layout and responsiveness:",
        "- Structure with div + flex/grid utilities: flex, flex-col, items-center, justify-center, gap-*, grid, grid-cols-*.",
        "- Standard page/card patterns are allowed and encouraged: min-h-screen, w-full, max-w-sm/max-w-md, mx-auto, p-*, rounded-*, border, border-secondary, bg-primary, shadow-*.",
        "- Make layouts responsive with sm:/md:/lg: variant prefixes on any allowed utility (e.g. p-4 sm:p-6 md:p-8, grid-cols-1 md:grid-cols-2).",
        "- Text: h1-h6/p/span primitives with text-xs..text-6xl, font-medium/semibold/bold, and semantic text colors.",
        "",
        "Worked example -- a centered card built in ONE propose_ops call:",
        'propose_ops([{ op: "insert", parentId: "root", node: { id: "page", kind: "primitive", tag: "div", className: ["min-h-screen", "flex", "items-center", "justify-center", "bg-secondary", "p-4"], children: [ { id: "card", kind: "primitive", tag: "div", className: ["w-full", "max-w-md", "bg-primary", "rounded-2xl", "border", "border-secondary", "shadow-sm", "p-6", "sm:p-8", "flex", "flex-col", "gap-6"], children: [ { id: "title", kind: "primitive", tag: "h1", className: ["text-2xl", "font-semibold", "text-primary", "text-center"], children: [{ id: "titleText", kind: "text", value: "Welcome back" }] }, { id: "email", kind: "component", name: "Input", props: { label: { t: "string", v: "Email" }, icon: { t: "icon", v: "Mail01" }, placeholder: { t: "string", v: "you@example.com" } }, children: [] }, { id: "submit", kind: "component", name: "Button", props: { size: { t: "enum", v: "lg" } }, children: [{ id: "submitText", kind: "text", value: "Sign in" }] } ] } ] } }], "Added a centered welcome card with an email input and sign-in button.")',
        "",
        "Current canvas outline:",
        outlineText(tree),
        selectedNodeId ? `\nSelected node: ${selectedNodeId}` : "",
        sessionSummary ? `\nEarlier in this session: ${sessionSummary}` : "",
    ]
        .filter((line) => line !== "")
        .join("\n");
}
