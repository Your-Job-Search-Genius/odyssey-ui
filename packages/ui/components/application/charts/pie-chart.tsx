"use client";

import type { ReactNode } from "react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { arc as d3Arc, pie as d3Pie } from "d3-shape";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartFocusRing, ChartLabel } from "./chart-primitives";
import type { ChartNamedValue, ChartTooltipData } from "./chart-types";
import { estimateTextWidth, fitLabel, formatNumber, formatPercent, lerp, seriesColor, stagger } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition, usePreviousDistinct } from "./use-chart-motion";

export interface PieChartProps extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty" | "legendPosition"> {
    /** Slices in display order. Memoise it: a new array identity replays the transition. */
    data: ChartNamedValue[];
    /** Hole size as a ratio of the outer radius (0 = pie, 0.66 = donut). Clamped to 0–0.9. */
    innerRadius?: number;
    /** Angular gap between slices, in radians. */
    padAngle?: number;
    /** Corner rounding of each slice, in px. */
    cornerRadius?: number;
    /** Small text under the centre value. Only rendered for donuts (`innerRadius` > 0.4). */
    centerLabel?: ReactNode;
    /** Centre value. Defaults to the total; numbers count up during the entry animation. */
    centerValue?: number | string;
    /** Slices beyond this count fold into a single "Other" slice so colors are never cycled. */
    maxSlices?: number;
    /** `right` draws an SVG legend beside the chart; `bottom` uses the frame's legend. Falls back to `bottom` under 420px. */
    legendPosition?: "right" | "bottom";
    /** Formats values for the legend, tooltip, centre and table. */
    valueFormatter?: (value: number) => string;
    /** Adds each slice's share of the total to legend and tooltip. */
    showShare?: boolean;
    /** Called when a slice is activated with Enter, Space or a click. */
    onSliceSelect?: (info: { datum: ChartNamedValue; index: number }) => void;
}

interface Slice extends ChartNamedValue {
    color: string;
    share: number;
}

/**
 * Pie and donut chart for part-to-whole at a glance. Keep it to six slices
 * or fewer; the tail folds into "Other" automatically. Every slice is a
 * focusable mark and the values are mirrored in an accessible table.
 */
export const PieChart = ({
    data,
    innerRadius = 0.66,
    padAngle = 0.02,
    cornerRadius = 3,
    centerLabel,
    centerValue,
    maxSlices = 6,
    legendPosition = "right",
    valueFormatter = formatNumber,
    showShare = true,
    onSliceSelect,
    description,
    height = 220,
    className,
    ...chartProps
}: PieChartProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [wrapperWidth, setWrapperWidth] = useState(0);
    const measure = useCallback(() => {
        const element = wrapperRef.current;
        if (!element) return;
        const next = Math.floor(element.getBoundingClientRect().width);
        setWrapperWidth((prev) => (prev === next ? prev : next));
    }, []);
    useLayoutEffect(measure, [measure]);
    useResizeObserver({ ref: wrapperRef, onResize: measure });

    const slices = useMemo<Slice[]>(() => {
        const clean = data.filter((d) => Number.isFinite(d.value) && d.value > 0);
        const limit = Math.max(1, maxSlices);
        const kept = clean.length > limit ? clean.slice(0, limit - 1) : clean;
        const rest = clean.length > limit ? clean.slice(limit - 1) : [];
        const folded: ChartNamedValue[] = rest.length ? [...kept, { name: "Other", value: rest.reduce((sum, d) => sum + d.value, 0) }] : kept;
        const total = folded.reduce((sum, d) => sum + d.value, 0);
        return folded.map((d, index) => ({ ...d, color: seriesColor(index, d.color), share: total > 0 ? d.value / total : 0 }));
    }, [data, maxSlices]);

    const total = useMemo(() => slices.reduce((sum, d) => sum + d.value, 0), [slices]);
    const isEmpty = slices.length === 0 || total <= 0;
    const useSvgLegend = legendPosition === "right" && wrapperWidth >= 420;

    const legend = useMemo(() => slices.map((s, index) => ({ key: `${s.name}-${index}`, name: s.name, color: s.color, shape: "dot" as const })), [slices]);

    const table = useMemo(
        () => ({
            columns: showShare ? ["Name", "Value", "Share"] : ["Name", "Value"],
            rows: slices.map((s) => (showShare ? [s.name, valueFormatter(s.value), formatPercent(s.share)] : [s.name, valueFormatter(s.value)])),
        }),
        [slices, valueFormatter, showShare],
    );

    const autoDescription = useMemo(() => {
        if (isEmpty) return "No data.";
        const largest = slices.reduce((best, s) => (s.value > best.value ? s : best), slices[0]);
        return `${slices.length} slices totalling ${valueFormatter(total)}. Largest is ${largest.name} at ${formatPercent(largest.share)}.`;
    }, [isEmpty, slices, total, valueFormatter]);

    return (
        <div ref={wrapperRef} className="w-full min-w-0">
            <Chart
                {...chartProps}
                height={height}
                className={className}
                description={description ?? autoDescription}
                legend={!useSvgLegend && slices.length > 1 ? legend : undefined}
                legendPosition="bottom"
                table={table}
                isEmpty={isEmpty}
            >
                {(size) => (
                    <PieChartPlot
                        {...size}
                        slices={slices}
                        total={total}
                        innerRadius={Math.min(0.9, Math.max(0, innerRadius))}
                        padAngle={padAngle}
                        cornerRadius={cornerRadius}
                        centerLabel={centerLabel}
                        centerValue={centerValue}
                        showSvgLegend={useSvgLegend}
                        valueFormatter={valueFormatter}
                        showShare={showShare}
                        onSliceSelect={onSliceSelect}
                    />
                )}
            </Chart>
        </div>
    );
};

interface PieChartPlotProps {
    width: number;
    height: number;
    slices: Slice[];
    total: number;
    innerRadius: number;
    padAngle: number;
    cornerRadius: number;
    centerLabel?: ReactNode;
    centerValue?: number | string;
    showSvgLegend: boolean;
    valueFormatter: (value: number) => string;
    showShare: boolean;
    onSliceSelect?: PieChartProps["onSliceSelect"];
}

interface ArcSpec {
    r0: number;
    r1: number;
    a0: number;
    a1: number;
    corner: number;
    pad: number;
}

const arcPath = ({ r0, r1, a0, a1, corner, pad }: ArcSpec): string =>
    d3Arc().innerRadius(r0).outerRadius(r1).cornerRadius(corner).padAngle(pad)({ innerRadius: r0, outerRadius: r1, startAngle: a0, endAngle: a1 }) ?? "";

const arcCentroid = ({ r0, r1, a0, a1 }: ArcSpec): [number, number] =>
    d3Arc().innerRadius(r0).outerRadius(r1).centroid({ innerRadius: r0, outerRadius: r1, startAngle: a0, endAngle: a1 });

const LEGEND_ROW = 22;

const PieChartPlot = ({
    width,
    height,
    slices,
    total,
    innerRadius,
    padAngle,
    cornerRadius,
    centerLabel,
    centerValue,
    showSvgLegend,
    valueFormatter,
    showShare,
    onSliceSelect,
}: PieChartPlotProps) => {
    const progress = useChartTransition(slices);
    const previousSlices = usePreviousDistinct(slices);
    const isUpdate = previousSlices !== undefined && previousSlices.length === slices.length;

    const legendWidth = showSvgLegend
        ? Math.ceil(
              Math.max(0, ...slices.map((s) => estimateTextWidth(`${s.name}  ${valueFormatter(s.value)}${showShare ? `  ${formatPercent(s.share)}` : ""}`, 12))),
          ) + 24
        : 0;
    const legendSpace = showSvgLegend ? Math.min(legendWidth + 24, width * 0.55) : 0;
    const outerRadius = Math.max(16, Math.min(height / 2 - 8, (width - legendSpace) / 2 - 8));
    const r0 = outerRadius * innerRadius;
    const cx = showSvgLegend ? outerRadius + 8 : width / 2;
    const cy = height / 2;

    const angles = useMemo(() => {
        const compute = (rows: Slice[]) =>
            d3Pie<Slice>()
                .sort(null)
                .value((d) => d.value)
                .padAngle(padAngle)(rows)
                .map((p) => [p.startAngle, p.endAngle] as [number, number]);
        return { current: compute(slices), previous: isUpdate && previousSlices ? compute(previousSlices) : null };
    }, [slices, previousSlices, isUpdate, padAngle]);

    const animated = useMemo(
        () =>
            angles.current.map(([a0, a1], index) => {
                const prev = angles.previous?.[index];
                if (prev) return [lerp(prev[0], a0, progress), lerp(prev[1], a1, progress)] as [number, number];
                const t = stagger(progress, index, slices.length, 0.5);
                return [a0, a0 + (a1 - a0) * t] as [number, number];
            }),
        [angles, progress, slices.length],
    );

    const focus = useChartFocus({
        rowCount: 1,
        colCount: () => slices.length,
        navigation: "list",
        onSelect: onSliceSelect ? ({ col }) => onSliceSelect({ datum: slices[col], index: col }) : undefined,
    });
    const current = focus.current;

    const specFor = useCallback(
        (index: number, isCurrent: boolean): ArcSpec => ({
            r0,
            r1: isCurrent ? outerRadius + 4 : outerRadius,
            a0: animated[index][0],
            a1: animated[index][1],
            corner: cornerRadius,
            pad: padAngle,
        }),
        [r0, outerRadius, animated, cornerRadius, padAngle],
    );

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!current || !slices[current.col]) return null;
        const slice = slices[current.col];
        const [lx, ly] = arcCentroid(specFor(current.col, true));
        const rows = [{ name: "Value", value: valueFormatter(slice.value), color: slice.color }];
        if (showShare) rows.push({ name: "Share", value: formatPercent(slice.share), color: "" });
        return { x: cx + lx, y: cy + ly, title: slice.name, rows: rows.map((r) => (r.color ? r : { name: r.name, value: r.value })) };
    }, [current, slices, specFor, cx, cy, valueFormatter, showShare]);
    useChartTooltip(tooltip);

    const previousTotal = previousSlices ? previousSlices.reduce((sum, d) => sum + d.value, 0) : 0;
    const displayedTotal = isUpdate ? lerp(previousTotal, total, progress) : total * progress;
    const centerText =
        centerValue === undefined
            ? valueFormatter(Math.round(displayedTotal))
            : typeof centerValue === "number"
              ? valueFormatter(Math.round(isUpdate ? centerValue : centerValue * progress))
              : centerValue;
    const showCenter = innerRadius > 0.4;

    const legendTop = cy - (slices.length * LEGEND_ROW) / 2 + LEGEND_ROW / 2;
    const valueText = (slice: Slice) => (showShare ? `${valueFormatter(slice.value)} · ${formatPercent(slice.share)}` : valueFormatter(slice.value));

    return (
        <g>
            <g transform={`translate(${cx},${cy})`}>
                {slices.map((slice, index) => {
                    const isCurrent = focus.isCurrent(0, index);
                    const label = `${slice.name}, ${valueFormatter(slice.value)}${showShare ? `, ${formatPercent(slice.share)}` : ""}`;
                    return (
                        <path
                            key={`${slice.name}-${index}`}
                            {...focus.getItemProps(0, index, label, "slice")}
                            d={arcPath(specFor(index, isCurrent))}
                            fill={slice.color}
                            className="transition-opacity duration-100 ease-linear"
                            style={{ opacity: current && !isCurrent ? 0.7 : 1 }}
                        />
                    );
                })}
                {focus.isKeyboard && current && slices[current.col] && (
                    <ChartFocusRing
                        shape={{
                            type: "path",
                            d: arcPath({ ...specFor(current.col, true), r0: Math.max(0, r0 - 3), r1: outerRadius + 7, corner: cornerRadius + 1 }),
                        }}
                    />
                )}
                {showCenter && (
                    <g aria-hidden="true">
                        <text
                            textAnchor="middle"
                            dy={centerLabel ? "-0.05em" : "0.35em"}
                            className="fill-text-primary text-display-xs font-semibold"
                            style={{ fontVariantNumeric: "normal" }}
                        >
                            {centerText}
                        </text>
                        {centerLabel && (
                            <text textAnchor="middle" dy="1.6em" className="fill-text-quaternary text-xs">
                                {centerLabel}
                            </text>
                        )}
                    </g>
                )}
            </g>

            {showSvgLegend && (
                <g aria-hidden="true" transform={`translate(${cx + outerRadius + 24},${legendTop})`}>
                    {slices.map((slice, index) => {
                        const y = index * LEGEND_ROW;
                        return (
                            <g
                                key={`${slice.name}-${index}`}
                                className="transition-opacity duration-100 ease-linear"
                                style={{ opacity: current && !focus.isCurrent(0, index) ? 0.6 : 1 }}
                            >
                                <circle cx={4} cy={y} r={4} fill={slice.color} />
                                <ChartLabel x={16} y={y} tone="secondary" weight="regular">
                                    {fitLabel(slice.name, Math.max(24, legendSpace - 40 - estimateTextWidth(valueText(slice), 12)))}
                                    <title>{slice.name}</title>
                                </ChartLabel>
                                <ChartLabel x={legendWidth} y={y} anchor="end" tone="quaternary" weight="medium">
                                    {valueText(slice)}
                                </ChartLabel>
                            </g>
                        );
                    })}
                </g>
            )}
        </g>
    );
};
