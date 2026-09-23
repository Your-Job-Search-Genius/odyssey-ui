import type { FlowBounds, FlowEdgeStatus, FlowNode, FlowNodeStatus, FlowPoint, FlowRoleDefinition, FlowRoleRegistry, FlowSpeed } from "./flow-canvas-types";

/** Node card size in content-space px. Fixed -- every node is the same size. */
export const NODE_WIDTH = 224;
export const NODE_HEIGHT = 84;

export const DEFAULT_GRID_SIZE = 24;

/** `--flow-duration` values for each ambient-animation speed preset. */
export const SPEED_DURATIONS: Record<FlowSpeed, string> = {
    slow: "4.4s",
    normal: "2.4s",
    fast: "1.1s",
};

export function snapValue(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize;
}

/** The right/"out" connection point of a node, in content-space. */
export function nodeOutAnchor(node: Pick<FlowNode, "x" | "y">): FlowPoint {
    return { x: node.x + NODE_WIDTH / 2, y: node.y };
}

/** The left/"in" connection point of a node, in content-space. */
export function nodeInAnchor(node: Pick<FlowNode, "x" | "y">): FlowPoint {
    return { x: node.x - NODE_WIDTH / 2, y: node.y };
}

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * A cubic-bezier path between two content-space anchors. Control points are offset
 * horizontally, proportional to the distance between the points (minimum 48px so
 * short edges still read as curved rather than straight).
 */
export function buildEdgePath(source: FlowPoint, target: FlowPoint): { d: string; mid: FlowPoint } {
    const offset = Math.max(Math.abs(target.x - source.x) * 0.5, 48);
    const c1 = { x: source.x + offset, y: source.y };
    const c2 = { x: target.x - offset, y: target.y };
    const d = `M ${round(source.x)} ${round(source.y)} C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(target.x)} ${round(target.y)}`;
    // Cubic bezier midpoint at t=0.5: B(0.5) = (P0 + 3*C1 + 3*C2 + P3) / 8.
    const mid = { x: (source.x + 3 * c1.x + 3 * c2.x + target.x) / 8, y: (source.y + 3 * c1.y + 3 * c2.y + target.y) / 8 };
    return { d, mid };
}

export function nodeBounds(node: Pick<FlowNode, "x" | "y">): FlowBounds {
    return { minX: node.x - NODE_WIDTH / 2, minY: node.y - NODE_HEIGHT / 2, maxX: node.x + NODE_WIDTH / 2, maxY: node.y + NODE_HEIGHT / 2 };
}

const FALLBACK_BOUNDS: FlowBounds = { minX: 0, minY: 0, maxX: 800, maxY: 400 };

/** The bounding box of every node, or a fixed fallback box when there are none. */
export function graphBounds(nodes: readonly Pick<FlowNode, "x" | "y">[]): FlowBounds {
    if (nodes.length === 0) return FALLBACK_BOUNDS;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of nodes) {
        const bounds = nodeBounds(node);
        minX = Math.min(minX, bounds.minX);
        minY = Math.min(minY, bounds.minY);
        maxX = Math.max(maxX, bounds.maxX);
        maxY = Math.max(maxY, bounds.maxY);
    }
    return { minX, minY, maxX, maxY };
}

/** Merges a partial `roles` override (per key) over the default registry, keeping every unspecified field. */
export function mergeRoles(overrides: Record<string, Partial<FlowRoleDefinition>> | undefined, defaults: FlowRoleRegistry): FlowRoleRegistry {
    if (!overrides) return defaults;
    const merged: FlowRoleRegistry = { ...defaults };
    for (const [key, value] of Object.entries(overrides)) {
        const base = merged[key] ?? defaults[key];
        merged[key] = {
            label: value.label ?? base?.label ?? key,
            icon: value.icon ?? base?.icon,
            color: value.color ?? base?.color ?? "gray",
        } as FlowRoleDefinition;
    }
    return merged;
}

export const NODE_STATUS_LABEL: Record<FlowNodeStatus, string> = {
    idle: "Idle",
    queued: "Queued",
    running: "Running",
    done: "Done",
    skipped: "Skipped",
};

export function nodeStatusOf(status: FlowNodeStatus | undefined): FlowNodeStatus {
    return status ?? "idle";
}

export function edgeStatusOf(status: FlowEdgeStatus | undefined): FlowEdgeStatus {
    return status ?? "idle";
}
