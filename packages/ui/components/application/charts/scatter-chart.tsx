"use client";

import { useMemo } from "react";
import { extent } from "d3-array";
import { scaleLinear, scaleSqrt } from "d3-scale";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartAxisBottom, ChartAxisLeft, ChartFocusRing, ChartGrid } from "./chart-primitives";
import type { ChartTooltipData } from "./chart-types";
import { clamp01, estimateTextWidth, formatCompact, formatNumber, lerp, seriesColor, stagger, toLabel, toNumber } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition, usePreviousDistinct } from "./use-chart-motion";

/** The palette is all-pairs validated for three hues, so scatter charts cap categories at three and fold the rest into "Other". */
const MAX_CATEGORIES = 3;
const OTHER_CATEGORY = "Other";

export interface ScatterChartProps<T extends object> extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty"> {
    /** One datum per point. Memoise it: a new array identity replays the transition. */
    data: T[];
    /** The numeric property plotted on the x axis. */
    xKey: Extract<keyof T, string>;
    /** The numeric property plotted on the y axis. */
    yKey: Extract<keyof T, string>;
    /** Optional numeric property that sizes each mark (bubble chart). */
    sizeKey?: Extract<keyof T, string>;
    /** Mark radius range in px used with `sizeKey`. */
    sizeRange?: [number, number];
    /** Optional property that colors marks by category. At most three categories keep distinct hues; the rest fold into "Other". */
    categoryKey?: Extract<keyof T, string>;
    /** Optional property used as each point's tooltip title and table label. */
    labelKey?: Extract<keyof T, string>;
    /** Formats x values for ticks, tooltips and the table. */
    xFormatter?: (value: number) => string;
    /** Formats y values for ticks, tooltips and the table. */
    yFormatter?: (value: number) => string;
    /** Formats size values for tooltips and the table. */
    sizeFormatter?: (value: number) => string;
    /** Fixes the x domain instead of deriving it from the data. */
    xDomain?: [number, number];
    /** Fixes the y domain instead of deriving it from the data. */
    yDomain?: [number, number];
    /** Approximate number of x ticks. */
    xTicks?: number;
    /** Approximate number of y ticks. */
    yTicks?: number;
    showGrid?: boolean;
    /** Hides the legend. It is shown by default whenever `categoryKey` is set. */
    showLegend?: boolean;
    /** Called when a point is activated with Enter, Space or a click. */
    onPointSelect?: (info: { datum: T; index: number }) => void;
}

interface CategoryInfo {
    name: string;
    color: string;
}

/**
 * Scatter and bubble chart for correlation between two measures. Every mark
 * has a 24px hit target, is keyboard focusable in x order and is mirrored in
 * an accessible table.
 */
export const ScatterChart = <T extends object>({
    data,
    xKey,
    yKey,
    sizeKey,
    sizeRange = [3, 14],
    categoryKey,
    labelKey,
    xFormatter = formatCompact,
    yFormatter = formatCompact,
    sizeFormatter = formatNumber,
    xDomain,
    yDomain,
    xTicks = 5,
    yTicks = 4,
    showGrid = true,
    showLegend,
    onPointSelect,
    description,
    ...chartProps
}: ScatterChartProps<T>) => {
    // Categories in first-seen order; color follows the entity, never its rank.
    const categories = useMemo(() => {
        const list: CategoryInfo[] = [];
        if (!categoryKey) return list;
        for (const datum of data) {
            const name = toLabel(datum[categoryKey]);
            if (list.some((c) => c.name === name)) continue;
            if (list.length < MAX_CATEGORIES) list.push({ name, color: seriesColor(list.length) });
            else if (!list.some((c) => c.name === OTHER_CATEGORY)) list.push({ name: OTHER_CATEGORY, color: seriesColor(MAX_CATEGORIES) });
        }
        return list;
    }, [data, categoryKey]);

    const categoryOf = useMemo(() => {
        const named = new Set(categories.map((c) => c.name));
        return (datum: T): CategoryInfo | undefined => {
            if (!categoryKey) return undefined;
            const name = toLabel(datum[categoryKey]);
            return categories.find((c) => c.name === (named.has(name) ? name : OTHER_CATEGORY));
        };
    }, [categories, categoryKey]);

    const labelOf = useMemo(() => (datum: T, index: number) => (labelKey ? toLabel(datum[labelKey]) : `Point ${index + 1}`), [labelKey]);

    const legend = useMemo(() => categories.map((c) => ({ key: c.name, name: c.name, color: c.color, shape: "dot" as const })), [categories]);

    const table = useMemo(
        () => ({
            columns: ["Label", ...(categoryKey ? ["Category"] : []), String(xKey), String(yKey), ...(sizeKey ? [String(sizeKey)] : [])],
            rows: data.map((datum, index) => [
                labelOf(datum, index),
                ...(categoryKey ? [categoryOf(datum)?.name ?? ""] : []),
                xFormatter(toNumber(datum[xKey])),
                yFormatter(toNumber(datum[yKey])),
                ...(sizeKey ? [sizeFormatter(toNumber(datum[sizeKey]))] : []),
            ]),
        }),
        [data, categoryKey, xKey, yKey, sizeKey, labelOf, categoryOf, xFormatter, yFormatter, sizeFormatter],
    );

    const autoDescription = useMemo(() => {
        if (data.length === 0) return "No data.";
        const xs = data.map((d) => toNumber(d[xKey]));
        const ys = data.map((d) => toNumber(d[yKey]));
        return `${data.length} points${categories.length ? ` in ${categories.length} categories` : ""}. ${String(xKey)} spans ${xFormatter(Math.min(...xs))} to ${xFormatter(Math.max(...xs))}; ${String(yKey)} spans ${yFormatter(Math.min(...ys))} to ${yFormatter(Math.max(...ys))}.`;
    }, [data, xKey, yKey, categories.length, xFormatter, yFormatter]);

    const shouldShowLegend = showLegend ?? categories.length > 0;

    return (
        <Chart
            {...chartProps}
            description={description ?? autoDescription}
            legend={shouldShowLegend && legend.length ? legend : undefined}
            table={table}
            isEmpty={data.length === 0}
        >
            {(size) => (
                <ScatterChartPlot
                    {...size}
                    data={data}
                    xKey={xKey}
                    yKey={yKey}
                    sizeKey={sizeKey}
                    sizeRange={sizeRange}
                    categoryOf={categoryOf}
                    labelOf={labelOf}
                    xFormatter={xFormatter}
                    yFormatter={yFormatter}
                    sizeFormatter={sizeFormatter}
                    xDomain={xDomain}
                    yDomain={yDomain}
                    xTicks={xTicks}
                    yTicks={yTicks}
                    showGrid={showGrid}
                    onPointSelect={onPointSelect}
                />
            )}
        </Chart>
    );
};

interface ScatterChartPlotProps<T extends object> {
    width: number;
    height: number;
    data: T[];
    xKey: Extract<keyof T, string>;
    yKey: Extract<keyof T, string>;
    sizeKey?: Extract<keyof T, string>;
    sizeRange: [number, number];
    categoryOf: (datum: T) => CategoryInfo | undefined;
    labelOf: (datum: T, index: number) => string;
    xFormatter: (value: number) => string;
    yFormatter: (value: number) => string;
    sizeFormatter: (value: number) => string;
    xDomain?: [number, number];
    yDomain?: [number, number];
    xTicks: number;
    yTicks: number;
    showGrid: boolean;
    onPointSelect?: ScatterChartProps<T>["onPointSelect"];
}

const DEFAULT_RADIUS = 5;

/** Back-out easing for the pop-in: overshoots slightly past 1 before settling. */
const easeBackOut = (t: number) => {
    const c = 1.4;
    const u = t - 1;
    return 1 + (c + 1) * u * u * u + c * u * u;
};

const ScatterChartPlot = <T extends object>({
    width,
    height,
    data,
    xKey,
    yKey,
    sizeKey,
    sizeRange,
    categoryOf,
    labelOf,
    xFormatter,
    yFormatter,
    sizeFormatter,
    xDomain,
    yDomain,
    xTicks,
    yTicks,
    showGrid,
    onPointSelect,
}: ScatterChartPlotProps<T>) => {
    const progress = useChartTransition(data);
    const previousData = usePreviousDistinct(data);
    const isUpdate = previousData !== undefined && previousData.length === data.length;

    // Points sorted by x so keyboard navigation reads left to right.
    const points = useMemo(() => {
        const read = (rows: T[]) =>
            rows.map((datum, index) => ({ index, x: toNumber(datum[xKey]), y: toNumber(datum[yKey]), size: sizeKey ? toNumber(datum[sizeKey]) : 1 }));
        const current = read(data);
        const previous = isUpdate && previousData ? read(previousData) : null;
        return current
            .map((p) => {
                const prev = previous?.[p.index];
                return prev ? { ...p, x: lerp(prev.x, p.x, progress), y: lerp(prev.y, p.y, progress), size: lerp(prev.size, p.size, progress) } : p;
            })
            .sort((a, b) => a.x - b.x);
    }, [data, previousData, isUpdate, progress, xKey, yKey, sizeKey]);

    const xExtent = useMemo<[number, number]>(() => {
        if (xDomain) return xDomain;
        const [lo, hi] = extent(data, (d) => toNumber(d[xKey])) as [number | undefined, number | undefined];
        const a = lo ?? 0;
        const b = hi ?? 1;
        return a === b ? [a - 1, b + 1] : [a, b];
    }, [data, xKey, xDomain]);
    const yExtent = useMemo<[number, number]>(() => {
        if (yDomain) return yDomain;
        const [lo, hi] = extent(data, (d) => toNumber(d[yKey])) as [number | undefined, number | undefined];
        const a = lo ?? 0;
        const b = hi ?? 1;
        return a === b ? [a - 1, b + 1] : [a, b];
    }, [data, yKey, yDomain]);

    const y = useMemo(() => scaleLinear().domain(yExtent).nice(yTicks), [yExtent, yTicks]);
    const yTickValues = y.ticks(yTicks);
    const marginLeft = Math.max(28, Math.ceil(Math.max(0, ...yTickValues.map((t) => estimateTextWidth(yFormatter(t), 12)))) + 12);
    const margin = { top: 14, right: 16, bottom: 30, left: marginLeft };
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom);

    const x = useMemo(() => scaleLinear().domain(xExtent).nice(xTicks).range([0, plotWidth]), [xExtent, xTicks, plotWidth]);
    y.range([plotHeight, 0]);
    const xTickValues = x.ticks(xTicks);

    const sizeScale = useMemo(() => {
        const [lo, hi] = extent(data, (d) => (sizeKey ? toNumber(d[sizeKey]) : 1)) as [number | undefined, number | undefined];
        return scaleSqrt()
            .domain([lo ?? 0, hi ?? 1])
            .range(sizeRange);
    }, [data, sizeKey, sizeRange]);
    const radiusOf = (size: number) => (sizeKey ? sizeScale(size) : DEFAULT_RADIUS);

    const focus = useChartFocus({
        rowCount: 1,
        colCount: () => points.length,
        navigation: "list",
        onSelect: onPointSelect ? ({ col }) => onPointSelect({ datum: data[points[col].index], index: points[col].index }) : undefined,
    });
    const current = focus.current;
    const currentPoint = current ? points[current.col] : undefined;

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!currentPoint) return null;
        const datum = data[currentPoint.index];
        const category = categoryOf(datum);
        return {
            x: margin.left + x(currentPoint.x),
            y: margin.top + y(currentPoint.y) - radiusOf(currentPoint.size),
            title: labelOf(datum, currentPoint.index),
            rows: [
                ...(category ? [{ name: category.name, value: "", color: category.color }] : []),
                { name: String(xKey), value: xFormatter(toNumber(datum[xKey])) },
                { name: String(yKey), value: yFormatter(toNumber(datum[yKey])) },
                ...(sizeKey ? [{ name: String(sizeKey), value: sizeFormatter(toNumber(datum[sizeKey])) }] : []),
            ],
        };
        // radiusOf is derived from sizeScale/sizeKey, which are already dependencies.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPoint, data, categoryOf, labelOf, margin.left, margin.top, x, y, sizeScale, xKey, yKey, sizeKey, xFormatter, yFormatter, sizeFormatter]);
    useChartTooltip(tooltip);

    return (
        <g transform={`translate(${margin.left},${margin.top})`}>
            {showGrid && <ChartGrid horizontal={yTickValues.map((t) => y(t))} width={plotWidth} height={plotHeight} />}
            <ChartAxisLeft ticks={yTickValues.map((t) => ({ position: y(t), label: yFormatter(t) }))} />
            <ChartAxisBottom ticks={xTickValues.map((t) => ({ position: x(t), label: xFormatter(t) }))} y={plotHeight} />

            {points.map((p, i) => {
                const datum = data[p.index];
                const category = categoryOf(datum);
                const color = category?.color ?? seriesColor(0);
                const isCurrent = focus.isCurrent(0, i);
                const target = radiusOf(p.size);
                const pop = isUpdate ? 1 : easeBackOut(stagger(progress, i, points.length, 0.5));
                const radius = Math.max(0, target * pop) + (isCurrent ? 2 : 0);
                const label = `${labelOf(datum, p.index)}${category ? `, ${category.name}` : ""}, ${String(xKey)} ${xFormatter(toNumber(datum[xKey]))}, ${String(yKey)} ${yFormatter(toNumber(datum[yKey]))}${sizeKey ? `, ${String(sizeKey)} ${sizeFormatter(toNumber(datum[sizeKey]))}` : ""}`;
                return (
                    <g key={p.index} {...focus.getItemProps(0, i, label)}>
                        <circle cx={x(p.x)} cy={y(p.y)} r={Math.max(12, target)} fill="transparent" />
                        <circle
                            cx={x(p.x)}
                            cy={y(p.y)}
                            r={radius}
                            fill={color}
                            fillOpacity={isCurrent ? 0.95 : 0.75}
                            className="stroke-bg-primary transition-[r,fill-opacity] duration-100 ease-linear"
                            strokeWidth={2}
                            style={{ opacity: clamp01(pop * 2) }}
                        />
                    </g>
                );
            })}

            {focus.isKeyboard && currentPoint && (
                <ChartFocusRing shape={{ type: "circle", cx: x(currentPoint.x), cy: y(currentPoint.y), r: radiusOf(currentPoint.size) + 2 }} />
            )}
        </g>
    );
};
