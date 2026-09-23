"use client";

import { cx } from "@/utils/cx";
import type { FlowNodeStatus } from "./flow-canvas-types";
import { DEFAULT_GRID_SIZE, NODE_STATUS_LABEL } from "./flow-canvas-utils";

/** The dot-grid background, panning and zooming with content -- rendered as the first child inside the transformed edge layer. */
export const FlowCanvasGrid = ({ id, gridSize = DEFAULT_GRID_SIZE }: { id: string; gridSize?: number }) => (
    <g aria-hidden="true">
        <pattern id={id} width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="currentColor" className="text-fg-quaternary opacity-40" />
        </pattern>
        <rect x={-4000} y={-4000} width={12000} height={12000} fill={`url(#${id})`} />
    </g>
);

/** Static, non-panning ambient color wash behind the grid. Decorative atmosphere, not tied to content position. */
export const FlowCanvasBlobs = () => (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute -top-20 -left-14 size-72 rounded-full bg-brand-secondary opacity-40 blur-3xl" />
        <div className="absolute -right-12 -bottom-20 size-80 rounded-full bg-success-secondary opacity-20 blur-3xl" />
    </div>
);

/** Hand-wobble filter for "sketchy" mode, applied to edge strokes and node outline overlays. One instance per `FlowCanvas`, id-scoped so multiple instances on one page don't collide. */
export const FlowCanvasSketchyFilterDefs = ({ id }: { id: string }) => (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves={2} seed={4} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
    </filter>
);

/** Arrowhead markers for idle and active/selected edges. Id-scoped per `FlowCanvas` instance. */
export const FlowCanvasEdgeMarkers = ({ id }: { id: string }) => (
    <>
        <marker
            id={`${id}-arrow`}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth={7}
            markerHeight={7}
            orient="auto-start-reverse"
            className="text-fg-quaternary"
        >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
        <marker
            id={`${id}-arrow-active`}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth={7}
            markerHeight={7}
            orient="auto-start-reverse"
            className="text-fg-brand-primary"
        >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
    </>
);

const STATUS_DOT_CLASS: Record<FlowNodeStatus, string> = {
    idle: "",
    queued: "bg-fg-warning-primary",
    running: "bg-fg-brand-primary",
    done: "bg-fg-success-primary",
    skipped: "bg-fg-quaternary",
};

export interface FlowCanvasStatusChipProps {
    status: FlowNodeStatus;
    reducedMotion?: boolean;
    className?: string;
}

/** Small pulsing-dot status chip rendered on a node card's top edge. Renders nothing for `"idle"`. */
export const FlowCanvasStatusChip = ({ status, reducedMotion, className }: FlowCanvasStatusChipProps) => {
    if (status === "idle") return null;
    return (
        <span
            className={cx(
                "absolute -top-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-full border border-secondary bg-primary px-2 py-0.5 text-[10.5px] font-semibold text-nowrap text-secondary shadow-xs",
                className,
            )}
        >
            <span
                aria-hidden="true"
                className={cx(
                    "size-1.5 shrink-0 rounded-full",
                    STATUS_DOT_CLASS[status],
                    status === "running" && !reducedMotion && "animate-flow-status-pulse",
                )}
            />
            {NODE_STATUS_LABEL[status]}
        </span>
    );
};
