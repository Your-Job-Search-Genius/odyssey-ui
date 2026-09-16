/**
 * Registry override for RadarChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape; everything here wins over
 * what react-docgen-typescript extracted from radar-chart.tsx.
 */
export const componentMeta = {
    description:
        "Radar (spider) chart comparing a profile across several dimensions, e.g. a candidate's skills against a role requirement. Built on d3-scale; every vertex is keyboard focusable and the values are mirrored in an accessible table.",
    allowedChildren: "none",
    variants: {},
    a11y: "Pass a `label` (required) naming the chart. The chart is one tab stop; Left/Right move between axes, Up/Down between series, Home/End jump to the first/last axis, Escape closes the tooltip. Reduced motion renders the final frame immediately.",
    doNot: [
        "Do not plot more than two or three series: overlapping polygons stop being readable.",
        "Do not use a radar chart to compare precise values; use a BarChart for that.",
        "Do not pass a new `data` array identity on every render; memoise it or the entry animation replays.",
    ],
    examples: [
        {
            title: "You vs role requirement",
            code: '<RadarChart label="Skills match" data={skills} axisKey="axis" series={[{ key: "role", name: "Role requirement" }, { key: "you", name: "You" }]} max={100} />',
        },
    ],
};
