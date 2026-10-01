import type { FC, ReactNode } from "react";

/** Lifecycle state of a node during a run. Purely display data -- `FlowCanvas` never computes it. */
export type FlowNodeStatus = "idle" | "queued" | "running" | "done" | "skipped";

/** Lifecycle state of an edge during a run. Purely display data -- `FlowCanvas` never computes it. */
export type FlowEdgeStatus = "idle" | "active" | "traversed" | "muted";

/** Smooth (clean bezier) or sketchy (hand-wobbled, Excalidraw-style) edge rendering. */
export type FlowEdgeStyle = "smooth" | "sketchy";

/** Ambient flow-dot travel speed. */
export type FlowSpeed = "slow" | "normal" | "fast";

/** The five tile colors `FeaturedIcon` supports -- every role maps onto one of these. */
export type FlowRoleColor = "brand" | "gray" | "success" | "warning" | "error";

/** A role's visual identity: the icon and color shown on its `FeaturedIcon` tile. */
export interface FlowRoleDefinition {
    /** Display name shown in the inspector's role picker and the legend. */
    label: string;
    icon: FC<{ className?: string }>;
    color: FlowRoleColor;
}

/** A registry of role ids to their definitions, e.g. `DEFAULT_FLOW_ROLES` or a `roles` prop override. */
export type FlowRoleRegistry = Record<string, FlowRoleDefinition>;

export interface FlowNode<TData = unknown> {
    /** Stable, unique id. Required for selection, deletion and controlled updates. */
    id: string;
    label: string;
    /** Short supporting text shown under the label (one line; the full text is always exposed to assistive tech). */
    description?: string;
    /**
     * Shown in a tooltip while the node is hovered or keyboard-focused, and announced as the node's
     * description -- e.g. the full condition text or a breakdown of counts.
     */
    tooltip?: ReactNode;
    /** Key into the role registry (`roles` prop merged over `DEFAULT_FLOW_ROLES`). Unknown roles fall back to a neutral tile. */
    role: string;
    /** Overrides the role's default icon for this one node. */
    icon?: FC<{ className?: string }>;
    /** Content-space position of the node's center. */
    x: number;
    y: number;
    /** Card width in content-space px. @default 224 */
    width?: number;
    /** Card height in content-space px. Taller cards give `renderNodeContent` room (e.g. count tiles). @default 84 */
    height?: number;
    /** Execution status. Defaults to `"idle"` when omitted. */
    status?: FlowNodeStatus;
    /** Arbitrary consumer data, not read by `FlowCanvas` itself. */
    data?: TData;
}

export interface FlowEdge<TEdgeData = unknown> {
    /** Stable, unique id. Required for selection, deletion and controlled updates. */
    id: string;
    /** Source node id (edge starts at this node's right/"out" handle). */
    source: string;
    /** Target node id (edge ends at this node's left/"in" handle). */
    target: string;
    /** Optional label chip rendered at the edge's midpoint. */
    label?: string;
    /** Execution status. Defaults to `"idle"` when omitted. */
    status?: FlowEdgeStatus;
    /** Arbitrary consumer data (e.g. a branch condition), not read by `FlowCanvas` itself. Kept on every update. */
    data?: TEdgeData;
}

/** Fired by `onConnect` when a user drags from one node's "out" handle onto another node. */
export interface FlowConnection {
    source: string;
    target: string;
}

/** One line in the inspector's run log. */
export interface FlowRunLogEntry {
    id: string;
    text: string;
    tone?: "default" | "success" | "muted";
}

export interface FlowPoint {
    x: number;
    y: number;
}

export interface FlowBounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export type FlowSelection = { type: "node"; id: string } | { type: "edge"; id: string } | null;
