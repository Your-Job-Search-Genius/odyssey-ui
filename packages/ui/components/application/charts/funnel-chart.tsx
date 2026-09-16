"use client";

import { useMemo } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartFocusRing, ChartLabel } from "./chart-primitives";
import type { ChartNamedValue, ChartTooltipData } from "./chart-types";
import { estimateTextWidth, fitLabel, formatNumber, formatPercent, stagger } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition } from "./use-chart-motion";

export interface FunnelChartProps extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty"> {
    /** Ordered stages, first stage first. Memoise it: a new array identity replays the transition. */
    data: ChartNamedValue[];
    /** `horizontal` lays stages side by side as centred columns; `vertical` stacks centred bars top to bottom. */
    orientation?: "horizontal" | "vertical";
    /** Shows the conversion from the previous stage between stages. */
    showConversion?: boolean;
    /** Shows each stage's value inside its mark. */
    showValues?: boolean;
    /** Formats values for labels, tooltips and the table. */
    valueFormatter?: (value: number) => string;
    /** Called when a stage is activated with Enter, Space or a click. */
    onStageSelect?: (info: { stage: ChartNamedValue; index: number }) => void;
}

/** Ordinal ramp: step 7 (darkest) for the first stage down towards step 3, never lower so the last stage still reads. */
const stageColorStep = (index: number, count: number): number => {
    if (count <= 1) return 7;
    return Math.round(7 - (index / (count - 1)) * 4);
};

/**
 * Funnel chart for ordered stages such as a hiring pipeline. Stages wear the
 * ordinal brand ramp so the order reads in the color, every stage is a
 * focusable mark, and conversions between stages are labelled directly.
 */
export const FunnelChart = ({
    data,
    orientation = "horizontal",
    showConversion = true,
    showValues = true,
    valueFormatter = formatNumber,
    onStageSelect,
    description,
    height = 200,
    ...chartProps
}: FunnelChartProps) => {
    const first = data[0]?.value ?? 0;

    const table = useMemo(
        () => ({
            columns: ["Stage", "Value", "Of first", "Of previous"],
            rows: data.map((stage, index) => [
                stage.name,
                valueFormatter(stage.value),
                formatPercent(first > 0 ? stage.value / first : 0),
                index === 0 ? "–" : formatPercent(data[index - 1].value > 0 ? stage.value / data[index - 1].value : 0),
            ]),
        }),
        [data, first, valueFormatter],
    );

    const autoDescription = useMemo(() => {
        if (data.length === 0) return "No data.";
        const last = data[data.length - 1];
        return `${data.length} stages from ${data[0].name} (${valueFormatter(data[0].value)}) to ${last.name} (${valueFormatter(last.value)}), an overall conversion of ${formatPercent(first > 0 ? last.value / first : 0)}.`;
    }, [data, first, valueFormatter]);

    return (
        <Chart {...chartProps} height={height} description={description ?? autoDescription} table={table} isEmpty={data.length === 0}>
            {(size) => (
                <FunnelChartPlot
                    {...size}
                    data={data}
                    orientation={orientation}
                    showConversion={showConversion}
                    showValues={showValues}
                    valueFormatter={valueFormatter}
                    onStageSelect={onStageSelect}
                />
            )}
        </Chart>
    );
};

interface FunnelChartPlotProps {
    width: number;
    height: number;
    data: ChartNamedValue[];
    orientation: NonNullable<FunnelChartProps["orientation"]>;
    showConversion: boolean;
    showValues: boolean;
    valueFormatter: (value: number) => string;
    onStageSelect?: FunnelChartProps["onStageSelect"];
}

const FunnelChartPlot = ({ width, height, data, orientation, showConversion, showValues, valueFormatter, onStageSelect }: FunnelChartPlotProps) => {
    const progress = useChartTransition(data);
    const isHorizontal = orientation === "horizontal";
    const maxValue = Math.max(1, ...data.map((d) => d.value));
    const first = data[0]?.value ?? 0;

    const labelWidth = isHorizontal ? 0 : Math.min(Math.ceil(Math.max(0, ...data.map((d) => estimateTextWidth(d.name, 12)))) + 14, Math.max(40, width * 0.35));
    const margin = isHorizontal ? { top: showConversion ? 16 : 8, right: 8, bottom: 26, left: 8 } : { top: 8, right: 8, bottom: 8, left: labelWidth };
    const plotWidth = Math.max(0, width - margin.left - margin.right);
    const plotHeight = Math.max(0, height - margin.top - margin.bottom);

    const band = useMemo(
        () =>
            scaleBand<number>()
                .domain(data.map((_, i) => i))
                .range([0, isHorizontal ? plotWidth : plotHeight])
                .paddingInner(isHorizontal ? 0.06 : 0.25),
        [data, isHorizontal, plotWidth, plotHeight],
    );
    const extent = useMemo(
        () =>
            scaleLinear()
                .domain([0, maxValue])
                .range([0, isHorizontal ? plotHeight : plotWidth]),
        [maxValue, isHorizontal, plotHeight, plotWidth],
    );

    const focus = useChartFocus({
        rowCount: 1,
        colCount: () => data.length,
        navigation: "list",
        onSelect: onStageSelect ? ({ col }) => onStageSelect({ stage: data[col], index: col }) : undefined,
    });
    const current = focus.current;

    const shapes = useMemo(
        () =>
            data.map((stage, index) => {
                const k = stagger(progress, index, data.length, 0.4);
                const size = Math.max(6, extent(stage.value)) * k;
                const along = band(index) ?? 0;
                const thickness = band.bandwidth();
                if (isHorizontal) {
                    return { x: along, y: plotHeight / 2 - size / 2, width: thickness, height: size, cx: along + thickness / 2, cy: plotHeight / 2 };
                }
                return { x: plotWidth / 2 - size / 2, y: along, width: size, height: thickness, cx: plotWidth / 2, cy: along + thickness / 2 };
            }),
        [data, progress, extent, band, isHorizontal, plotHeight, plotWidth],
    );

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!current || !data[current.col]) return null;
        const index = current.col;
        const stage = data[index];
        const shape = shapes[index];
        const step = stageColorStep(index, data.length);
        return {
            x: margin.left + shape.cx,
            y: margin.top + shape.y,
            title: stage.name,
            rows: [
                { name: "Value", value: valueFormatter(stage.value), color: `var(--color-chart-sequential-${step})`, isActive: true },
                { name: "Of first stage", value: formatPercent(first > 0 ? stage.value / first : 0) },
                { name: "Of previous stage", value: index === 0 ? "–" : formatPercent(data[index - 1].value > 0 ? stage.value / data[index - 1].value : 0) },
            ],
        };
    }, [current, data, shapes, margin.left, margin.top, first, valueFormatter]);
    useChartTooltip(tooltip);

    return (
        <g transform={`translate(${margin.left},${margin.top})`}>
            {data.map((stage, index) => {
                const shape = shapes[index];
                const step = stageColorStep(index, data.length);
                const isDark = step >= 5;
                const isCurrent = focus.isCurrent(0, index);
                const label = `${stage.name}, ${valueFormatter(stage.value)}, ${index === 0 ? "first stage" : `${formatPercent(data[index - 1].value > 0 ? stage.value / data[index - 1].value : 0)} of previous stage`}`;
                const fitsValue = isHorizontal
                    ? shape.height >= 18 && shape.width >= estimateTextWidth(valueFormatter(stage.value), 13) + 8
                    : shape.width >= estimateTextWidth(valueFormatter(stage.value), 13) + 8;
                return (
                    <g key={index}>
                        <g {...focus.getItemProps(0, index, label, "funnel stage")}>
                            <rect
                                x={shape.x}
                                y={shape.y}
                                width={shape.width}
                                height={shape.height}
                                fill={`var(--color-chart-sequential-${step})`}
                                className="transition-opacity duration-100 ease-linear"
                                style={{ opacity: current && !isCurrent ? 0.7 : 1 }}
                            />
                        </g>
                        {showValues && fitsValue && (
                            <ChartLabel
                                x={shape.cx}
                                y={shape.cy}
                                anchor="middle"
                                tone={isDark ? "inverse" : "primary"}
                                weight="semibold"
                                className="text-[13px]"
                            >
                                {valueFormatter(stage.value)}
                            </ChartLabel>
                        )}
                        {isHorizontal ? (
                            <ChartLabel x={shape.cx} y={plotHeight + 18} anchor="middle" tone="secondary" weight="regular">
                                {fitLabel(stage.name, Math.max(24, band.step() - 4))}
                                <title>{stage.name}</title>
                            </ChartLabel>
                        ) : (
                            <ChartLabel x={-10} y={shape.cy} anchor="end" tone="secondary" weight="regular">
                                {fitLabel(stage.name, labelWidth - 14)}
                                <title>{stage.name}</title>
                            </ChartLabel>
                        )}
                        {showConversion && index > 0 && (
                            <text
                                aria-hidden="true"
                                x={isHorizontal ? shape.x - (band.step() - band.bandwidth()) / 2 : plotWidth / 2}
                                y={isHorizontal ? -6 : shape.y - (band.step() - band.bandwidth()) / 2}
                                dy={isHorizontal ? 0 : "0.32em"}
                                textAnchor="middle"
                                className="pointer-events-none fill-text-quaternary text-[10px]"
                            >
                                {formatPercent(data[index - 1].value > 0 ? stage.value / data[index - 1].value : 0)}
                            </text>
                        )}
                    </g>
                );
            })}
            {focus.isKeyboard && current && shapes[current.col] && (
                <ChartFocusRing
                    shape={{
                        type: "rect",
                        x: shapes[current.col].x,
                        y: shapes[current.col].y,
                        width: shapes[current.col].width,
                        height: shapes[current.col].height,
                        rx: 0,
                    }}
                />
            )}
        </g>
    );
};
