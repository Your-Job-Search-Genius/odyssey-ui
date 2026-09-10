/**
 * Checks one Assertion against a completed agent turn. Every check is a
 * hard pass/fail against actual output (the final tree, the tool-call
 * trace) -- never an LLM-judged "looks about right".
 */
import type { Registry } from "@your-job-search-genius/ds-registry";
import type { UITree } from "@your-job-search-genius/ui-tree";
import type { RunAgentTurnResult } from "~/lib/playground/agent.js";
import type { Assertion } from "./types.js";

export interface CheckContext {
    result: RunAgentTurnResult;
    finalTree: UITree;
    registry: Registry;
}

export interface AssertionCheckResult {
    assertion: Assertion;
    pass: boolean;
    detail: string;
}

function matchesComponentName(registry: Registry, treeName: string, wanted: string): boolean {
    if (treeName === wanted) return true;
    const entry = registry.components.find((c) => c.name === treeName || c.importName === treeName);
    return entry ? entry.id === wanted || entry.name === wanted || entry.importName === wanted : false;
}

function proposeOpsResults(result: RunAgentTurnResult): Array<{ ok: boolean; errors?: string[] }> {
    return result.toolResults
        .filter((r) => r.name === "propose_ops")
        .map((r) => {
            try {
                return JSON.parse(r.content) as { ok: boolean; errors?: string[] };
            } catch {
                return { ok: false, errors: ["propose_ops result was not valid JSON"] };
            }
        });
}

function checkOne(assertion: Assertion, ctx: CheckContext): boolean {
    const { finalTree, registry, result } = ctx;
    const componentNodes = Object.values(finalTree.nodes).filter((n) => n.kind === "component");

    switch (assertion.type) {
        case "treeContainsComponent": {
            const count = componentNodes.filter((n) => matchesComponentName(registry, n.name, assertion.name)).length;
            return count >= (assertion.minCount ?? 1);
        }
        case "treeExcludesComponent":
            return !componentNodes.some((n) => matchesComponentName(registry, n.name, assertion.name));
        case "onlyPrimitivesUsed": {
            const primitiveTags = Object.values(finalTree.nodes)
                .filter((n) => n.kind === "primitive")
                .map((n) => n.tag);
            return primitiveTags.every((tag) => assertion.allowed.includes(tag));
        }
        case "componentHasProp":
            return componentNodes.some((n) => matchesComponentName(registry, n.name, assertion.component) && assertion.prop in n.props);
        case "firstAttemptAccepted": {
            const first = proposeOpsResults(result)[0];
            return first !== undefined && first.ok === true;
        }
        case "reportedUnavailable":
            return result.reportedUnavailable !== undefined;
        case "noHallucinatedComponentsOrIcons": {
            const needles = ["Unknown component", "Unknown icon", "not in the icon set", "not in the registry"];
            return !result.toolResults.some((r) => needles.some((n) => r.content.includes(n)));
        }
        case "discoveredBeforeProposing": {
            const firstProposeIndex = result.toolCalls.findIndex((c) => c.name === "propose_ops");
            if (firstProposeIndex === -1) return true; // nothing proposed, nothing to violate
            return result.toolCalls.slice(0, firstProposeIndex).some((c) => c.name === "list_components" || c.name === "search_components");
        }
    }
}

function describe(assertion: Assertion): string {
    switch (assertion.type) {
        case "treeContainsComponent":
            return `tree contains >= ${assertion.minCount ?? 1} ${assertion.name}`;
        case "treeExcludesComponent":
            return `tree excludes ${assertion.name}`;
        case "onlyPrimitivesUsed":
            return `only primitives used: ${assertion.allowed.join(", ")}`;
        case "componentHasProp":
            return `${assertion.component} has prop "${assertion.prop}" set`;
        case "firstAttemptAccepted":
            return "first propose_ops call was accepted";
        case "reportedUnavailable":
            return "report_unavailable was called";
        case "noHallucinatedComponentsOrIcons":
            return "no unknown-component/icon errors anywhere in the trace";
        case "discoveredBeforeProposing":
            return "a discovery tool was called before the first propose_ops";
    }
}

export function checkAssertion(assertion: Assertion, ctx: CheckContext): AssertionCheckResult {
    const pass = checkOne(assertion, ctx);
    return { assertion, pass, detail: describe(assertion) };
}
