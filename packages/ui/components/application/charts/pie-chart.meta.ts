/**
 * Registry override for PieChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape; anything omitted falls
 * back to what react-docgen-typescript extracted from pie-chart.tsx.
 */
export const componentMeta = {
    description:
        "Pie or donut chart for part-to-whole at a glance, built on d3-shape. Slices beyond maxSlices fold into a single Other slice, every slice is keyboard focusable with a tooltip, and the values are mirrored in an accessible data table. Pass a memoised data array of { name, value }.",
    allowedChildren: "none",
    variants: {
        legendPosition: ["right", "bottom"],
    },
    a11y: "Renders a labelled figure (use `label`) with a generated description, a visually hidden data table twin (visible with showTable) and one tab stop: arrow keys move between slices, Home/End jump to the first/last slice, Enter/Space activates (onSliceSelect), Escape closes the tooltip. Respects prefers-reduced-motion.",
    doNot: [
        "Do not use a pie or donut to compare close values; use a BarChart so lengths can be read.",
        "Do not show more than six slices; leave maxSlices at its default so the tail folds into Other.",
        "Do not use a two-slice pie for a single figure; use a StatTile or RadialChart instead.",
        "Do not set slice colors to status tokens unless the slice genuinely means good/bad.",
    ],
    examples: [
        { title: "Donut", code: '<PieChart label="Applications by source" title="Applications by source" data={sources} />' },
        { title: "Pie", code: '<PieChart label="Applications by source" data={sources} innerRadius={0} />' },
        { title: "Custom centre", code: '<PieChart label="Applications by source" data={sources} centerValue={286} centerLabel="applications" />' },
    ],
};
