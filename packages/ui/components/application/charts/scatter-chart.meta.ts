/**
 * Registry override for ScatterChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape; everything here wins over
 * what react-docgen-typescript extracted from scatter-chart.tsx.
 */
export const componentMeta = {
    description:
        "Scatter and bubble chart for correlation between two numeric measures, optionally sized by a third and colored by a category. Every mark has a 24px hit target, is keyboard focusable in x order, and is mirrored in an accessible table.",
    allowedChildren: "none",
    variants: {},
    a11y: "Pass a `label` (required) naming the chart. The chart is one tab stop; any arrow key steps through points from left to right, Home/End jump to the ends, Escape closes the tooltip. Reduced motion renders the final frame immediately.",
    doNot: [
        'Do not color by more than three categories: the palette is only validated for three simultaneous hues in a scatter, so extra categories fold into "Other".',
        "Do not use a scatter for time series; use a LineChart.",
        "Do not pass a new `data` array identity on every render; memoise it or the entry animation replays.",
    ],
    examples: [
        {
            title: "Bubble by category",
            code: '<ScatterChart label="Salary vs match score" data={jobs} xKey="match" yKey="salary" sizeKey="openings" categoryKey="type" labelKey="title" />',
        },
    ],
};
