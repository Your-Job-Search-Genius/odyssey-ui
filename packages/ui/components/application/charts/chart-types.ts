/**
 * Shared types for the Odyssey chart family. Every chart component in this
 * folder builds on the same vocabulary so that series, legends, tooltips and
 * the accessible data-table twin behave identically across chart types.
 */

/** A single series drawn from a key on each datum. */
export interface ChartSeries<T> {
    /** The property on each datum that holds this series' numeric value. */
    key: Extract<keyof T, string>;
    /** Human-readable name shown in legends, tooltips and the data table. Defaults to `key`. */
    name?: string;
    /**
     * Optional explicit color. Any CSS color, including a token such as
     * `var(--color-chart-3)`. When omitted, the series takes the next
     * categorical slot in order (chart-1, chart-2, ...).
     */
    color?: string;
}

/** One row of the tooltip readout: a colored key, a name and a formatted value. */
export interface ChartTooltipRow {
    name: string;
    value: string;
    /** CSS color for the key swatch. Omit to render no swatch (e.g. a secondary metric). */
    color?: string;
    /** Marks the row the reader is currently on so it can be emphasised. */
    isActive?: boolean;
}

/** A tooltip descriptor positioned in the plot's SVG pixel space. */
export interface ChartTooltipData {
    /** Horizontal anchor in SVG pixels (relative to the chart's plot box). */
    x: number;
    /** Vertical anchor in SVG pixels (relative to the chart's plot box). */
    y: number;
    title: string;
    rows: ChartTooltipRow[];
}

/** The accessible table twin of a chart. Every value in the chart appears here. */
export interface ChartTable {
    caption?: string;
    columns: string[];
    rows: Array<Array<string | number>>;
}

/** One legend entry. */
export interface ChartLegendItem {
    key: string;
    name: string;
    color: string;
    /** The mark shape the legend mirrors: `line` for lines, `square` for bars and areas, `dot` for points. */
    shape?: "line" | "square" | "dot";
}

/** A position in the chart's keyboard focus grid: `row` is usually a series, `col` a data point. */
export interface ChartFocusPosition {
    row: number;
    col: number;
}

/** A node in a hierarchical dataset (treemap, sunburst). */
export interface ChartTreeNode {
    name: string;
    /** Leaf value. Omit on branches; their value is the sum of their children. */
    value?: number;
    children?: ChartTreeNode[];
    /** Optional explicit color for a top-level branch and all of its descendants. */
    color?: string;
}

/** A simple named value used by part-to-whole charts (pie, funnel, radial). */
export interface ChartNamedValue {
    name: string;
    value: number;
    color?: string;
}
