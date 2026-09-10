/**
 * The RuleSet is hand-authored, not extracted -- it encodes the hard
 * constraints from the design system plan (Section 1), not a fact about
 * the source tree. Kept as a single reviewable source of truth that both
 * `get_rules` (ds-mcp) and the /agent-rules docs page render verbatim, so
 * humans and agents read the same rules.
 */
import type { RuleSet } from "../schema.js";
import { ICONS_IMPORT_PATH, UI_COMPONENTS_IMPORT_ROOT, UI_PACKAGE_NAME } from "../schema.js";

export const RULE_SET_VERSION = "2.0.0";

export function buildRuleSet(): RuleSet {
    return {
        version: RULE_SET_VERSION,
        allowedPrimitives: ["div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6"],
        forbiddenElements: ["input", "button", "select", "textarea", "a", "img", "form", "table", "label", "ul", "ol", "li", "iframe", "svg"],
        setupRules: [
            `UI is consumed as the published npm package ${UI_PACKAGE_NAME} (GitHub Packages). Install it in the consuming app -- never copy component source files into the app, never scaffold your own versions of these components, and never import from a repo-local "@/" path alias.`,
            `Before the first install, configure GitHub Packages auth in the consuming app's .npmrc: "@your-job-search-genius:registry=https://npm.pkg.github.com" plus "//npm.pkg.github.com/:_authToken=<GitHub token with read:packages>". Then install with your package manager, e.g. "npm install ${UI_PACKAGE_NAME}". Peer requirements: react ^19, react-dom ^19, tailwindcss ^4.`,
            `Import every component from the package specifier given by the registry's importPath, e.g. import { Button } from "${UI_COMPONENTS_IMPORT_ROOT}/base/buttons/button". Import icons from "${ICONS_IMPORT_PATH}". Code importing from "@/components/..." is rejected by validate_jsx.`,
            `In the app's global stylesheet, import the library styles: @import "${UI_PACKAGE_NAME}/styles/globals.css"; (this pulls in Tailwind v4, the design tokens, and typography). Since v1.0.1 the package declares its own @source directives, so Tailwind scans the package's classes automatically; only if pinned to 1.0.0 add @source "../node_modules/${UI_PACKAGE_NAME}"; (path relative to the CSS file) manually.`,
            `The package ships TypeScript source, and that source resolves its own internals through the "@/" alias. Map that alias to the installed package in the consuming app: tsconfig "paths": { "@/*": ["./node_modules/${UI_PACKAGE_NAME}/*"] } plus the equivalent bundler alias (Next.js: also add "${UI_PACKAGE_NAME}" to transpilePackages). Keep the app's own source on a different alias so the two never collide.`,
        ],
        styleRules: [
            "className may only use Tailwind utility classes that resolve to a design token (see get_tokens) -- spacing, color, radius, typography, layout.",
            "No arbitrary Tailwind values (e.g. bg-[#ff0000], w-[13px]). If the design needs a value outside the token scale, use the closest token and say so.",
            "No inline style={{...}} props.",
            "No CSS-in-JS, no <style> tags, no new CSS files, no new CSS custom properties.",
            "Colors must come from the documented semantic classes (text-primary, bg-secondary, border-brand, etc.), never a raw Tailwind palette color like bg-blue-700 or text-gray-900.",
        ],
        compositionRules: [
            `Only components exported from ${UI_PACKAGE_NAME} (imported from ${UI_COMPONENTS_IMPORT_ROOT}/...) and the allowed HTML primitives may appear in generated UI.`,
            "If the user asks for something with no matching approved component (e.g. a raw <input>), use the closest library component (e.g. Input) -- never fall back to the raw HTML element.",
            "If no approved component or icon matches the request at all, say so explicitly and offer the closest available alternative. Never invent a component, prop, or icon that is not in the registry.",
            "Compound components must respect their documented parent/child nesting (e.g. Select.Item only inside Select / Select.ComboBox).",
            "Icons must come from search_icons / get_tokens results only.",
            "Call validate_jsx before presenting generated code as final.",
        ],
    };
}
