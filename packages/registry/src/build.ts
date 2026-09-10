#!/usr/bin/env tsx
/**
 * Regenerates dist/registry.json (plus dist/tokens.json and
 * dist/icons.json as standalone convenience copies) from the real
 * packages/ui source. This is the registry's single write path -- ds-mcp,
 * the docs agent-rules page, and the playground only ever read the
 * output, never re-derive it.
 *
 * Run via `pnpm run registry:build` from the repo root (also what CI's
 * drift check calls before diffing dist/registry.json against what's
 * committed -- see .github/workflows/ci.yml).
 */
import fs from "node:fs";
import path from "node:path";
import { extractComponents } from "./extract/components.js";
import { defaultIconsIndexPath, extractIcons } from "./extract/icons.js";
import { buildRuleSet } from "./extract/rules.js";
import { defaultThemeCssPath, extractTokens } from "./extract/tokens.js";
import type { Registry } from "./schema.js";
import { RegistrySchema, UI_COMPONENTS_IMPORT_ROOT, UI_PACKAGE_NAME } from "./schema.js";

const SCRIPT_DIR = import.meta.dirname;
const PACKAGES_ROOT = path.join(SCRIPT_DIR, "..", "..");
const REPO_ROOT = path.join(PACKAGES_ROOT, "..");
const UI_ROOT = path.join(PACKAGES_ROOT, "ui");
const COMPONENTS_ROOT = path.join(UI_ROOT, "components");
const DIST_DIR = path.join(SCRIPT_DIR, "..", "dist");

function readLibraryVersion(): string {
    const pkg = JSON.parse(fs.readFileSync(path.join(UI_ROOT, "package.json"), "utf8")) as { version: string };
    return pkg.version;
}

/**
 * Deterministic, not wall-clock: two builds from the same source produce
 * byte-identical output (required for the CI drift check to be
 * meaningful -- a timestamp would make every build "differ").
 * Stamped from the library version + a content hash instead of Date.now().
 */
function deterministicGeneratedAt(version: string, componentCount: number, tokenCount: number, iconCount: number): string {
    return `library@${version}+components:${componentCount}+tokens:${tokenCount}+icons:${iconCount}`;
}

async function main() {
    const libraryVersion = readLibraryVersion();

    const { components, skipped } = await extractComponents({
        componentsRoot: COMPONENTS_ROOT,
        uiTsconfigPath: path.join(UI_ROOT, "tsconfig.json"),
        docsUrlFor: (id) => `/docs/${id}`,
    });

    const tokens = extractTokens({
        themeCssPath: defaultThemeCssPath(UI_ROOT),
        claudeMdPath: path.join(REPO_ROOT, "CLAUDE.md"),
    });

    const icons = extractIcons(defaultIconsIndexPath(UI_ROOT));
    const rules = buildRuleSet();

    const registry: Registry = {
        version: libraryVersion,
        generatedAt: deterministicGeneratedAt(libraryVersion, components.length, tokens.colors.length, icons.length),
        library: {
            packageName: UI_PACKAGE_NAME,
            importPath: UI_COMPONENTS_IMPORT_ROOT,
        },
        components,
        tokens,
        icons,
        rules,
    };

    const parsed = RegistrySchema.safeParse(registry);
    if (!parsed.success) {
        console.error("[registry:build] registry failed schema validation:");
        console.error(parsed.error.format());
        process.exit(1);
    }

    fs.mkdirSync(DIST_DIR, { recursive: true });
    fs.writeFileSync(path.join(DIST_DIR, "registry.json"), `${JSON.stringify(parsed.data, null, 2)}\n`);
    fs.writeFileSync(path.join(DIST_DIR, "tokens.json"), `${JSON.stringify(parsed.data.tokens, null, 2)}\n`);
    fs.writeFileSync(path.join(DIST_DIR, "icons.json"), `${JSON.stringify(parsed.data.icons, null, 2)}\n`);

    console.log(
        `[registry:build] ${components.length} components (${skipped.length} skipped, no docgen result and no *.meta.ts), ${tokens.colors.length} color tokens, ${icons.length} icons.`,
    );
    if (skipped.length > 0) {
        console.log(`[registry:build] skipped: ${skipped.join(", ")}`);
    }
}

main().catch((error) => {
    console.error("[registry:build] failed:", error);
    process.exit(1);
});
