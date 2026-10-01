"use client";

import type { KeyboardEvent as ReactKeyboardEvent, RefCallback } from "react";
import { useCallback, useRef, useState } from "react";

export interface UseFlowCanvasFocusOptions {
    /**
     * Focusable item keys in traversal order: every node id, then every edge as `edgeFocusKey(id)`.
     * Determines Tab/Shift+Tab order.
     */
    nodeIds: readonly string[];
}

/** Roving-focus key for an edge, kept apart from node ids. */
export const edgeFocusKey = (edgeId: string) => `edge:${edgeId}`;

export interface FlowCanvasFocusItemProps {
    tabIndex: 0 | -1;
    /** Nodes are HTML cards; edges are SVG paths. */
    ref: RefCallback<HTMLElement | SVGElement>;
    onFocus: () => void;
    onKeyDown: (event: ReactKeyboardEvent<Element>) => void;
}

export interface UseFlowCanvasFocusResult {
    /** Spread onto each node's root element. */
    getNodeProps: (id: string) => FlowCanvasFocusItemProps;
    focusedId: string | null;
    focusNode: (id: string) => void;
}

/**
 * Roving tabindex over the canvas's nodes and then its edges: the canvas is one tab
 * stop from the surrounding page's perspective (only the current item has
 * `tabIndex={0}`), and Tab/Shift+Tab while an item is focused moves to the next/previous
 * one instead of leaving the canvas -- modeled on `charts/use-chart-focus.ts`, but keyed on Tab
 * rather than the arrow keys, since arrow keys reposition the focused node here.
 */
export function useFlowCanvasFocus({ nodeIds }: UseFlowCanvasFocusOptions): UseFlowCanvasFocusResult {
    const [tabbableId, setTabbableId] = useState<string | null>(nodeIds[0] ?? null);
    const elementsRef = useRef(new Map<string, HTMLElement | SVGElement>());

    const effectiveTabbableId = tabbableId && nodeIds.includes(tabbableId) ? tabbableId : (nodeIds[0] ?? null);

    const focusNode = useCallback((id: string) => {
        setTabbableId(id);
        elementsRef.current.get(id)?.focus({ preventScroll: true });
    }, []);

    const getNodeProps = useCallback(
        (id: string): FlowCanvasFocusItemProps => ({
            tabIndex: id === effectiveTabbableId ? 0 : -1,
            ref: (element) => {
                if (element) elementsRef.current.set(id, element);
                else elementsRef.current.delete(id);
            },
            onFocus: () => setTabbableId(id),
            onKeyDown: (event) => {
                if (event.key !== "Tab") return;
                const index = nodeIds.indexOf(id);
                if (index === -1) return;
                const nextIndex = event.shiftKey ? index - 1 : index + 1;
                // Out of range: let Tab leave the canvas normally instead of wrapping.
                if (nextIndex < 0 || nextIndex >= nodeIds.length) return;
                event.preventDefault();
                focusNode(nodeIds[nextIndex]);
            },
        }),
        [effectiveTabbableId, nodeIds, focusNode],
    );

    return { getNodeProps, focusedId: effectiveTabbableId, focusNode };
}
