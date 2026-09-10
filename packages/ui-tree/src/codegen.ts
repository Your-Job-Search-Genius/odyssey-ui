/**
 * treeToTsx(tree, registry) -> a single .tsx file (plan Section 5.4).
 * Deterministic by construction (same tree -> byte-identical output,
 * required for reproducibility per the plan's Section 1) -- no
 * Date.now(), no Math.random(), no object-key-order dependence beyond
 * what's already stable (registry prop order, alphabetically sorted
 * classNames/imports).
 *
 * The round-trip contract this package's tests enforce: treeToTsx's
 * output must pass @your-job-search-genius/ds-mcp's validateJsx() with
 * zero errors. If codegen ever produces something the validator
 * rejects, that is a codegen bug, not a validator false positive -- the
 * whole point of building UI through this tree instead of raw JSX is
 * that generated code is correct by construction.
 */
import type { ComponentEntry, Registry } from "@your-job-search-genius/ds-registry";
import { ICONS_IMPORT_PATH } from "@your-job-search-genius/ds-registry";
import prettier from "prettier";
import type { PropValue, UINode, UITree } from "./schema.js";

const LONG_TEXT_THRESHOLD = 80;

interface CodegenCtx {
    tree: UITree;
    registry: Registry;
    /** importPath -> set of names imported from it (component root names + icon names, deduplicated). */
    imports: Map<string, Set<string>>;
    /** id -> generated const identifier, for text nodes over the length threshold. */
    extractedTextConsts: Map<string, string>;
}

function findComponent(registry: Registry, name: string): ComponentEntry | undefined {
    return registry.components.find((c) => c.importName === name || c.name === name);
}

/**
 * A compound child's importName (e.g. "Select.Item") is accessed off the
 * root identifier ("Select") at runtime, imported from the ROOT
 * component's own file -- not the child's. select-item.tsx has its own
 * importPath (".../components/base/select/select-item"), which is where
 * SelectItem's *source* lives, not where the "Select" identifier comes
 * from. Importing "Select" from select-item's path would be wrong (and
 * is exactly the bug this function exists to avoid -- caught by
 * codegen.test.ts's compound-Select round-trip test).
 */
function rootImportInfo(registry: Registry, entry: ComponentEntry): { rootName: string; importPath: string } {
    const rootName = entry.importName.split(".")[0] ?? entry.importName;
    if (rootName === entry.importName) return { rootName, importPath: entry.importPath }; // not a compound child
    const rootEntry = registry.components.find((c) => c.importName === rootName);
    return rootEntry ? { rootName, importPath: rootEntry.importPath } : { rootName, importPath: entry.importPath };
}

function addImport(ctx: CodegenCtx, importPath: string, name: string) {
    const set = ctx.imports.get(importPath) ?? new Set<string>();
    set.add(name);
    ctx.imports.set(importPath, set);
}

function jsxAttrStringValue(value: string): string {
    // Double-quoted JSX string attribute -- escape only the double quote
    // (JSX string attributes are not JS string literals, no other escaping
    // is meaningful inside them).
    return `"${value.replace(/"/g, "&quot;")}"`;
}

function isSimpleJsxText(text: string): boolean {
    return !/[<>{}]/.test(text) && text === text.trim();
}

function collectImportsAndTextConsts(ctx: CodegenCtx, id: string) {
    const node = ctx.tree.nodes[id];
    if (!node) return;

    if (node.kind === "text") {
        if (node.value.length > LONG_TEXT_THRESHOLD) {
            ctx.extractedTextConsts.set(id, `text_${id.replace(/[^a-zA-Z0-9]/g, "_")}`);
        }
        return;
    }

    if (node.kind === "icon") {
        addImport(ctx, ICONS_IMPORT_PATH, node.name);
        return;
    }

    if (node.kind === "component") {
        const entry = findComponent(ctx.registry, node.name);
        if (entry) {
            const { rootName, importPath } = rootImportInfo(ctx.registry, entry);
            addImport(ctx, importPath, rootName);
        }
        for (const value of Object.values(node.props)) {
            if (value.t === "icon") addImport(ctx, ICONS_IMPORT_PATH, value.v);
            if (value.t === "node") collectImportsAndTextConsts(ctx, value.v);
        }
    }

    if (node.kind === "component" || node.kind === "primitive") {
        for (const childId of node.children) collectImportsAndTextConsts(ctx, childId);
    }
}

function textNodeJsx(ctx: CodegenCtx, id: string, value: string): string {
    const constName = ctx.extractedTextConsts.get(id);
    if (constName) return `{${constName}}`;
    return isSimpleJsxText(value) ? value : `{${JSON.stringify(value)}}`;
}

function propValueJsxExpression(ctx: CodegenCtx, value: PropValue): string {
    switch (value.t) {
        case "string":
        case "enum":
            return jsxAttrStringValue(value.v);
        case "number":
            return `{${JSON.stringify(value.v)}}`;
        case "boolean":
            // Never actually reached: attributesJsx uses shorthand `prop`
            // for true and omits the attribute entirely for false, since
            // `undefined` and `false` are equivalent for every boolean
            // prop in this library. Kept exhaustive rather than throwing.
            return value.v ? "" : "{false}";
        case "icon":
            return `{${value.v}}`;
        case "node":
            return `{${nodeToJsx(ctx, value.v)}}`;
    }
}

function attributesJsx(ctx: CodegenCtx, node: UINode & { kind: "component" }, entry: ComponentEntry | undefined): string {
    const order = entry ? entry.props.map((p) => p.name) : [];
    const names = Object.keys(node.props).sort((a, b) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });

    return names
        .map((name) => {
            const value = node.props[name];
            if (!value) return "";
            if (value.t === "boolean") return value.v ? ` ${name}` : ""; // shorthand for true, omitted entirely for false (equivalent to undefined for every boolean prop here)
            return ` ${name}=${propValueJsxExpression(ctx, value)}`;
        })
        .join("");
}

function nodeToJsx(ctx: CodegenCtx, id: string): string {
    const node = ctx.tree.nodes[id];
    if (!node) return "null";

    if (node.kind === "text") return textNodeJsx(ctx, id, node.value);

    if (node.kind === "icon") {
        const cls = node.className && node.className.length > 0 ? ` className=${jsxAttrStringValue([...node.className].sort().join(" "))}` : "";
        return `<${node.name} aria-hidden="true"${cls} />`;
    }

    if (node.kind === "primitive") {
        const cls = node.className.length > 0 ? ` className=${jsxAttrStringValue([...node.className].sort().join(" "))}` : "";
        const children = node.children.map((childId) => nodeToJsx(ctx, childId)).join("");
        return children.length > 0 ? `<${node.tag}${cls}>${children}</${node.tag}>` : `<${node.tag}${cls} />`;
    }

    // node.kind === "component"
    const entry = findComponent(ctx.registry, node.name);
    const tag = entry?.importName ?? node.name;
    const attrs = attributesJsx(ctx, node, entry);
    const children = node.children.map((childId) => nodeToJsx(ctx, childId)).join("");
    return children.length > 0 ? `<${tag}${attrs}>${children}</${tag}>` : `<${tag}${attrs} />`;
}

function importsBlock(ctx: CodegenCtx): string {
    return [...ctx.imports.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([importPath, names]) => `import { ${[...names].sort().join(", ")} } from "${importPath}";`)
        .join("\n");
}

function textConstsBlock(ctx: CodegenCtx): string {
    return [...ctx.extractedTextConsts.entries()]
        .map(([id, constName]) => `const ${constName} = ${JSON.stringify((ctx.tree.nodes[id] as UINode & { kind: "text" }).value)};`)
        .join("\n");
}

export interface TreeToTsxOptions {
    /** Exported function name for the generated component. Defaults to "GeneratedComponent". */
    componentName?: string;
    /** Skip the prettier formatting pass (useful in tests that want to see raw output, or environments without a resolvable prettier config). Defaults to false. */
    skipFormat?: boolean;
}

export async function treeToTsx(tree: UITree, registry: Registry, options: TreeToTsxOptions = {}): Promise<string> {
    const ctx: CodegenCtx = { tree, registry, imports: new Map(), extractedTextConsts: new Map() };
    collectImportsAndTextConsts(ctx, tree.rootId);

    const componentName = options.componentName ?? "GeneratedComponent";
    const body = nodeToJsx(ctx, tree.rootId);

    const source = [importsBlock(ctx), textConstsBlock(ctx), "", `export default function ${componentName}() {`, `  return (`, `    ${body}`, `  );`, `}`, ""]
        .filter((line) => line !== "")
        .join("\n");

    if (options.skipFormat) return source;

    try {
        const config = (await prettier.resolveConfig(import.meta.dirname)) ?? {};
        return await prettier.format(source, { ...config, parser: "typescript" });
    } catch {
        // A resolvable prettier config is a nice-to-have, not a hard
        // requirement -- fall back to the unformatted (but syntactically
        // valid) source rather than failing codegen entirely.
        return source;
    }
}
