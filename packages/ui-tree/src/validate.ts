/**
 * validateTree(tree, registry): the tree-level equivalent of ds-mcp's
 * validate_jsx. Runs after every applyOps() call (see ops.ts) -- a batch
 * of ops that produces an invalid tree is rejected wholesale, so the
 * live tree in a playground session is always valid by construction.
 */
import type { ComponentEntry, Registry } from "@your-job-search-genius/ds-registry";
import type { PropValue, UINode, UITree } from "./schema.js";

export interface TreeValidationError {
    nodeId: string;
    message: string;
}

export interface ValidateTreeResult {
    ok: boolean;
    errors: TreeValidationError[];
}

function findComponent(registry: Registry, name: string): ComponentEntry | undefined {
    return registry.components.find((c) => c.importName === name || c.name === name);
}

function checkStructure(tree: UITree): TreeValidationError[] {
    const errors: TreeValidationError[] = [];

    if (!tree.nodes[tree.rootId]) {
        errors.push({ nodeId: tree.rootId, message: `rootId "${tree.rootId}" does not exist in nodes.` });
        return errors; // nothing else can be checked meaningfully without a real root
    }

    const parentOf = new Map<string, string>();
    const visited = new Set<string>();
    const onStack = new Set<string>();

    function walk(id: string, path: string[]) {
        if (onStack.has(id)) {
            errors.push({ nodeId: id, message: `Cycle detected: ${[...path, id].join(" -> ")}.` });
            return;
        }
        if (visited.has(id)) return; // already fully walked via another reference (would already be flagged as multi-parent below)
        visited.add(id);
        onStack.add(id);

        const node = tree.nodes[id];
        if (!node) {
            errors.push({ nodeId: id, message: `Referenced node "${id}" does not exist in nodes.` });
            onStack.delete(id);
            return;
        }

        const children = node.kind === "component" || node.kind === "primitive" ? node.children : [];
        for (const childId of children) {
            if (parentOf.has(childId) && parentOf.get(childId) !== id) {
                errors.push({
                    nodeId: childId,
                    message: `Node "${childId}" is referenced as a child by more than one parent ("${parentOf.get(childId)}" and "${id}") -- a tree, not a DAG.`,
                });
            } else {
                parentOf.set(childId, id);
            }
            walk(childId, [...path, id]);
        }

        // "node"-typed prop values also count as references for reachability,
        // but not as tree-shape parent/child edges (a slot reference is not
        // "this node is a child of the tree here").
        if (node.kind === "component") {
            for (const value of Object.values(node.props)) {
                if (value.t === "node" && tree.nodes[value.v]) visited.add(value.v);
            }
        }

        onStack.delete(id);
    }

    walk(tree.rootId, []);

    for (const id of Object.keys(tree.nodes)) {
        if (!visited.has(id)) {
            errors.push({ nodeId: id, message: `Node "${id}" is not reachable from rootId "${tree.rootId}" (orphaned).` });
        }
    }

    return errors;
}

function checkPropValue(
    errors: TreeValidationError[],
    tree: UITree,
    registry: Registry,
    node: UINode & { kind: "component" },
    propName: string,
    value: PropValue,
) {
    const entry = findComponent(registry, node.name);
    const propDef = entry?.props.find((p) => p.name === propName);

    if (value.t === "node") {
        if (!tree.nodes[value.v]) errors.push({ nodeId: node.id, message: `Prop "${propName}" references node "${value.v}", which does not exist.` });
        return;
    }

    if (value.t === "icon") {
        if (!registry.icons.some((i) => i.name === value.v)) {
            errors.push({ nodeId: node.id, message: `Prop "${propName}" references icon "${value.v}", which is not in the icon set.` });
        }
        if (propDef && propDef.acceptsIcon === false) {
            errors.push({ nodeId: node.id, message: `Prop "${propName}" does not accept an icon.` });
        }
        return;
    }

    if (value.t === "enum" && propDef?.enumValues && !propDef.enumValues.includes(value.v)) {
        errors.push({ nodeId: node.id, message: `Prop "${propName}" got "${value.v}", expected one of: ${propDef.enumValues.join(", ")}.` });
    }
}

function checkComponentNode(errors: TreeValidationError[], tree: UITree, registry: Registry, node: UINode & { kind: "component" }) {
    const entry = findComponent(registry, node.name);
    if (!entry) {
        errors.push({ nodeId: node.id, message: `Unknown component "${node.name}" -- not in the registry.` });
        return;
    }

    for (const prop of entry.props) {
        if (prop.required && !(prop.name in node.props)) {
            errors.push({ nodeId: node.id, message: `Missing required prop "${prop.name}" for ${entry.importName}.` });
        }
    }
    for (const [propName, value] of Object.entries(node.props)) {
        checkPropValue(errors, tree, registry, node, propName, value);
    }

    if (entry.allowedParents && entry.allowedParents.length > 0) {
        const parentId = Object.values(tree.nodes).find((n) => (n.kind === "component" || n.kind === "primitive") && n.children.includes(node.id))?.id;
        const parent = parentId ? tree.nodes[parentId] : undefined;
        const parentComponentEntry = parent?.kind === "component" ? findComponent(registry, parent.name) : undefined;
        const parentMatches =
            parentComponentEntry &&
            entry.allowedParents.some((p) => p === parentComponentEntry.id || p === parentComponentEntry.name || p === parentComponentEntry.importName);
        if (!parentMatches) {
            errors.push({ nodeId: node.id, message: `${entry.importName} may only appear inside: ${entry.allowedParents.join(", ")}.` });
        }
    }

    const rule = entry.allowedChildren;
    if (rule && rule !== "any") {
        for (const childId of node.children) {
            const child = tree.nodes[childId];
            if (!child) continue; // already reported by checkStructure
            if (rule === "none") {
                errors.push({ nodeId: childId, message: `${entry.importName} does not allow any children.` });
                continue;
            }
            if (rule === "text") {
                if (child.kind !== "text") errors.push({ nodeId: childId, message: `${entry.importName} only allows text content.` });
                continue;
            }
            const childEntry = child.kind === "component" ? findComponent(registry, child.name) : undefined;
            const matches = childEntry && rule.some((allowed) => allowed === childEntry.id || allowed === childEntry.name || allowed === childEntry.importName);
            if (!matches) {
                errors.push({ nodeId: childId, message: `${entry.importName} only allows these children: ${rule.join(", ")}.` });
            }
        }
    }
}

function checkPrimitiveNode(errors: TreeValidationError[], registry: Registry, node: UINode & { kind: "primitive" }) {
    const patterns = registry.tokens.allowedTailwindPatterns.map((p) => new RegExp(p));
    for (const cls of node.className) {
        // Strip any stack of state/responsive variants (e.g. "md:hover:bg-primary")
        // so the bare utility is what gets checked against the token patterns.
        const bare = cls.replace(/^((hover|focus|focus-visible|active|disabled|dark|xxs|xs|sm|md|lg|xl|2xl):)+/, "");
        if (/\[.*\]/.test(cls)) {
            errors.push({ nodeId: node.id, message: `Arbitrary Tailwind value "${cls}" is not allowed.` });
            continue;
        }
        if (!patterns.some((re) => re.test(cls)) && !patterns.some((re) => re.test(bare))) {
            errors.push({ nodeId: node.id, message: `"${cls}" does not resolve to a design token.` });
        }
    }
}

function checkIconNode(errors: TreeValidationError[], registry: Registry, node: UINode & { kind: "icon" }) {
    if (!registry.icons.some((i) => i.name === node.name)) {
        errors.push({ nodeId: node.id, message: `Unknown icon "${node.name}".` });
    }
}

export function validateTree(tree: UITree, registry: Registry): ValidateTreeResult {
    const errors = checkStructure(tree);

    for (const node of Object.values(tree.nodes)) {
        if (node.kind === "component") checkComponentNode(errors, tree, registry, node);
        else if (node.kind === "primitive") checkPrimitiveNode(errors, registry, node);
        else if (node.kind === "icon") checkIconNode(errors, registry, node);
        // text nodes have nothing further to check on their own.
    }

    return { ok: errors.length === 0, errors };
}
