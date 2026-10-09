"use client";

import { useRef } from "react";
import type { FlowViewport } from "@/hooks/use-flow-viewport";
import { cx } from "@/utils/cx";
import { useFlowCanvasContext } from "./flow-canvas-context";
import type { FlowNode, FlowPoint, FlowRoleColor } from "./flow-canvas-types";
import { graphBounds, nodeBounds } from "./flow-canvas-utils";

const ROLE_TEXT_CLASS: Record<FlowRoleColor, string> = {
    brand: "text-fg-brand-primary",
    gray: "text-fg-tertiary",
    success: "text-fg-success-primary",
    warning: "text-fg-warning-primary",
    error: "text-fg-error-primary",
};

export interface FlowCanvasMinimapProps<TData = unknown> {
    nodes: readonly FlowNode<TData>[];
    viewport: FlowViewport;
    /** The main canvas's measured pixel size, used to draw the visible-region rectangle. */
    containerSize: { width: number; height: number };
    onNavigate: (point: FlowPoint) => void;
}

const MINIMAP_PADDING = 160;

/** A small overview of every node plus a clickable rectangle showing the current pan/zoom window. */
export const FlowCanvasMinimap = <TData,>({ nodes, viewport, containerSize, onNavigate }: FlowCanvasMinimapProps<TData>) => {
    const context = useFlowCanvasContext();
    const svgRef = useRef<SVGSVGElement>(null);
    const bounds = graphBounds(nodes);
    const box = {
        x: bounds.minX - MINIMAP_PADDING,
        y: bounds.minY - MINIMAP_PADDING,
        w: bounds.maxX - bounds.minX + MINIMAP_PADDING * 2,
        h: bounds.maxY - bounds.minY + MINIMAP_PADDING * 2,
    };
    const visible = {
        minX: (0 - viewport.panX) / viewport.zoom,
        minY: (0 - viewport.panY) / viewport.zoom,
        maxX: (containerSize.width - viewport.panX) / viewport.zoom,
        maxY: (containerSize.height - viewport.panY) / viewport.zoom,
    };

    const navigateTo = (clientX: number, clientY: number) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return;
        onNavigate({ x: box.x + ((clientX - rect.left) / rect.width) * box.w, y: box.y + ((clientY - rect.top) / rect.height) * box.h });
    };

    return (
        <svg
            ref={svgRef}
            viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
            // Pointer-only shortcut; keyboard users pan/zoom from the canvas itself.
            aria-hidden="true"
            className="size-full cursor-pointer"
            onPointerDown={(event) => navigateTo(event.clientX, event.clientY)}
        >
            {nodes.map((node) => {
                const role = context.roles[node.role];
                return (
                    <rect
                        key={node.id}
                        x={nodeBounds(node).minX}
                        y={nodeBounds(node).minY}
                        width={nodeBounds(node).maxX - nodeBounds(node).minX}
                        height={nodeBounds(node).maxY - nodeBounds(node).minY}
                        rx={14}
                        fill="currentColor"
                        className={cx("opacity-80", role ? ROLE_TEXT_CLASS[role.color] : "text-fg-quaternary")}
                    />
                );
            })}
            <rect
                x={visible.minX}
                y={visible.minY}
                width={Math.max(visible.maxX - visible.minX, 1)}
                height={Math.max(visible.maxY - visible.minY, 1)}
                fill="currentColor"
                fillOpacity={0.12}
                stroke="currentColor"
                strokeWidth={Math.max(box.w / 180, 2)}
                pointerEvents="none"
                className="text-fg-brand-primary"
            />
        </svg>
    );
};
