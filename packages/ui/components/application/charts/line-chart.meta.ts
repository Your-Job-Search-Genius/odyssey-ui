/**
 * Registry override for LineChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape; anything omitted falls
 * back to what react-docgen-typescript extracted from line-chart.tsx.
 */
export const componentMeta = {
    description:
        "Line, area and stacked-area chart for change over time, built on d3-scale/d3-shape. Every point is keyboard-focusable (roving tabindex, arrow keys), the tooltip lists every series at the focused x, and an accessible data table mirrors the plot. Series colors come from the fixed chart-1..chart-8 token order.",
    allowedChildren: "none",
    variants: {
        variant: ["line", "area", "stacked-area"],
        curve: ["monotone", "linear", "step"],
    },
    a11y: "Pass a meaningful `label` (the figure's accessible name). The chart is one tab stop; Left/Right move between points, Up/Down between series, Home/End jump to the ends, Escape closes the tooltip. Every value is also in a visually hidden table (set `showTable` to render it visibly). Motion is disabled automatically under prefers-reduced-motion.",
    doNot: [
        "Do not plot more than 8 series; fold the tail into an 'Other' series instead of cycling colors.",
        "Do not use two y-axes; index the series to a common base or split into two charts.",
        "Do not pass a new `data` array on every render (memoise it) -- a new identity replays the transition.",
        "Do not color the labels or legend text with the series color; text always wears text tokens.",
    ],
    examples: [
        {
            title: "Multi-series line",
            code: '<LineChart label="Applications by week" data={rows} xKey="week" series={[{ key: "applications", name: "Applications" }, { key: "responses", name: "Responses" }]} />',
        },
        {
            title: "Single-series area with dots",
            code: '<LineChart label="Applications sent" data={rows} xKey="week" series={[{ key: "applications" }]} variant="area" showDots />',
        },
        {
            title: "Stacked area with bottom legend",
            code: '<LineChart label="Applications by source" data={rows} xKey="week" series={sources} variant="stacked-area" legendPosition="bottom" />',
        },
    ],
};
