"use client";

import { useMemo } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { Chart, useChartTooltip } from "@/components/application/charts/chart";
import { ChartAxisBottom, ChartAxisLeft, ChartBaseline, ChartFocusRing, ChartGrid } from "@/components/application/charts/chart-primitives";
import { formatNumber, seriesColor, stagger } from "@/components/application/charts/chart-utils";
import { useChartFocus } from "@/components/application/charts/use-chart-focus";
import { useChartTransition } from "@/components/application/charts/use-chart-motion";

const data = [
    { stage: "Applied", days: 0 },
    { stage: "Screened", days: 4 },
    { stage: "Interview", days: 11 },
    { stage: "Final", days: 19 },
    { stage: "Offer", days: 26 },
];

/**
 * A lollipop chart built from the Chart root and primitives in about 60
 * lines: this is the pattern every built-in chart follows.
 */
const LollipopPlot = ({ width, height }: { width: number; height: number }) => {
    const progress = useChartTransition(data);
    const margin = { top: 12, right: 12, bottom: 28, left: 32 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const x = useMemo(
        () =>
            scaleBand<string>()
                .domain(data.map((d) => d.stage))
                .range([0, plotWidth])
                .padding(0.5),
        [plotWidth],
    );
    const y = useMemo(() => scaleLinear().domain([0, 30]).range([plotHeight, 0]), [plotHeight]);

    const focus = useChartFocus({ rowCount: 1, colCount: () => data.length, navigation: "list" });
    const current = focus.current;

    useChartTooltip(
        current
            ? {
                  x: margin.left + (x(data[current.col].stage) ?? 0) + x.bandwidth() / 2,
                  y: margin.top + y(data[current.col].days),
                  title: data[current.col].stage,
                  rows: [{ name: "Days since applying", value: formatNumber(data[current.col].days), color: seriesColor(0) }],
              }
            : null,
    );

    return (
        <g transform={`translate(${margin.left},${margin.top})`}>
            <ChartGrid horizontal={y.ticks(3).map((t) => y(t))} width={plotWidth} height={plotHeight} />
            <ChartAxisLeft ticks={y.ticks(3).map((t) => ({ position: y(t), label: `${t}d` }))} />
            <ChartAxisBottom ticks={data.map((d) => ({ position: (x(d.stage) ?? 0) + x.bandwidth() / 2, label: d.stage }))} y={plotHeight} />
            <ChartBaseline y={plotHeight} width={plotWidth} />
            {data.map((d, i) => {
                const cx = (x(d.stage) ?? 0) + x.bandwidth() / 2;
                const t = stagger(progress, i, data.length, 0.4);
                const cy = plotHeight - (plotHeight - y(d.days)) * t;
                return (
                    <g key={d.stage} {...focus.getItemProps(0, i, `${d.stage}, ${d.days} days`)}>
                        <line x1={cx} x2={cx} y1={plotHeight} y2={cy} stroke={seriesColor(0)} strokeWidth={2} strokeLinecap="round" />
                        <circle cx={cx} cy={cy} r={focus.isCurrent(0, i) ? 7 : 6} fill={seriesColor(0)} className="stroke-bg-primary" strokeWidth={2} />
                        <rect x={cx - 12} y={0} width={24} height={plotHeight} fill="transparent" />
                    </g>
                );
            })}
            {focus.isKeyboard && current && (
                <ChartFocusRing shape={{ type: "circle", cx: (x(data[current.col].stage) ?? 0) + x.bandwidth() / 2, cy: y(data[current.col].days), r: 7 }} />
            )}
        </g>
    );
};

export const CustomLollipopChart = () => (
    <Chart
        label="Days to reach each pipeline stage"
        title="Time to stage"
        subtitle="A custom lollipop chart built on the Chart root"
        height={200}
        description="Five stages from Applied at day 0 to Offer at day 26."
        table={{ columns: ["Stage", "Days"], rows: data.map((d) => [d.stage, d.days]) }}
    >
        {(size) => <LollipopPlot {...size} />}
    </Chart>
);
