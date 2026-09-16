/**
 * Registry override for HeatmapChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema; anything omitted falls back to what
 * react-docgen-typescript extracted from heatmap-chart.tsx.
 */
export const componentMeta = {
    description:
        "Heatmap / calendar heatmap for density across two categorical axes (e.g. activity per weekday over weeks, or a skill-by-role matrix). Sequential brand ramp for magnitude, or a diverging orange/brand scale for change around zero. Every cell is keyboard focusable and the full matrix is mirrored in a screen-reader table.",
    allowedChildren: "none",
    variants: {
        colorScale: ["sequential", "diverging"],
    },
    a11y: "Pass a meaningful `label`. Cells form a focus grid: Tab enters the chart, arrow keys move between cells, Escape closes the tooltip. Cells with no data are announced as such. Values that do not fit inside a cell remain reachable through the tooltip and the hidden data table; pass `showTable` to render that table visibly.",
    doNot: [
        'Do not use a rainbow or multi-hue scale for magnitude; keep `colorScale="sequential"` for how-much questions and `"diverging"` only for values around a meaningful zero.',
        "Do not pass more than ~40 columns without `xTickEvery`; labels are thinned automatically but the cells become too small to read.",
        "Do not encode categories that have no order on the sequential ramp; use a BarChart for nominal comparisons.",
    ],
    examples: [
        {
            title: "Calendar heatmap",
            code: '<HeatmapChart label="Activity per day" data={cells} xDomain={weeks} yDomain={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} xTickEvery={4} />',
        },
        {
            title: "Matrix with values",
            code: '<HeatmapChart label="Skill demand by role" data={cells} showValues valueFormatter={(v) => `${v}%`} />',
        },
        {
            title: "Diverging change",
            code: '<HeatmapChart label="Change vs previous week" data={cells} colorScale="diverging" showValues />',
        },
    ],
};
