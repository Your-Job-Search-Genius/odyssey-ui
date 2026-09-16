"use client";

import { useMemo } from "react";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartFocusRing, ChartLabel } from "./chart-primitives";
import type { ChartTooltipData } from "./chart-types";
import { divergingColor, estimateTextWidth, fitLabel, formatNumber, sequentialColor, stagger } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition } from "./use-chart-motion";

/** One cell of a heatmap: a category on each axis and a value (or `null` for "no data"). */
export interface HeatmapCell {
    x: string;
    y: string;
    value: number | null;
}

export interface HeatmapChartProps extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty" | "height"> {
    /** Cells in any order. Missing x/y combinations render as empty cells. Memoise it: a new identity replays the transition. */
    data: HeatmapCell[];
    /** Column order. Defaults to first-seen order in `data`. */
    xDomain?: string[];
    /** Row order. Defaults to first-seen order in `data`. */
    yDomain?: string[];
    /**
     * `sequential` maps value / max onto the brand ramp (magnitude).
     * `diverging` colours negative values orange and positive values brand, with opacity by magnitude (polarity).
     */
    colorScale?: "sequential" | "diverging";
    /** Corner radius of each cell in px. */
    cellRadius?: number;
    /** Gap between cells in px. */
    cellGap?: number;
    /** Renders the value inside each cell when it fits. Values that do not fit stay in the tooltip and table. */
    showValues?: boolean;
    /**
     * Plot height in px. Defaults to a height that gives every row a 21px band
     * plus the axis and legend bands, so the chart grows with `yDomain`.
     */
    height?: number;
    valueFormatter?: (value: number) => string;
    xFormatter?: (x: string) => string;
    yFormatter?: (y: string) => string;
    /** Show every nth column label. Defaults to the smallest step at which labels do not overlap. */
    xTickEvery?: number;
    /** Renders the "less → more" colour key under the grid. */
    showLegend?: boolean;
    /** Called when a cell is activated with Enter, Space or a click. */
    onCellSelect?: (cell: HeatmapCell) => void;
}

const uniqueInOrder = (values: string[]) => Array.from(new Set(values));

/**
 * Heatmap / calendar heatmap for density over two categorical axes. Each
 * cell is a focusable mark; the full matrix is mirrored in an accessible
 * table. Colour is one hue light → dark for magnitude, or two hues around a
 * neutral midpoint for polarity.
 */
export const HeatmapChart = ({
    data,
    xDomain,
    yDomain,
    colorScale = "sequential",
    cellRadius = 3,
    cellGap = 3,
    showValues = false,
    height,
    valueFormatter = formatNumber,
    xFormatter = (x) => x,
    yFormatter = (y) => y,
    xTickEvery,
    showLegend = true,
    onCellSelect,
    description,
    ...chartProps
}: HeatmapChartProps) => {
    const xs = useMemo(() => xDomain ?? uniqueInOrder(data.map((d) => d.x)), [xDomain, data]);
    const ys = useMemo(() => yDomain ?? uniqueInOrder(data.map((d) => d.y)), [yDomain, data]);

    const lookup = useMemo(() => {
        const map = new Map<string, number | null>();
        data.forEach((d) => map.set(`${d.x}|${d.y}`, d.value));
        return map;
    }, [data]);

    const table = useMemo(
        () => ({
            columns: ["", ...xs.map(xFormatter)],
            rows: ys.map((y) => [
                yFormatter(y),
                ...xs.map((x) => ((lookup.get(`${x}|${y}`) ?? null) === null ? "–" : valueFormatter(lookup.get(`${x}|${y}`) as number))),
            ]),
        }),
        [xs, ys, lookup, xFormatter, yFormatter, valueFormatter],
    );

    const autoDescription = useMemo(() => {
        const cells = data.filter((d) => d.value !== null) as Array<HeatmapCell & { value: number }>;
        if (cells.length === 0) return "No data.";
        const peak = cells.reduce((best, cell) => (cell.value > best.value ? cell : best), cells[0]);
        return `${ys.length} rows by ${xs.length} columns. Highest value ${valueFormatter(peak.value)} at ${xFormatter(peak.x)}, ${yFormatter(peak.y)}.`;
    }, [data, xs.length, ys.length, valueFormatter, xFormatter, yFormatter]);

    const resolvedHeight = height ?? ys.length * (18 + cellGap) + 24 + (showLegend ? 26 : 8);

    return (
        <Chart
            {...chartProps}
            height={resolvedHeight}
            description={description ?? autoDescription}
            table={table}
            isEmpty={data.length === 0 || xs.length === 0 || ys.length === 0}
        >
            {(size) => (
                <HeatmapChartPlot
                    {...size}
                    data={data}
                    xs={xs}
                    ys={ys}
                    lookup={lookup}
                    colorScale={colorScale}
                    cellRadius={cellRadius}
                    cellGap={cellGap}
                    showValues={showValues}
                    valueFormatter={valueFormatter}
                    xFormatter={xFormatter}
                    yFormatter={yFormatter}
                    xTickEvery={xTickEvery}
                    showLegend={showLegend}
                    onCellSelect={onCellSelect}
                />
            )}
        </Chart>
    );
};

interface HeatmapChartPlotProps {
    width: number;
    height: number;
    data: HeatmapCell[];
    xs: string[];
    ys: string[];
    lookup: Map<string, number | null>;
    colorScale: "sequential" | "diverging";
    cellRadius: number;
    cellGap: number;
    showValues: boolean;
    valueFormatter: (value: number) => string;
    xFormatter: (x: string) => string;
    yFormatter: (y: string) => string;
    xTickEvery?: number;
    showLegend: boolean;
    onCellSelect?: (cell: HeatmapCell) => void;
}

const HeatmapChartPlot = ({
    width,
    height,
    data,
    xs,
    ys,
    lookup,
    colorScale,
    cellRadius,
    cellGap,
    showValues,
    valueFormatter,
    xFormatter,
    yFormatter,
    xTickEvery,
    showLegend,
    onCellSelect,
}: HeatmapChartPlotProps) => {
    const progress = useChartTransition(data);

    const yLabelWidth = Math.min(Math.ceil(Math.max(0, ...ys.map((y) => estimateTextWidth(yFormatter(y), 12)))), Math.max(24, width * 0.35));
    const margin = { top: 20, right: 4, bottom: showLegend ? 26 : 4, left: yLabelWidth + 12 };
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom);

    const cols = xs.length;
    const rows = ys.length;
    const cell = Math.max(4, Math.min((plotWidth - cellGap * (cols - 1)) / cols, (plotHeight - cellGap * (rows - 1)) / rows));
    const gridWidth = cols * cell + (cols - 1) * cellGap;
    const gridHeight = rows * cell + (rows - 1) * cellGap;

    const { max, maxAbs } = useMemo(() => {
        let max = 0;
        let maxAbs = 0;
        data.forEach((d) => {
            if (d.value === null) return;
            max = Math.max(max, d.value);
            maxAbs = Math.max(maxAbs, Math.abs(d.value));
        });
        return { max, maxAbs };
    }, [data]);

    const fillFor = (value: number | null): { fill: string; opacity: number; inkInverse: boolean } => {
        if (value === null) return { fill: "var(--color-chart-empty-cell)", opacity: 1, inkInverse: false };
        if (colorScale === "diverging") {
            if (value === 0 || maxAbs === 0) return { fill: "var(--color-chart-diverging-mid)", opacity: 1, inkInverse: false };
            const strength = Math.abs(value) / maxAbs;
            return { fill: divergingColor(value), opacity: 0.25 + 0.75 * strength, inkInverse: strength >= 0.6 };
        }
        const t = max === 0 ? 0 : value / max;
        return { fill: sequentialColor(t), opacity: 1, inkInverse: Math.ceil(Math.min(Math.max(t, 0), 1) * 7) >= 5 };
    };

    const focus = useChartFocus({
        rowCount: rows,
        colCount: () => cols,
        onSelect: onCellSelect ? ({ row, col }) => onCellSelect({ x: xs[col], y: ys[row], value: lookup.get(`${xs[col]}|${ys[row]}`) ?? null }) : undefined,
    });
    const current = focus.current;

    const cellX = (col: number) => col * (cell + cellGap);
    const cellY = (row: number) => row * (cell + cellGap);

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!current || xs[current.col] === undefined || ys[current.row] === undefined) return null;
        const value = lookup.get(`${xs[current.col]}|${ys[current.row]}`) ?? null;
        return {
            x: margin.left + cellX(current.col) + cell / 2,
            y: margin.top + cellY(current.row),
            title: `${xFormatter(xs[current.col])} · ${yFormatter(ys[current.row])}`,
            rows: [{ name: "Value", value: value === null ? "No data" : valueFormatter(value), color: value === null ? undefined : fillFor(value).fill }],
        };
        // Geometry helpers are recomputed each render from primitive inputs.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, lookup, xs, ys, margin.left, margin.top, cell, cellGap, xFormatter, yFormatter, valueFormatter, colorScale, max, maxAbs]);
    useChartTooltip(tooltip);

    const maxXLabel = Math.max(0, ...xs.map((x) => estimateTextWidth(xFormatter(x), 12)));
    const tickEvery = Math.max(1, xTickEvery ?? Math.ceil((maxXLabel + 8) / (cell + cellGap)));

    const legendSwatches =
        colorScale === "diverging"
            ? [
                  { fill: "var(--color-chart-diverging-negative)", opacity: 1 },
                  { fill: "var(--color-chart-diverging-negative)", opacity: 0.5 },
                  { fill: "var(--color-chart-diverging-mid)", opacity: 1 },
                  { fill: "var(--color-chart-diverging-positive)", opacity: 0.5 },
                  { fill: "var(--color-chart-diverging-positive)", opacity: 1 },
              ]
            : [2, 3, 4, 5, 6, 7].map((step) => ({ fill: `var(--color-chart-sequential-${step})`, opacity: 1 }));
    const swatch = 10;
    const legendWidth = legendSwatches.length * (swatch + 2) - 2;
    const legendLabels = colorScale === "diverging" ? ["lower", "higher"] : ["less", "more"];

    const total = rows * cols;

    return (
        <g transform={`translate(${margin.left},${margin.top})`}>
            <g aria-hidden="true" className="fill-text-quaternary text-xs">
                {ys.map((y, row) => (
                    <text key={y} x={-8} y={cellY(row) + cell / 2} dy="0.32em" textAnchor="end">
                        {fitLabel(yFormatter(y), yLabelWidth)}
                        <title>{yFormatter(y)}</title>
                    </text>
                ))}
                {xs.map((x, col) =>
                    col % tickEvery === 0 ? (
                        <text key={x} x={cellX(col)} y={-7} textAnchor="start">
                            {xFormatter(x)}
                        </text>
                    ) : null,
                )}
            </g>

            {ys.map((y, row) => (
                <g key={y} role="group" aria-label={yFormatter(y)}>
                    {xs.map((x, col) => {
                        const value = lookup.get(`${x}|${y}`) ?? null;
                        const { fill, opacity, inkInverse } = fillFor(value);
                        const index = row * cols + col;
                        const appear = stagger(progress, index, total, 0.6);
                        const scale = 0.6 + 0.4 * appear;
                        const cx = cellX(col) + cell / 2;
                        const cy = cellY(row) + cell / 2;
                        const isCurrent = focus.isCurrent(row, col);
                        const valueLabel = value === null ? "" : valueFormatter(value);
                        const labelFits = showValues && value !== null && cell >= 16 && estimateTextWidth(valueLabel, 11) <= cell - 6;
                        const label = `${xFormatter(x)}, ${yFormatter(y)}, ${value === null ? "no data" : valueFormatter(value)}`;
                        return (
                            <g
                                key={x}
                                {...focus.getItemProps(row, col, label, "cell")}
                                transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}
                                style={{ opacity: appear }}
                            >
                                <rect
                                    x={cellX(col)}
                                    y={cellY(row)}
                                    width={cell}
                                    height={cell}
                                    rx={cellRadius}
                                    fill={fill}
                                    fillOpacity={opacity}
                                    stroke={isCurrent && !focus.isKeyboard ? fill : "none"}
                                    strokeWidth={1.5}
                                    className="transition-[fill-opacity] duration-100 ease-linear"
                                />
                                {labelFits && (
                                    <ChartLabel x={cx} y={cy} anchor="middle" tone={inkInverse ? "inverse" : "primary"} weight="medium" className="text-[11px]">
                                        {valueLabel}
                                    </ChartLabel>
                                )}
                            </g>
                        );
                    })}
                </g>
            ))}

            {focus.isKeyboard && current && current.row < rows && current.col < cols && (
                <ChartFocusRing shape={{ type: "rect", x: cellX(current.col), y: cellY(current.row), width: cell, height: cell, rx: cellRadius }} offset={2} />
            )}

            {showLegend && (
                <g aria-hidden="true" transform={`translate(${gridWidth - legendWidth},${gridHeight + 12})`} className="fill-text-quaternary text-xs">
                    <text x={-6} y={swatch / 2} dy="0.32em" textAnchor="end">
                        {legendLabels[0]}
                    </text>
                    {legendSwatches.map((s, i) => (
                        <rect key={i} x={i * (swatch + 2)} y={0} width={swatch} height={swatch} rx={2} fill={s.fill} fillOpacity={s.opacity} />
                    ))}
                    <text x={legendWidth + 6} y={swatch / 2} dy="0.32em" textAnchor="start">
                        {legendLabels[1]}
                    </text>
                </g>
            )}
        </g>
    );
};
