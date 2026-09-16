/**
 * Registry override for SunburstChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema; anything omitted falls back to what
 * react-docgen-typescript extracted from sunburst-chart.tsx.
 */
export const componentMeta = {
    description:
        "Sunburst for nested share: the inner ring is the top-level breakdown, outer rings are the children of each segment, and the centre carries the total. Hue identifies the top-level branch. Every arc is keyboard focusable and listed in a screen-reader table.",
    allowedChildren: "none",
    variants: {},
    a11y: "Pass a meaningful `label`. Arcs form a focus grid by ring: Tab enters the chart, Left/Right move around the current ring, Up/Down move between rings, Escape closes the tooltip. Each arc announces its full path, value and share. The hidden data table lists every arc (`showTable` renders it visibly).",
    doNot: [
        'Do not use a sunburst for more than about six top-level branches or three rings; it becomes unreadable. Fold the tail into an "Other" branch or use a table.',
        "Do not use it to compare close values; angular differences are hard to judge. Use a BarChart.",
        "Do not put a decorative or display typeface on the centre figure; it uses the same sans as everything else.",
    ],
    examples: [
        {
            title: "Industries and roles",
            code: '<SunburstChart label="Applications by industry and role" data={{ name: "Applications", children: [{ name: "SaaS", children: [{ name: "Frontend", value: 28 }] }] }} centerLabel="applied" />',
        },
        {
            title: "Custom centre",
            code: '<SunburstChart label="Applications by industry" data={tree} centerValue="4 sectors" centerLabel="in play" showLegend={false} />',
        },
    ],
};
