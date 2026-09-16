"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cx } from "@/utils/cx";
import type { ChartLegendItem, ChartTable, ChartTooltipData } from "./chart-types";
import { useChartReducedMotion } from "./use-chart-motion";

interface ChartContextValue {
    /** Measured plot width in px. */
    width: number;
    /** Plot height in px. */
    height: number;
    /** Stable id prefix for `<clipPath>`/`<linearGradient>` definitions. */
    id: string;
    reducedMotion: boolean;
    setTooltip: (tooltip: ChartTooltipData | null) => void;
    /** Pushes text to the chart's polite live region. */
    announce: (text: string) => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);

/** Access the enclosing `<Chart>`'s size, tooltip and announcement helpers. */
export const useChartContext = (): ChartContextValue => {
    const context = useContext(ChartContext);
    if (!context) throw new Error("useChartContext must be used inside <Chart>.");
    return context;
};

/**
 * Declaratively shows the chart tooltip. Pass `null` to hide it. Charts call
 * this with the descriptor for the currently focused or hovered mark.
 */
export const useChartTooltip = (tooltip: ChartTooltipData | null) => {
    const { setTooltip } = useChartContext();
    const { x, y, title } = tooltip ?? { x: 0, y: 0, title: "" };
    const rowsKey = tooltip ? tooltip.rows.map((row) => `${row.name}=${row.value}`).join("|") : "";
    useEffect(() => {
        setTooltip(tooltip);
        // Compare by content so an identical descriptor rebuilt on every
        // render does not re-trigger the effect.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [x, y, title, rowsKey, setTooltip]);
    useEffect(() => () => setTooltip(null), [setTooltip]);
};

export interface ChartProps {
    /** Accessible name announced for the whole chart, e.g. "Applications by week". Required. */
    label: string;
    /** One-sentence summary of what the data shows, exposed to assistive technology. Charts generate a default from their data. */
    description?: string;
    /** Visible title rendered above the plot. */
    title?: ReactNode;
    /** Visible supporting text rendered under the title. */
    subtitle?: ReactNode;
    /** Slot rendered at the end of the header row (e.g. a range select). */
    actions?: ReactNode;
    /** Plot height in px. Width is always the container width. */
    height?: number;
    className?: string;
    /** Legend entries. Omit for single-series charts (the title names the series). */
    legend?: ChartLegendItem[];
    /** Where to render the legend. Defaults to `top`. */
    legendPosition?: "top" | "bottom";
    /** Series keys currently hidden through the legend. */
    hiddenKeys?: ReadonlySet<string>;
    /** Makes legend entries toggle buttons. */
    onLegendToggle?: (key: string) => void;
    /** The accessible table twin. Rendered visually hidden unless `showTable` is set. */
    table?: ChartTable;
    /** Renders the data table visibly under the chart. */
    showTable?: boolean;
    /** Renders the empty state instead of the plot. */
    isEmpty?: boolean;
    /** Text shown in the empty state. */
    emptyMessage?: string;
    /** Render prop receiving the measured plot size. Return SVG content. */
    children: (size: { width: number; height: number }) => ReactNode;
}

/**
 * The shared frame every Odyssey chart renders into. It measures its
 * container, owns the HTML tooltip, the legend, the polite live region and
 * the accessible data-table twin, and exposes size and helpers through
 * `useChartContext`. Build custom charts on it the same way the built-in
 * ones do.
 */
export const Chart = ({
    label,
    description,
    title,
    subtitle,
    actions,
    height = 240,
    className,
    legend,
    legendPosition = "top",
    hiddenKeys,
    onLegendToggle,
    table,
    showTable = false,
    isEmpty = false,
    emptyMessage = "No data to display",
    children,
}: ChartProps) => {
    const id = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [tooltip, setTooltipState] = useState<ChartTooltipData | null>(null);
    const [announcement, setAnnouncement] = useState("");
    const reducedMotion = useChartReducedMotion();

    const measure = useCallback(() => {
        const element = containerRef.current;
        if (!element) return;
        const next = Math.floor(element.getBoundingClientRect().width);
        setWidth((prev) => (prev === next ? prev : next));
    }, []);

    useLayoutEffect(measure, [measure]);
    useResizeObserver({ ref: containerRef, onResize: measure });

    const setTooltip = useCallback((next: ChartTooltipData | null) => setTooltipState(next), []);
    const announce = useCallback((text: string) => setAnnouncement(text), []);

    const context = useMemo<ChartContextValue>(
        () => ({ width, height, id, reducedMotion, setTooltip, announce }),
        [width, height, id, reducedMotion, setTooltip, announce],
    );

    const descriptionId = `${id}-description`;
    const hasHeader = Boolean(title || subtitle || actions || (legend && legendPosition === "top"));
    const legendNode = legend && legend.length > 0 ? <ChartLegend items={legend} hiddenKeys={hiddenKeys} onToggle={onLegendToggle} /> : null;

    return (
        <ChartContext.Provider value={context}>
            <figure
                role="figure"
                aria-label={label}
                aria-describedby={description ? descriptionId : undefined}
                className={cx("relative flex w-full min-w-0 flex-col gap-3", className)}
            >
                {hasHeader && (
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                        {(title || subtitle) && (
                            <div className="flex min-w-0 flex-col gap-0.5">
                                {title && <p className="text-sm font-semibold text-primary">{title}</p>}
                                {subtitle && <p className="text-xs text-tertiary">{subtitle}</p>}
                            </div>
                        )}
                        <div className="flex min-w-0 flex-wrap items-center gap-3">
                            {legendPosition === "top" && legendNode}
                            {actions}
                        </div>
                    </div>
                )}

                <div ref={containerRef} className="relative w-full min-w-0" style={{ height }}>
                    {isEmpty ? (
                        <ChartEmptyState message={emptyMessage} />
                    ) : (
                        width > 0 && (
                            <svg
                                width={width}
                                height={height}
                                viewBox={`0 0 ${width} ${height}`}
                                className="block overflow-visible text-xs tabular-nums select-none [&_[data-chart-item]]:cursor-pointer [&_[data-chart-item]]:outline-none"
                            >
                                {children({ width, height })}
                            </svg>
                        )
                    )}
                    {!isEmpty && width > 0 && <ChartTooltip tooltip={tooltip} containerWidth={width} />}
                </div>

                {legendPosition === "bottom" && legendNode}

                {description && (
                    <figcaption id={descriptionId} className="sr-only">
                        {description}
                    </figcaption>
                )}
                <div aria-live="polite" aria-atomic="true" className="sr-only">
                    {announcement}
                </div>

                {table && <ChartDataTable table={table} isVisible={showTable} />}
            </figure>
        </ChartContext.Provider>
    );
};

interface ChartLegendProps {
    items: ChartLegendItem[];
    hiddenKeys?: ReadonlySet<string>;
    /** When provided, entries become toggle buttons. */
    onToggle?: (key: string) => void;
    className?: string;
}

/** The chart legend. Entries mirror the mark shape and become toggle buttons when `onToggle` is passed. */
export const ChartLegend = ({ items, hiddenKeys, onToggle, className }: ChartLegendProps) => (
    <ul className={cx("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)} aria-label="Legend">
        {items.map((item) => {
            const isHidden = hiddenKeys?.has(item.key) ?? false;
            const swatch = (
                <span
                    aria-hidden="true"
                    className={cx(
                        "inline-block shrink-0 transition duration-100 ease-linear",
                        item.shape === "line" ? "h-0.5 w-3 rounded-full" : item.shape === "square" ? "size-2.5 rounded-sm" : "size-2 rounded-full",
                        isHidden && "opacity-30",
                    )}
                    style={{ backgroundColor: item.color }}
                />
            );
            const content = (
                <>
                    {swatch}
                    <span className={cx("text-xs text-tertiary transition duration-100 ease-linear", isHidden && "line-through opacity-60")}>{item.name}</span>
                </>
            );
            return (
                <li key={item.key} className="flex items-center">
                    {onToggle ? (
                        <button
                            type="button"
                            aria-pressed={!isHidden}
                            onClick={() => onToggle(item.key)}
                            className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 outline-focus-ring hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            {content}
                        </button>
                    ) : (
                        <span className="flex items-center gap-2">{content}</span>
                    )}
                </li>
            );
        })}
    </ul>
);

interface ChartTooltipProps {
    tooltip: ChartTooltipData | null;
    containerWidth: number;
}

/**
 * The HTML tooltip shared by every chart. It is positioned in plot pixel
 * space, clamped to the container's horizontal bounds and flipped below the
 * anchor when there is no room above it.
 */
const ChartTooltip = ({ tooltip, containerWidth }: ChartTooltipProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element || !tooltip) return;
        const rect = element.getBoundingClientRect();
        setSize((prev) => (prev.width === rect.width && prev.height === rect.height ? prev : { width: rect.width, height: rect.height }));
    }, [tooltip]);

    if (!tooltip) return null;

    const gap = 10;
    const half = size.width / 2;
    const left = Math.max(half, Math.min(containerWidth - half, tooltip.x));
    const flip = tooltip.y - size.height - gap < 0;
    const top = flip ? tooltip.y + gap : tooltip.y - gap;

    return (
        <div
            ref={ref}
            role="presentation"
            aria-hidden="true"
            className="pointer-events-none absolute z-10 flex min-w-32 flex-col gap-1 rounded-lg bg-primary-solid px-3 py-2 shadow-lg"
            style={{ left, top, transform: `translate(-50%, ${flip ? "0" : "-100%"})`, visibility: size.width ? "visible" : "hidden" }}
        >
            <p className="text-xs font-semibold text-white">{tooltip.title}</p>
            {tooltip.rows.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    {tooltip.rows.map((row, index) => (
                        <div key={`${row.name}-${index}`} className="flex items-center gap-2 text-xs text-tooltip-supporting-text">
                            {row.color && (
                                <span aria-hidden="true" className="inline-block h-0.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                            )}
                            <span className={cx("truncate", row.isActive && "text-white")}>{row.name}</span>
                            <span className={cx("ml-auto pl-3 font-semibold text-white", row.isActive && "underline underline-offset-2")}>{row.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ChartDataTableProps {
    table: ChartTable;
    /** Renders the table visibly. Otherwise it stays available to assistive technology only. */
    isVisible?: boolean;
    className?: string;
}

/** The table twin of a chart: every plotted value, reachable without a pointer. */
export const ChartDataTable = ({ table, isVisible = false, className }: ChartDataTableProps) => (
    <div className={cx(isVisible ? "w-full overflow-x-auto rounded-lg ring-1 ring-secondary" : "sr-only", className)}>
        <table className="w-full border-collapse text-xs tabular-nums">
            {table.caption && <caption className={cx("text-left text-xs text-tertiary", isVisible && "px-3 py-2")}>{table.caption}</caption>}
            <thead>
                <tr>
                    {table.columns.map((column, index) => (
                        <th
                            key={`${column}-${index}`}
                            scope="col"
                            className={cx(
                                "font-medium text-quaternary",
                                isVisible && "border-b border-secondary bg-secondary px-3 py-1.5",
                                index > 0 ? "text-right" : "text-left",
                            )}
                        >
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) =>
                            cellIndex === 0 ? (
                                <th
                                    key={cellIndex}
                                    scope="row"
                                    className={cx("text-left font-medium text-secondary", isVisible && "border-b border-tertiary px-3 py-1.5")}
                                >
                                    {cell}
                                </th>
                            ) : (
                                <td key={cellIndex} className={cx("text-right text-tertiary", isVisible && "border-b border-tertiary px-3 py-1.5")}>
                                    {cell}
                                </td>
                            ),
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

interface ChartEmptyStateProps {
    message?: string;
    className?: string;
}

/** Labelled empty state rendered in place of the plot when there is no data. */
export const ChartEmptyState = ({ message = "No data to display", className }: ChartEmptyStateProps) => (
    <div role="status" className={cx("flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-secondary", className)}>
        <svg width="40" height="28" viewBox="0 0 40 28" aria-hidden="true" className="text-fg-quaternary">
            <rect x="2" y="16" width="6" height="10" rx="2" fill="currentColor" opacity="0.5" />
            <rect x="12" y="10" width="6" height="16" rx="2" fill="currentColor" opacity="0.5" />
            <rect x="22" y="4" width="6" height="22" rx="2" fill="currentColor" opacity="0.5" />
            <rect x="32" y="12" width="6" height="14" rx="2" fill="currentColor" opacity="0.5" />
        </svg>
        <p className="text-sm text-tertiary">{message}</p>
    </div>
);
