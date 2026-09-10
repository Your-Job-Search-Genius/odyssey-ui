/**
 * Walks packages/ui/components using the same <category>/<group>/<file>.tsx
 * convention CONTRIBUTING.md documents (and apps/docs/scripts/sync-content.ts
 * already extracts docs props tables from), runs react-docgen-typescript
 * once in batch, and layers any colocated `<file>.meta.ts` override on top.
 *
 * Deliberately mirrors apps/docs/scripts/sync-content.ts's writeProps walk
 * (same ICON_HEAVY_GROUPS, same id shape) rather than reinventing it, with
 * one intentional divergence: the "internal" category (Storybook-only
 * decorators, not real UI) is excluded here. That category has no
 * equivalent guard in sync-content.ts today and leaks a spurious
 * "internal/decorators" entry into apps/docs/.generated/props.json; this
 * registry is the agent-facing "approved components" contract, so it
 * excludes it explicitly rather than carrying that quirk forward.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as docgen from "react-docgen-typescript";
import type { ComponentCategory, ComponentEntry, ComponentMetaOverride, PropEntry } from "../schema.js";
import { ComponentMetaOverrideSchema, UI_COMPONENTS_IMPORT_ROOT } from "../schema.js";

const ICON_HEAVY_GROUPS = new Set(["icons", "payment-icons", "integration-icons", "social-icons"]);
const EXCLUDED_CATEGORIES = new Set(["internal"]);
const KNOWN_CATEGORIES = new Set(["base", "application", "foundations", "shared-assets", "marketing"]);

interface CandidateFile {
    id: string;
    category: ComponentCategory;
    filePath: string;
    /** The file's own base name, e.g. "button" for button.tsx. */
    baseName: string;
}

function isRealComponentFile(name: string): boolean {
    return name.endsWith(".tsx") && !name.endsWith(".demo.tsx") && !name.endsWith(".story.tsx") && !name.endsWith(".meta.tsx");
}

function toComponentCategory(name: string): ComponentCategory | null {
    return KNOWN_CATEGORIES.has(name) ? (name as ComponentCategory) : null;
}

function collectCandidates(componentsRoot: string): CandidateFile[] {
    const candidates: CandidateFile[] = [];
    const categoryDirs = fs
        .readdirSync(componentsRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .filter((name) => !EXCLUDED_CATEGORIES.has(name));

    for (const categoryName of categoryDirs) {
        const category = toComponentCategory(categoryName);
        if (!category) continue; // unknown top-level dir; not part of the documented category set
        const categoryDir = path.join(componentsRoot, categoryName);
        const categoryEntries = fs.readdirSync(categoryDir, { withFileTypes: true });

        // Loose top-level files (e.g. foundations/dot-icon.tsx).
        for (const entry of categoryEntries) {
            if (entry.isFile() && isRealComponentFile(entry.name)) {
                const baseName = entry.name.replace(/\.tsx$/, "");
                candidates.push({ id: `${categoryName}/${baseName}`, category, filePath: path.join(categoryDir, entry.name), baseName });
            }
        }

        // Grouped files, e.g. base/buttons/button.tsx.
        for (const group of categoryEntries) {
            if (!group.isDirectory() || ICON_HEAVY_GROUPS.has(group.name)) continue;
            const groupDir = path.join(categoryDir, group.name);
            for (const file of fs.readdirSync(groupDir, { withFileTypes: true })) {
                if (!file.isFile() || !isRealComponentFile(file.name)) continue;
                const baseName = file.name.replace(/\.tsx$/, "");
                candidates.push({ id: `${categoryName}/${group.name}/${baseName}`, category, filePath: path.join(groupDir, file.name), baseName });
            }
        }
    }

    return candidates;
}

/**
 * react-docgen-typescript occasionally disambiguates a displayName with a
 * leading underscore when it collides with something else in the same
 * batched TS program (observed on Select, whose call-signature-overload
 * type shape -- the same pattern Button also uses -- apparently collides
 * with something else across ~110 files parsed in one program). "_Select"
 * is not select.tsx's real exported name; strip the prefix when doing so
 * recovers the name the candidate's own file/folder convention expects,
 * rather than exposing the mangled name to agents.
 */
function unmangleDisplayName(displayName: string, expectedPascalCase: string): string {
    if (displayName.startsWith("_") && displayName.slice(1) === expectedPascalCase) return expectedPascalCase;
    return displayName;
}

function toPascalCase(slug: string): string {
    return slug
        .split(/[-_]/)
        .map((w) => w[0]?.toUpperCase() + w.slice(1))
        .join("");
}

/** Heuristic: does this prop's declared type look like it wants an icon component/element? */
function looksLikeIconProp(name: string, type: string): boolean {
    return /icon/i.test(name) && /(FC\s*<|ReactNode|ReactElement|ComponentType)/.test(type);
}

function toPropEntry(name: string, prop: docgen.PropItem): PropEntry {
    const type = prop.type.name;
    // An optional prop's union type resolves through docgen with an
    // implicit "undefined" member (from the `?`) alongside the real
    // literal values -- e.g. `size?: "sm" | "md"` extracts as
    // ["undefined", "sm", "md"]. That is not a legal value to pass, so
    // it is filtered out rather than reported as one.
    const enumValues =
        prop.type.name === "enum" && Array.isArray(prop.type.value)
            ? (prop.type.value as Array<{ value: string }>).map((v) => v.value.replace(/^"(.*)"$/, "$1")).filter((v) => v !== "undefined" && v !== "null")
            : undefined;

    const entry: PropEntry = {
        name,
        type,
        required: prop.required,
        description: prop.description || undefined,
    };
    if (enumValues && enumValues.length > 0) entry.enumValues = enumValues;
    if (prop.defaultValue && typeof prop.defaultValue === "object" && "value" in prop.defaultValue) {
        entry.default = String((prop.defaultValue as { value: unknown }).value);
    }
    if (looksLikeIconProp(name, type)) entry.acceptsIcon = true;
    if (name === "className") entry.acceptsClassName = true;
    return entry;
}

/**
 * Applies a meta override's propOverrides on top of extracted props --
 * see PropOverrideSchema's doc comment in schema.ts for what this exists
 * to fix (a union-typed component's variant-only prop reported as
 * globally required). An override for a prop name docgen didn't actually
 * find is dropped, not fabricated into a new prop entry.
 */
function applyPropOverrides(props: PropEntry[], overrides: Record<string, { required?: boolean; description?: string }> | undefined): PropEntry[] {
    if (!overrides) return props;
    return props.map((prop) => {
        const override = overrides[prop.name];
        return override ? { ...prop, ...override } : prop;
    });
}

/** Picks the docgen result that best represents this file's public component, when parse() found more than one. */
function pickPrimaryDoc(docs: docgen.ComponentDoc[], baseName: string): docgen.ComponentDoc | undefined {
    if (docs.length <= 1) return docs[0];
    const expected = toPascalCase(baseName);
    return docs.find((d) => d.displayName === expected) ?? docs[0];
}

async function loadMetaOverride(componentFilePath: string): Promise<ComponentMetaOverride | undefined> {
    const metaPath = componentFilePath.replace(/\.tsx$/, ".meta.ts");
    if (!fs.existsSync(metaPath)) return undefined;
    const mod: unknown = await import(pathToFileURL(metaPath).href);
    const exported = (mod as { componentMeta?: unknown }).componentMeta ?? (mod as { default?: unknown }).default;
    const parsed = ComponentMetaOverrideSchema.safeParse(exported);
    if (!parsed.success) {
        throw new Error(`Invalid componentMeta export in ${metaPath}: ${parsed.error.message}`);
    }
    return parsed.data;
}

export interface ExtractComponentsOptions {
    componentsRoot: string;
    uiTsconfigPath: string;
    docsUrlFor: (id: string) => string;
}

export interface ExtractComponentsResult {
    components: ComponentEntry[];
    /** Candidate files docgen produced zero results for -- needs a *.meta.ts, or isn't a real component (e.g. a pure type/util file). */
    skipped: string[];
}

export async function extractComponents({ componentsRoot, uiTsconfigPath, docsUrlFor }: ExtractComponentsOptions): Promise<ExtractComponentsResult> {
    const candidates = collectCandidates(componentsRoot);

    const parser = docgen.withCustomConfig(uiTsconfigPath, {
        savePropValueAsString: true,
        shouldExtractLiteralValuesFromEnum: true,
        propFilter: (prop) => prop.parent == null || !/node_modules/.test(prop.parent.fileName),
    });

    // One batched parse() call: react-docgen-typescript rebuilds the whole
    // TS program per call, so parsing hundreds of files one at a time here
    // would recompile packages/ui hundreds of times.
    let allDocs: docgen.ComponentDoc[] = [];
    try {
        allDocs = parser.parse(candidates.map((c) => c.filePath));
    } catch (error) {
        throw new Error(`react-docgen-typescript batch parse failed: ${String(error)}`);
    }
    const docsByFilePath = new Map<string, docgen.ComponentDoc[]>();
    for (const doc of allDocs) {
        const list = docsByFilePath.get(doc.filePath) ?? [];
        list.push(doc);
        docsByFilePath.set(doc.filePath, list);
    }

    const components: ComponentEntry[] = [];
    const skipped: string[] = [];

    for (const candidate of candidates) {
        const docs = docsByFilePath.get(candidate.filePath);
        const primary = docs ? pickPrimaryDoc(docs, candidate.baseName) : undefined;
        const override = await loadMetaOverride(candidate.filePath);

        if (!primary && !override) {
            skipped.push(candidate.id);
            continue;
        }

        const expectedName = toPascalCase(candidate.baseName);
        const name = primary ? unmangleDisplayName(primary.displayName, expectedName) : expectedName;
        const extractedProps = primary ? Object.entries(primary.props).map(([propName, prop]) => toPropEntry(propName, prop)) : [];
        const { propOverrides, ...componentOverride } = override ?? {};
        const props = applyPropOverrides(extractedProps, propOverrides);

        const entry: ComponentEntry = {
            id: candidate.id,
            name,
            importName: name,
            importPath: `${UI_COMPONENTS_IMPORT_ROOT}/${candidate.id}`,
            category: candidate.category,
            description: primary?.description || "",
            props,
            slots: [],
            variants: {},
            allowedChildren: "any",
            examples: [],
            doNot: [],
            docsUrl: docsUrlFor(candidate.id),
            isExtracted: primary !== undefined,
            ...componentOverride,
        };
        components.push(entry);
    }

    return { components: components.sort((a, b) => a.id.localeCompare(b.id)), skipped };
}
