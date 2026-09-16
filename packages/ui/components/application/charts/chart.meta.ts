/**
 * Registry override for the Chart root. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape.
 */
export const componentMeta = {
    description:
        "The shared frame every Odyssey chart renders into: measures its container, owns the tooltip, legend, live region and accessible data-table twin, and exposes size and helpers through useChartContext. Use it only to build a custom chart type; for everyday charts use LineChart, BarChart, PieChart, etc.",
    allowedChildren: "none",
    a11y: "Renders a <figure> with `label` as its accessible name and `description` as its figcaption. Marks inside must use useChartFocus so they become a single tab stop with arrow-key navigation. The `table` prop is rendered visually hidden (or visibly with `showTable`) so every value is reachable without a pointer.",
    doNot: [
        "Do not use Chart directly for standard chart types -- use the dedicated chart components, which already wire focus, tooltips and tables.",
        "Do not render HTML inside the render prop; it returns SVG content only.",
    ],
    examples: [
        {
            title: "Custom chart skeleton",
            code: '<Chart label="Custom" height={200} table={{ columns: ["Name", "Value"], rows }}>{({ width, height }) => <g>{/* SVG marks */}</g>}</Chart>',
        },
    ],
};
