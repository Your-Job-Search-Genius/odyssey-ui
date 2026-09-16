/**
 * Registry override for SankeyChart. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema; deliberately untyped like button.meta.ts.
 */
export const componentMeta = {
    description:
        "Sankey diagram for flows between stages, e.g. application source -> pipeline stage -> outcome. Ribbons inherit the color of the chain they started in, draw on in column order, and every ribbon is a keyboard-focusable mark with a tooltip. Values are mirrored in an accessible From/To/Value table.",
    allowedChildren: "none",
    variants: {},
    a11y: "Renders as a labelled figure (pass `label`). Each flow is focusable and announced as 'Source to Target, value'; arrow keys step through flows top to bottom, Escape closes the tooltip. The table twin is always present for assistive technology. Respects prefers-reduced-motion.",
    doNot: [
        "Do not create cycles (a node flowing back into an earlier column); d3-sankey requires a directed acyclic graph.",
        "Do not use it for fewer than two columns of nodes; a bar chart is clearer.",
        "Do not omit `label`; it is the chart's accessible name.",
    ],
    examples: [
        {
            title: "Source to outcome",
            code: '<SankeyChart label="Application flow" nodes={[{ id: "li", name: "LinkedIn" }, { id: "s", name: "Screened" }, { id: "n", name: "No reply" }]} links={[{ source: "li", target: "s", value: 46 }, { source: "li", target: "n", value: 86 }]} mutedNodes={["n"]} />',
        },
    ],
};
