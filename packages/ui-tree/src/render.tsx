/**
 * renderTree(tree, options) -> React elements (plan Section 5.3). Takes
 * a componentMap/iconMap built from the *real* @your-job-search-genius/odyssey-ui
 * exports (see this package's README) so the preview is pixel-identical
 * to production -- this package deliberately does not import packages/ui
 * itself, keeping it agnostic to which build of the library is being
 * previewed against (the current apps/docs source tree today; a
 * published version later, if ever needed).
 *
 * Every rendered node carries data-node-id, so a host page (apps/docs's
 * preview iframe, Phase 4) can wire click-to-select without this package
 * knowing anything about selection UI.
 */
import { Fragment, createElement } from "react";
import type { ComponentType, ReactNode } from "react";
import type { PropValue, UINode, UITree } from "./schema.js";

/**
 * ComponentType<any>, deliberately: a real componentMap is heterogeneous
 * by nature (~100+ real library components, each with its own concrete,
 * mutually-incompatible props type) -- Record<string, ComponentType<Record
 * <string, unknown>>> looks stricter but is actually unsatisfiable by any
 * real component with required or specifically-typed props (every
 * concrete props type fails "is Record<string, unknown> assignable to
 * this"), which is exactly what broke apps/docs's generated,
 * ~108-component real map. Prop correctness for a given node is what
 * validateTree() and the registry check before a node ever reaches this
 * renderer, not this type.
 */
// Not Record<string, ComponentType<any>>: some real compound roots (e.g.
// Dropdown, Pagination) are pure namespace objects with no callable
// component of their own -- only Dropdown.Root, Dropdown.Menu, etc. are
// real components. resolveComponent() below walks the dotted path at
// runtime and only requires the *final* resolved value to be callable,
// so the map's own value type has to allow either shape.
// eslint is not configured for this package (see README) so no
// eslint-disable is needed for these `any`s -- kept minimal and
// deliberate regardless.
export type ComponentMap = Record<string, ComponentType<any> | Record<string, unknown>>;
export type IconMap = Record<string, ComponentType<any>>;

export interface RenderOptions {
    componentMap: ComponentMap;
    iconMap: IconMap;
}

/**
 * "Select.Item" resolves via the real compound-component runtime shape
 * (Select.Item = SelectItem, per CLAUDE.md's documented pattern) --
 * looks up "Select" in componentMap, then walks ".Item" as a property on
 * the live component reference, rather than requiring the consumer to
 * pre-flatten dotted keys into componentMap.
 */
function resolveComponent(componentMap: ComponentMap, name: string): ComponentType<Record<string, unknown>> | undefined {
    const [root, ...rest] = name.split(".");
    if (!root) return undefined;
    let current: unknown = componentMap[root];
    for (const segment of rest) {
        if (typeof current !== "function" && typeof current !== "object") return undefined;
        current = (current as Record<string, unknown>)[segment];
    }
    return typeof current === "function" ? (current as ComponentType<Record<string, unknown>>) : undefined;
}

function resolvePropValue(tree: UITree, value: PropValue, options: RenderOptions): unknown {
    switch (value.t) {
        case "string":
        case "number":
        case "boolean":
        case "enum":
            return value.v;
        case "icon":
            return options.iconMap[value.v];
        case "node":
            return renderNode(tree, value.v, options);
    }
}

export function renderNode(tree: UITree, id: string, options: RenderOptions): ReactNode {
    const node: UINode | undefined = tree.nodes[id];
    if (!node) return null;

    if (node.kind === "text") return node.value;

    if (node.kind === "icon") {
        const Icon = options.iconMap[node.name];
        if (!Icon) return null;
        return createElement(Icon, { key: id, "data-icon": true, "data-node-id": id, className: node.className?.join(" ") });
    }

    if (node.kind === "primitive") {
        const children = node.children.map((childId) => renderNode(tree, childId, options));
        return createElement(node.tag, { key: id, "data-node-id": id, className: node.className.join(" ") }, ...children);
    }

    // node.kind === "component"
    const Component = resolveComponent(options.componentMap, node.name);
    if (!Component) return null;
    const props: Record<string, unknown> = { key: id, "data-node-id": id };
    for (const [propName, value] of Object.entries(node.props)) {
        props[propName] = resolvePropValue(tree, value, options);
    }
    const children = node.children.map((childId) => renderNode(tree, childId, options));
    return createElement(Component, props, children.length > 0 ? createElement(Fragment, null, ...children) : undefined);
}

export function renderTree(tree: UITree, options: RenderOptions): ReactNode {
    return renderNode(tree, tree.rootId, options);
}
