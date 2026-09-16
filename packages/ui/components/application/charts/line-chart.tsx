"use client";

import type { PointerEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { max as d3Max, min as d3Min } from "d3-array";
import { scaleLinear, scalePoint } from "d3-scale";
import { curveLinear, curveMonotoneX, curveStepAfter, area as d3Area, line as d3Line, stack as d3Stack } from "d3-shape";
import type { ChartProps } from "./chart";
import { Chart, useChartContext, useChartTooltip } from "./chart";
import { ChartAxisBottom, ChartAxisLeft, ChartCrosshair, ChartFocusRing, ChartGrid, ChartLabel } from "./chart-primitives";
import type { ChartSeries, ChartTooltipData } from "./chart-types";
import { estimateTextWidth, evenlySpacedIndices, fitLabel, formatCompact, formatNumber, lerp, seriesColor, stagger, toLabel, toNumber } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition, usePreviousDistinct } from "./use-chart-motion";

export interface LineChartProps<T extends object> extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty"> {
    /** One datum per x position, in display order. Memoise it: a new array identity replays the transition. */
    data: T[];
    /** The property that labels each x position (a string, number or Date). */
    xKey: Extract<keyof T, string>;
    /** The series to plot, at most 8. Colors are assigned in slot order unless a series sets its own. */
    series: ChartSeries<T>[];
    /** `line` draws strokes only; `area` adds a wash under each line; `stacked-area` stacks the series. */
    variant?: "line" | "area" | "stacked-area";
    /** Curve interpolation. */
    curve?: "monotone" | "linear" | "step";
    /** Renders a marker on every point. Markers always exist for keyboard focus; this only makes them visible at rest. */
    showDots?: boolean;
    /** Labels each series at its last point instead of relying on the legend alone. */
    showEndLabels?: boolean;
    showGrid?: boolean;
    /** Hides the legend. It is shown by default whenever there is more than one series. */
    showLegend?: boolean;
    /** Formats x labels for the axis, tooltip and table. */
    xFormatter?: (value: T[Extract<keyof T, string>], index: number) => string;
    /** Formats values for tooltips, labels and the table. */
    valueFormatter?: (value: number) => string;
    /** Formats y-axis ticks. Defaults to compact notation (1.2K). */
    tickFormatter?: (value: number) => string;
    /** Fixes the y domain instead of deriving it from the data. */
    yDomain?: [number, number];
    /** Approximate number of y ticks. */
    yTicks?: number;
    /** Called when a point is activated with Enter, Space or a click. */
    onPointSelect?: (info: { datum: T; seriesKey: string; index: number }) => void;
}

const curves = { monotone: curveMonotoneX, linear: curveLinear, step: curveStepAfter } as const;

/**
 * Line, area and stacked-area chart for change over time. Built directly on
 * d3-scale and d3-shape; every point is a focusable mark and the whole
 * series list is mirrored in an accessible table.
 */
export const LineChart = <T extends object>({
    data,
    xKey,
    series,
    variant = "line",
    curve = "monotone",
    showDots = false,
    showEndLabels = false,
    showGrid = true,
    showLegend,
    xFormatter,
    valueFormatter = formatNumber,
    tickFormatter = formatCompact,
    yDomain,
    yTicks = 4,
    onPointSelect,
    description,
    ...chartProps
}: LineChartProps<T>) => {
    const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set());
    const toggle = useCallback((key: string) => {
        setHidden((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    const formatX = useCallback((datum: T, index: number) => (xFormatter ? xFormatter(datum[xKey], index) : toLabel(datum[xKey])), [xFormatter, xKey]);

    const legend = useMemo(
        () =>
            series.map((s, index) => ({
                key: s.key,
                name: s.name ?? s.key,
                color: seriesColor(index, s.color),
                shape: variant === "line" ? ("line" as const) : ("square" as const),
            })),
        [series, variant],
    );

    const table = useMemo(
        () => ({
            columns: [String(xKey), ...series.map((s) => s.name ?? s.key)],
            rows: data.map((datum, index) => [formatX(datum, index), ...series.map((s) => valueFormatter(toNumber(datum[s.key])))]),
        }),
        [data, series, xKey, formatX, valueFormatter],
    );

    const autoDescription = useMemo(() => {
        if (data.length === 0 || series.length === 0) return "No data.";
        const first = series[0];
        const values = data.map((d) => toNumber(d[first.key]));
        const peakIndex = values.indexOf(Math.max(...values));
        return `${series.length} series across ${data.length} points. ${first.name ?? first.key} ranges from ${valueFormatter(Math.min(...values))} to ${valueFormatter(Math.max(...values))}, peaking at ${formatX(data[peakIndex], peakIndex)}.`;
    }, [data, series, valueFormatter, formatX]);

    const shouldShowLegend = showLegend ?? series.length > 1;

    return (
        <Chart
            {...chartProps}
            description={description ?? autoDescription}
            legend={shouldShowLegend ? legend : undefined}
            hiddenKeys={hidden}
            onLegendToggle={shouldShowLegend ? toggle : undefined}
            table={table}
            isEmpty={data.length === 0 || series.length === 0}
        >
            {(size) => (
                <LineChartPlot
                    {...size}
                    data={data}
                    series={series}
                    hidden={hidden}
                    variant={variant}
                    curve={curve}
                    showDots={showDots}
                    showEndLabels={showEndLabels}
                    showGrid={showGrid}
                    formatX={formatX}
                    valueFormatter={valueFormatter}
                    tickFormatter={tickFormatter}
                    yDomain={yDomain}
                    yTicks={yTicks}
                    onPointSelect={onPointSelect}
                />
            )}
        </Chart>
    );
};

interface LineChartPlotProps<T extends object> {
    width: number;
    height: number;
    data: T[];
    series: ChartSeries<T>[];
    hidden: ReadonlySet<string>;
    variant: NonNullable<LineChartProps<T>["variant"]>;
    curve: NonNullable<LineChartProps<T>["curve"]>;
    showDots: boolean;
    showEndLabels: boolean;
    showGrid: boolean;
    formatX: (datum: T, index: number) => string;
    valueFormatter: (value: number) => string;
    tickFormatter: (value: number) => string;
    yDomain?: [number, number];
    yTicks: number;
    onPointSelect?: LineChartProps<T>["onPointSelect"];
}

const DOT_RADIUS = 4.5;

const LineChartPlot = <T extends object>({
    width,
    height,
    data,
    series,
    hidden,
    variant,
    curve,
    showDots,
    showEndLabels,
    showGrid,
    formatX,
    valueFormatter,
    tickFormatter,
    yDomain,
    yTicks,
    onPointSelect,
}: LineChartPlotProps<T>) => {
    const { id } = useChartContext();
    const progress = useChartTransition(data);
    const previousData = usePreviousDistinct(data);
    const isUpdate = previousData !== undefined && previousData.length === data.length;

    const visible = useMemo(
        () => series.map((s, index) => ({ ...s, index, color: seriesColor(index, s.color), name: s.name ?? s.key })).filter((s) => !hidden.has(s.key)),
        [series, hidden],
    );

    // Values per visible series: [y0, y1] per point (stacked) or [0, value].
    const stacks = useMemo(() => {
        const compute = (rows: T[]) => {
            if (variant === "stacked-area") {
                const stacked = d3Stack<T, string>()
                    .keys(visible.map((s) => s.key))
                    .value((d, key) => toNumber(d[key as keyof T]))(rows);
                return stacked.map((layer) => layer.map((point) => [point[0], point[1]] as [number, number]));
            }
            return visible.map((s) => rows.map((d) => [0, toNumber(d[s.key])] as [number, number]));
        };
        return { current: compute(data), previous: isUpdate && previousData ? compute(previousData) : null };
    }, [data, previousData, isUpdate, visible, variant]);

    const values = useMemo(
        () =>
            stacks.current.map((layer, si) =>
                layer.map(([y0, y1], i) => {
                    const prev = stacks.previous?.[si]?.[i];
                    return prev ? ([lerp(prev[0], y0, progress), lerp(prev[1], y1, progress)] as [number, number]) : ([y0, y1] as [number, number]);
                }),
            ),
        [stacks, progress],
    );

    const yExtent = useMemo<[number, number]>(() => {
        if (yDomain) return yDomain;
        const all = stacks.current.flat();
        const lo = Math.min(0, d3Min(all, (v) => v[0]) ?? 0, d3Min(all, (v) => v[1]) ?? 0);
        const hi = Math.max(0, d3Max(all, (v) => v[1]) ?? 0);
        return [lo, hi === lo ? lo + 1 : hi];
    }, [stacks, yDomain]);

    const y = useMemo(() => scaleLinear().domain(yExtent).nice(yTicks), [yExtent, yTicks]);
    const ticks = y.ticks(yTicks);
    const marginLeft = Math.max(28, Math.ceil(Math.max(...ticks.map((t) => estimateTextWidth(tickFormatter(t), 12)))) + 12);
    const endLabels = showEndLabels ? visible.map((s) => `${s.name} ${valueFormatter(stacks.current[visible.indexOf(s)]?.at(-1)?.[1] ?? 0)}`) : [];
    const marginRight = showEndLabels && endLabels.length ? Math.ceil(Math.max(...endLabels.map((l) => estimateTextWidth(l, 12)))) + 14 : 12;
    const margin = { top: 12, right: Math.min(marginRight, Math.max(12, width * 0.35)), bottom: 28, left: marginLeft };
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom);

    const x = useMemo(
        () =>
            scalePoint<number>()
                .domain(data.map((_, i) => i))
                .range([0, plotWidth]),
        [data, plotWidth],
    );
    y.range([plotHeight, 0]);

    const xOf = useCallback((i: number) => x(i) ?? 0, [x]);
    const lineGen = useMemo(
        () =>
            d3Line<[number, number]>()
                .x((_, i) => xOf(i))
                .y((d) => y(d[1]))
                .curve(curves[curve]),
        [xOf, y, curve],
    );
    const areaGen = useMemo(
        () =>
            d3Area<[number, number]>()
                .x((_, i) => xOf(i))
                .y0((d) => (variant === "stacked-area" ? y(d[0]) : y(Math.max(0, yExtent[0]))))
                .y1((d) => y(d[1]))
                .curve(curves[curve]),
        [xOf, y, curve, variant, yExtent],
    );

    const focus = useChartFocus({
        rowCount: visible.length,
        colCount: () => data.length,
        onSelect: onPointSelect ? ({ row, col }) => onPointSelect({ datum: data[col], seriesKey: visible[row].key, index: col }) : undefined,
    });
    const current = focus.current;

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!current || !data[current.col]) return null;
        const anchorSeries = values[current.row];
        return {
            x: margin.left + xOf(current.col),
            y: margin.top + y(anchorSeries?.[current.col]?.[1] ?? 0),
            title: formatX(data[current.col], current.col),
            rows: visible.map((s, si) => ({
                name: s.name,
                value: valueFormatter(stacks.current[si][current.col][1] - (variant === "stacked-area" ? stacks.current[si][current.col][0] : 0)),
                color: s.color,
                isActive: si === current.row,
            })),
        };
    }, [current, data, values, visible, stacks, margin.left, margin.top, xOf, y, formatX, valueFormatter, variant]);
    useChartTooltip(tooltip);

    const handlePointerMove = useCallback(
        (event: PointerEvent<SVGRectElement>) => {
            if (data.length === 0 || visible.length === 0) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const px = event.clientX - rect.left;
            const py = event.clientY - rect.top;
            const step = x.step() || 1;
            const col = Math.max(0, Math.min(data.length - 1, Math.round(px / step)));
            let row = 0;
            let best = Infinity;
            values.forEach((layer, si) => {
                const d = Math.abs(y(layer[col][1]) - py);
                if (d < best) {
                    best = d;
                    row = si;
                }
            });
            focus.setHovered({ row, col });
        },
        [data.length, visible.length, x, values, y, focus],
    );

    const clipId = `${id}-reveal`;
    const revealWidth = isUpdate ? plotWidth : plotWidth * progress;
    const revealHeight = isUpdate ? plotHeight : plotHeight * progress;
    const revealVertical = variant === "stacked-area";
    const widestXLabel = Math.max(0, ...data.map((d, i) => estimateTextWidth(formatX(d, i), 12)));
    const xTicks = evenlySpacedIndices(data.length, Math.max(2, Math.floor(plotWidth / Math.max(64, widestXLabel + 16))));

    // Resolve end-label collisions by pushing labels apart vertically.
    const endLabelPositions = useMemo(() => {
        if (!showEndLabels) return [];
        const items = visible.map((s, si) => ({ si, y: y(values[si]?.at(-1)?.[1] ?? 0) })).sort((a, b) => a.y - b.y);
        for (let i = 1; i < items.length; i++) if (items[i].y - items[i - 1].y < 14) items[i].y = items[i - 1].y + 14;
        return items;
    }, [showEndLabels, visible, values, y]);

    return (
        <g transform={`translate(${margin.left},${margin.top})`}>
            <defs>
                <clipPath id={clipId}>
                    {revealVertical ? (
                        <rect x={-8} y={plotHeight - revealHeight} width={plotWidth + 16} height={revealHeight + 8} />
                    ) : (
                        <rect x={-8} y={-8} width={revealWidth + 8} height={plotHeight + 16} />
                    )}
                </clipPath>
                {variant === "area" &&
                    visible.map((s) => (
                        <linearGradient key={s.key} id={`${id}-${s.key}-fill`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                            <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                        </linearGradient>
                    ))}
            </defs>

            {showGrid && <ChartGrid horizontal={ticks.map((t) => y(t))} width={plotWidth} height={plotHeight} />}
            <ChartAxisLeft ticks={ticks.map((t) => ({ position: y(t), label: tickFormatter(t) }))} />
            <ChartAxisBottom ticks={xTicks.map((i) => ({ position: xOf(i), label: formatX(data[i], i) }))} y={plotHeight} />

            <g clipPath={`url(#${clipId})`}>
                {visible.map((s, si) => (
                    <g key={s.key} role="group" aria-label={s.name}>
                        {variant !== "line" && (
                            <path
                                d={areaGen(values[si]) ?? undefined}
                                fill={variant === "area" ? `url(#${id}-${s.key}-fill)` : s.color}
                                fillOpacity={variant === "area" ? 1 : 0.14}
                            />
                        )}
                        <path d={lineGen(values[si]) ?? undefined} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    </g>
                ))}
            </g>

            {/* Pointer hit band: sits under the marks so clicks still reach them. */}
            <rect
                x={0}
                y={0}
                width={plotWidth}
                height={plotHeight}
                fill="transparent"
                onPointerMove={handlePointerMove}
                onPointerLeave={() => focus.setHovered(null)}
            />

            {current && <ChartCrosshair x={xOf(current.col)} height={plotHeight} />}

            {visible.map((s, si) => (
                <g key={s.key}>
                    {values[si].map((point, i) => {
                        const cx = xOf(i);
                        const cy = y(point[1]);
                        const isCurrent = focus.isCurrent(si, i);
                        const isVisible = showDots || isCurrent;
                        const appear = isUpdate ? 1 : stagger(progress, i, data.length, 0.6);
                        const label = `${formatX(data[i], i)}, ${s.name}, ${valueFormatter(stacks.current[si][i][1] - (variant === "stacked-area" ? stacks.current[si][i][0] : 0))}`;
                        return (
                            <g key={i} {...focus.getItemProps(si, i, label)}>
                                <circle cx={cx} cy={cy} r={12} fill="transparent" />
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={isCurrent ? DOT_RADIUS + 1 : DOT_RADIUS}
                                    fill={s.color}
                                    className="stroke-bg-primary transition-[r] duration-100 ease-linear"
                                    strokeWidth={2}
                                    style={{ opacity: isVisible ? appear : 0 }}
                                />
                            </g>
                        );
                    })}
                </g>
            ))}

            {focus.isKeyboard && current && values[current.row]?.[current.col] && (
                <ChartFocusRing shape={{ type: "circle", cx: xOf(current.col), cy: y(values[current.row][current.col][1]), r: DOT_RADIUS + 1 }} />
            )}

            {showEndLabels &&
                endLabelPositions.map(({ si, y: ly }) => (
                    <ChartLabel key={visible[si].key} x={plotWidth + 10} y={ly} className="transition-opacity duration-300" tone="secondary">
                        {fitLabel(endLabels[si], margin.right - 12)}
                        <title>{endLabels[si]}</title>
                    </ChartLabel>
                ))}
        </g>
    );
};
