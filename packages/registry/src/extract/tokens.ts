/**
 * Extracts design tokens from packages/ui/styles/theme.css (a single
 * Tailwind v4 `@theme { ... }` block, plus a `.dark-mode { ... }`
 * override block -- there is no tailwind.config.js in this repo).
 *
 * Deliberately parses with postcss instead of a regex over lines: the
 * file mixes custom properties with `@keyframes` blocks and multi-line
 * values, and a real CSS parser is the only way to walk that reliably.
 */
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import type { TokenColorEntry, TokenSet } from "../schema.js";
import { extractColorUsageFromClaudeMd } from "./claude-md-colors.js";

/**
 * "PROPERTY COLORS" sections (BACKGROUND PROPERTY COLORS, TEXT PROPERTY
 * COLORS, ...) are Tailwind v4 plumbing: they re-publish the semantic
 * `--color-*` tokens under `--background-color-*` / `--text-color-*` /
 * etc. namespaces so `bg-*` / `text-*` utilities resolve at all. They are
 * not new tokens -- skip them so each semantic color is catalogued once,
 * under its real name.
 */
const SKIPPED_SECTIONS = new Set([
    "BACKGROUND PROPERTY COLORS",
    "TEXT PROPERTY COLORS",
    "BORDER PROPERTY COLORS",
    "RING PROPERTY COLORS",
    "OUTLINE PROPERTY COLORS",
    "LIGHT MODE VARIABLES",
    "DARK MODE VARIABLES",
]);

interface RawDecl {
    prop: string;
    value: string;
    section: string;
}

function humanizeSection(section: string): string {
    return section
        .toLowerCase()
        .split(" ")
        .map((w) => w[0]?.toUpperCase() + w.slice(1))
        .join(" ");
}

/** Walks an at-rule or rule's direct declaration children, tagging each with its nearest preceding UPPERCASE comment. */
function collectDecls(root: postcss.Container): RawDecl[] {
    const decls: RawDecl[] = [];
    let currentSection = "Uncategorized";

    root.walk((node) => {
        if (node.type === "comment") {
            const text = node.text.trim();
            if (text === text.toUpperCase() && /[A-Z]/.test(text)) {
                currentSection = text;
            }
            return;
        }
        if (node.type === "decl" && node.prop.startsWith("--")) {
            decls.push({ prop: node.prop, value: node.value, section: currentSection });
        }
    });

    return decls;
}

/** "--color-text-primary" -> "text-primary" ; "--color-brand-500" -> "brand-500" ; "--color-fg-quaternary_hover" -> "fg-quaternary_hover" */
function cssVarToClassName(cssVar: string): string | null {
    const match = /^--color-(.+)$/.exec(cssVar);
    return match?.[1] ?? null;
}

export interface ExtractTokensOptions {
    themeCssPath: string;
    claudeMdPath: string;
}

export function extractTokens({ themeCssPath, claudeMdPath }: ExtractTokensOptions): TokenSet {
    const css = fs.readFileSync(themeCssPath, "utf8");
    const root = postcss.parse(css, { from: themeCssPath });
    const usageMap = extractColorUsageFromClaudeMd(claudeMdPath);

    const themeAtRule = root.nodes.find((n) => n.type === "atrule" && n.name === "theme") as postcss.AtRule | undefined;
    // .dark-mode is nested inside `@layer base { ... }`, not a top-level
    // rule -- walkRules searches the whole tree, not just direct children.
    let darkModeRule: postcss.Rule | undefined;
    root.walkRules(".dark-mode", (rule) => {
        darkModeRule = rule;
    });

    const lightDecls = themeAtRule ? collectDecls(themeAtRule) : [];
    const darkDecls = darkModeRule ? collectDecls(darkModeRule) : [];
    const darkByProp = new Map(darkDecls.map((d) => [d.prop, d.value]));

    const colors: TokenColorEntry[] = [];
    const breakpoints: Record<string, string> = {};
    const shadows: string[] = [];
    const animationNames = new Set<string>();

    for (const decl of lightDecls) {
        if (SKIPPED_SECTIONS.has(decl.section)) continue;

        if (decl.prop.startsWith("--color-")) {
            const className = cssVarToClassName(decl.prop);
            if (!className) continue;
            const entry: TokenColorEntry = {
                cssVar: decl.prop,
                className,
                value: decl.value,
                usage: usageMap.get(className) ?? `${humanizeSection(decl.section)} token.`,
            };
            const darkValue = darkByProp.get(decl.prop);
            if (darkValue && darkValue !== decl.value) entry.darkValue = darkValue;
            colors.push(entry);
            continue;
        }

        if (decl.prop.startsWith("--breakpoint-")) {
            breakpoints[decl.prop.replace("--breakpoint-", "")] = decl.value;
            continue;
        }

        if (decl.prop.startsWith("--shadow-")) {
            shadows.push(decl.prop.replace("--shadow-", ""));
            continue;
        }

        if (decl.prop.startsWith("--animate-")) {
            animationNames.add(decl.prop.replace("--animate-", ""));
        }
    }

    // Radius: packages/ui/styles/theme.css defines no custom --radius-* scale
    // today, so Tailwind's default rounded-* scale is what's actually in
    // effect. Reported as an explicit empty array (see TokenSetSchema doc
    // comment) rather than silently omitted.
    const radius: string[] = [];

    const allowedTailwindPatterns = buildAllowedTailwindPatterns({ colors, breakpoints, shadows, radius });

    return {
        colors: colors.sort((a, b) => a.className.localeCompare(b.className)),
        breakpoints,
        shadows: shadows.sort(),
        animations: [...animationNames].sort(),
        radius,
        allowedTailwindPatterns,
    };
}

function buildAllowedTailwindPatterns({ colors, shadows }: Pick<TokenSet, "colors" | "breakpoints" | "shadows" | "radius">): string[] {
    // Two different usage shapes, per CLAUDE.md:
    // - text-* / border-* / bg-* tokens are already complete, single-utility
    //   class names (e.g. "text-primary" is used exactly as "text-primary",
    //   not "text-text-primary").
    // - fg-* tokens and the raw palette scale (brand-500, utility-blue-50,
    //   component tokens, ...) are utility-agnostic names combined with
    //   whichever prefix fits (text-fg-primary, bg-fg-primary, bg-brand-600, ...).
    const selfContained = colors.filter((c) => /^(text|border|bg)-/.test(c.className)).map((c) => escapeRegExp(c.className));
    const prefixed = colors.filter((c) => !/^(text|border|bg)-/.test(c.className)).map((c) => escapeRegExp(c.className));
    const shadowNames = shadows.map(escapeRegExp).join("|");

    const patterns: string[] = [];
    if (selfContained.length > 0) {
        patterns.push(`^(${selfContained.join("|")})$`);
        patterns.push(`^(hover|focus|focus-visible|active|disabled|dark):(${selfContained.join("|")})$`);
    }
    if (prefixed.length > 0) {
        patterns.push(`^(text|border|bg|ring|outline|stroke|fill|divide|decoration|caret|accent)-(${prefixed.join("|")})$`);
        patterns.push(`^(hover|focus|focus-visible|active|disabled|dark):(text|border|bg|ring|outline|stroke|fill)-(${prefixed.join("|")})$`);
    }

    patterns.push(
        // Tailwind's default spacing/layout/typography scales -- these are
        // Tailwind's own numeric scale (no custom override in theme.css), so
        // allow the standard fractional/integer utility shape rather than
        // enumerating every step by hand.
        "^-?(m|p)[trblxy]?-(0|px|0\\.5|1|1\\.5|2|2\\.5|3|3\\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$",
        "^m[trblxy]?-auto$",
        "^gap(-x|-y)?-(0|px|0\\.5|1|1\\.5|2|2\\.5|3|3\\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$",
        "^space-(x|y)-(0|px|0\\.5|1|1\\.5|2|2\\.5|3|3\\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$",
        "^(w|h|size)-(0|px|full|screen|dvh|svh|lvh|dvw|svw|auto|min|max|fit|1\\/2|1\\/3|2\\/3|1\\/4|2\\/4|3\\/4|0\\.5|1|1\\.5|2|2\\.5|3|3\\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$",
        // Min/max sizing -- required for standard responsive layouts
        // (min-h-screen page shells, max-w-md centered cards, ...).
        "^(min-w|min-h|max-w|max-h)-(0|px|full|screen|dvh|svh|lvh|dvw|svw|none|min|max|fit|3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|0\\.5|1|1\\.5|2|2\\.5|3|3\\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$",
        "^rounded(-[tlbr]{1,2})?(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$",
        // Border/divide *width* utilities -- the matching border-*/divide-*
        // color classes are already covered by the color patterns above.
        "^border(-[trblxy])?(-0|-2|-4|-8)?$",
        "^divide-(x|y)(-0|-2|-4|-8)?$",
        "^text-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl)$",
        "^font-(normal|medium|semibold|bold)$",
        "^leading-(none|tight|snug|normal|relaxed|loose|3|4|5|6|7|8|9|10)$",
        "^tracking-(tighter|tight|normal|wide|wider|widest)$",
        "^(uppercase|lowercase|capitalize|normal-case)$",
        "^aspect-(auto|square|video)$",
        `^shadow(-(${shadowNames}))?$`,
        // Display / flex / grid layout -- Tailwind's own utility set, not a
        // token scale, so allowed broadly rather than enumerated by value.
        "^(flex|grid|inline-flex|inline-grid|block|inline-block|inline|hidden|contents|table|table-row|table-cell)$",
        "^flex-(row|row-reverse|col|col-reverse|wrap|wrap-reverse|nowrap|1|auto|initial|none)$",
        "^(grow|shrink)(-0)?$",
        "^basis-(0|auto|full|1\\/2|1\\/3|2\\/3|1\\/4|3\\/4)$",
        "^(items|justify|content|self)-(start|end|center|between|around|evenly|stretch|baseline)$",
        "^justify-(self)-(start|end|center|stretch)$",
        "^(grid-cols|grid-rows|col-span|row-span)-([1-9]|1[0-2]|full)$",
        // Position / overflow / visibility / z-index / whitespace -- same
        // reasoning: Tailwind's own scale, not a design token.
        "^(relative|absolute|fixed|sticky|static)$",
        "^(top|right|bottom|left|inset)(-x|-y)?-(0|px|auto|1\\/2|full|0\\.5|1|1\\.5|2|2\\.5|3|3\\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$",
        "^overflow(-x|-y)?-(auto|hidden|visible|scroll|clip)$",
        "^(visible|invisible|collapse)$",
        "^z-(0|10|20|30|40|50|auto)$",
        "^whitespace-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)$",
        "^truncate$",
        "^(text|break)-(left|center|right|justify|ellipsis|clip|all|words|normal)$",
        // Interaction / transform / transition -- widely used across
        // components (buttons, spinners, tooltips) for state changes, not
        // arbitrary styling.
        "^(cursor-pointer|cursor-not-allowed|cursor-default|pointer-events-none|pointer-events-auto)$",
        "^outline(-none|-hidden|-dashed|-dotted|-\\d)?$",
        "^outline-offset-(0|1|2|4|8)$",
        "^ring(-0|-1|-2|-4|-8|-inset)?$",
        "^transition(-none|-all|-colors|-opacity|-shadow|-transform)?$",
        "^duration-(75|100|150|200|300|500|700|1000)$",
        "^ease-(linear|in|out|in-out)$",
        "^animate-(none|spin|ping|pulse|bounce)$",
        "^-?(translate|scale|rotate)-(x-|y-)?(0|1\\/2|1\\/4|3\\/4|full|1|2|3|6|12|45|90|180)$",
        "^opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$",
        "^origin-(center|top|bottom|left|right|top-left|top-right|bottom-left|bottom-right)$",
    );

    return patterns;
}

function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function defaultThemeCssPath(uiRoot: string): string {
    return path.join(uiRoot, "styles", "theme.css");
}
