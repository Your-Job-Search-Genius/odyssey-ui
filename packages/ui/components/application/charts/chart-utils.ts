import { format as d3Format } from "d3-format";

/** Number of categorical color slots defined in theme.css (`--color-chart-1` ... `--color-chart-8`). */
export const CHART_SERIES_SLOTS = 8;

/**
 * Resolves the color for the series at `index`. Colors are assigned in fixed
 * order and never cycled: a ninth series reuses the last slot, which is a
 * signal that the chart should fold its tail into an "Other" series instead.
 */
export const seriesColor = (index: number, override?: string): string => {
    if (override) return override;
    const slot = Math.min(Math.max(index, 0), CHART_SERIES_SLOTS - 1) + 1;
    return `var(--color-chart-${slot})`;
};

/** Maps a normalised value in [0, 1] onto the 7-step sequential brand ramp. */
export const sequentialColor = (t: number): string => {
    const clamped = Number.isFinite(t) ? Math.min(Math.max(t, 0), 1) : 0;
    const step = Math.max(1, Math.min(7, Math.ceil(clamped * 7)));
    return `var(--color-chart-sequential-${step})`;
};

/** Returns the diverging pole color for a signed value (negative pole for `< 0`). */
export const divergingColor = (value: number): string => (value < 0 ? "var(--color-chart-diverging-negative)" : "var(--color-chart-diverging-positive)");

const thousands = d3Format(",");
const compact = d3Format("~s");
const oneDecimal = d3Format(",.1f");

/** Formats a value with thousands separators, keeping up to one decimal for non-integers. */
export const formatNumber = (value: number): string => {
    if (!Number.isFinite(value)) return "–";
    return Number.isInteger(value) ? thousands(value) : oneDecimal(value);
};

/** Compact SI formatting for axis ticks: 1200 -> "1.2K", 3_400_000 -> "3.4M". */
export const formatCompact = (value: number): string => {
    if (!Number.isFinite(value)) return "–";
    if (Math.abs(value) < 1000) return formatNumber(value);
    return compact(value).replace("k", "K").replace("G", "B");
};

/** Formats a ratio in [0, 1] as a whole percentage. */
export const formatPercent = (ratio: number): string => `${Math.round(ratio * 100)}%`;

/**
 * Splits a global animation progress `t` into a per-item progress so items
 * animate in sequence. `spread` is the fraction of the total duration that
 * separates the first and the last item.
 */
export const stagger = (t: number, index: number, count: number, spread = 0.35): number => {
    if (count <= 1 || spread <= 0) return clamp01(t);
    const start = (index / (count - 1)) * spread;
    return clamp01((t - start) / (1 - spread));
};

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/** Linear interpolation between two numbers. */
export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

/** Truncates a label to `max` characters, appending an ellipsis. */
export const truncateLabel = (label: string, max = 14): string => (label.length > max ? `${label.slice(0, Math.max(1, max - 1))}…` : label);

/** Truncates `label` so its estimated width fits in `maxWidth` px. Pair with a `<title>` carrying the full text. */
export const fitLabel = (label: string, maxWidth: number, fontSize = 12): string => {
    const maxChars = Math.floor(maxWidth / (fontSize * 0.58));
    return maxChars >= label.length ? label : truncateLabel(label, Math.max(2, maxChars));
};

/** Rough text width estimate (in px) for laying out axis margins before fonts are measured. */
export const estimateTextWidth = (text: string, fontSize = 12): number => text.length * fontSize * 0.58;

/** Picks evenly spaced indices so that at most `max` labels are shown on a categorical axis. */
export const evenlySpacedIndices = (count: number, max: number): number[] => {
    if (count <= 0) return [];
    if (count <= max) return Array.from({ length: count }, (_, i) => i);
    const step = Math.ceil(count / max);
    const picked: number[] = [];
    for (let i = 0; i < count; i += step) picked.push(i);
    return picked;
};

/** Coerces an unknown datum field to a finite number, treating anything else as 0. */
export const toNumber = (value: unknown): number => {
    const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
    return Number.isFinite(n) ? n : 0;
};

/** Coerces an unknown datum field to a display string. */
export const toLabel = (value: unknown): string => {
    if (value instanceof Date) return value.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    if (value === null || value === undefined) return "";
    return String(value);
};

/** Rounded-top bar path growing upward from `baseY`. Radius collapses gracefully for very short bars. */
export const roundedBarPath = (x: number, baseY: number, width: number, height: number, radius: number, direction: "up" | "down" = "up"): string => {
    const h = Math.max(0, height);
    const r = Math.min(radius, width / 2, h);
    const sign = direction === "up" ? -1 : 1;
    const straight = h - r;
    return [
        `M${x},${baseY}`,
        `v${sign * straight}`,
        `a${r},${r} 0 0 ${direction === "up" ? 1 : 0} ${r},${sign * r}`,
        `h${width - 2 * r}`,
        `a${r},${r} 0 0 ${direction === "up" ? 1 : 0} ${r},${-sign * r}`,
        `v${-sign * straight}`,
        "z",
    ].join(" ");
};

/** Rounded-end horizontal bar path growing from `x0` toward the right or left. */
export const roundedHorizontalBarPath = (
    x0: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    direction: "right" | "left" = "right",
): string => {
    const w = Math.max(0, width);
    const r = Math.min(radius, height / 2, w);
    const sign = direction === "right" ? 1 : -1;
    const straight = w - r;
    return [
        `M${x0},${y}`,
        `h${sign * straight}`,
        `a${r},${r} 0 0 ${direction === "right" ? 1 : 0} ${sign * r},${r}`,
        `v${height - 2 * r}`,
        `a${r},${r} 0 0 ${direction === "right" ? 1 : 0} ${-sign * r},${r}`,
        `h${-sign * straight}`,
        "z",
    ].join(" ");
};
