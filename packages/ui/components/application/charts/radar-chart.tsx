"use client";

import { useCallback, useMemo, useState } from "react";
import { max as d3Max } from "d3-array";
import { scaleLinear } from "d3-scale";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartFocusRing } from "./chart-primitives";
import type { ChartSeries, ChartTooltipData } from "./chart-types";
import { clamp01, fitLabel, formatNumber, lerp, seriesColor, stagger, toLabel, toNumber } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition, usePreviousDistinct } from "./use-chart-motion";

export interface RadarChartProps<T extends object> extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty"> {
    /** One datum per axis, in clockwise order starting at the top. Memoise it: a new array identity replays the transition. */
    data: T[];
    /** The property that names each axis. */
    axisKey: Extract<keyof T, string>;
    /** The series to plot. Two read best; the palette supports up to 8. */
    series: ChartSeries<T>[];
    /** Outer ring value. Defaults to a nice ceiling of the largest value. */
    max?: number;
    /** Number of concentric grid levels. */
    levels?: number;
    /** Renders a marker at every vertex. Markers always exist for keyboard focus; this only makes them visible at rest. */
    showDots?: boolean;
    /** Hides the legend. It is shown by default whenever there is more than one series. */
    showLegend?: boolean;
    /** Formats values for tooltips and the table. */
    valueFormatter?: (value: number) => string;
    /** Called when a vertex is activated with Enter, Space or a click. */
    onPointSelect?: (info: { datum: T; seriesKey: string; index: number }) => void;
}

/**
 * Radar (spider) chart for comparing a profile across several dimensions.
 * Each vertex is a focusable mark and the whole grid of values is mirrored
 * in an accessible table.
 */
export const RadarChart = <T extends object>({
    data,
    axisKey,
    series,
    max,
    levels = 4,
    showDots = true,
    showLegend,
    valueFormatter = formatNumber,
    onPointSelect,
    description,
    height = 280,
    ...chartProps
}: RadarChartProps<T>) => {
    const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set());
    const toggle = useCallback((key: string) => {
        setHidden((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    const axisLabel = useCallback((datum: T) => toLabel(datum[axisKey]), [axisKey]);

    const legend = useMemo(
        () => series.map((s, index) => ({ key: s.key, name: s.name ?? s.key, color: seriesColor(index, s.color), shape: "line" as const })),
        [series],
    );

    const table = useMemo(
        () => ({
            columns: ["Axis", ...series.map((s) => s.name ?? s.key)],
            rows: data.map((datum) => [axisLabel(datum), ...series.map((s) => valueFormatter(toNumber(datum[s.key])))]),
        }),
        [data, series, axisLabel, valueFormatter],
    );

    const autoDescription = useMemo(() => {
        if (data.length === 0 || series.length === 0) return "No data.";
        const first = series[0];
        const values = data.map((d) => toNumber(d[first.key]));
        const peakIndex = values.indexOf(Math.max(...values));
        return `${series.length} series across ${data.length} axes. ${first.name ?? first.key} is strongest on ${axisLabel(data[peakIndex])} at ${valueFormatter(values[peakIndex])}.`;
    }, [data, series, valueFormatter, axisLabel]);

    const shouldShowLegend = showLegend ?? series.length > 1;

    return (
        <Chart
            {...chartProps}
            height={height}
            description={description ?? autoDescription}
            legend={shouldShowLegend ? legend : undefined}
            hiddenKeys={hidden}
            onLegendToggle={shouldShowLegend ? toggle : undefined}
            table={table}
            isEmpty={data.length === 0 || series.length === 0}
        >
            {(size) => (
                <RadarChartPlot
                    {...size}
                    data={data}
                    series={series}
                    hidden={hidden}
                    max={max}
                    levels={levels}
                    showDots={showDots}
                    axisLabel={axisLabel}
                    valueFormatter={valueFormatter}
                    onPointSelect={onPointSelect}
                />
            )}
        </Chart>
    );
};

interface RadarChartPlotProps<T extends object> {
    width: number;
    height: number;
    data: T[];
    series: ChartSeries<T>[];
    hidden: ReadonlySet<string>;
    max?: number;
    levels: number;
    showDots: boolean;
    axisLabel: (datum: T) => string;
    valueFormatter: (value: number) => string;
    onPointSelect?: RadarChartProps<T>["onPointSelect"];
}

const DOT_RADIUS = 4;
const LABEL_GAP = 16;

const RadarChartPlot = <T extends object>({
    width,
    height,
    data,
    series,
    hidden,
    max,
    levels,
    showDots,
    axisLabel,
    valueFormatter,
    onPointSelect,
}: RadarChartPlotProps<T>) => {
    const progress = useChartTransition(data);
    const previousData = usePreviousDistinct(data);
    const isUpdate = previousData !== undefined && previousData.length === data.length;

    const visible = useMemo(
        () => series.map((s, index) => ({ ...s, index, color: seriesColor(index, s.color), name: s.name ?? s.key })).filter((s) => !hidden.has(s.key)),
        [series, hidden],
    );

    const targets = useMemo(() => {
        const compute = (rows: T[]) => visible.map((s) => rows.map((d) => toNumber(d[s.key])));
        return { current: compute(data), previous: isUpdate && previousData ? compute(previousData) : null };
    }, [data, previousData, isUpdate, visible]);

    const ceiling = useMemo(() => {
        if (max !== undefined) return max;
        const dataMax = d3Max(targets.current.flat()) ?? 0;
        return scaleLinear().domain([0, dataMax]).nice(levels).domain()[1] || 1;
    }, [max, targets, levels]);

    const axisLabels = useMemo(() => data.map((d) => axisLabel(d)), [data, axisLabel]);
    const labelSpace = Math.min(width * 0.2, Math.max(...axisLabels.map((l) => l.length * 12 * 0.58), 0)) + LABEL_GAP;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.max(10, Math.min(width / 2 - labelSpace, height / 2 - LABEL_GAP - 8));
    const r = useMemo(() => scaleLinear().domain([0, ceiling]).range([0, radius]), [ceiling, radius]);

    const angle = useCallback((i: number) => (Math.PI * 2 * i) / Math.max(1, data.length) - Math.PI / 2, [data.length]);
    // Geometry never goes below the centre: a negative value plots at 0 (the tooltip and table keep the real number).
    const pointAt = useCallback(
        (i: number, value: number) => [Math.cos(angle(i)) * r(Math.max(0, value)), Math.sin(angle(i)) * r(Math.max(0, value))] as [number, number],
        [angle, r],
    );

    // Per-series animated values: morph on update, scale out from the centre on entry.
    const values = useMemo(
        () =>
            targets.current.map((layer, si) => {
                const grow = isUpdate ? 1 : stagger(progress, si, targets.current.length, 0.25);
                return layer.map((v, i) => {
                    const prev = targets.previous?.[si]?.[i];
                    return prev !== undefined ? lerp(prev, v, progress) : v * grow;
                });
            }),
        [targets, progress, isUpdate],
    );

    const focus = useChartFocus({
        rowCount: visible.length,
        colCount: () => data.length,
        onSelect: onPointSelect ? ({ row, col }) => onPointSelect({ datum: data[col], seriesKey: visible[row].key, index: col }) : undefined,
    });
    const current = focus.current;

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!current || !data[current.col]) return null;
        const [px, py] = pointAt(current.col, values[current.row]?.[current.col] ?? 0);
        return {
            x: cx + px,
            y: cy + py,
            title: axisLabels[current.col],
            rows: visible.map((s, si) => ({
                name: s.name,
                value: valueFormatter(targets.current[si][current.col]),
                color: s.color,
                isActive: si === current.row,
            })),
        };
    }, [current, data, values, visible, targets, pointAt, cx, cy, axisLabels, valueFormatter]);
    useChartTooltip(tooltip);

    const levelValues = Array.from({ length: levels }, (_, i) => (ceiling * (i + 1)) / levels);
    const polygon = (radiusValue: number) => data.map((_, i) => pointAt(i, radiusValue).join(",")).join(" ");
    const anchorFor = (i: number): "start" | "middle" | "end" => {
        const c = Math.cos(angle(i));
        return Math.abs(c) < 0.1 ? "middle" : c > 0 ? "start" : "end";
    };

    return (
        <g transform={`translate(${cx},${cy})`}>
            <g aria-hidden="true" className="stroke-chart-grid" strokeWidth={1} fill="none">
                {levelValues.map((level, i) => (
                    <polygon key={i} points={polygon(level)} />
                ))}
                {data.map((_, i) => {
                    const [x, y] = pointAt(i, ceiling);
                    return <line key={i} x1={0} y1={0} x2={x} y2={y} />;
                })}
            </g>

            <g aria-hidden="true" className="fill-text-secondary text-xs">
                {data.map((_, i) => {
                    const [x, y] = pointAt(i, ceiling);
                    const c = Math.cos(angle(i));
                    const s = Math.sin(angle(i));
                    return (
                        <text key={i} x={x + c * LABEL_GAP} y={y + s * LABEL_GAP} dy="0.32em" textAnchor={anchorFor(i)}>
                            {fitLabel(axisLabels[i], Math.max(30, labelSpace - LABEL_GAP + (anchorFor(i) === "middle" ? width * 0.3 : 0)))}
                            <title>{axisLabels[i]}</title>
                        </text>
                    );
                })}
            </g>

            {visible.map((s, si) => (
                <g key={s.key} role="group" aria-label={s.name}>
                    <path
                        d={`M${values[si].map((v, i) => pointAt(i, v).join(",")).join("L")}Z`}
                        fill={s.color}
                        fillOpacity={0.12}
                        stroke={s.color}
                        strokeWidth={2}
                        strokeLinejoin="round"
                    />
                </g>
            ))}

            {visible.map((s, si) => (
                <g key={s.key}>
                    {values[si].map((v, i) => {
                        const [x, y] = pointAt(i, v);
                        const isCurrent = focus.isCurrent(si, i);
                        const isVisible = showDots || isCurrent;
                        const appear = isUpdate ? 1 : clamp01((progress - 0.6) / 0.4);
                        const label = `${axisLabels[i]}, ${s.name}, ${valueFormatter(targets.current[si][i])}`;
                        return (
                            <g key={i} {...focus.getItemProps(si, i, label)}>
                                <circle cx={x} cy={y} r={12} fill="transparent" />
                                <circle
                                    cx={x}
                                    cy={y}
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

            {focus.isKeyboard && current && values[current.row] && (
                <ChartFocusRing
                    shape={{
                        type: "circle",
                        cx: pointAt(current.col, values[current.row][current.col])[0],
                        cy: pointAt(current.col, values[current.row][current.col])[1],
                        r: DOT_RADIUS + 1,
                    }}
                />
            )}
        </g>
    );
};
