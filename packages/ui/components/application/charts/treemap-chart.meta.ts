/**
 * Registry override for TreemapChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema; anything omitted falls back to what
 * react-docgen-typescript extracted from treemap-chart.tsx.
 */
export const componentMeta = {
    description:
        "Treemap for hierarchical share: each top-level branch takes a categorical hue and its leaves tint by value. Use it to show how a total splits across groups and items at a glance. Every tile is keyboard focusable and every leaf is listed in a screen-reader table.",
    allowedChildren: "none",
    variants: {},
    a11y: "Pass a meaningful `label`. Tiles are a single focus list: Tab enters the chart, any arrow key moves to the next or previous tile, Escape closes the tooltip. Tiles too small for an inline label still announce their name, value and share, and remain in the hidden data table (`showTable` renders it visibly).",
    doNot: [
        "Do not use a treemap to compare values that are close together; readers cannot judge small area differences. Use a BarChart instead.",
        "Do not nest more than two levels; deeper hierarchies belong in a SunburstChart or a table.",
        "Do not set explicit `color` on leaves; hue belongs to the top-level branch so identity stays consistent.",
    ],
    examples: [
        {
            title: "Two-level hierarchy",
            code: '<TreemapChart label="Matched jobs by category" data={{ name: "Jobs", children: [{ name: "Engineering", children: [{ name: "Frontend", value: 320 }] }] }} />',
        },
        {
            title: "Flat",
            code: '<TreemapChart label="Applications by location" data={{ name: "Locations", children: [{ name: "Remote", value: 128 }, { name: "London", value: 64 }] }} showShare={false} />',
        },
    ],
};
