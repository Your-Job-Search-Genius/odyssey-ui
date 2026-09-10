"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import type { ListBoxProps as AriaListBoxProps, Key } from "react-aria-components";
import {
    ListBox as AriaListBox,
    ListBoxItem as AriaListBoxItem,
    ListBoxLoadMoreItem as AriaListBoxLoadMoreItem,
    ListLayout,
    Virtualizer,
} from "react-aria-components";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { cx } from "@/utils/cx";

/** In-memory scroll position cache, keyed by `scrollRestorationKey`. Survives unmount/remount
 * within the same session (e.g. navigating away and back) but not a full page reload — swap in
 * `sessionStorage` in `restoreScroll`/`onScroll` below if that's needed. */
const scrollPositions = new Map<string, number>();

export interface VirtualizedListProps<T extends { id: Key }> extends Omit<
    AriaListBoxProps<T>,
    "children" | "items" | "layout" | "renderEmptyState" | "className"
> {
    /** The full (already-fetched) list of rows to render. */
    items: T[];
    /** Render function for a single row's contents. The surrounding interactive wrapper (focus ring, hover, selection) is provided automatically. */
    children: (item: T) => ReactNode;
    /** Returns a plain-text representation of a row, used for typeahead and screen reader announcements. */
    getTextValue?: (item: T) => string;
    /**
     * Fixed row height in px. Omit this when rows have variable height — pass `estimatedRowHeight`
     * instead and each row will be measured with a `ResizeObserver` as it's rendered.
     */
    rowHeight?: number;
    /** Starting-point row height in px used for variable-height rows before they're measured. @default 64 */
    estimatedRowHeight?: number;
    /** Gap between rows in px. @default 0 */
    gap?: number;
    /** Content rendered when `items` is empty (and not currently loading the first page). */
    renderEmptyState?: () => ReactNode;
    /**
     * Called when the user scrolls near the end of the list. Wire this to a `loadMore()` call on
     * your data source (e.g. `useAsyncList`). Only fires while `items` is non-empty and stays
     * armed as long as `isLoadingMore`/`hasMore`-style guarding is handled by the caller.
     */
    onLoadMore?: () => void;
    /** Shows the trailing loading row. Keep this in sync with your data source's loading state. */
    isLoadingMore?: boolean;
    /** Distance from the bottom (as a fraction of the viewport height) that triggers `onLoadMore`. @default 1 */
    loadMoreOffset?: number;
    /** Max height of the scrollable viewport. @default "24rem" */
    maxHeight?: number | string;
    /**
     * Persists and restores scroll position across mounts under this key — e.g. pass the current
     * search query so returning to the same query resumes where the user left off.
     */
    scrollRestorationKey?: string;
    className?: string;
}

const defaultEmptyState = () => (
    <div className="flex h-64 flex-col items-center justify-center gap-1 p-8 text-center">
        <p className="text-sm font-semibold text-primary">No results</p>
        <p className="text-sm text-tertiary">There's nothing to show here yet.</p>
    </div>
);

/**
 * A windowed (virtualized) list: only the rows currently visible (plus a small overscan buffer)
 * are ever mounted in the DOM, so the list stays fast at any size — 10, 10,000, or more rows.
 *
 * This component is purely presentational. Pair it with `useAsyncList` (from `react-stately`)
 * for server-backed pagination, search, cancellation, and error handling — see
 * `virtualized-list.demo.tsx` for a full example.
 */
export const VirtualizedList = <T extends { id: Key }>({
    items,
    children,
    getTextValue,
    rowHeight,
    estimatedRowHeight = 64,
    gap = 0,
    renderEmptyState = defaultEmptyState,
    onLoadMore,
    isLoadingMore,
    loadMoreOffset = 1,
    maxHeight = "24rem",
    scrollRestorationKey,
    className,
    ...props
}: VirtualizedListProps<T>) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Restore the saved scroll position (if any) once, on mount.
    useEffect(() => {
        if (!scrollRestorationKey || !scrollRef.current) return;
        const saved = scrollPositions.get(scrollRestorationKey);
        if (saved) scrollRef.current.scrollTop = saved;
        // Intentionally mount-only: re-running this on every `scrollRestorationKey` change would
        // fight the user's own scrolling once they've started interacting with a given key.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = () => {
        if (scrollRestorationKey && scrollRef.current) {
            scrollPositions.set(scrollRestorationKey, scrollRef.current.scrollTop);
        }
    };

    const layout = useMemo(
        () =>
            new ListLayout<T>({
                rowSize: rowHeight,
                estimatedRowSize: rowHeight ? undefined : estimatedRowHeight,
                gap,
            }),
        [rowHeight, estimatedRowHeight, gap],
    );

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ maxHeight }}
            className={cx("w-full overflow-auto rounded-xl bg-primary ring-1 ring-secondary ring-inset", className)}
        >
            <Virtualizer layout={layout} shouldObserveItemSize={!rowHeight}>
                <AriaListBox {...props} aria-label={props["aria-label"] ?? "Virtualized list"} className="outline-hidden" renderEmptyState={renderEmptyState}>
                    {items.map((item) => (
                        <AriaListBoxItem
                            key={item.id}
                            id={item.id}
                            textValue={getTextValue?.(item)}
                            className={({ isFocusVisible, isSelected, isDisabled, isHovered }) =>
                                cx(
                                    "flex w-full cursor-default items-center border-b border-secondary px-4 py-3 outline-hidden transition duration-100 ease-linear last:border-b-0",
                                    isHovered && "bg-primary_hover",
                                    isSelected && "bg-active",
                                    isFocusVisible && "outline-2 -outline-offset-2 outline-focus-ring",
                                    isDisabled && "cursor-not-allowed opacity-50",
                                )
                            }
                        >
                            {children(item)}
                        </AriaListBoxItem>
                    ))}

                    {onLoadMore && items.length > 0 && (
                        <AriaListBoxLoadMoreItem isLoading={isLoadingMore} onLoadMore={onLoadMore} scrollOffset={loadMoreOffset}>
                            <div className="flex items-center justify-center py-4">
                                <LoadingIndicator type="line-spinner" size="sm" label="Loading more…" />
                            </div>
                        </AriaListBoxLoadMoreItem>
                    )}
                </AriaListBox>
            </Virtualizer>
        </div>
    );
};
