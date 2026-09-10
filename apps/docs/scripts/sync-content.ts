/**
 * Build-time content sync. Regenerates, from the real component library
 * source, everything the docs site needs to render live previews,
 * code blocks, and props tables -- never at request time:
 *
 *  - lib/demo-registry.ts           (static imports of every *.demo.tsx / *.story.tsx)
 *  - .generated/demo-sources.json   (extracted source text per named export)
 *  - .generated/demo-exports.json   (export names per demo id, in file order)
 *  - .generated/props.json          (react-docgen-typescript output per component)
 *  - lib/playground/component-map.generated.ts (static imports for the playground's live renderer)
 *
 * Run via `pnpm run docs:sync` (also runs automatically before
 * `docs:dev` / `docs:build`).
 */
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import fs from "node:fs";
import path from "node:path";
import * as docgen from "react-docgen-typescript";
import ts from "typescript";

const SCRIPT_DIR = import.meta.dirname;
const DOCS_ROOT = path.join(SCRIPT_DIR, "..");
const REPO_ROOT = path.join(DOCS_ROOT, "..", "..");
const UI_ROOT = path.join(REPO_ROOT, "packages", "ui");
const COMPONENTS_ROOT = path.join(UI_ROOT, "components");
const GENERATED_DIR = path.join(DOCS_ROOT, ".generated");
const LIB_DIR = path.join(DOCS_ROOT, "lib");
const PLAYGROUNDS_ROOT = path.join(LIB_DIR, "playgrounds");
const PLAYGROUND_LIB_DIR = path.join(LIB_DIR, "playground");

/**
 * "<demo id>#<export name>" pairs that are NOT standalone renderable
 * components -- render-prop callbacks handed to a third-party library
 * (e.g. a recharts custom tick/tooltip renderer) or sub-components that
 * only work inside a specific parent context (e.g. a `useXState` hook
 * that requires a particular ancestor provider). Discovered by
 * rendering every extracted export and finding the ones that throw;
 * excluded here (never surfaced as a ComponentPreview example) rather
 * than left to fail at request time -- add to this list if
 * `docs:build` or manual testing turns up another one.
 */
const EXCLUDED_EXPORTS = new Set(["application/carousel/carousel#CarouselIndicator", "application/charts/radar-charts#CustomRadarChartTick"]);

interface RegistryEntry {
    /** e.g. "base/buttons/buttons" */
    id: string;
    /** absolute path to the *.demo.tsx or *.story.tsx file backing this id */
    sourcePath: string;
    /** e.g. "@/components/base/buttons/buttons.demo" */
    importPath: string;
    /** "demo" if backed by a *.demo.tsx file, "story" if falling back to *.story.tsx */
    kind: "demo" | "story";
}

function walk(dir: string, predicate: (fileName: string) => boolean, results: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, predicate, results);
        } else if (predicate(entry.name)) {
            results.push(full);
        }
    }
    return results;
}

function toPosix(p: string): string {
    return p.split(path.sep).join("/");
}

function toId(filePath: string, suffix: ".demo" | ".story"): string {
    const rel = path.relative(COMPONENTS_ROOT, filePath).replace(/\.tsx$/, "");
    const withoutSuffix = rel.endsWith(suffix) ? rel.slice(0, -suffix.length) : rel;
    return toPosix(withoutSuffix);
}

function toImportPath(filePath: string): string {
    const rel = path.relative(UI_ROOT, filePath).replace(/\.tsx$/, "");
    return `@/${toPosix(rel)}`;
}

function toIdentifier(id: string): string {
    return `demo_${id.replace(/[^a-zA-Z0-9]/g, "_")}`;
}

function buildRegistry(): Map<string, RegistryEntry> {
    const demoFiles = walk(COMPONENTS_ROOT, (name) => name.endsWith(".demo.tsx"));
    const storyFiles = walk(COMPONENTS_ROOT, (name) => name.endsWith(".story.tsx"));

    const registry = new Map<string, RegistryEntry>();

    for (const file of demoFiles) {
        const id = toId(file, ".demo");
        registry.set(id, { id, sourcePath: file, importPath: toImportPath(file), kind: "demo" });
    }

    // Fall back to the sibling *.story.tsx only for ids that have no
    // *.demo.tsx (the handful of icon/dropdown showcases authored
    // directly as stories -- see CONTRIBUTING.md's documented convention).
    for (const file of storyFiles) {
        const id = toId(file, ".story");
        if (!registry.has(id)) {
            registry.set(id, { id, sourcePath: file, importPath: toImportPath(file), kind: "story" });
        }
    }

    return registry;
}

function hasExportModifier(node: ts.Node): boolean {
    const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
    return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

/**
 * Extracts the exact source text of every top-level named export in a
 * *.demo.tsx / *.story.tsx file, in declaration order. Uses the
 * TypeScript Compiler API (not regex, which breaks on nested
 * braces/JSX) so extraction is exact regardless of formatting.
 */
function extractExports(filePath: string): { name: string; code: string }[] {
    const text = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const found: { name: string; code: string }[] = [];

    for (const stmt of sourceFile.statements) {
        if (ts.isVariableStatement(stmt) && hasExportModifier(stmt)) {
            for (const decl of stmt.declarationList.declarations) {
                if (ts.isIdentifier(decl.name)) {
                    found.push({ name: decl.name.text, code: stmt.getText(sourceFile) });
                }
            }
        } else if (ts.isFunctionDeclaration(stmt) && hasExportModifier(stmt) && stmt.name) {
            found.push({ name: stmt.name.text, code: stmt.getText(sourceFile) });
        }
    }

    return found;
}

function writeDemoRegistry(registry: Map<string, RegistryEntry>) {
    const entries = [...registry.values()].sort((a, b) => a.id.localeCompare(b.id));

    const lines = [
        "// AUTO-GENERATED by apps/docs/scripts/sync-content.ts -- do not edit by hand.",
        "// Run `pnpm run docs:sync` to regenerate.",
        "",
        ...entries.map((e) => `import * as ${toIdentifier(e.id)} from "${e.importPath}";`),
        "",
        // Deliberately `unknown`, not `ComponentType<...>`: each module is a
        // *.demo.tsx/*.story.tsx namespace mixing real zero-prop demo
        // components with the occasional non-component export (a
        // Storybook `default` metadata object, a render-prop helper that
        // takes required props, ...). consumers narrow when they use a
        // specific "<id>#<export>" pair (see lib/demo-sources.ts and
        // EXCLUDED_EXPORTS above, which is the real guard against
        // rendering one of those non-component exports).
        "export const demoRegistry: Record<string, Record<string, unknown>> = {",
        ...entries.map((e) => `    "${e.id}": ${toIdentifier(e.id)},`),
        "};",
        "",
    ];

    fs.mkdirSync(LIB_DIR, { recursive: true });
    fs.writeFileSync(path.join(LIB_DIR, "demo-registry.ts"), lines.join("\n"));
}

function writeDemoSourcesAndExports(registry: Map<string, RegistryEntry>) {
    const sources: Record<string, string> = {};
    const exportsByid: Record<string, string[]> = {};
    let failures = 0;

    for (const entry of registry.values()) {
        try {
            const found = extractExports(entry.sourcePath).filter(({ name }) => !EXCLUDED_EXPORTS.has(`${entry.id}#${name}`));
            exportsByid[entry.id] = found.map((f) => f.name);
            for (const { name, code } of found) {
                sources[`${entry.id}#${name}`] = code;
            }
        } catch (error) {
            failures += 1;
            console.warn(`[sync-content] failed to extract exports from ${entry.sourcePath}:`, error);
        }
    }

    fs.mkdirSync(GENERATED_DIR, { recursive: true });
    fs.writeFileSync(path.join(GENERATED_DIR, "demo-sources.json"), JSON.stringify(sources, null, 2));
    fs.writeFileSync(path.join(GENERATED_DIR, "demo-exports.json"), JSON.stringify(exportsByid, null, 2));

    return { count: registry.size, failures };
}

// These groups are pure icon barrels (dozens to ~1180 near-identical SVG
// wrapper files each) -- they become searchable IconGallery pages, not
// PropsTable-documented components, so per-file docgen extraction over
// them would be both pointless and slow. Excluded from the scan below.
const ICON_HEAVY_GROUPS = new Set(["icons", "payment-icons", "integration-icons", "social-icons"]);

/**
 * react-docgen-typescript extraction for props tables. Runs against
 * every top-level "*.tsx" file directly inside each "<category>/<group>/"
 * folder (excluding *.demo.tsx / *.story.tsx and nested subfolders),
 * keyed as "<category>/<group>/<file-name>". Most groups contain exactly
 * one such file matching CONTRIBUTING.md's documented convention (e.g.
 * "base/select/select.tsx"), but several genuinely contain more than one
 * real component (e.g. "base/buttons/" has button.tsx, button-utility.tsx,
 * close-button.tsx, ...) -- extracting every one of them individually
 * gives each its own props table without needing a folder-name match.
 * Groups with no extractable top-level component (loose foundation/
 * shared-asset files that live directly under their category, not their
 * own folder) are skipped here and must use <PropsTable overrides="...">
 * in their MDX page instead -- one hard case never blocks the rest.
 */
function writeProps() {
    const parser = docgen.withCustomConfig(path.join(UI_ROOT, "tsconfig.json"), {
        savePropValueAsString: true,
        shouldExtractLiteralValuesFromEnum: true,
        propFilter: (prop) => prop.parent == null || !/node_modules/.test(prop.parent.fileName),
    });

    const categories = fs
        .readdirSync(COMPONENTS_ROOT, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);

    // Collect every candidate file first and parse them all in one batched
    // call -- react-docgen-typescript builds a fresh TS program per parse()
    // call, so parsing one file at a time here was recompiling the whole
    // project ~120 times (100s+); one batched call builds the program once.
    const idByFilePath = new Map<string, string>();

    for (const category of categories) {
        const categoryDir = path.join(COMPONENTS_ROOT, category);
        const categoryEntries = fs.readdirSync(categoryDir, { withFileTypes: true });

        // Loose top-level files (e.g. components/foundations/dot-icon.tsx)
        // live directly under the category, not their own group folder --
        // id them as "<category>/<file-name>" (two segments), matching
        // new-doc.ts's `allGroupsFor`/loose-file id convention.
        for (const entry of categoryEntries) {
            if (entry.isFile() && entry.name.endsWith(".tsx") && !entry.name.endsWith(".demo.tsx") && !entry.name.endsWith(".story.tsx")) {
                const id = `${category}/${entry.name.replace(/\.tsx$/, "")}`;
                idByFilePath.set(path.join(categoryDir, entry.name), id);
            }
        }

        for (const group of categoryEntries) {
            if (!group.isDirectory() || ICON_HEAVY_GROUPS.has(group.name)) continue;

            const groupDir = path.join(categoryDir, group.name);
            const componentFiles = fs
                .readdirSync(groupDir, { withFileTypes: true })
                .filter((e) => e.isFile() && e.name.endsWith(".tsx") && !e.name.endsWith(".demo.tsx") && !e.name.endsWith(".story.tsx"))
                .map((e) => e.name);

            for (const fileName of componentFiles) {
                const componentFile = path.join(groupDir, fileName);
                const id = `${category}/${group.name}/${fileName.replace(/\.tsx$/, "")}`;
                idByFilePath.set(componentFile, id);
            }
        }
    }

    const props: Record<string, unknown> = {};
    let extracted = 0;
    let skipped = 0;

    let allDocs: docgen.ComponentDoc[] = [];
    try {
        allDocs = parser.parse([...idByFilePath.keys()]);
    } catch (error) {
        console.warn("[sync-content] react-docgen-typescript batch parse failed:", error);
    }

    const docsByFilePath = new Map<string, docgen.ComponentDoc[]>();
    for (const doc of allDocs) {
        const list = docsByFilePath.get(doc.filePath) ?? [];
        list.push(doc);
        docsByFilePath.set(doc.filePath, list);
    }

    for (const [componentFile, id] of idByFilePath) {
        const docs = docsByFilePath.get(componentFile);
        if (docs && docs.length > 0) {
            props[id] = docs;
            extracted += 1;
        } else {
            skipped += 1;
        }
    }

    fs.mkdirSync(GENERATED_DIR, { recursive: true });
    fs.writeFileSync(path.join(GENERATED_DIR, "props.json"), JSON.stringify(props, null, 2));

    return { extracted, skipped };
}

function writePlaygroundRegistry() {
    if (!fs.existsSync(PLAYGROUNDS_ROOT)) {
        fs.mkdirSync(PLAYGROUNDS_ROOT, { recursive: true });
    }
    const files = walk(PLAYGROUNDS_ROOT, (name) => name.endsWith(".playground.ts"));

    const idFor = (file: string) => toPosix(path.relative(PLAYGROUNDS_ROOT, file).replace(/\.playground\.ts$/, ""));
    const identifierFor = (id: string) => `playground_${id.replace(/[^a-zA-Z0-9]/g, "_")}`;

    const entries = files.map((file) => ({ id: idFor(file), file })).sort((a, b) => a.id.localeCompare(b.id));

    const lines = [
        "// AUTO-GENERATED by apps/docs/scripts/sync-content.ts -- do not edit by hand.",
        "// Run `pnpm run docs:sync` to regenerate.",
        "",
        'import type { PlaygroundSchema } from "./playground-types";',
        "",
        ...entries.map((e) => `import ${identifierFor(e.id)} from "./playgrounds/${e.id}.playground";`),
        "",
        "export const playgroundRegistry: Record<string, PlaygroundSchema> = {",
        ...entries.map((e) => `    "${e.id}": ${identifierFor(e.id)},`),
        "};",
        "",
    ];

    fs.writeFileSync(path.join(LIB_DIR, "playground-registry.ts"), lines.join("\n"));
    return entries.length;
}

/**
 * Generates lib/playground/component-map.generated.ts: a real, static
 * `import { X } from "..."` per distinct root component (compound
 * children like Select.Item need no import of their own -- see
 * @your-job-search-genius/ui-tree's render.tsx, which resolves them via
 * the real Select.Item runtime property), plus the icon barrel imported
 * wholesale. A statically generated file, not a fully dynamic
 * runtime `import()` keyed by a registry string: webpack/Turbopack can
 * bundle a dynamic import expression, but only reliably when it can see
 * the set of possible paths at build time, which a fully runtime-computed
 * specifier from ~111 registry entries does not give it. This mirrors
 * writeDemoRegistry's exact same reasoning for the exact same tradeoff.
 */
function writeComponentMap(dsRegistry: ReturnType<typeof loadRegistry>) {
    const roots = new Map<string, string>(); // root component name -> importPath
    for (const c of dsRegistry.components) {
        const rootName = c.importName.split(".")[0];
        if (rootName && rootName === c.importName && !roots.has(rootName)) {
            roots.set(rootName, c.importPath);
        }
    }

    const usedIdentifiers = new Set<string>();
    const entries = [...roots.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, importPath]) => {
            let identifier = name;
            let suffix = 2;
            while (usedIdentifiers.has(identifier)) identifier = `${name}_${suffix++}`;
            usedIdentifiers.add(identifier);
            return { name, identifier, importPath };
        });

    const lines = [
        "// AUTO-GENERATED by apps/docs/scripts/sync-content.ts -- do not edit by hand.",
        "// Run `pnpm run docs:sync` to regenerate.",
        "",
        'import * as icons from "@/components/foundations/icons";',
        ...entries.map((e) =>
            e.identifier === e.name ? `import { ${e.name} } from "${e.importPath}";` : `import { ${e.name} as ${e.identifier} } from "${e.importPath}";`,
        ),
        "",
        'import type { ComponentMap, IconMap } from "@your-job-search-genius/ui-tree";',
        "",
        "export const componentMap: ComponentMap = {",
        ...entries.map((e) => `    ${e.name}: ${e.identifier},`),
        "};",
        "",
        "export const iconMap: IconMap = icons;",
        "",
    ];

    fs.mkdirSync(PLAYGROUND_LIB_DIR, { recursive: true });
    fs.writeFileSync(path.join(PLAYGROUND_LIB_DIR, "component-map.generated.ts"), lines.join("\n"));
    return entries.length;
}

async function main() {
    const registry = buildRegistry();
    writeDemoRegistry(registry);
    const { count, failures } = writeDemoSourcesAndExports(registry);
    const { extracted, skipped } = writeProps();
    const playgroundCount = writePlaygroundRegistry();
    const componentMapCount = writeComponentMap(loadRegistry());

    console.log(
        `[sync-content] demo registry: ${count} ids (${failures} extraction failures) -- props: ${extracted} extracted, ${skipped} skipped (need <PropsTable overrides>) -- playgrounds: ${playgroundCount} -- component map: ${componentMapCount} root components`,
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
