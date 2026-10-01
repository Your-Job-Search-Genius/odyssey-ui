import type {
    FlowBounds,
    FlowEdgeStatus,
    FlowNode,
    FlowNodeStatus,
    FlowPoint,
    FlowPort,
    FlowRoleDefinition,
    FlowRoleRegistry,
    FlowSpeed,
} from "./flow-canvas-types";

/** Default node card size in content-space px; a node can override it with `width` / `height`. */
export const NODE_WIDTH = 224;
export const NODE_HEIGHT = 84;

type SizedPoint = Pick<FlowNode, "x" | "y" | "width" | "height" | "inputs" | "outputs">;

/** A node's card size, falling back to the defaults. */
export function nodeSize(node: Pick<FlowNode, "width" | "height">): { width: number; height: number } {
    return { width: node.width && node.width > 0 ? node.width : NODE_WIDTH, height: node.height && node.height > 0 ? node.height : NODE_HEIGHT };
}

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

/** Vertical offset of a port's handle from the node's center: ports are spread evenly down the edge. */
export function portOffsetY(node: Pick<FlowNode, "height">, ports: readonly FlowPort[] | undefined, portId: string | undefined): number {
    if (!ports?.length) return 0;
    const index = Math.max(
        0,
        ports.findIndex((port) => port.id === portId),
    );
    const { height } = nodeSize(node);
    return -height / 2 + (height * (index + 1)) / (ports.length + 1);
}

/** The port a connection resolves to: the given id when the node has it, else the first named port, else none. */
export function resolvePortId(ports: readonly FlowPort[] | undefined, portId: string | undefined): string | undefined {
    if (!ports?.length) return undefined;
    return ports.some((port) => port.id === portId) ? portId : ports[0].id;
}

/** A port's display label (its `label`, else its id), or undefined for the default port. */
export function portLabel(ports: readonly FlowPort[] | undefined, portId: string | undefined): string | undefined {
    if (!ports?.length || !portId) return undefined;
    const port = ports.find((p) => p.id === portId);
    return port ? (port.label ?? port.id) : undefined;
}

/** The right/"out" connection point of a node (or of one of its named outputs), in content-space. */
export function nodeOutAnchor(node: SizedPoint, portId?: string): FlowPoint {
    return { x: node.x + nodeSize(node).width / 2, y: node.y + portOffsetY(node, node.outputs, portId) };
}

/** The left/"in" connection point of a node (or of one of its named inputs), in content-space. */
export function nodeInAnchor(node: SizedPoint, portId?: string): FlowPoint {
    return { x: node.x - nodeSize(node).width / 2, y: node.y + portOffsetY(node, node.inputs, portId) };
}

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * A cubic-bezier path between two content-space anchors. Control points are offset
 * horizontally, proportional to the distance between the points (minimum 48px so
 * short edges still read as curved rather than straight).
 */
export interface EdgePathOptions {
    /** Shifts both control points vertically, so parallel edges between the same ports fan apart. */
    bend?: number;
    /** Draws a self-loop: out of the source's right side, over the card at this y, back into its left side. */
    loopTop?: number;
}

export function buildEdgePath(source: FlowPoint, target: FlowPoint, options: EdgePathOptions = {}): { d: string; mid: FlowPoint } {
    if (options.loopTop !== undefined) {
        const top = options.loopTop;
        const midX = (source.x + target.x) / 2;
        const reach = 56;
        const d = `M ${round(source.x)} ${round(source.y)} C ${round(source.x + reach)} ${round(source.y)}, ${round(source.x + reach)} ${round(top)}, ${round(midX)} ${round(top)} C ${round(target.x - reach)} ${round(top)}, ${round(target.x - reach)} ${round(target.y)}, ${round(target.x)} ${round(target.y)}`;
        return { d, mid: { x: midX, y: top } };
    }
    const bend = options.bend ?? 0;
    const offset = Math.max(Math.abs(target.x - source.x) * 0.5, 48);
    const c1 = { x: source.x + offset, y: source.y + bend };
    const c2 = { x: target.x - offset, y: target.y + bend };
    const d = `M ${round(source.x)} ${round(source.y)} C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(target.x)} ${round(target.y)}`;
    // Cubic bezier midpoint at t=0.5: B(0.5) = (P0 + 3*C1 + 3*C2 + P3) / 8.
    const mid = { x: (source.x + 3 * c1.x + 3 * c2.x + target.x) / 8, y: (source.y + 3 * c1.y + 3 * c2.y + target.y) / 8 };
    return { d, mid };
}

export function nodeBounds(node: SizedPoint): FlowBounds {
    const { width, height } = nodeSize(node);
    return { minX: node.x - width / 2, minY: node.y - height / 2, maxX: node.x + width / 2, maxY: node.y + height / 2 };
}

const FALLBACK_BOUNDS: FlowBounds = { minX: 0, minY: 0, maxX: 800, maxY: 400 };

/** The bounding box of every node, or a fixed fallback box when there are none. */
export function graphBounds(nodes: readonly SizedPoint[]): FlowBounds {
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
