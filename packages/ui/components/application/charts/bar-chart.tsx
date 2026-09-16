"use client";

import { useCallback, useMemo, useState } from "react";
import { max as d3Max, min as d3Min } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { stack as d3Stack } from "d3-shape";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartAxisBottom, ChartAxisLeft, ChartBaseline, ChartFocusRing, ChartGrid, ChartLabel } from "./chart-primitives";
import type { ChartSeries, ChartTooltipData } from "./chart-types";
import {
    clamp01,
    divergingColor,
    estimateTextWidth,
    evenlySpacedIndices,
    fitLabel,
    formatCompact,
    formatNumber,
    lerp,
    roundedBarPath,
    roundedHorizontalBarPath,
    seriesColor,
    stagger,
    toLabel,
    toNumber,
} from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition, usePreviousDistinct } from "./use-chart-motion";

export interface BarChartProps<T extends object> extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty"> {
    /** One datum per category, in display order. Memoise it: a new array identity replays the transition. */
    data: T[];
    /** The property that labels each category. */
    xKey: Extract<keyof T, string>;
    /** The series to plot, at most 8. Colors are assigned in slot order unless a series sets its own. */
    series: ChartSeries<T>[];
    /** `vertical` grows bars up from a baseline; `horizontal` grows them right from the category label. */
    orientation?: "vertical" | "horizontal";
    /**
     * `grouped` places series side by side; `stacked` stacks them with a 2px surface gap;
     * `diverging` plots one signed series around a centred zero line (negatives take the orange pole).
     */
    mode?: "grouped" | "stacked" | "diverging";
    /** Direct-labels each bar at its tip (stacked bars label only the total). Labels always sit outside the bar so they never clip. */
    showValues?: boolean;
    /** Bars never grow thicker than this, in px. They stay centred in their band. */
    maxBarThickness?: number;
    /** Corner radius at the data end of each bar. The baseline end is always square. */
    barRadius?: number;
    showGrid?: boolean;
    /** Hides the legend. It is shown by default whenever there is more than one series. */
    showLegend?: boolean;
    /** Formats category labels for the axis, tooltip and table. */
    xFormatter?: (value: T[Extract<keyof T, string>], index: number) => string;
    /** Formats values for tooltips, labels and the table. */
    valueFormatter?: (value: number) => string;
    /** Formats value-axis ticks. Defaults to compact notation (1.2K). */
    tickFormatter?: (value: number) => string;
    /** Fixes the value domain instead of deriving it from the data. */
    yDomain?: [number, number];
    /** Approximate number of value ticks. */
    yTicks?: number;
    /** Called when a bar is activated with Enter, Space or a click. */
    onBarSelect?: (info: { datum: T; seriesKey: string; index: number }) => void;
}

/**
 * Grouped, stacked, horizontal and diverging bar chart for comparing
 * magnitudes across categories. Built directly on d3-scale and d3-shape;
 * every bar is a focusable mark and the whole dataset is mirrored in an
 * accessible table.
 */
export const BarChart = <T extends object>({
    data,
    xKey,
    series,
    orientation = "vertical",
    mode = "grouped",
    showValues = false,
    maxBarThickness = 24,
    barRadius = 4,
    showGrid = true,
    showLegend,
    xFormatter,
    valueFormatter = formatNumber,
    tickFormatter = formatCompact,
    yDomain,
    yTicks = 4,
    onBarSelect,
    description,
    ...chartProps
}: BarChartProps<T>) => {
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
    const formatValue = useCallback(
        (value: number) => (mode === "diverging" && value > 0 ? `+${valueFormatter(value)}` : valueFormatter(value)),
        [mode, valueFormatter],
    );

    const legend = useMemo(
        () => series.map((s, index) => ({ key: s.key, name: s.name ?? s.key, color: seriesColor(index, s.color), shape: "square" as const })),
        [series],
    );

    const table = useMemo(
        () => ({
            columns: [String(xKey), ...series.map((s) => s.name ?? s.key)],
            rows: data.map((datum, index) => [formatX(datum, index), ...series.map((s) => formatValue(toNumber(datum[s.key])))]),
        }),
        [data, series, xKey, formatX, formatValue],
    );

    const autoDescription = useMemo(() => {
        if (data.length === 0 || series.length === 0) return "No data.";
        const first = series[0];
        const values = data.map((d) => toNumber(d[first.key]));
        const peakIndex = values.indexOf(Math.max(...values));
        const lowIndex = values.indexOf(Math.min(...values));
        return `${series.length} series across ${data.length} categories. ${first.name ?? first.key} is highest at ${formatX(data[peakIndex], peakIndex)} (${formatValue(values[peakIndex])}) and lowest at ${formatX(data[lowIndex], lowIndex)} (${formatValue(values[lowIndex])}).`;
    }, [data, series, formatValue, formatX]);

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
                <BarChartPlot
                    {...size}
                    data={data}
                    series={series}
                    hidden={hidden}
                    orientation={orientation}
                    mode={mode}
                    showValues={showValues}
                    maxBarThickness={maxBarThickness}
                    barRadius={barRadius}
                    showGrid={showGrid}
                    formatX={formatX}
                    formatValue={formatValue}
                    tickFormatter={tickFormatter}
                    yDomain={yDomain}
                    yTicks={yTicks}
                    onBarSelect={onBarSelect}
                />
            )}
        </Chart>
    );
};

interface BarChartPlotProps<T extends object> {
    width: number;
    height: number;
    data: T[];
    series: ChartSeries<T>[];
    hidden: ReadonlySet<string>;
    orientation: NonNullable<BarChartProps<T>["orientation"]>;
    mode: NonNullable<BarChartProps<T>["mode"]>;
    showValues: boolean;
    maxBarThickness: number;
    barRadius: number;
    showGrid: boolean;
    formatX: (datum: T, index: number) => string;
    formatValue: (value: number) => string;
    tickFormatter: (value: number) => string;
    yDomain?: [number, number];
    yTicks: number;
    onBarSelect?: BarChartProps<T>["onBarSelect"];
}

/** Surface gap between touching marks (grouped neighbours and stacked segments), in px. */
const GAP = 2;

const BarChartPlot = <T extends object>({
    width,
    height,
    data,
    series,
    hidden,
    orientation,
    mode,
    showValues,
    maxBarThickness,
    barRadius,
    showGrid,
    formatX,
    formatValue,
    tickFormatter,
    yDomain,
    yTicks,
    onBarSelect,
}: BarChartPlotProps<T>) => {
    const progress = useChartTransition(data);
    const previousData = usePreviousDistinct(data);
    const isUpdate = previousData !== undefined && previousData.length === data.length;
    const isHorizontal = orientation === "horizontal";
    const isStacked = mode === "stacked";
    const isDiverging = mode === "diverging";

    const visible = useMemo(
        () => series.map((s, index) => ({ ...s, index, color: seriesColor(index, s.color), name: s.name ?? s.key })).filter((s) => !hidden.has(s.key)),
        [series, hidden],
    );
    const seriesCount = visible.length;
    const categoryCount = data.length;

    // Values per visible series: [v0, v1] per category (stacked) or [0, value].
    const stacks = useMemo(() => {
        const compute = (rows: T[]) => {
            if (isStacked) {
                const stacked = d3Stack<T, string>()
                    .keys(visible.map((s) => s.key))
                    .value((d, key) => Math.max(0, toNumber(d[key as keyof T])))(rows);
                return stacked.map((layer) => layer.map((point) => [point[0], point[1]] as [number, number]));
            }
            return visible.map((s) => rows.map((d) => [0, toNumber(d[s.key])] as [number, number]));
        };
        return { current: compute(data), previous: isUpdate && previousData ? compute(previousData) : null };
    }, [data, previousData, isUpdate, visible, isStacked]);

    // Animated values: entry grows every bar from the baseline (staggered by
    // category, then by series); updates tween from the previous dataset.
    const values = useMemo(
        () =>
            stacks.current.map((layer, si) =>
                layer.map(([v0, v1], i) => {
                    const prev = stacks.previous?.[si]?.[i];
                    if (prev) return [lerp(prev[0], v0, progress), lerp(prev[1], v1, progress)] as [number, number];
                    const t = isStacked ? stagger(progress, i * seriesCount + si, categoryCount * seriesCount, 0.5) : stagger(progress, i, categoryCount, 0.4);
                    return [v0 * t, v1 * t] as [number, number];
                }),
            ),
        [stacks, progress, isStacked, seriesCount, categoryCount],
    );

    const valueExtent = useMemo<[number, number]>(() => {
        if (yDomain) return yDomain;
        const all = stacks.current.flat();
        const lo = Math.min(0, d3Min(all, (v) => Math.min(v[0], v[1])) ?? 0);
        const hi = Math.max(0, d3Max(all, (v) => Math.max(v[0], v[1])) ?? 0);
        if (isDiverging) {
            const m = Math.max(Math.abs(lo), Math.abs(hi)) || 1;
            return [-m, m];
        }
        return [lo, hi === lo ? lo + 1 : hi];
    }, [stacks, yDomain, isDiverging]);

    const valueScale = useMemo(() => scaleLinear().domain(valueExtent).nice(yTicks), [valueExtent, yTicks]);
    const ticks = valueScale.ticks(yTicks);
    const categoryLabels = useMemo(() => data.map((d, i) => formatX(d, i)), [data, formatX]);
    const showValueAxis = !(isHorizontal && showValues);

    // Widest tip label, used to reserve room so labels never run off the plot.
    const widestValueLabel = showValues ? Math.ceil(Math.max(0, ...stacks.current.flat().map((v) => estimateTextWidth(formatValue(v[1]), 12)))) : 0;
    const widestCategoryLabel = Math.ceil(Math.max(0, ...categoryLabels.map((l) => estimateTextWidth(l, 12))));
    const widestTick = Math.ceil(Math.max(0, ...ticks.map((t) => estimateTextWidth(tickFormatter(t), 12))));

    const margin = isHorizontal
        ? {
              top: 6,
              right: showValues ? widestValueLabel + 12 : 12,
              bottom: showValueAxis ? 28 : 6,
              left: Math.min(Math.max(28, widestCategoryLabel + 14), Math.max(28, width * 0.4)),
          }
        : { top: showValues ? 22 : 12, right: 12, bottom: 28, left: Math.max(28, widestTick + 12) };
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom);

    const band = useMemo(
        () =>
            scaleBand<number>()
                .domain(data.map((_, i) => i))
                .range([0, isHorizontal ? plotHeight : plotWidth])
                .paddingInner(0.3)
                .paddingOuter(0.15),
        [data, isHorizontal, plotWidth, plotHeight],
    );
    valueScale.range(isHorizontal ? [0, plotWidth] : [plotHeight, 0]);

    // Bar thickness and offset within the category band.
    const bandwidth = band.bandwidth();
    const groupCount = isStacked ? 1 : Math.max(1, seriesCount);
    const thickness = Math.max(1, Math.min(maxBarThickness, (bandwidth - GAP * (groupCount - 1)) / groupCount));
    const groupSize = groupCount * thickness + GAP * (groupCount - 1);
    const groupOffset = (bandwidth - groupSize) / 2;
    const barStart = (i: number, si: number) => (band(i) ?? 0) + groupOffset + (isStacked ? 0 : si * (thickness + GAP));

    const zero = valueScale(0);

    const focus = useChartFocus({
        rowCount: seriesCount,
        colCount: () => categoryCount,
        navigation: seriesCount === 1 ? "list" : "grid",
        onSelect: onBarSelect ? ({ row, col }) => onBarSelect({ datum: data[col], seriesKey: visible[row].key, index: col }) : undefined,
    });
    const current = focus.current;

    /** Geometry of the bar (or stacked segment) for series `si` at category `i`, in plot px. */
    const barRect = useCallback(
        (si: number, i: number) => {
            const [v0, v1] = values[si]?.[i] ?? [0, 0];
            const start = barStart(i, si);
            const a = valueScale(v0);
            const b = valueScale(v1);
            if (isHorizontal) {
                const x0 = Math.min(a, b);
                return { x: x0, y: start, width: Math.abs(b - a), height: thickness, negative: v1 < v0 };
            }
            const y0 = Math.min(a, b);
            return { x: start, y: y0, width: thickness, height: Math.abs(b - a), negative: v1 < v0 };
        },
        // barStart is a plain closure over stable scale values.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [values, valueScale, isHorizontal, thickness, band, groupOffset, isStacked],
    );

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!current || !data[current.col]) return null;
        const rect = barRect(current.row, current.col);
        return {
            x: margin.left + (isHorizontal ? (rect.negative ? rect.x : rect.x + rect.width) : rect.x + rect.width / 2),
            y: margin.top + (isHorizontal ? rect.y + rect.height / 2 : rect.negative ? rect.y + rect.height : rect.y),
            title: categoryLabels[current.col],
            rows: visible.map((s, si) => {
                const [v0, v1] = stacks.current[si][current.col];
                return {
                    name: s.name,
                    value: formatValue(isStacked ? v1 - v0 : v1),
                    color: isDiverging ? divergingColor(v1) : s.color,
                    isActive: si === current.row,
                };
            }),
        };
    }, [current, data, barRect, margin.left, margin.top, isHorizontal, categoryLabels, visible, stacks, formatValue, isStacked, isDiverging]);
    useChartTooltip(tooltip);

    const categoryTicks = useMemo(() => {
        const indices = isHorizontal
            ? data.map((_, i) => i)
            : evenlySpacedIndices(categoryCount, Math.max(2, Math.floor(plotWidth / Math.max(56, widestCategoryLabel + 16))));
        return indices.map((i) => ({ position: (band(i) ?? 0) + bandwidth / 2, label: categoryLabels[i] }));
    }, [isHorizontal, data, categoryCount, plotWidth, band, bandwidth, categoryLabels, widestCategoryLabel]);

    // Index of the topmost (outermost) non-empty stacked segment per category, which is the only rounded one.
    const topSegment = useMemo(
        () =>
            data.map((_, i) => {
                for (let si = seriesCount - 1; si >= 0; si--) {
                    const [v0, v1] = stacks.current[si]?.[i] ?? [0, 0];
                    if (v1 - v0 > 0) return si;
                }
                return -1;
            }),
        [data, seriesCount, stacks],
    );

    const ringShape = useMemo(() => {
        if (!focus.isKeyboard || !current || !values[current.row]?.[current.col]) return null;
        const rect = barRect(current.row, current.col);
        return { type: "rect" as const, x: rect.x, y: rect.y, width: rect.width, height: rect.height, rx: barRadius };
    }, [focus.isKeyboard, current, values, barRect, barRadius]);

    return (
        <g transform={`translate(${margin.left},${margin.top})`}>
            {showGrid &&
                showValueAxis &&
                (isHorizontal ? (
                    <ChartGrid vertical={ticks.map((t) => valueScale(t))} width={plotWidth} height={plotHeight} />
                ) : (
                    <ChartGrid horizontal={ticks.map((t) => valueScale(t))} width={plotWidth} height={plotHeight} />
                ))}

            {isHorizontal ? (
                <>
                    <g aria-hidden="true" className="fill-text-secondary text-xs">
                        {categoryTicks.map((tick, index) => (
                            <text key={index} x={-10} y={tick.position} dy="0.32em" textAnchor="end">
                                {fitLabel(tick.label, margin.left - 14)}
                                <title>{tick.label}</title>
                            </text>
                        ))}
                    </g>
                    {showValueAxis && <ChartAxisBottom ticks={ticks.map((t) => ({ position: valueScale(t), label: tickFormatter(t) }))} y={plotHeight} />}
                    <line
                        aria-hidden="true"
                        x1={zero}
                        x2={zero}
                        y1={0}
                        y2={plotHeight}
                        className="stroke-chart-axis"
                        strokeWidth={1}
                        shapeRendering="crispEdges"
                    />
                </>
            ) : (
                <>
                    <ChartAxisLeft ticks={ticks.map((t) => ({ position: valueScale(t), label: tickFormatter(t) }))} />
                    <ChartAxisBottom ticks={categoryTicks} y={plotHeight} />
                    <ChartBaseline y={zero} width={plotWidth} />
                </>
            )}

            {visible.map((s, si) => (
                <g key={s.key} role="group" aria-label={s.name}>
                    {data.map((_, i) => {
                        const [v0, v1] = stacks.current[si][i];
                        const segmentValue = isStacked ? v1 - v0 : v1;
                        const rect = barRect(si, i);
                        const isCurrent = focus.isCurrent(si, i);
                        const color = isDiverging ? divergingColor(v1) : s.color;
                        const isRounded = !isStacked || topSegment[i] === si;
                        // Stacked segments leave a 1px surface gap above and below.
                        const inset = isStacked ? 1 : 0;
                        let d: string;
                        if (isHorizontal) {
                            const w = Math.max(0, rect.width - inset * 2);
                            d = rect.negative
                                ? roundedHorizontalBarPath(rect.x + rect.width - inset, rect.y, w, rect.height, isRounded ? barRadius : 0, "left")
                                : roundedHorizontalBarPath(rect.x + inset, rect.y, w, rect.height, isRounded ? barRadius : 0, "right");
                        } else {
                            const h = Math.max(0, rect.height - inset * 2);
                            d = rect.negative
                                ? roundedBarPath(rect.x, rect.y + inset, rect.width, h, isRounded ? barRadius : 0, "down")
                                : roundedBarPath(rect.x, rect.y + rect.height - inset, rect.width, h, isRounded ? barRadius : 0, "up");
                        }
                        const label = `${categoryLabels[i]}, ${s.name}, ${formatValue(segmentValue)}`;
                        const hitStart = isStacked ? (band(i) ?? 0) : rect[isHorizontal ? "y" : "x"] - GAP / 2;
                        const hitSize = isStacked ? bandwidth : thickness + GAP;

                        return (
                            <g key={i} {...focus.getItemProps(si, i, label, "bar")}>
                                {/* Generous hit target: the whole band (or the series' slot) across the plot. */}
                                {isHorizontal ? (
                                    <rect x={0} y={hitStart} width={plotWidth} height={hitSize} fill="transparent" />
                                ) : (
                                    <rect x={hitStart} y={0} width={hitSize} height={plotHeight} fill="transparent" />
                                )}
                                <path d={d} fill={color} fillOpacity={isCurrent ? 0.8 : 1} className="transition-[fill-opacity] duration-100 ease-linear" />
                            </g>
                        );
                    })}
                </g>
            ))}

            {showValues &&
                data.map((_, i) => {
                    const labelSeries = isStacked ? [seriesCount - 1] : visible.map((_, si) => si);
                    return labelSeries.map((si) => {
                        if (si < 0 || !values[si]) return null;
                        // Stacked bars label the total (the top segment's upper edge); others label their own value.
                        const [, v1] = stacks.current[si][i];
                        const rect = barRect(si, i);
                        const negative = rect.negative;
                        // Fade the label in with the bar's own growth.
                        const opacity = isUpdate ? 1 : clamp01((stagger(progress, i, categoryCount, 0.4) - 0.6) / 0.4);
                        const text = formatValue(v1);
                        if (isHorizontal) {
                            return (
                                <ChartLabel
                                    key={`${si}-${i}`}
                                    x={negative ? rect.x - 8 : rect.x + rect.width + 8}
                                    y={rect.y + rect.height / 2}
                                    anchor={negative ? "end" : "start"}
                                    className="transition-opacity duration-200"
                                    tone="secondary"
                                >
                                    <tspan style={{ opacity }}>{text}</tspan>
                                </ChartLabel>
                            );
                        }
                        return (
                            <ChartLabel
                                key={`${si}-${i}`}
                                x={rect.x + rect.width / 2}
                                y={negative ? rect.y + rect.height + 6 : rect.y - 6}
                                anchor="middle"
                                baseline={negative ? "hanging" : "auto"}
                                tone="secondary"
                            >
                                <tspan style={{ opacity }}>{text}</tspan>
                            </ChartLabel>
                        );
                    });
                })}

            {ringShape && <ChartFocusRing shape={ringShape} offset={3} />}
        </g>
    );
};
