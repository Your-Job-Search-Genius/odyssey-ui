"use client";

import { cx } from "@/utils/cx";
import { useFlowCanvasContext } from "./flow-canvas-context";
import type { FlowEdge, FlowPoint } from "./flow-canvas-types";
import { edgeStatusOf } from "./flow-canvas-utils";

export interface FlowCanvasEdgePathProps {
    edge: FlowEdge;
    /** Precomputed by the caller (`buildEdgePath`) so the same path/midpoint is shared with `FlowCanvasEdgeLabel`. */
    d: string;
    isSelected: boolean;
    onSelect: () => void;
}

/** One edge: an invisible wide hit-stroke for easy click targeting, the visible stroke, and (unless paused/reduced-motion/muted/traversed) ambient travel dots. */
export const FlowCanvasEdgePath = ({ edge, d, isSelected, onSelect }: FlowCanvasEdgePathProps) => {
    const context = useFlowCanvasContext();
    const status = edgeStatusOf(edge.status);
    const isActiveVisual = isSelected || status === "active";
    const markerId = isActiveVisual ? context.arrowMarkerActiveId : context.arrowMarkerId;
    const showDots = !context.reducedMotion && status !== "muted" && status !== "traversed";

    return (
        <g className={cx(status === "muted" && "opacity-35")}>
            <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={18}
                className={cx("pointer-events-auto", !context.isReadOnly && "cursor-pointer")}
                onPointerDown={(event) => {
                    event.stopPropagation();
                    onSelect();
                }}
            />
            <path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={isSelected ? 3 : 2}
                strokeLinecap="round"
                markerEnd={`url(#${markerId})`}
                filter={context.edgeStyle === "sketchy" ? `url(#${context.sketchyFilterId})` : undefined}
                className={cx(
                    "pointer-events-none transition-[stroke] duration-100 ease-linear",
                    status === "traversed" ? "text-fg-brand-secondary" : isActiveVisual ? "text-fg-brand-primary" : "text-fg-quaternary",
                )}
            />
            {showDots &&
                [0, 1].map((index) => (
                    <circle
                        key={index}
                        r={status === "active" ? 4 : 3}
                        fill="currentColor"
                        className={cx(
                            "pointer-events-none animate-flow-dot-travel text-fg-brand-primary",
                            status === "active" && "drop-shadow-[0_0_4px_var(--color-flow-glow-brand)]",
                        )}
                        style={{
                            offsetPath: `path('${d}')`,
                            animationDelay: `calc(var(--flow-duration, 2.4s) * -${index} / 2)`,
                            animationPlayState: context.isPlaying ? "running" : "paused",
                            opacity: status === "active" ? 1 : 0.5,
                        }}
                    />
                ))}
        </g>
    );
};

export interface FlowCanvasEdgeLabelProps {
    label: string;
    mid: FlowPoint;
}

/** The optional label chip rendered at an edge's midpoint, in the same HTML layer as node cards. */
export const FlowCanvasEdgeLabel = ({ label, mid }: FlowCanvasEdgeLabelProps) => (
    <span
        style={{ left: mid.x, top: mid.y }}
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary bg-primary/90 px-2 py-0.5 text-[11px] font-medium text-nowrap text-secondary shadow-xs backdrop-blur-sm"
    >
        {label}
    </span>
);
