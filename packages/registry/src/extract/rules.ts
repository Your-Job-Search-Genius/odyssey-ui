/**
 * The RuleSet is hand-authored, not extracted -- it encodes the hard
 * constraints from the design system plan (Section 1), not a fact about
 * the source tree. Kept as a single reviewable source of truth that both
 * `get_rules` (ds-mcp) and the /agent-rules docs page render verbatim, so
 * humans and agents read the same rules.
 */
import type { RuleSet } from "../schema.js";
import { ICONS_IMPORT_PATH, UI_COMPONENTS_IMPORT_ROOT, UI_PACKAGE_NAME } from "../schema.js";
import { buildUxPreamble, buildUxSections } from "./ux-rules.js";

export const RULE_SET_VERSION = "4.0.0";

export function buildRuleSet(): RuleSet {
    return {
        version: RULE_SET_VERSION,
        // Structural landmarks (main..aside) are allowed so generated UI can
        // satisfy the landmark/semantic rules (ARIA-07, CODE-02, KEY-10)
        // without validate_jsx rejecting the markup those rules require.
        allowedPrimitives: ["div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "main", "header", "footer", "nav", "section", "article", "aside"],
        forbiddenElements: ["input", "button", "select", "textarea", "a", "img", "form", "table", "label", "ul", "ol", "li", "iframe", "svg"],
        setupRules: [
            `UI is consumed as the published npm package ${UI_PACKAGE_NAME} (GitHub Packages). Install it in the consuming app -- never copy component source files into the app, never scaffold your own versions of these components, and never import from a repo-local "@/" path alias.`,
            `Before the first install, configure GitHub Packages auth in the consuming app's .npmrc: "@your-job-search-genius:registry=https://npm.pkg.github.com" plus "//npm.pkg.github.com/:_authToken=<GitHub token with read:packages>". Then install with your package manager, e.g. "npm install ${UI_PACKAGE_NAME}". Peer requirements: react ^19, react-dom ^19, tailwindcss ^4.`,
            `Import every component from the package specifier given by the registry's importPath, e.g. import { Button } from "${UI_COMPONENTS_IMPORT_ROOT}/base/buttons/button". Import icons from "${ICONS_IMPORT_PATH}". Code importing from "@/components/..." is rejected by validate_jsx.`,
            `In the app's global stylesheet, import the library styles: @import "${UI_PACKAGE_NAME}/styles/globals.css"; (this pulls in Tailwind v4, the design tokens, and typography). Since v1.0.1 the package declares its own @source directives, so Tailwind scans the package's classes automatically; only if pinned to 1.0.0 add @source "../node_modules/${UI_PACKAGE_NAME}"; (path relative to the CSS file) manually. Since v1.0.2 the Tailwind plugins the stylesheet loads (@tailwindcss/typography, tailwindcss-react-aria-components, tailwindcss-animate) are dependencies of the package; if pinned to <=1.0.1, install those three packages in the app manually to fix "Can't resolve" errors from the @plugin directives.`,
            `The package ships TypeScript source, and that source resolves its own internals through the "@/" alias. Map that alias to the installed package in the consuming app: tsconfig "paths": { "@/*": ["./node_modules/${UI_PACKAGE_NAME}/*"] } plus the equivalent bundler alias (Next.js: also add "${UI_PACKAGE_NAME}" to transpilePackages). Keep the app's own source on a different alias so the two never collide.`,
            `Vite apps additionally need optimizeDeps configured, because the package's TS source lives in node_modules where Vite's dependency scanner does not look: set optimizeDeps: { exclude: ["${UI_PACKAGE_NAME}"], include: ["react-aria-components", "react-aria", "react-stately", "@internationalized/date"] } in vite.config. Without this, Vite serves react-aria's ESM files unbundled and their imports of CJS-only deps fail in the browser with errors like "The requested module '/node_modules/use-sync-external-store/shim/index.js' does not provide an export named 'useSyncExternalStore'". Prefix those entries with the package ("${UI_PACKAGE_NAME} > react-aria-components") when the app does not depend on them directly.`,
            `Vite apps that already use "@/" for their own src/ must resolve "@/" per importer instead of with resolve.alias (Vite applies aliases before plugins, so an alias would send the package's own "@/" imports to src/). Add an enforce:"pre" plugin: const odysseyRoot = fs.realpathSync(path.dirname(require.resolve("${UI_PACKAGE_NAME}/package.json"))); resolveId(source, importer, options) { if (!source.startsWith("@/")) return null; const root = importer?.split("?")[0].startsWith(odysseyRoot) ? odysseyRoot : srcRoot; return this.resolve(\`\${root}/\${source.slice(2)}\`, importer, { ...options, skipSelf: true }); }. Also set resolve.dedupe: ["react", "react-dom"]. The installation docs page has the complete vite.config.`,
            `Fonts: the theme's --font-body / --font-display use var(--font-inter, "Inter"), but the package does not ship or load Inter. Load it in the app (Vite/plain HTML: a Google Fonts <link> for Inter 400/500/600/700 in index.html; Next.js: next/font/google Inter with variable "--font-inter" on <html>). Without it the UI silently falls back to system fonts.`,
            `Dark mode: the library ships no provider. Toggle the "dark-mode" class on <html> (document.documentElement.classList.toggle("dark-mode", isDark)); every token switches automatically and the theme sets CSS color-scheme so native controls follow. To avoid a light flash, apply the class from a small inline script in <head> before first paint (read a stored choice, else matchMedia("(prefers-color-scheme: dark)")). Next.js + next-themes: attribute="class" value={{ dark: "dark-mode" }}.`,
            `App setup providers: mount <Toaster /> (from ${UI_COMPONENTS_IMPORT_ROOT}/application/alerts/alert) once near the root to show toast() notifications, and wrap the app in react-aria-components' <RouterProvider navigate={...} useHref={...}> so library links (Button href, SidebarLayout items) navigate client-side. RouterProvider and I18nProvider are the only react-aria-components imports validate_jsx accepts.`,
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
            `App shells: wrap page content in SidebarLayout (${UI_COMPONENTS_IMPORT_ROOT}/application/sidebar/sidebar) -- it is the only sidebar navigation component and owns the page's <main> landmark (one per page, never nested). Top-bar navigation uses HeaderNavigationBase (${UI_COMPONENTS_IMPORT_ROOT}/application/header-navigation/header-navigation). Never assemble a sidebar or mobile nav from <aside>/<nav>/div primitives.`,
            "Code, JSON and logs go in CodeBlock (not <pre>/<code>); label/value metadata goes in DescriptionList (not a div grid or <dl>); untrusted or email HTML goes in HtmlPreview (never a raw <iframe>).",
            "These rules bind consuming apps. The library's own source uses a few internals (fractional spacing such as w-58.25, scrollbar styling) that consumers should not copy -- reach for the component instead.",
            "Call validate_jsx before presenting generated code as final.",
        ],
        uxPreamble: buildUxPreamble(),
        uxSections: buildUxSections(),
    };
}
