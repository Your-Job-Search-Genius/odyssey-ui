"use client";

import type { FocusEvent, KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChartFocusPosition } from "./chart-types";

export interface UseChartFocusOptions {
    /** Number of rows in the focus grid (usually the number of series). */
    rowCount: number;
    /** Number of focusable items in a given row (usually the number of data points). */
    colCount: (row: number) => number;
    /**
     * `grid`: Left/Right move within a row, Up/Down move between rows.
     * `list`: every arrow key steps through the single row (for pies, funnels, ranked bars).
     */
    navigation?: "grid" | "list";
    /** Called when the reader presses Enter or Space on an item, or clicks it. */
    onSelect?: (position: ChartFocusPosition) => void;
}

/** Props to spread onto each focusable mark (an SVG `<g>`, `<rect>`, `<circle>` or `<path>`). */
export interface ChartItemProps {
    ref: (element: SVGElement | null) => void;
    tabIndex: number;
    role: "img";
    "aria-label": string;
    "aria-roledescription": string;
    "data-chart-item": string;
    "data-current": true | undefined;
    onFocus: (event: FocusEvent<SVGElement>) => void;
    onBlur: (event: FocusEvent<SVGElement>) => void;
    onKeyDown: (event: KeyboardEvent<SVGElement>) => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onClick: () => void;
}

export interface ChartFocus {
    /** The keyboard-focused item, if any. */
    focused: ChartFocusPosition | null;
    /** The pointer-hovered item, if any. */
    hovered: ChartFocusPosition | null;
    /** `focused` when set, otherwise `hovered`. The item tooltips and rings should follow. */
    current: ChartFocusPosition | null;
    /** Whether `current` came from the keyboard (draw the focus ring) rather than the pointer. */
    isKeyboard: boolean;
    setHovered: (position: ChartFocusPosition | null) => void;
    /** Builds the props for the mark at `row`/`col`. `label` is what a screen reader announces. */
    getItemProps: (row: number, col: number, label: string, roleDescription?: string) => ChartItemProps;
    isCurrent: (row: number, col: number) => boolean;
}

const keyOf = (row: number, col: number) => `${row}:${col}`;
const samePosition = (a: ChartFocusPosition | null, b: ChartFocusPosition | null) => (a === b ? true : !!a && !!b && a.row === b.row && a.col === b.col);

/**
 * Roving-tabindex keyboard model shared by every chart.
 *
 * The chart is a single tab stop: exactly one mark carries `tabIndex=0`
 * (the last one visited, or the first). Arrow keys move focus between
 * marks, Home/End jump to the ends of a row, Escape drops focus and closes
 * the tooltip, Enter/Space activate. Pointer hover is tracked alongside so a
 * chart can show the same tooltip for both input methods.
 */
export function useChartFocus(options: UseChartFocusOptions): ChartFocus {
    const { rowCount, colCount, navigation = "grid", onSelect } = options;
    const elements = useRef(new Map<string, SVGElement>());
    const [tabbable, setTabbable] = useState<ChartFocusPosition>({ row: 0, col: 0 });
    const [focused, setFocused] = useState<ChartFocusPosition | null>(null);
    const [hovered, setHoveredState] = useState<ChartFocusPosition | null>(null);

    const clampPosition = useCallback(
        (row: number, col: number): ChartFocusPosition => {
            const r = Math.max(0, Math.min(rowCount - 1, row));
            const cols = Math.max(0, colCount(r));
            const c = Math.max(0, Math.min(cols - 1, col));
            return { row: r, col: c };
        },
        [rowCount, colCount],
    );

    // Keep the tabbable item inside the grid when the data shrinks.
    useEffect(() => {
        if (rowCount === 0) return;
        const clamped = clampPosition(tabbable.row, tabbable.col);
        if (!samePosition(clamped, tabbable)) setTabbable(clamped);
    }, [rowCount, clampPosition, tabbable]);

    const moveTo = useCallback(
        (row: number, col: number) => {
            const next = clampPosition(row, col);
            setTabbable(next);
            elements.current.get(keyOf(next.row, next.col))?.focus({ preventScroll: true });
        },
        [clampPosition],
    );

    const setHovered = useCallback((position: ChartFocusPosition | null) => {
        setHoveredState((prev) => (samePosition(prev, position) ? prev : position));
    }, []);

    const getItemProps = useCallback(
        (row: number, col: number, label: string, roleDescription = "data point"): ChartItemProps => {
            const key = keyOf(row, col);
            const isTabbable = tabbable.row === row && tabbable.col === col;
            const isCurrentItem = focused ? focused.row === row && focused.col === col : !!hovered && hovered.row === row && hovered.col === col;

            return {
                ref: (element) => {
                    if (element) elements.current.set(key, element);
                    else elements.current.delete(key);
                },
                tabIndex: isTabbable ? 0 : -1,
                role: "img",
                "aria-label": label,
                "aria-roledescription": roleDescription,
                "data-chart-item": key,
                "data-current": isCurrentItem || undefined,
                onFocus: () => {
                    setFocused({ row, col });
                    setTabbable({ row, col });
                },
                onBlur: (event) => {
                    // Only a move to another mark of *this* chart keeps focus state; a
                    // mark in a neighbouring chart must not leave a stale ring/tooltip here.
                    const next = event.relatedTarget as SVGElement | null;
                    const staysInside = !!next && [...elements.current.values()].includes(next);
                    if (!staysInside) setFocused(null);
                },
                onKeyDown: (event) => {
                    const cols = colCount(row);
                    let handled = true;
                    switch (event.key) {
                        case "ArrowRight":
                            moveTo(row, col + 1);
                            break;
                        case "ArrowLeft":
                            moveTo(row, col - 1);
                            break;
                        case "ArrowDown":
                            if (navigation === "list") moveTo(row, col + 1);
                            else moveTo(row + 1, col);
                            break;
                        case "ArrowUp":
                            if (navigation === "list") moveTo(row, col - 1);
                            else moveTo(row - 1, col);
                            break;
                        case "Home":
                            moveTo(event.ctrlKey ? 0 : row, 0);
                            break;
                        case "End":
                            moveTo(event.ctrlKey ? rowCount - 1 : row, cols - 1);
                            break;
                        case "Escape":
                            setFocused(null);
                            (event.currentTarget as SVGElement).blur();
                            break;
                        case "Enter":
                        case " ":
                            onSelect?.({ row, col });
                            break;
                        default:
                            handled = false;
                    }
                    if (handled) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                },
                onPointerEnter: () => setHovered({ row, col }),
                onPointerLeave: () => setHovered(null),
                onClick: () => onSelect?.({ row, col }),
            };
        },
        [tabbable, focused, hovered, colCount, rowCount, navigation, moveTo, onSelect, setHovered],
    );

    const current = focused ?? hovered;

    const isCurrent = useCallback((row: number, col: number) => !!current && current.row === row && current.col === col, [current]);

    return useMemo(
        () => ({ focused, hovered, current, isKeyboard: focused !== null, setHovered, getItemProps, isCurrent }),
        [focused, hovered, current, setHovered, getItemProps, isCurrent],
    );
}
