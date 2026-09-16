"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import { formatNumber } from "./chart-utils";
import { Sparkline, describeTrend } from "./sparkline";
import { useChartTransition } from "./use-chart-motion";

export interface StatTileDelta {
    /** Already-formatted change, e.g. "+12.4%" or "−2.3 pts". */
    value: string;
    direction: "up" | "down" | "flat";
    /** Whether the change is good news. Defaults to `direction === "up"`; set false for metrics where down is good. */
    isPositive?: boolean;
    /** Context for the comparison, e.g. "vs last month". */
    caption?: string;
}

export interface StatTileProps {
    /** Sentence-case metric name, no trailing colon. */
    label: string;
    /** Numbers count up on entry and are formatted with `valueFormatter`; strings render as-is. */
    value: number | string;
    valueFormatter?: (value: number) => string;
    /** Signed change versus a named period. */
    delta?: StatTileDelta;
    /** Recent values, oldest first, drawn as a sparkline under the delta. */
    trend?: number[];
    /** Controls the value's display size. */
    size?: "sm" | "md" | "lg";
    className?: string;
}

const valueSizes = { sm: "text-display-xs", md: "text-display-sm", lg: "text-display-md" } as const;

/**
 * The form to use when the story is one number. Shows a label, a hero
 * value in proportional figures, an optional signed delta colored by
 * whether the change is good, and an optional sparkline trend.
 */
export const StatTile = ({ label, value, valueFormatter = formatNumber, delta, trend, size = "md", className }: StatTileProps) => {
    const progress = useChartTransition(value);
    const isNumber = typeof value === "number";
    const displayValue = isNumber ? valueFormatter(Math.round(value * progress)) : value;
    const finalValue = isNumber ? valueFormatter(value) : value;

    const isPositive = delta ? (delta.isPositive ?? delta.direction === "up") : true;
    const deltaTone = !delta || delta.direction === "flat" ? "text-tertiary" : isPositive ? "text-success-primary" : "text-error-primary";
    const trendColor =
        !delta || delta.direction === "flat" ? "var(--color-chart-1)" : isPositive ? "var(--color-fg-success-primary)" : "var(--color-fg-error-primary)";
    const DeltaIcon = delta?.direction === "up" ? ArrowUp : delta?.direction === "down" ? ArrowDown : Minus;

    return (
        <div role="group" aria-label={label} className={cx("flex min-w-0 flex-col gap-1", className)}>
            <p className="text-sm text-tertiary">{label}</p>
            <p className={cx("font-semibold text-primary", valueSizes[size])}>
                <span aria-hidden="true">{displayValue}</span>
                <span className="sr-only">{finalValue}</span>
            </p>
            {delta && (
                <p className={cx("flex items-center gap-1 text-sm font-medium", deltaTone)}>
                    <DeltaIcon data-icon aria-hidden="true" className="size-3 shrink-0" />
                    <span>{delta.value}</span>
                    {delta.caption && <span className="font-normal text-quaternary">{delta.caption}</span>}
                </p>
            )}
            {trend && trend.length > 0 && (
                <div className="mt-1">
                    <Sparkline data={trend} color={trendColor} label={`${label} trend over ${trend.length} points, ${describeTrend(trend)}`} />
                </div>
            )}
        </div>
    );
};

export interface StatTileGroupProps {
    /** Number of columns on large screens. */
    columns?: 2 | 3 | 4;
    className?: string;
    children: ReactNode;
}

const columnClasses = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;

/** A responsive row of stat tiles, each on its own card. */
export const StatTileGroup = ({ columns = 3, className, children }: StatTileGroupProps) => (
    <div className={cx("grid gap-4 *:rounded-xl *:bg-primary *:p-5 *:ring-1 *:ring-secondary sm:grid-cols-2", columnClasses[columns], className)}>
        {children}
    </div>
);
