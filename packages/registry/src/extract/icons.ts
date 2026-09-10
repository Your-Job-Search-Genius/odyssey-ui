/**
 * Extracts the primary icon set from packages/ui/components/foundations/icons.
 * Scope note: payment-icons, social-icons, integration-icons, and
 * file-icons are separate, more specialized asset barrels (brand marks,
 * file-type glyphs) rather than general-purpose swappable UI icons, and
 * illustrations/background-patterns are shared assets, not icons. All are
 * left out of IconEntry[] for this pass -- search_icons only needs to
 * cover the set components actually accept via an `icon`/`iconLeading`
 * prop, which is this barrel.
 */
import fs from "node:fs";
import path from "node:path";
import type { IconEntry } from "../schema.js";
import { ICONS_IMPORT_PATH } from "../schema.js";

/**
 * icons/index.ts is a flat barrel: `export { default as Activity } from "./activity";`
 * one line per icon, in PascalCase. Parsed with a regex, not the
 * TypeScript compiler -- it is a single, uniform, generated-shape file
 * with ~1200 lines, and spinning up a full program just to read re-export
 * names would be pure overhead here (react-docgen-typescript is already
 * doing that work for actual components in extract/components.ts).
 */
const EXPORT_LINE = /^export\s*\{\s*default\s+as\s+([A-Za-z0-9_]+)\s*\}\s*from\s*["'](\.\/[^"']+)["'];?\s*$/;

function tagsFor(iconName: string): string[] {
    // Split "ArrowNarrowUpRight" -> ["arrow", "narrow", "up", "right"].
    const words = iconName
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
    return [...new Set(words)];
}

export function extractIcons(iconsIndexPath: string): IconEntry[] {
    const text = fs.readFileSync(iconsIndexPath, "utf8");
    const icons: IconEntry[] = [];

    for (const line of text.split("\n")) {
        const match = EXPORT_LINE.exec(line.trim());
        const name = match?.[1];
        if (!name) continue;
        icons.push({ name, importPath: ICONS_IMPORT_PATH, tags: tagsFor(name) });
    }

    return icons.sort((a, b) => a.name.localeCompare(b.name));
}

export function defaultIconsIndexPath(uiRoot: string): string {
    return path.join(uiRoot, "components", "foundations", "icons", "index.ts");
}
