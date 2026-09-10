/**
 * The RuleSet is hand-authored, not extracted -- it encodes the hard
 * constraints from the design system plan (Section 1), not a fact about
 * the source tree. Kept as a single reviewable source of truth that both
 * `get_rules` (ds-mcp) and the /agent-rules docs page render verbatim, so
 * humans and agents read the same rules.
 */
import type { RuleSet } from "../schema.js";

export const RULE_SET_VERSION = "1.0.0";

export function buildRuleSet(): RuleSet {
    return {
        version: RULE_SET_VERSION,
        allowedPrimitives: ["div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6"],
        forbiddenElements: ["input", "button", "select", "textarea", "a", "img", "form", "table", "label", "ul", "ol", "li", "iframe", "svg"],
        styleRules: [
            "className may only use Tailwind utility classes that resolve to a design token (see get_tokens) -- spacing, color, radius, typography, layout.",
            "No arbitrary Tailwind values (e.g. bg-[#ff0000], w-[13px]). If the design needs a value outside the token scale, use the closest token and say so.",
            "No inline style={{...}} props.",
            "No CSS-in-JS, no <style> tags, no new CSS files, no new CSS custom properties.",
            "Colors must come from the documented semantic classes (text-primary, bg-secondary, border-brand, etc.), never a raw Tailwind palette color like bg-blue-700 or text-gray-900.",
        ],
        compositionRules: [
            "Only components exported from @your-job-search-genius/odyssey-ui (imported via @/components/...) and the allowed HTML primitives may appear in generated UI.",
            "If the user asks for something with no matching approved component (e.g. a raw <input>), use the closest library component (e.g. Input) -- never fall back to the raw HTML element.",
            "If no approved component or icon matches the request at all, say so explicitly and offer the closest available alternative. Never invent a component, prop, or icon that is not in the registry.",
            "Compound components must respect their documented parent/child nesting (e.g. Select.Item only inside Select / Select.ComboBox).",
            "Icons must come from search_icons / get_tokens results only.",
            "Call validate_jsx before presenting generated code as final.",
        ],
    };
}
