"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { SankeyLink, SankeyNode } from "d3-sankey";
import { sankey as d3Sankey, sankeyJustify, sankeyLinkHorizontal } from "d3-sankey";
import type { ChartProps } from "./chart";
import { Chart, useChartTooltip } from "./chart";
import { ChartFocusRing, ChartLabel } from "./chart-primitives";
import type { ChartTooltipData } from "./chart-types";
import { estimateTextWidth, fitLabel, formatNumber, seriesColor, stagger } from "./chart-utils";
import { useChartFocus } from "./use-chart-focus";
import { useChartTransition } from "./use-chart-motion";

export interface SankeyNodeInput {
    id: string;
    name: string;
    /** Optional explicit color. Only meaningful on first-column nodes; downstream nodes inherit the color of their largest inflow. */
    color?: string;
}

export interface SankeyLinkInput {
    /** Source node id. */
    source: string;
    /** Target node id. */
    target: string;
    value: number;
}

export interface SankeyChartProps extends Omit<ChartProps, "children" | "table" | "legend" | "hiddenKeys" | "onLegendToggle" | "isEmpty"> {
    nodes: SankeyNodeInput[];
    /** Flows between nodes. Memoise it: a new array identity replays the transition. */
    links: SankeyLinkInput[];
    /** Node rectangle width in px. */
    nodeWidth?: number;
    /** Vertical gap between nodes in the same column, in px. */
    nodePadding?: number;
    /** Ids of terminal nodes whose incoming flows should recede (e.g. "No reply", "Rejected"). */
    mutedNodes?: string[];
    /** Formats values for labels, tooltips and the table. */
    valueFormatter?: (value: number) => string;
    /** Called when a flow is activated with Enter, Space or a click. */
    onLinkSelect?: (info: { link: SankeyLinkInput; index: number }) => void;
}

type NodeExtra = SankeyNodeInput & { color: string; value: number };
type LinkExtra = { color: string; inputIndex: number };
type LayoutNode = SankeyNode<NodeExtra, LinkExtra>;
type LayoutLink = SankeyLink<NodeExtra, LinkExtra>;

/**
 * Sankey diagram for flows between stages, e.g. where applications came
 * from and where they ended up. Ribbons inherit the color of the chain they
 * started in, draw on in column order, and every ribbon is a focusable mark.
 */
export const SankeyChart = ({
    nodes,
    links,
    nodeWidth = 10,
    nodePadding = 14,
    mutedNodes,
    valueFormatter = formatNumber,
    onLinkSelect,
    description,
    height = 260,
    ...chartProps
}: SankeyChartProps) => {
    const nameOf = useMemo(() => new Map(nodes.map((n) => [n.id, n.name])), [nodes]);

    const table = useMemo(
        () => ({
            columns: ["From", "To", "Value"],
            rows: links.map((link) => [nameOf.get(link.source) ?? link.source, nameOf.get(link.target) ?? link.target, valueFormatter(link.value)]),
        }),
        [links, nameOf, valueFormatter],
    );

    const autoDescription = useMemo(() => {
        if (links.length === 0) return "No data.";
        const largest = links.reduce((a, b) => (b.value > a.value ? b : a), links[0]);
        return `${links.length} flows between ${nodes.length} nodes. The largest flow is ${nameOf.get(largest.source) ?? largest.source} to ${nameOf.get(largest.target) ?? largest.target} at ${valueFormatter(largest.value)}.`;
    }, [links, nodes.length, nameOf, valueFormatter]);

    return (
        <Chart
            {...chartProps}
            height={height}
            description={description ?? autoDescription}
            table={table}
            isEmpty={links.length === 0 || nodes.length === 0 || links.every((link) => !(link.value > 0))}
        >
            {(size) => (
                <SankeyChartPlot
                    {...size}
                    nodes={nodes}
                    links={links}
                    nodeWidth={nodeWidth}
                    nodePadding={nodePadding}
                    mutedNodes={mutedNodes}
                    valueFormatter={valueFormatter}
                    onLinkSelect={onLinkSelect}
                />
            )}
        </Chart>
    );
};

interface SankeyChartPlotProps {
    width: number;
    height: number;
    nodes: SankeyNodeInput[];
    links: SankeyLinkInput[];
    nodeWidth: number;
    nodePadding: number;
    mutedNodes?: string[];
    valueFormatter: (value: number) => string;
    onLinkSelect?: SankeyChartProps["onLinkSelect"];
}

const SankeyChartPlot = ({ width, height, nodes, links, nodeWidth, nodePadding, mutedNodes, valueFormatter, onLinkSelect }: SankeyChartPlotProps) => {
    const progress = useChartTransition(links);
    const muted = useMemo(() => new Set(mutedNodes ?? []), [mutedNodes]);

    // Node totals from the raw links, so label margins are known before the layout runs.
    const totals = useMemo(() => {
        const inflow = new Map<string, number>();
        const outflow = new Map<string, number>();
        for (const l of links) {
            outflow.set(l.source, (outflow.get(l.source) ?? 0) + l.value);
            inflow.set(l.target, (inflow.get(l.target) ?? 0) + l.value);
        }
        return new Map(nodes.map((n) => [n.id, Math.max(inflow.get(n.id) ?? 0, outflow.get(n.id) ?? 0)]));
    }, [nodes, links]);
    const hasInflow = useMemo(() => new Set(links.map((l) => l.target)), [links]);
    const hasOutflow = useMemo(() => new Set(links.map((l) => l.source)), [links]);
    const labelText = (n: SankeyNodeInput) => `${n.name} ${valueFormatter(totals.get(n.id) ?? 0)}`;
    const leftLabels = nodes.filter((n) => !hasInflow.has(n.id)).map(labelText);
    const rightLabels = nodes.filter((n) => !hasOutflow.has(n.id)).map(labelText);
    const labelCap = Math.max(40, width * 0.28);
    const margin = {
        top: 16,
        right: Math.min(Math.ceil(Math.max(0, ...rightLabels.map((l) => estimateTextWidth(l, 12)))) + 12, labelCap),
        bottom: 6,
        left: Math.min(Math.ceil(Math.max(0, ...leftLabels.map((l) => estimateTextWidth(l, 12)))) + 12, labelCap),
    };
    const plotWidth = Math.max(1, width - margin.left - margin.right);
    const plotHeight = Math.max(1, height - margin.top - margin.bottom);

    const layout = useMemo(() => {
        const nodeIds = new Set(nodes.map((n) => n.id));
        const validLinks = links.filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target) && l.source !== l.target && l.value > 0);
        const empty = { nodes: [] as LayoutNode[], links: [] as LayoutLink[], columns: 1, validLinks };
        if (validLinks.length === 0) return empty;
        // Only nodes that take part in a valid flow are laid out; an orphan node has no
        // column and would give d3-sankey a zero-value column (NaN coordinates).
        const usedIds = new Set(validLinks.flatMap((l) => [l.source, l.target]));
        let graph: { nodes: LayoutNode[]; links: LayoutLink[] };
        try {
            graph = d3Sankey<NodeExtra, LinkExtra>()
                .nodeId((d) => d.id)
                .nodeWidth(nodeWidth)
                .nodePadding(nodePadding)
                .nodeAlign(sankeyJustify)
                .extent([
                    [0, 0],
                    [plotWidth, plotHeight],
                ])({
                nodes: nodes.filter((n) => usedIds.has(n.id)).map((n) => ({ ...n, color: n.color ?? "", value: 0 })),
                links: validLinks.map((l, inputIndex) => ({ source: l.source, target: l.target, value: l.value, color: "", inputIndex })),
            });
        } catch {
            // d3-sankey throws on circular flows; render nothing rather than crash the page.
            return empty;
        }

        // Colors: first column by slot, everything else inherits its largest inflow.
        const sorted = [...graph.nodes].sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0) || (a.y0 ?? 0) - (b.y0 ?? 0));
        let slot = 0;
        for (const node of sorted) {
            if ((node.depth ?? 0) === 0) {
                node.color = node.color || seriesColor(slot++);
            } else {
                const largest = (node.targetLinks ?? []).reduce<LayoutLink | null>((best, l) => (!best || l.value > best.value ? l : best), null);
                node.color = largest ? (largest.source as LayoutNode).color : seriesColor(0);
            }
            for (const l of node.sourceLinks ?? []) l.color = node.color;
        }
        const columns = Math.max(1, ...graph.nodes.map((n) => (n.depth ?? 0) + 1));
        return { nodes: graph.nodes as LayoutNode[], links: graph.links as LayoutLink[], columns, validLinks };
    }, [nodes, links, nodeWidth, nodePadding, plotWidth, plotHeight]);

    const labelOf = (node: LayoutNode) => `${node.name} ${valueFormatter(node.value ?? 0)}`;
    const fitNodeLabel = (node: LayoutNode, maxWidth: number) => (
        <>
            {fitLabel(labelOf(node), maxWidth)}
            <title>{labelOf(node)}</title>
        </>
    );

    const geometry = useMemo(() => {
        const nodeBox = (n: LayoutNode) => ({
            x: n.x0 ?? 0,
            y: n.y0 ?? 0,
            width: Math.max(1, (n.x1 ?? 0) - (n.x0 ?? 0)),
            height: Math.max(1, (n.y1 ?? 0) - (n.y0 ?? 0)),
        });
        const gen = sankeyLinkHorizontal<NodeExtra, LinkExtra>();
        const linkGeoms = layout.links.map((l) => {
            const src = l.source as LayoutNode;
            const tgt = l.target as LayoutNode;
            const x0 = src.x1 ?? 0;
            const x1 = tgt.x0 ?? 0;
            const y0 = l.y0 ?? 0;
            const y1 = l.y1 ?? 0;
            return { d: gen(l) ?? "", width: Math.max(1, l.width ?? 1), midX: (x0 + x1) / 2, midY: (y0 + y1) / 2, column: src.depth ?? 0, link: l };
        });
        return { nodeBox, linkGeoms };
    }, [layout]);

    // Focus order: links by their midpoint y.
    const order = useMemo(
        () =>
            geometry.linkGeoms
                .map((g, i) => ({ g, i }))
                .sort((a, b) => a.g.midY - b.g.midY)
                .map(({ i }) => i),
        [geometry],
    );

    // Path lengths for the draw-on animation.
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const [lengths, setLengths] = useState<number[]>([]);
    useLayoutEffect(() => {
        const next = pathRefs.current.map((p) => (p ? p.getTotalLength() : 0));
        setLengths((prev) => (prev.length === next.length && prev.every((v, i) => Math.abs(v - next[i]) < 0.5) ? prev : next));
    }, [geometry]);

    const focus = useChartFocus({
        rowCount: 1,
        colCount: () => order.length,
        navigation: "list",
        onSelect: onLinkSelect
            ? ({ col }) => {
                  const g = geometry.linkGeoms[order[col]];
                  onLinkSelect({ link: layout.validLinks[g.link.inputIndex], index: g.link.inputIndex });
              }
            : undefined,
    });
    const current = focus.current;
    const currentLinkIndex = current ? order[current.col] : -1;

    const tooltip = useMemo<ChartTooltipData | null>(() => {
        if (currentLinkIndex < 0) return null;
        const g = geometry.linkGeoms[currentLinkIndex];
        return {
            x: margin.left + g.midX,
            y: margin.top + g.midY - g.width / 2,
            title: `${(g.link.source as LayoutNode).name} → ${(g.link.target as LayoutNode).name}`,
            rows: [{ name: "Value", value: valueFormatter(g.link.value), color: g.link.color, isActive: true }],
        };
    }, [currentLinkIndex, geometry, margin.left, margin.top, valueFormatter]);
    useChartTooltip(tooltip);

    const columnCount = layout.columns;

    return (
        <g transform={`translate(${margin.left},${margin.top})`}>
            <g fill="none">
                {geometry.linkGeoms.map((g, i) => {
                    const isMuted = muted.has((g.link.target as LayoutNode).id);
                    const isCurrent = i === currentLinkIndex;
                    const k = stagger(progress, g.column, columnCount, 0.5);
                    const length = lengths[i] ?? 0;
                    const label = `${(g.link.source as LayoutNode).name} to ${(g.link.target as LayoutNode).name}, ${valueFormatter(g.link.value)}`;
                    const itemProps = focus.getItemProps(0, order.indexOf(i), label, "flow");
                    return (
                        <path
                            key={i}
                            {...itemProps}
                            ref={(el) => {
                                itemProps.ref(el);
                                pathRefs.current[i] = el;
                            }}
                            d={g.d}
                            stroke={g.link.color}
                            strokeWidth={g.width}
                            strokeOpacity={isCurrent ? 0.7 : isMuted ? 0.18 : 0.42}
                            strokeDasharray={length ? `${length} ${length}` : undefined}
                            strokeDashoffset={length ? length * (1 - k) : 0}
                            className="transition-[stroke-opacity] duration-100 ease-linear"
                        />
                    );
                })}
            </g>

            {layout.nodes.map((node) => {
                const box = geometry.nodeBox(node);
                const depth = node.depth ?? 0;
                const isFirst = depth === 0;
                const isLast = depth === columnCount - 1;
                return (
                    <g key={node.id} style={{ opacity: stagger(progress, depth, columnCount, 0.5) }}>
                        <rect x={box.x} y={box.y} width={box.width} height={box.height} rx={3} fill={isFirst ? node.color : "var(--color-fg-quaternary)"} />
                        {isFirst ? (
                            <ChartLabel x={box.x - 8} y={box.y + box.height / 2} anchor="end">
                                {fitNodeLabel(node, margin.left - 12)}
                            </ChartLabel>
                        ) : isLast ? (
                            <ChartLabel x={box.x + box.width + 8} y={box.y + box.height / 2} anchor="start">
                                {fitNodeLabel(node, margin.right - 12)}
                            </ChartLabel>
                        ) : (
                            <ChartLabel x={box.x + box.width / 2} y={box.y - 8} anchor="middle">
                                {labelOf(node)}
                            </ChartLabel>
                        )}
                    </g>
                );
            })}

            {focus.isKeyboard && currentLinkIndex >= 0 && (
                <ChartFocusRing
                    shape={{
                        type: "rect",
                        x: geometry.linkGeoms[currentLinkIndex].midX - 6,
                        y: geometry.linkGeoms[currentLinkIndex].midY - geometry.linkGeoms[currentLinkIndex].width / 2,
                        width: 12,
                        height: geometry.linkGeoms[currentLinkIndex].width,
                        rx: 2,
                    }}
                />
            )}
        </g>
    );
};
