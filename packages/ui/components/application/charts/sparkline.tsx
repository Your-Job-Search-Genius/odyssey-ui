"use client";

import { useId, useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { curveMonotoneX, area as d3Area, line as d3Line } from "d3-shape";
import { cx } from "@/utils/cx";
import { useChartTransition } from "./use-chart-motion";

export interface SparklineProps {
    /** The values to plot, oldest first. */
    data: number[];
    /** `line` is a bare stroke, `area` adds a 10% wash, `bar` draws 4px rounded columns. */
    variant?: "line" | "area" | "bar";
    /** Any CSS color. Defaults to the first categorical slot. */
    color?: string;
    /** Height in px. Width always fills the container. */
    height?: number;
    /** Accessible name, e.g. "Profile views trend over 12 weeks, rising". Required: the sparkline is a single image to assistive tech. */
    label: string;
    /** Marks the latest value with a dot. */
    showEndDot?: boolean;
    className?: string;
}

/** Summarises a series' direction by comparing the last value with the first. */
export const describeTrend = (data: number[]): "rising" | "falling" | "flat" => {
    if (data.length < 2) return "flat";
    const first = data[0];
    const last = data[data.length - 1];
    const tolerance = Math.abs(first) * 0.02;
    if (last - first > tolerance) return "rising";
    if (first - last > tolerance) return "falling";
    return "flat";
};

const VIEW_WIDTH = 200;

/**
 * A 12-ish point trend drawn as a single decorative image, meant to sit
 * under a stat tile's value. It is deliberately not per-point focusable:
 * the tile's value and delta carry the information, and `label` describes
 * the trend to assistive technology in one sentence.
 */
export const Sparkline = ({ data, variant = "area", color = "var(--color-chart-1)", height = 36, label, showEndDot = true, className }: SparklineProps) => {
    const id = useId();
    const progress = useChartTransition(data);
    const clipId = `${id}-reveal`;

    // Non-finite readings plot as 0 rather than poisoning every coordinate with NaN.
    const values = useMemo(() => data.map((d) => (Number.isFinite(d) ? d : 0)), [data]);
    const geometry = useMemo(() => {
        const n = values.length;
        const pad = 4;
        const x = scaleLinear()
            .domain([0, Math.max(1, n - 1)])
            .range([pad, VIEW_WIDTH - pad]);
        const lo = Math.min(...values, 0);
        const hi = Math.max(...values, lo + 1);
        const y = scaleLinear()
            .domain([lo, hi])
            .range([height - pad, pad]);
        const line = d3Line<number>()
            .x((_, i) => x(i))
            .y((d) => y(d))
            .curve(curveMonotoneX);
        const area = d3Area<number>()
            .x((_, i) => x(i))
            .y0(height)
            .y1((d) => y(d))
            .curve(curveMonotoneX);
        return { x, y, linePath: line(values) ?? "", areaPath: area(values) ?? "", baseline: y(Math.max(lo, 0)) };
    }, [values, height]);

    if (values.length === 0) {
        return <svg role="img" aria-label={label} width="100%" height={height} className={className} />;
    }

    const last = values.length - 1;
    const revealWidth = VIEW_WIDTH * progress;

    return (
        <svg
            role="img"
            aria-label={label}
            width="100%"
            height={height}
            viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
            preserveAspectRatio="none"
            className={cx("block overflow-visible", className)}
        >
            <defs>
                <clipPath id={clipId}>
                    <rect x={0} y={-4} width={revealWidth} height={height + 8} />
                </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
                {variant === "bar" ? (
                    values.map((d, i) => {
                        const barX = geometry.x(i) - 2;
                        const top = Math.min(geometry.y(d), geometry.baseline);
                        const h = Math.max(1, Math.abs(geometry.y(d) - geometry.baseline));
                        return <rect key={i} x={barX} y={top} width={4} height={h} rx={2} fill={color} vectorEffect="non-scaling-stroke" />;
                    })
                ) : (
                    <>
                        {variant === "area" && <path d={geometry.areaPath} fill={color} fillOpacity={0.1} />}
                        <path
                            d={geometry.linePath}
                            fill="none"
                            stroke={color}
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </>
                )}
            </g>
            {showEndDot && variant !== "bar" && (
                <circle
                    cx={geometry.x(last)}
                    cy={geometry.y(values[last])}
                    r={3.5}
                    fill={color}
                    className="stroke-bg-primary"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    style={{ opacity: progress >= 0.98 ? 1 : 0, transition: "opacity 200ms linear" }}
                />
            )}
        </svg>
    );
};
