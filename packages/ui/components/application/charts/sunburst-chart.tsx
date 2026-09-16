"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import type { HierarchyRectangularNode } from "d3-hierarchy";
import { partition as d3Partition, hierarchy } from "d3-hierarchy";
import { arc as d3Arc } from "d3-shape";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartFocusRing, ChartLabel } from "./chart-primitives";
import type { ChartTooltipData, ChartTreeNode } from "./chart-types";
import { estimateTextWidth, formatNumber, formatPercent, seriesColor, stagger, truncateLabel } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition } from "./use-chart-motion";

export interface SunburstChartProps extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty"> {
    /** The root node. Its top-level children each take a categorical hue. Memoise it: a new identity replays the transition. */
    data: ChartTreeNode;
    /** Text under the centre value. Defaults to "total". */
    centerLabel?: ReactNode;
    /** The centre figure. Defaults to the root total; numbers count up during the entry animation. */
    centerValue?: number | string;
    /** Deepest ring to draw (1 = top-level only). */
    maxDepth?: number;
    /** Angular gap between arcs in radians. */
    padAngle?: number;
    /** Corner radius of each arc in px. */
    cornerRadius?: number;
    /** Radius of the centre hole in px. */
    innerRadius?: number;
    valueFormatter?: (value: number) => string;
    /** Lists the top-level branches beside the rings when the chart is wide enough. */
    showLegend?: boolean;
    /** Called when an arc is activated with Enter, Space or a click. */
    onNodeSelect?: (info: { name: string; path: string[]; value: number; depth: number }) => void;
}

type Node = HierarchyRectangularNode<ChartTreeNode>;

const pathOf = (node: { ancestors: () => Array<{ data: ChartTreeNode }> }) =>
    node
        .ancestors()
        .reverse()
        .slice(1)
        .map((a) => a.data.name);

/**
 * Sunburst for nested share. The inner ring is the top-level breakdown, the
 * outer rings its children. Arrow keys walk each ring; Up and Down move
 * between rings. Every arc is listed in an accessible table.
 */
export const SunburstChart = ({
    data,
    centerLabel = "total",
    centerValue,
    maxDepth = 2,
    padAngle = 0.012,
    cornerRadius = 2,
    innerRadius = 36,
    valueFormatter = formatNumber,
    showLegend = true,
    onNodeSelect,
    description,
    height = 240,
    ...chartProps
}: SunburstChartProps) => {
    const root = useMemo(
        () =>
            hierarchy<ChartTreeNode>(data)
                .sum((d) => (d.children && d.children.length > 0 ? 0 : Math.max(0, d.value ?? 0)))
                .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)),
        [data],
    );
    const total = root.value ?? 0;

    const table = useMemo(
        () => ({
            columns: ["Path", "Value", "Share"],
            rows: root
                .descendants()
                .filter((node) => node.depth > 0 && node.depth <= maxDepth)
                .map((node) => [pathOf(node).join(" › "), valueFormatter(node.value ?? 0), formatPercent(total > 0 ? (node.value ?? 0) / total : 0)]),
        }),
        [root, maxDepth, valueFormatter, total],
    );

    const autoDescription = useMemo(() => {
        const groups = root.children ?? [];
        if (groups.length === 0 || total === 0) return "No data.";
        const largest = groups[0];
        return `${groups.length} groups totalling ${valueFormatter(total)}. Largest is ${largest.data.name} at ${formatPercent((largest.value ?? 0) / total)}.`;
    }, [root, total, valueFormatter]);

    return (
        <Chart {...chartProps} height={height} description={description ?? autoDescription} table={table} isEmpty={total === 0}>
            {(size) => (
                <SunburstChartPlot
                    {...size}
                    data={data}
                    root={root}
                    centerLabel={centerLabel}
                    centerValue={centerValue}
                    maxDepth={maxDepth}
                    padAngle={padAngle}
                    cornerRadius={cornerRadius}
                    innerRadius={innerRadius}
                    valueFormatter={valueFormatter}
                    showLegend={showLegend}
                    onNodeSelect={onNodeSelect}
                />
            )}
        </Chart>
    );
};

interface SunburstChartPlotProps {
    width: number;
    height: number;
    data: ChartTreeNode;
    root: ReturnType<typeof hierarchy<ChartTreeNode>>;
    centerLabel: ReactNode;
    centerValue?: number | string;
    maxDepth: number;
    padAngle: number;
    cornerRadius: number;
    innerRadius: number;
    valueFormatter: (value: number) => string;
    showLegend: boolean;
    onNodeSelect?: SunburstChartProps["onNodeSelect"];
}

const LEGEND_ROW = 18;

const SunburstChartPlot = ({
    width,
    height,
    data,
    root,
    centerLabel,
    centerValue,
    maxDepth,
    padAngle,
    cornerRadius,
    innerRadius,
    valueFormatter,
    showLegend,
    onNodeSelect,
}: SunburstChartPlotProps) => {
    const progress = useChartTransition(data);
    const total = root.value ?? 0;
    const topLevel = root.children ?? [];

    const legendItems = topLevel.map((child, index) => ({ name: child.data.name, value: child.value ?? 0, color: seriesColor(index, child.data.color) }));
    const legendWidth = showLegend
        ? Math.ceil(Math.max(0, ...legendItems.map((item) => 16 + estimateTextWidth(item.name, 12) + 16 + estimateTextWidth(valueFormatter(item.value), 12))))
        : 0;
    const hasLegend = showLegend && width >= 420 && legendItems.length > 0;

    const padding = 4;
    const radius = Math.max(innerRadius + 8, Math.min(height / 2, (hasLegend ? width - legendWidth - 24 : width) / 2) - padding);
    const cx = hasLegend ? radius + padding : width / 2;
    const cy = height / 2;

    // d3's partition gives the root its own radial band; shift every node
    // inward by that band so the first ring starts at the hole's edge and the
    // deepest drawn ring ends at `radius`.
    const { rings, bandOffset } = useMemo(() => {
        const depthsShown = Math.max(1, Math.min(root.height, maxDepth));
        const band = Math.max(1, radius - innerRadius) / depthsShown;
        const laidOut = d3Partition<ChartTreeNode>().size([Math.PI * 2, band * (root.height + 1)])(root.copy());
        const byDepth: Node[][] = [];
        laidOut.descendants().forEach((node) => {
            if (node.depth === 0 || node.depth > maxDepth) return;
            (byDepth[node.depth - 1] ??= []).push(node as Node);
        });
        return { rings: byDepth.map((ring) => ring.sort((a, b) => a.x0 - b.x0)), bandOffset: band };
    }, [root, radius, innerRadius, maxDepth]);

    const colorOf = (node: Node) => {
        const top = node.ancestors().find((a) => a.depth === 1) ?? node;
        const index = topLevel.findIndex((child) => child.data.name === top.data.name);
        return seriesColor(Math.max(0, index), top.data.color);
    };

    const arcFor = (node: Node, sweep: number, inset = 0) =>
        d3Arc<Node>()
            .startAngle(() => node.x0)
            .endAngle(() => node.x0 + (node.x1 - node.x0) * sweep)
            .padAngle(padAngle)
            .padRadius(radius / 2)
            .innerRadius(() => innerRadius + node.y0 - bandOffset - inset)
            .outerRadius(() => innerRadius + node.y1 - bandOffset - 1 + inset)
            .cornerRadius(cornerRadius)(node) ?? "";

    const focus = useChartFocus({
        rowCount: rings.length,
        colCount: (row) => rings[row]?.length ?? 0,
        onSelect: onNodeSelect
            ? ({ row, col }) => {
                  const node = rings[row][col];
                  onNodeSelect({ name: node.data.name, path: pathOf(node), value: node.value ?? 0, depth: node.depth });
              }
            : undefined,
    });
    const current = focus.current;
    const currentNode = current ? rings[current.row]?.[current.col] : undefined;

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!currentNode) return null;
        const value = currentNode.value ?? 0;
        const mid = (currentNode.x0 + currentNode.x1) / 2 - Math.PI / 2;
        const r = innerRadius + (currentNode.y0 + currentNode.y1) / 2 - bandOffset;
        return {
            x: cx + Math.cos(mid) * r,
            y: cy + Math.sin(mid) * r,
            title: pathOf(currentNode).join(" · "),
            rows: [
                { name: "Value", value: valueFormatter(value), color: colorOf(currentNode) },
                { name: "Share", value: formatPercent(total > 0 ? value / total : 0) },
            ],
        };
        // colorOf depends on stable props resolved via `root`.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentNode, innerRadius, cx, cy, valueFormatter, total, root]);
    useChartTooltip(tooltip);

    const perDepth = Math.max(1, ...rings.map((ring) => ring.length));
    const orderCount = rings.length * perDepth;

    const centre = centerValue === undefined ? total : centerValue;
    const centreText = typeof centre === "number" ? valueFormatter(Math.round(centre * progress)) : centre;
    const centreSize = Math.max(11, Math.min(22, (innerRadius * 2 - 8) / Math.max(3, centreText.length) / 0.58));

    return (
        <g>
            <g transform={`translate(${cx},${cy})`}>
                {rings.map((ring, depthIndex) => (
                    <g key={depthIndex} role="group" aria-label={`Ring ${depthIndex + 1}`}>
                        {ring.map((node, i) => {
                            const sweep = stagger(progress, depthIndex * perDepth + i, orderCount, 0.5);
                            const color = colorOf(node);
                            const value = node.value ?? 0;
                            const isCurrent = focus.isCurrent(depthIndex, i);
                            const label = `${pathOf(node).join(", ")}, ${valueFormatter(value)}, ${formatPercent(total > 0 ? value / total : 0)}`;
                            return (
                                <path
                                    key={`${pathOf(node).join("/")}#${i}`}
                                    {...focus.getItemProps(depthIndex, i, label, "segment")}
                                    d={arcFor(node, sweep)}
                                    fill={color}
                                    fillOpacity={node.depth === 1 ? (isCurrent ? 1 : 0.95) : isCurrent ? 0.7 : 0.45}
                                    className="transition-[fill-opacity] duration-100 ease-linear"
                                />
                            );
                        })}
                    </g>
                ))}

                {focus.isKeyboard && currentNode && <ChartFocusRing shape={{ type: "path", d: arcFor(currentNode, 1, 3) }} />}

                <ChartLabel x={0} y={-2} anchor="middle" tone="primary" weight="semibold" className="text-xl" baseline="auto">
                    <tspan style={{ fontSize: centreSize }}>{centreText}</tspan>
                </ChartLabel>
                <ChartLabel x={0} y={14} anchor="middle" tone="quaternary" weight="regular" baseline="auto">
                    {centerLabel}
                </ChartLabel>
            </g>

            {hasLegend && (
                <g aria-hidden="true" transform={`translate(${cx + radius + 24},${cy - (legendItems.length * LEGEND_ROW) / 2 + LEGEND_ROW / 2})`}>
                    {legendItems.map((item, index) => (
                        <g key={`${item.name}#${index}`} transform={`translate(0,${index * LEGEND_ROW})`}>
                            <circle cx={4} cy={0} r={4} fill={item.color} />
                            <ChartLabel x={16} y={0} tone="secondary" weight="regular">
                                {truncateLabel(item.name, 18)}
                            </ChartLabel>
                            <ChartLabel x={legendWidth} y={0} anchor="end" tone="quaternary" weight="regular">
                                {valueFormatter(item.value)}
                            </ChartLabel>
                        </g>
                    ))}
                </g>
            )}
        </g>
    );
};
