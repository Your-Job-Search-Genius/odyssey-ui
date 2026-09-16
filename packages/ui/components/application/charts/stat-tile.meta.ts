/**
 * Registry override for StatTile. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema; deliberately untyped like button.meta.ts.
 *
 * The same file also exports StatTileGroup, a responsive card grid that
 * lays out several StatTiles side by side (2-4 columns on large screens).
 */
export const componentMeta = {
    description:
        "The form to use when the story is one number: a label, a hero value that counts up on entry, an optional signed delta colored by whether the change is good, and an optional sparkline trend. Wrap several in StatTileGroup (same module) for a KPI row.",
    allowedChildren: "none",
    variants: {
        size: ["sm", "md", "lg"],
    },
    a11y: "Renders as a labelled group; the final value and delta are readable as text (the counting animation is aria-hidden). Delta direction is conveyed by an icon and sign, never color alone. Respects prefers-reduced-motion.",
    doNot: [
        "Do not use tabular-nums on the hero value; it uses proportional figures by design.",
        "Do not use a one-bar bar chart or a two-slice pie for a single number; use StatTile.",
        "Do not set delta.isPositive by direction alone for metrics where down is good (e.g. time to hire); pass isPositive explicitly.",
    ],
    examples: [
        { title: "Basic", code: '<StatTile label="Profile views" value={1284} delta={{ value: "+12.4%", direction: "up", caption: "vs last month" }} />' },
        {
            title: "With trend",
            code: '<StatTile label="Applications sent" value={286} delta={{ value: "+8.1%", direction: "up" }} trend={[18, 22, 20, 26, 24, 31]} />',
        },
        {
            title: "KPI row",
            code: '<StatTileGroup><StatTile label="Views" value={1284} /><StatTile label="Applications" value={286} /><StatTile label="Response rate" value="31%" /></StatTileGroup>',
        },
    ],
};
