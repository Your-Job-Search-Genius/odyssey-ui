/**
 * Registry override for FlowCanvas. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape; anything omitted falls
 * back to what react-docgen-typescript extracted from flow-canvas.tsx.
 */
export const componentMeta = {
    description:
        "Interactive node/edge diagram editor -- pipelines, workflows, decision trees, execution graphs -- with pan/zoom, drag-to-connect authoring, an extensible role registry, and consumer-driven run-status visualization. Nodes render as real HTML (glass cards, FeaturedIcon role tiles); edges are SVG bezier splines with a smooth or hand-wobbled 'sketchy' style.",
    allowedChildren: "none",
    variants: {
        edgeStyle: ["smooth", "sketchy"],
        speed: ["slow", "normal", "fast"],
    },
    a11y: "The canvas is one tab stop; Tab/Shift+Tab move a roving focus between nodes, arrow keys nudge the focused node's position (Shift for a larger step), Delete/Backspace removes the selection, Escape clears it, +/-/0 zoom and fit the view. Every mutating action is announced via a polite live region. Role and status are never color-only -- an icon and text label always pair with the color. Ambient motion respects prefers-reduced-motion.",
    doNot: [
        "Do not pass a new `nodes`/`edges` array identity on every render if you can avoid it -- memoise external data before handing it to FlowCanvas.",
        "Do not ship a fake execution-order simulator in production code; `status` is controlled display data -- drive it from a real backend/websocket/state machine, the same way the 'Run simulation' example's local fixture hook does.",
        "Do not render more than roughly 150-200 nodes at once -- nodes are real, non-virtualized HTML elements (needed for backdrop-blur, wrapped text and focus). Cluster or paginate larger graphs before handing them to FlowCanvas.",
        "Do not reach for sketchy mode in dense production dashboards -- it reads as a whiteboard/ideation aesthetic, not a data-density one.",
        "Do not add a second theme switcher inside `toolbarExtra` if the host app already has one -- FlowCanvas has no theme provider of its own by design.",
    ],
    examples: [
        {
            title: "Uncontrolled, full chrome",
            code: "<FlowCanvas defaultNodes={nodes} defaultEdges={edges} />",
        },
        {
            title: "Controlled state",
            code: "<FlowCanvas nodes={nodes} onNodesChange={setNodes} edges={edges} onEdgesChange={setEdges} selectedId={selectedId} onSelectedIdChange={setSelectedId} />",
        },
        {
            title: "Read-only summary embed",
            code: "<FlowCanvas defaultNodes={nodes} defaultEdges={edges} isReadOnly showToolbar={false} showMinimap={false} showInspector={false} />",
        },
        {
            title: "Custom role",
            code: '<FlowCanvas defaultNodes={nodes} defaultEdges={edges} roles={{ validation: { label: "Validation", icon: ShieldTick, color: "success" } }} />',
        },
    ],
};
