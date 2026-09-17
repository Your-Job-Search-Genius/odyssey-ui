"use client";

import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

interface ChartGridProps {
    /** Y pixel positions of horizontal gridlines. */
    horizontal?: number[];
    /** X pixel positions of vertical gridlines. */
    vertical?: number[];
    /** Plot width in px (horizontal lines span it). */
    width: number;
    /** Plot height in px (vertical lines span it). */
    height: number;
    className?: string;
}

/** Recessive hairline gridlines, one step off the surface. Never dashed. */
export const ChartGrid = ({ horizontal = [], vertical = [], width, height, className }: ChartGridProps) => (
    <g aria-hidden="true" className={cx("stroke-chart-grid", className)} strokeWidth={1} shapeRendering="crispEdges">
        {horizontal.map((y, index) => (
            <line key={`h-${index}`} x1={0} x2={width} y1={y} y2={y} />
        ))}
        {vertical.map((x, index) => (
            <line key={`v-${index}`} x1={x} x2={x} y1={0} y2={height} />
        ))}
    </g>
);

interface ChartAxisTick {
    /** Pixel position along the axis. */
    position: number;
    label: string;
    /** Per-tick text anchor override, e.g. to keep the first/last label inside the plot. */
    anchor?: "start" | "middle" | "end";
}

interface ChartAxisLeftProps {
    ticks: ChartAxisTick[];
    /** Distance from the plot's left edge to the label's right edge, in px. */
    offset?: number;
    className?: string;
}

/** Left value axis: right-aligned tick labels, no axis line. */
export const ChartAxisLeft = ({ ticks, offset = 8, className }: ChartAxisLeftProps) => (
    <g aria-hidden="true" className={cx("fill-text-quaternary text-xs", className)}>
        {ticks.map((tick, index) => (
            <text key={index} x={-offset} y={tick.position} dy="0.32em" textAnchor="end">
                {tick.label}
            </text>
        ))}
    </g>
);

interface ChartAxisBottomProps {
    ticks: ChartAxisTick[];
    /** Y pixel position of the axis (usually the plot height). */
    y: number;
    /** Gap between the axis and the label baseline, in px. */
    offset?: number;
    /** Text anchor for labels. */
    anchor?: "start" | "middle" | "end";
    /** Draws the baseline rule. */
    showLine?: boolean;
    width?: number;
    className?: string;
}

/** Bottom category axis: centred tick labels with an optional baseline. */
export const ChartAxisBottom = ({ ticks, y, offset = 18, anchor = "middle", showLine = false, width = 0, className }: ChartAxisBottomProps) => (
    <g aria-hidden="true" className={cx("fill-text-quaternary text-xs", className)}>
        {showLine && <line x1={0} x2={width} y1={y} y2={y} className="stroke-chart-axis" strokeWidth={1} shapeRendering="crispEdges" />}
        {ticks.map((tick, index) => (
            <text key={index} x={tick.position} y={y + offset} textAnchor={tick.anchor ?? anchor}>
                {tick.label}
            </text>
        ))}
    </g>
);

interface ChartBaselineProps {
    /** Y pixel position. */
    y: number;
    width: number;
    className?: string;
}

/** A single axis rule, used for bar baselines and diverging zero lines. */
export const ChartBaseline = ({ y, width, className }: ChartBaselineProps) => (
    <line aria-hidden="true" x1={0} x2={width} y1={y} y2={y} className={cx("stroke-chart-axis", className)} strokeWidth={1} shapeRendering="crispEdges" />
);

interface ChartCrosshairProps {
    /** X pixel position. */
    x: number;
    height: number;
    className?: string;
}

/** The vertical hairline that tracks the reader's X position on line and area charts. */
export const ChartCrosshair = ({ x, height, className }: ChartCrosshairProps) => (
    <line
        aria-hidden="true"
        x1={x}
        x2={x}
        y1={0}
        y2={height}
        className={cx("pointer-events-none stroke-chart-axis", className)}
        strokeWidth={1}
        shapeRendering="crispEdges"
    />
);

export type ChartRingShape =
    | { type: "circle"; cx: number; cy: number; r: number }
    | { type: "rect"; x: number; y: number; width: number; height: number; rx?: number }
    | { type: "path"; d: string };

interface ChartFocusRingProps {
    shape: ChartRingShape;
    /** Gap between the mark and the ring, in px. */
    offset?: number;
    className?: string;
}

/**
 * The visible keyboard focus indicator. Drawn as a real SVG element in the
 * focus-ring token so it matches the rest of the design system and is not
 * subject to browser differences in SVG `outline` rendering.
 */
export const ChartFocusRing = ({ shape, offset = 3, className }: ChartFocusRingProps) => {
    const common = { className: cx("pointer-events-none fill-none stroke-focus-ring", className), strokeWidth: 2, "aria-hidden": true as const };
    if (shape.type === "circle") return <circle {...common} cx={shape.cx} cy={shape.cy} r={shape.r + offset} />;
    if (shape.type === "rect") {
        return (
            <rect
                {...common}
                x={shape.x - offset}
                y={shape.y - offset}
                width={Math.max(0, shape.width + offset * 2)}
                height={Math.max(0, shape.height + offset * 2)}
                rx={(shape.rx ?? 4) + offset}
            />
        );
    }
    return <path {...common} d={shape.d} strokeLinejoin="round" />;
};

interface ChartLabelProps {
    x: number;
    y: number;
    anchor?: "start" | "middle" | "end";
    /** Vertical alignment shortcut. */
    baseline?: "middle" | "hanging" | "auto";
    tone?: "primary" | "secondary" | "quaternary" | "inverse";
    weight?: "regular" | "medium" | "semibold";
    className?: string;
    children: ReactNode;
}

/** Direct labels and value annotations. Always wears a text token, never the series color. */
export const ChartLabel = ({ x, y, anchor = "start", baseline = "middle", tone = "secondary", weight = "medium", className, children }: ChartLabelProps) => (
    <text
        aria-hidden="true"
        x={x}
        y={y}
        dy={baseline === "middle" ? "0.32em" : baseline === "hanging" ? "0.9em" : undefined}
        textAnchor={anchor}
        className={cx(
            "pointer-events-none text-xs",
            tone === "primary" && "fill-text-primary",
            tone === "secondary" && "fill-text-secondary",
            tone === "quaternary" && "fill-text-quaternary",
            tone === "inverse" && "fill-white",
            weight === "medium" && "font-medium",
            weight === "semibold" && "font-semibold",
            className,
        )}
    >
        {children}
    </text>
);
