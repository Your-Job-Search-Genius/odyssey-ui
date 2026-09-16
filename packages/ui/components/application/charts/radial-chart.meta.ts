/**
 * Registry override for RadialChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape; anything omitted falls
 * back to what react-docgen-typescript extracted from radial-chart.tsx.
 */
export const componentMeta = {
    description:
        "Radial progress built on d3-shape: concentric activity rings (one per item), a 240-degree gauge, or a single progress circle in four sizes. Each item is { name, value, max? } with max defaulting to 100. The track is the same hue at low opacity, arcs sweep in and centre figures count up. Every arc is keyboard focusable and the values are mirrored in an accessible data table.",
    allowedChildren: "none",
    variants: {
        variant: ["rings", "gauge", "progress"],
        size: ["xs", "sm", "md", "lg"],
    },
    a11y: "Renders a labelled figure (use `label`) with a generated description, a visually hidden data table twin (visible with showTable) and one tab stop: arrow keys move between rings, Enter/Space activates (onItemSelect), Escape closes the tooltip. Respects prefers-reduced-motion.",
    doNot: [
        "Do not put more than four rings in the rings variant; past that the inner rings become unreadable.",
        "Do not use the gauge or progress variants for more than one value; only the first item is drawn.",
        "Do not pass a status token as `color` unless the value genuinely means good/bad.",
    ],
    examples: [
        {
            title: "Activity rings",
            code: '<RadialChart label="Readiness scores" data={[{ name: "Resume score", value: 82 }, { name: "Job match", value: 67 }]} />',
        },
        { title: "Gauge", code: '<RadialChart label="Resume score" data={[{ name: "Resume score", value: 82, max: 100 }]} variant="gauge" />' },
        { title: "Progress circle", code: '<RadialChart label="Profile completeness" data={[{ name: "Profile", value: 91 }]} variant="progress" size="sm" />' },
    ],
};
