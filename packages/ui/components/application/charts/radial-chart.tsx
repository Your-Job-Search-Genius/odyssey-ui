"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { arc as d3Arc } from "d3-shape";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cx } from "@/utils/cx";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartFocusRing, ChartLabel } from "./chart-primitives";
import type { ChartNamedValue, ChartTooltipData } from "./chart-types";
import { fitLabel, formatNumber, formatPercent, lerp, seriesColor, stagger } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition, usePreviousDistinct } from "./use-chart-motion";

/** A radial datum: a value against an optional maximum (defaults to 100). */
export interface RadialChartDatum extends ChartNamedValue {
    max?: number;
}

export interface RadialChartProps extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty" | "height"> {
    /** One item per ring (`rings`), or a single item (`gauge`, `progress`). Memoise it: a new array identity replays the transition. */
    data: RadialChartDatum[];
    /** `rings`: concentric activity rings. `gauge`: a 240° dial. `progress`: a full progress circle. */
    variant?: "rings" | "gauge" | "progress";
    /** Ring thickness in px (`rings` and `gauge`). */
    thickness?: number;
    /** Gap between rings in px (`rings`). */
    gap?: number;
    /** Diameter preset for the `progress` variant. */
    size?: "xs" | "sm" | "md" | "lg";
    /** Overrides the arc color for `gauge` and `progress`, e.g. a status token. */
    color?: string;
    /** Plot height in px. Defaults per variant (rings 220, gauge 200, progress by `size`). */
    height?: number;
    /** Formats values for the legend, tooltip, centre and table. */
    valueFormatter?: (value: number) => string;
    /** Called when a ring or arc is activated with Enter, Space or a click. */
    onItemSelect?: (info: { datum: RadialChartDatum; index: number }) => void;
}

interface RadialItem {
    name: string;
    value: number;
    max: number;
    ratio: number;
    color: string;
}

const PROGRESS_SIZES = { xs: 64, sm: 96, md: 128, lg: 160 } as const;
const PROGRESS_THICKNESS = { xs: 6, sm: 8, md: 10, lg: 12 } as const;
const PROGRESS_TEXT = { xs: "text-xs", sm: "text-sm", md: "text-lg", lg: "text-display-xs" } as const;

const TAU = Math.PI * 2;
const GAUGE_SPAN = (TAU * 2) / 3;
const GAUGE_START = -GAUGE_SPAN / 2;

const arcPath = (r0: number, r1: number, a0: number, a1: number, corner: number): string =>
    d3Arc().innerRadius(r0).outerRadius(r1).cornerRadius(corner)({ innerRadius: r0, outerRadius: r1, startAngle: a0, endAngle: a1 }) ?? "";

const arcCentroid = (r0: number, r1: number, a0: number, a1: number): [number, number] =>
    d3Arc().innerRadius(r0).outerRadius(r1).centroid({ innerRadius: r0, outerRadius: r1, startAngle: a0, endAngle: a1 });

/**
 * Radial progress: concentric activity rings, a 240° gauge or a single
 * progress circle. The unfilled track is the same hue at low opacity so the
 * state reads across the whole ring. Every arc is a focusable mark.
 */
export const RadialChart = ({
    data,
    variant = "rings",
    thickness = 14,
    gap = 8,
    size = "md",
    color,
    height,
    valueFormatter = formatNumber,
    onItemSelect,
    description,
    className,
    ...chartProps
}: RadialChartProps) => {
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

    const items = useMemo<RadialItem[]>(() => {
        const source = variant === "rings" ? data : data.slice(0, 1);
        return source
            .filter((d) => Number.isFinite(d.value))
            .map((d, index) => {
                const max = d.max && d.max > 0 ? d.max : 100;
                return {
                    name: d.name,
                    value: d.value,
                    max,
                    ratio: Math.min(1, Math.max(0, d.value / max)),
                    color: variant === "rings" ? seriesColor(index, d.color) : (color ?? seriesColor(index, d.color)),
                };
            });
    }, [data, variant, color]);

    const isEmpty = items.length === 0;
    const resolvedHeight = height ?? (variant === "rings" ? 220 : variant === "gauge" ? 200 : PROGRESS_SIZES[size]);
    const useSvgLegend = variant === "rings" && wrapperWidth >= 420;

    const legend = useMemo(
        () =>
            items.map((item, index) => ({
                key: `${item.name}-${index}`,
                name: `${item.name} ${formatPercent(item.ratio)}`,
                color: item.color,
                shape: "dot" as const,
            })),
        [items],
    );

    const table = useMemo(
        () => ({
            columns: ["Name", "Value", "Max", "Share"],
            rows: items.map((item) => [item.name, valueFormatter(item.value), valueFormatter(item.max), formatPercent(item.ratio)]),
        }),
        [items, valueFormatter],
    );

    const autoDescription = useMemo(() => {
        if (isEmpty) return "No data.";
        return items.map((item) => `${item.name} ${valueFormatter(item.value)} of ${valueFormatter(item.max)} (${formatPercent(item.ratio)})`).join(", ") + ".";
    }, [isEmpty, items, valueFormatter]);

    return (
        <div ref={wrapperRef} className="w-full min-w-0">
            <Chart
                {...chartProps}
                height={resolvedHeight}
                className={className}
                description={description ?? autoDescription}
                legend={variant === "rings" && !useSvgLegend ? legend : undefined}
                legendPosition="bottom"
                table={table}
                isEmpty={isEmpty}
            >
                {(plotSize) => (
                    <RadialChartPlot
                        {...plotSize}
                        items={items}
                        variant={variant}
                        thickness={variant === "progress" ? PROGRESS_THICKNESS[size] : thickness}
                        gap={gap}
                        size={size}
                        showSvgLegend={useSvgLegend}
                        valueFormatter={valueFormatter}
                        onItemSelect={onItemSelect}
                    />
                )}
            </Chart>
        </div>
    );
};

interface RadialChartPlotProps {
    width: number;
    height: number;
    items: RadialItem[];
    variant: NonNullable<RadialChartProps["variant"]>;
    thickness: number;
    gap: number;
    size: NonNullable<RadialChartProps["size"]>;
    showSvgLegend: boolean;
    valueFormatter: (value: number) => string;
    onItemSelect?: RadialChartProps["onItemSelect"];
}

const LEGEND_ROW = 38;

const RadialChartPlot = ({ width, height, items, variant, thickness, gap, size, showSvgLegend, valueFormatter, onItemSelect }: RadialChartPlotProps) => {
    const progress = useChartTransition(items);
    const previousItems = usePreviousDistinct(items);
    const isUpdate = previousItems !== undefined && previousItems.length === items.length;

    const ratios = useMemo(
        () =>
            items.map((item, index) => {
                const prev = previousItems?.[index];
                if (isUpdate && prev) return lerp(prev.ratio, item.ratio, progress);
                return item.ratio * stagger(progress, index, items.length, 0.4);
            }),
        [items, previousItems, isUpdate, progress],
    );
    const displayedValues = useMemo(
        () =>
            items.map((item, index) => {
                const prev = previousItems?.[index];
                if (isUpdate && prev) return lerp(prev.value, item.value, progress);
                return item.value * stagger(progress, index, items.length, 0.4);
            }),
        [items, previousItems, isUpdate, progress],
    );

    const focus = useChartFocus({
        rowCount: 1,
        colCount: () => items.length,
        navigation: "list",
        onSelect: onItemSelect ? ({ col }) => onItemSelect({ datum: items[col], index: col }) : undefined,
    });
    const current = focus.current;

    // Geometry per variant.
    const legendSpace = showSvgLegend ? Math.min(180, width * 0.45) : 0;
    let outerRadius: number;
    let centerX: number;
    let centerY: number;
    if (variant === "gauge") {
        outerRadius = Math.max(24, Math.min((width - 32) / 2, (height - 28) / 1.5));
        centerX = width / 2;
        centerY = 8 + outerRadius;
    } else if (variant === "progress") {
        outerRadius = Math.max(12, Math.min(PROGRESS_SIZES[size], height, width) / 2);
        centerX = width / 2;
        centerY = height / 2;
    } else {
        outerRadius = Math.max(24, Math.min(height / 2 - 6, (width - legendSpace) / 2 - 6));
        centerX = showSvgLegend ? outerRadius + 8 : width / 2;
        centerY = height / 2;
    }

    const arcFor = useCallback(
        (index: number) => {
            const r1 = variant === "rings" ? outerRadius - index * (thickness + gap) : outerRadius;
            const r0 = Math.max(0, r1 - thickness);
            const a0 = variant === "gauge" ? GAUGE_START : 0;
            const span = variant === "gauge" ? GAUGE_SPAN : TAU;
            return { r0, r1, a0, a1: a0 + span * Math.max(ratios[index] ?? 0, 0.0001), aFull: a0 + span, corner: thickness / 2 };
        },
        [variant, outerRadius, thickness, gap, ratios],
    );

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!current || !items[current.col]) return null;
        const item = items[current.col];
        const a = arcFor(current.col);
        const [lx, ly] = arcCentroid(a.r0, a.r1, a.a0, a.a1);
        return {
            x: centerX + lx,
            y: centerY + ly,
            title: item.name,
            rows: [
                { name: "Value", value: `${valueFormatter(item.value)} / ${valueFormatter(item.max)}`, color: item.color },
                { name: "Share", value: formatPercent(item.ratio) },
            ],
        };
    }, [current, items, arcFor, centerX, centerY, valueFormatter]);
    useChartTooltip(tooltip);

    const first = items[0];
    const legendTop = centerY - (items.length * LEGEND_ROW) / 2 + 12;

    return (
        <g>
            <g transform={`translate(${centerX},${centerY})`}>
                {items.map((item, index) => {
                    const a = arcFor(index);
                    const isCurrent = focus.isCurrent(0, index);
                    const label = `${item.name}, ${valueFormatter(item.value)} of ${valueFormatter(item.max)}, ${formatPercent(item.ratio)}`;
                    return (
                        <g key={`${item.name}-${index}`}>
                            <path d={arcPath(a.r0, a.r1, a.a0, a.aFull, a.corner)} fill={item.color} fillOpacity={0.14} aria-hidden="true" />
                            <path
                                {...focus.getItemProps(0, index, label, variant === "rings" ? "ring" : "arc")}
                                d={arcPath(a.r0, a.r1, a.a0, a.a1, a.corner)}
                                fill={item.color}
                                className="transition-opacity duration-100 ease-linear"
                                style={{ opacity: current && !isCurrent ? 0.7 : 1 }}
                            />
                        </g>
                    );
                })}
                {focus.isKeyboard &&
                    current &&
                    items[current.col] &&
                    (() => {
                        const a = arcFor(current.col);
                        return <ChartFocusRing shape={{ type: "path", d: arcPath(Math.max(0, a.r0 - 3), a.r1 + 3, a.a0, a.a1, a.corner + 3) }} />;
                    })()}

                {variant === "gauge" && first && (
                    <g aria-hidden="true">
                        <text
                            textAnchor="middle"
                            dy="0.1em"
                            className="fill-text-primary text-display-sm font-semibold"
                            style={{ fontVariantNumeric: "normal" }}
                        >
                            {valueFormatter(Math.round(displayedValues[0]))}
                        </text>
                        <text textAnchor="middle" dy="2.2em" className="fill-text-tertiary text-sm">
                            {first.name}
                        </text>
                        <ChartLabel
                            x={Math.sin(GAUGE_START) * (outerRadius - thickness / 2)}
                            y={-Math.cos(GAUGE_START) * (outerRadius - thickness / 2) + 18}
                            anchor="middle"
                            tone="quaternary"
                            weight="regular"
                        >
                            0
                        </ChartLabel>
                        <ChartLabel
                            x={-Math.sin(GAUGE_START) * (outerRadius - thickness / 2)}
                            y={-Math.cos(GAUGE_START) * (outerRadius - thickness / 2) + 18}
                            anchor="middle"
                            tone="quaternary"
                            weight="regular"
                        >
                            {valueFormatter(first.max)}
                        </ChartLabel>
                    </g>
                )}

                {variant === "progress" && first && (
                    <text
                        aria-hidden="true"
                        textAnchor="middle"
                        dy="0.35em"
                        className={cx("fill-text-primary font-semibold", PROGRESS_TEXT[size])}
                        style={{ fontVariantNumeric: "normal" }}
                    >
                        {formatPercent(ratios[0] ?? 0)}
                    </text>
                )}
            </g>

            {variant === "rings" && showSvgLegend && (
                <g aria-hidden="true" transform={`translate(${centerX + outerRadius + 24},${legendTop})`}>
                    {items.map((item, index) => {
                        const y = index * LEGEND_ROW;
                        return (
                            <g
                                key={`${item.name}-${index}`}
                                className="transition-opacity duration-100 ease-linear"
                                style={{ opacity: current && !focus.isCurrent(0, index) ? 0.6 : 1 }}
                            >
                                <circle cx={4} cy={y} r={4} fill={item.color} />
                                <ChartLabel x={14} y={y} tone="quaternary" weight="regular">
                                    {fitLabel(item.name, Math.max(24, legendSpace - 40))}
                                    <title>{item.name}</title>
                                </ChartLabel>
                                <text x={0} y={y + 20} className="fill-text-primary text-lg font-semibold" style={{ fontVariantNumeric: "normal" }}>
                                    {formatPercent(ratios[index] ?? 0)}
                                </text>
                            </g>
                        );
                    })}
                </g>
            )}
        </g>
    );
};
