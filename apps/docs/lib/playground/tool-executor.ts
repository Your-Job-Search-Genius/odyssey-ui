/**
 * Executes one tool call within a single agent turn (design system
 * plan, Section 6.2). The 8 read-only tools call ds-mcp's exact same
 * pure functions (no duplicated logic, no MCP round-trip needed since
 * this runs in the same process). propose_ops and report_unavailable
 * are playground-specific and implemented here.
 *
 * This is the actual enforcement point: propose_ops is the ONLY
 * function in this module that can change `ctx.tree`, and it always
 * goes through applyOps (structural check) then validateTree (registry
 * rules) before accepting a change -- exactly mirroring how ui-tree's
 * own README describes the chain.
 */
import {
    getComponentEntry,
    getExample,
    getTokens,
    listComponents,
    rulesToMarkdown,
    searchComponents,
    searchIcons,
    suggestComposition,
} from "@your-job-search-genius/ds-mcp";
import type { Registry } from "@your-job-search-genius/ds-registry";
import { TreeOpSchema, applyOps, validateTree } from "@your-job-search-genius/ui-tree";
import type { TreeOp, UITree } from "@your-job-search-genius/ui-tree";
import { DISCOVERY_TOOL_NAMES, MAX_PROPOSE_OPS_ATTEMPTS } from "./tool-definitions";

export { MAX_PROPOSE_OPS_ATTEMPTS };

export interface ToolExecutionState {
    registry: Registry;
    /** The draft tree for this turn -- starts as a copy of the last committed tree, replaced in place by a successful propose_ops call. */
    tree: UITree;
    /** True once list_components or search_components has been called this turn. */
    discoveryCalled: boolean;
    /** Count of propose_ops calls this turn, successful or not -- capped at MAX_PROPOSE_OPS_ATTEMPTS. */
    proposeOpsAttempts: number;
    /** Set when propose_ops last succeeded, so the agent loop knows a new tree version needs to be persisted. */
    lastAcceptedOps?: { ops: TreeOp[]; summary: string };
    /** Set when report_unavailable is called, so the agent loop can end the turn cleanly. */
    reportedUnavailable?: { what: string; alternatives: string[] };
}

/** A tree "counts as empty" when its root is a childless container and there's nothing else in it -- not literally zero nodes, since a valid UITree always has at least a root node. Exported so system-prompt.ts's outline uses the exact same definition, not a second one that could drift. */
export function treeIsEmpty(tree: UITree): boolean {
    const root = tree.nodes[tree.rootId];
    return !root || (root.kind !== "text" && root.kind !== "icon" && root.children.length === 0 && Object.keys(tree.nodes).length <= 1);
}

function outline(tree: UITree): Array<{ id: string; kind: string; name?: string; tag?: string }> {
    return Object.values(tree.nodes).map((node) => ({
        id: node.id,
        kind: node.kind,
        name: node.kind === "component" ? node.name : undefined,
        tag: node.kind === "primitive" ? node.tag : node.kind === "icon" ? node.name : undefined,
    }));
}

function parseArgs(argumentsJson: string): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
    try {
        const parsed = JSON.parse(argumentsJson);
        if (typeof parsed !== "object" || parsed === null) return { ok: false, error: "Tool arguments must be a JSON object." };
        return { ok: true, value: parsed as Record<string, unknown> };
    } catch (error) {
        return { ok: false, error: `Tool arguments are not valid JSON: ${String(error)}` };
    }
}

function executeProposeOps(state: ToolExecutionState, args: Record<string, unknown>): string {
    if (treeIsEmpty(state.tree) && !state.discoveryCalled) {
        return JSON.stringify({ ok: false, errors: ["Call list_components or search_components at least once before proposing ops on an empty canvas."] });
    }

    state.proposeOpsAttempts += 1;
    if (state.proposeOpsAttempts > MAX_PROPOSE_OPS_ATTEMPTS) {
        return JSON.stringify({
            ok: false,
            errors: [
                `Maximum ${MAX_PROPOSE_OPS_ATTEMPTS} propose_ops attempts reached this turn. Explain to the user what could not be completed instead of calling this again.`,
            ],
        });
    }

    // Catch the most common model mistake with a targeted, fixable message
    // before zod's generic discriminator error: a bare node passed as an
    // ops entry instead of being wrapped in an insert op.
    if (Array.isArray(args.ops)) {
        const hints = args.ops.flatMap((entry, i) => {
            if (entry === null || entry === undefined) return [`ops[${i}] is ${String(entry)} -- remove it.`];
            if (typeof entry === "object" && !("op" in entry) && "kind" in entry) {
                return [
                    `ops[${i}] is a bare node, not an op -- wrap it as { op: "insert", parentId: "<parent id>", node: { ... } }, or nest it inside another inserted node's children.`,
                ];
            }
            return [];
        });
        if (hints.length > 0) return JSON.stringify({ ok: false, errors: hints });
    }

    const opsResult = TreeOpSchema.array().safeParse(args.ops);
    if (!opsResult.success) {
        return JSON.stringify({ ok: false, errors: [`Malformed ops: ${opsResult.error.message}`] });
    }
    const summary = typeof args.summary === "string" ? args.summary : "";
    if (!summary) {
        return JSON.stringify({ ok: false, errors: ["summary is required."] });
    }

    const { tree: candidate, errors: structuralErrors } = applyOps(state.tree, opsResult.data);
    if (structuralErrors.length > 0) {
        return JSON.stringify({ ok: false, errors: structuralErrors });
    }

    const { ok, errors } = validateTree(candidate, state.registry);
    if (!ok) {
        return JSON.stringify({ ok: false, errors: errors.map((e) => `[${e.nodeId}] ${e.message}`) });
    }

    state.tree = candidate;
    state.lastAcceptedOps = { ops: opsResult.data, summary };
    return JSON.stringify({ ok: true, outline: outline(candidate) });
}

function executeReportUnavailable(state: ToolExecutionState, args: Record<string, unknown>): string {
    const what = typeof args.what === "string" ? args.what : "the request";
    const alternatives = Array.isArray(args.alternatives) ? args.alternatives.filter((a): a is string => typeof a === "string") : [];
    state.reportedUnavailable = { what, alternatives };
    return JSON.stringify({ acknowledged: true });
}

/** Executes one tool call and returns the string to send back as the "tool" role message content. Mutates `state` in place (tree, discoveryCalled, attempt counters) -- callers should not reuse a ToolExecutionState across turns. */
export function executeTool(name: string, argumentsJson: string, state: ToolExecutionState): string {
    if (DISCOVERY_TOOL_NAMES.has(name)) state.discoveryCalled = true;

    const parsed = parseArgs(argumentsJson);
    if (!parsed.ok) return JSON.stringify({ error: parsed.error });
    const args = parsed.value;

    switch (name) {
        case "get_rules":
            return rulesToMarkdown(state.registry);
        case "list_components":
            return JSON.stringify(listComponents(state.registry, { category: args.category as never, query: args.query as string | undefined }));
        case "get_component":
            return JSON.stringify(getComponentEntry(state.registry, args.name as string));
        case "search_components":
            return JSON.stringify(searchComponents(state.registry, args.intent as string));
        case "get_tokens":
            return JSON.stringify(getTokens(state.registry, args.group as never));
        case "search_icons":
            return JSON.stringify(searchIcons(state.registry, args.query as string, args.limit as number | undefined));
        case "suggest_composition":
            return JSON.stringify(suggestComposition(state.registry, args.intent as string));
        case "get_example":
            return JSON.stringify(getExample(state.registry, args.name as string, args.title as string | undefined));
        case "propose_ops":
            return executeProposeOps(state, args);
        case "report_unavailable":
            return executeReportUnavailable(state, args);
        default:
            return JSON.stringify({ error: `Unknown tool "${name}".` });
    }
}
