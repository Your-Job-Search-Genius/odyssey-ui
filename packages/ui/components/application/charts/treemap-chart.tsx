"use client";

import { useMemo } from "react";
import type { HierarchyRectangularNode } from "d3-hierarchy";
import { treemap as d3Treemap, hierarchy, treemapSquarify } from "d3-hierarchy";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartFocusRing, ChartLabel } from "./chart-primitives";
import type { ChartTooltipData, ChartTooltipRow, ChartTreeNode } from "./chart-types";
import { formatNumber, formatPercent, seriesColor, stagger, truncateLabel } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition } from "./use-chart-motion";

export interface TreemapChartProps extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty"> {
    /** The root node. Its top-level children each take a categorical hue; leaves tint by value. Memoise it: a new identity replays the transition. */
    data: ChartTreeNode;
    /** Gap between sibling tiles in px. */
    paddingInner?: number;
    /** Gap around the outside of the plot in px. */
    paddingOuter?: number;
    /** Tiles smaller than this get no inline label; the tooltip and table carry it. */
    labelMinSize?: { width: number; height: number };
    valueFormatter?: (value: number) => string;
    /** Adds the share of the total to tooltips and the table. */
    showShare?: boolean;
    /** Called when a tile is activated with Enter, Space or a click. */
    onNodeSelect?: (info: { name: string; path: string[]; value: number }) => void;
}

type Leaf = HierarchyRectangularNode<ChartTreeNode>;

const pathOf = (node: { ancestors: () => Array<{ data: ChartTreeNode }> }) =>
    node
        .ancestors()
        .reverse()
        .slice(1)
        .map((a) => a.data.name);

/**
 * Treemap for hierarchical share. Hue identifies the top-level branch, tint
 * carries the leaf's value. Every tile is a focusable mark and every leaf
 * is listed in an accessible table.
 */
export const TreemapChart = ({
    data,
    paddingInner = 2,
    paddingOuter = 0,
    labelMinSize = { width: 64, height: 34 },
    valueFormatter = formatNumber,
    showShare = true,
    onNodeSelect,
    description,
    height = 240,
    ...chartProps
}: TreemapChartProps) => {
    const root = useMemo(
        () =>
            hierarchy<ChartTreeNode>(data)
                .sum((d) => (d.children && d.children.length > 0 ? 0 : Math.max(0, d.value ?? 0)))
                .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)),
        [data],
    );
    const total = root.value ?? 0;

    const table = useMemo(() => {
        const leaves = root.leaves().filter((leaf) => leaf.depth > 0);
        return {
            columns: showShare ? ["Group", "Item", "Value", "Share"] : ["Group", "Item", "Value"],
            rows: leaves.map((leaf) => {
                const path = pathOf(leaf);
                const group = path.length > 1 ? path[0] : "";
                const row: Array<string | number> = [group, leaf.data.name, valueFormatter(leaf.value ?? 0)];
                if (showShare) row.push(formatPercent(total > 0 ? (leaf.value ?? 0) / total : 0));
                return row;
            }),
        };
    }, [root, total, valueFormatter, showShare]);

    const autoDescription = useMemo(() => {
        const leaves = root.leaves().filter((leaf) => leaf.depth > 0);
        if (leaves.length === 0 || total === 0) return "No data.";
        const largest = leaves[0];
        return `${leaves.length} items totalling ${valueFormatter(total)}. Largest is ${pathOf(largest).join(", ")} at ${formatPercent((largest.value ?? 0) / total)}.`;
    }, [root, total, valueFormatter]);

    return (
        <Chart {...chartProps} height={height} description={description ?? autoDescription} table={table} isEmpty={total === 0}>
            {(size) => (
                <TreemapChartPlot
                    {...size}
                    data={data}
                    root={root}
                    paddingInner={paddingInner}
                    paddingOuter={paddingOuter}
                    labelMinSize={labelMinSize}
                    valueFormatter={valueFormatter}
                    showShare={showShare}
                    onNodeSelect={onNodeSelect}
                />
            )}
        </Chart>
    );
};

interface TreemapChartPlotProps {
    width: number;
    height: number;
    data: ChartTreeNode;
    root: ReturnType<typeof hierarchy<ChartTreeNode>>;
    paddingInner: number;
    paddingOuter: number;
    labelMinSize: { width: number; height: number };
    valueFormatter: (value: number) => string;
    showShare: boolean;
    onNodeSelect?: TreemapChartProps["onNodeSelect"];
}

const TreemapChartPlot = ({
    width,
    height,
    data,
    root,
    paddingInner,
    paddingOuter,
    labelMinSize,
    valueFormatter,
    showShare,
    onNodeSelect,
}: TreemapChartPlotProps) => {
    const progress = useChartTransition(data);
    const total = root.value ?? 0;

    const leaves = useMemo(() => {
        const laidOut = d3Treemap<ChartTreeNode>()
            .size([width, height])
            .paddingInner(paddingInner)
            .paddingOuter(paddingOuter)
            .round(true)
            .tile(treemapSquarify)(root.copy());
        return laidOut.leaves().filter((leaf) => leaf.depth > 0) as Leaf[];
    }, [root, width, height, paddingInner, paddingOuter]);

    const topLevel = root.children ?? [];
    const colorOf = (leaf: Leaf) => {
        const top = leaf.ancestors().find((a) => a.depth === 1) ?? leaf;
        const index = topLevel.findIndex((child) => child.data.name === top.data.name);
        return seriesColor(Math.max(0, index), top.data.color);
    };
    const maxLeafValue = Math.max(1, ...leaves.map((leaf) => leaf.value ?? 0));

    const focus = useChartFocus({
        rowCount: 1,
        colCount: () => leaves.length,
        navigation: "list",
        onSelect: onNodeSelect
            ? ({ col }) => onNodeSelect({ name: leaves[col].data.name, path: pathOf(leaves[col]), value: leaves[col].value ?? 0 })
            : undefined,
    });
    const current = focus.current;
    const currentLeaf = current ? leaves[current.col] : undefined;

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (!currentLeaf) return null;
        const path = pathOf(currentLeaf);
        const value = currentLeaf.value ?? 0;
        const rows: ChartTooltipRow[] = [{ name: "Value", value: valueFormatter(value), color: colorOf(currentLeaf) }];
        if (showShare) rows.push({ name: "Share", value: formatPercent(total > 0 ? value / total : 0) });
        return { x: (currentLeaf.x0 + currentLeaf.x1) / 2, y: currentLeaf.y0, title: path.join(" · "), rows };
        // colorOf depends on stable props resolved via `root`.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLeaf, valueFormatter, showShare, total, root]);
    useChartTooltip(tooltip);

    return (
        <g>
            {leaves.map((leaf, index) => {
                const w = leaf.x1 - leaf.x0;
                const h = leaf.y1 - leaf.y0;
                const cx = leaf.x0 + w / 2;
                const cy = leaf.y0 + h / 2;
                const appear = stagger(progress, index, leaves.length, 0.5);
                const scale = 0.96 + 0.04 * appear;
                const color = colorOf(leaf);
                const value = leaf.value ?? 0;
                const isCurrent = focus.isCurrent(0, index);
                const showLabel = w >= labelMinSize.width && h >= labelMinSize.height;
                const maxChars = Math.max(2, Math.floor((w - 16) / (12 * 0.58)));
                const name = truncateLabel(leaf.data.name, maxChars);
                const path = pathOf(leaf);
                const label = `${path.join(", ")}, ${valueFormatter(value)}${showShare && total > 0 ? `, ${formatPercent(value / total)}` : ""}`;
                return (
                    <g
                        key={`${path.join("/")}#${index}`}
                        {...focus.getItemProps(0, index, label, "tile")}
                        transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}
                        style={{ opacity: appear }}
                    >
                        <rect
                            x={leaf.x0}
                            y={leaf.y0}
                            width={w}
                            height={h}
                            rx={4}
                            fill={color}
                            fillOpacity={0.16 + 0.55 * (value / maxLeafValue)}
                            stroke={isCurrent ? color : "none"}
                            strokeWidth={1.5}
                        />
                        {showLabel && (
                            <>
                                <ChartLabel x={leaf.x0 + 8} y={leaf.y0 + 16} baseline="auto" tone="primary" weight="semibold">
                                    {name}
                                </ChartLabel>
                                <ChartLabel x={leaf.x0 + 8} y={leaf.y0 + 30} baseline="auto" tone="secondary" weight="regular">
                                    {valueFormatter(value)}
                                </ChartLabel>
                            </>
                        )}
                    </g>
                );
            })}

            {focus.isKeyboard && currentLeaf && (
                <ChartFocusRing
                    shape={{
                        type: "rect",
                        x: currentLeaf.x0,
                        y: currentLeaf.y0,
                        width: currentLeaf.x1 - currentLeaf.x0,
                        height: currentLeaf.y1 - currentLeaf.y0,
                        rx: 4,
                    }}
                    offset={2}
                />
            )}
        </g>
    );
};
