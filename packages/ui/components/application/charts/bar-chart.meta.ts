/**
 * Registry override for BarChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape; anything omitted falls
 * back to what react-docgen-typescript extracted from bar-chart.tsx.
 */
export const componentMeta = {
    description:
        "Grouped, stacked, horizontal and diverging bar chart for comparing magnitudes across categories. Built on d3; every bar is keyboard-focusable, the tooltip lists every series, and the full dataset is mirrored in an accessible table. Pass memoised data: a new array identity replays the transition.",
    allowedChildren: "none",
    variants: {
        orientation: ["vertical", "horizontal"],
        mode: ["grouped", "stacked", "diverging"],
    },
    a11y: "Renders a figure named by `label` with a generated description. The chart is one tab stop; arrow keys move between bars (Left/Right across categories, Up/Down across series), Home/End jump to the ends, Escape closes the tooltip, Enter/Space call onBarSelect. Every value is also in a visually hidden table (set showTable to display it). Animations respect prefers-reduced-motion.",
    doNot: [
        'Do not color nominal categories by their value (a value ramp) -- one series takes one color; use mode="diverging" only for signed values around a baseline.',
        "Do not pass more than 8 series; fold the tail into an 'Other' series instead of generating extra colors.",
        "Do not use a bar chart for a single value -- use StatTile.",
        "Do not omit `label`; it is the chart's accessible name.",
    ],
    examples: [
        {
            title: "Single series",
            code: '<BarChart label="Applications per month" data={months} xKey="month" series={[{ key: "applications", name: "Applications" }]} />',
        },
        {
            title: "Stacked",
            code: '<BarChart label="Pipeline by week" data={weeks} xKey="week" mode="stacked" series={[{ key: "applied", name: "Applied" }, { key: "interview", name: "Interview" }]} />',
        },
        {
            title: "Horizontal ranking with values",
            code: '<BarChart label="Skills in demand" data={skills} xKey="skill" orientation="horizontal" showValues series={[{ key: "posts", name: "Job posts" }]} />',
        },
        {
            title: "Diverging",
            code: '<BarChart label="Score vs benchmark" data={deltas} xKey="skill" orientation="horizontal" mode="diverging" showValues series={[{ key: "delta", name: "vs benchmark" }]} />',
        },
    ],
};
