/**
 * Registry override for FunnelChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema; deliberately untyped like button.meta.ts.
 */
export const componentMeta = {
    description:
        "Funnel chart for ordered stages such as a hiring pipeline (Applied -> Screened -> Interviewed -> Offers). Stages wear the ordinal brand ramp so their order reads in the color, conversion between stages is labelled directly, every stage is keyboard focusable, and the values are mirrored in an accessible table.",
    allowedChildren: "none",
    variants: {
        orientation: ["horizontal", "vertical"],
    },
    a11y: "Renders as a labelled figure (pass `label`). Each stage is a focusable mark announced as 'Stage, value, % of previous stage'; arrow keys move between stages, Escape closes the tooltip. A screen-reader table twin is always rendered; pass showTable to show it visibly. Respects prefers-reduced-motion.",
    doNot: [
        "Do not use a funnel for categories without a natural order; use BarChart instead.",
        "Do not pass more than about 7 stages; the ordinal ramp stops reading past that.",
        "Do not omit `label`; it is the chart's accessible name.",
    ],
    examples: [
        {
            title: "Hiring pipeline",
            code: '<FunnelChart label="Hiring pipeline conversion" title="Pipeline conversion" data={[{ name: "Applied", value: 286 }, { name: "Screened", value: 112 }, { name: "Interviewed", value: 41 }, { name: "Offers", value: 5 }]} />',
        },
        { title: "Vertical with visible table", code: '<FunnelChart label="Pipeline" data={stages} orientation="vertical" showTable />' },
    ],
};
