/**
 * Registry override for Sparkline. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema; deliberately untyped like button.meta.ts.
 */
export const componentMeta = {
    description:
        "A small inline trend (line, area or bar) that fills its container's width, meant to sit under a StatTile value. It is a single decorative image to assistive technology: pass a `label` that states the trend in words. Not per-point focusable; use LineChart when readers need to inspect individual values.",
    allowedChildren: "none",
    variants: {
        variant: ["line", "area", "bar"],
    },
    a11y: "Rendered as role=img with the required `label` as its accessible name, e.g. 'Profile views trend over 12 weeks, rising'. Use describeTrend(data) to derive the direction word. Respects prefers-reduced-motion.",
    doNot: ["Do not use a Sparkline as the only place a value is shown; pair it with a StatTile value or a table.", "Do not omit `label`."],
    examples: [{ title: "Area sparkline", code: '<Sparkline data={[30, 34, 31, 40, 44, 51]} label="Profile views trend over 6 weeks, rising" />' }],
};
