"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useRef, useState } from "react";

type DragMode = "move" | "connect";

interface DragState {
    mode: DragMode;
    lastX: number;
    lastY: number;
    origX: number;
    origY: number;
    moved: boolean;
    /** Zoom captured at drag start -- a node drag rarely overlaps a zoom change, so reading it once avoids any stale-closure risk mid-gesture. */
    zoom: number;
}

export interface UseFlowNodeDragOptions {
    isReadOnly?: boolean;
    zoom: number;
    /** Called continuously while dragging the node body, with the pointer delta converted to content-space. */
    onMoveBy: (dx: number, dy: number) => void;
    /** Called once on pointer-up after a real move (not a click). */
    onMoveEnd: () => void;
    /** Called on pointer-up when the pointer never moved past the click threshold. */
    onClick: () => void;
    onConnectStart?: () => void;
    /** Called continuously while dragging from the "out" handle, with raw client coordinates. */
    onConnectMoveTo?: (clientX: number, clientY: number) => void;
    /** Called once on pointer-up after a connect-drag, with whatever element is under the pointer. */
    onConnectEnd?: (dropElement: Element | null) => void;
}

export interface FlowNodeDragHandlers {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
}

export interface UseFlowNodeDragResult {
    /** Spread onto the node's root element -- dragging repositions the node, a plain click selects it. */
    bodyHandlers: FlowNodeDragHandlers;
    /** Spread onto the node's "out" connection handle -- dragging previews and creates an edge. */
    handleHandlers: FlowNodeDragHandlers;
    isDragging: boolean;
}

const CLICK_THRESHOLD_PX = 3;

/**
 * Per-node pointer handling: drag the card to reposition it, or drag from its "out"
 * handle to connect it to another node. Emits deltas/callbacks only -- the caller
 * (`FlowCanvas`) owns node position state and resolves drop targets, keeping this
 * hook a pure pointer-math layer.
 */
export function useFlowNodeDrag(options: UseFlowNodeDragOptions): UseFlowNodeDragResult {
    const { isReadOnly, zoom, onMoveBy, onMoveEnd, onClick, onConnectStart, onConnectMoveTo, onConnectEnd } = options;
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<DragState | null>(null);

    const beginDrag = useCallback(
        (event: ReactPointerEvent<HTMLElement>, mode: DragMode) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            dragRef.current = { mode, lastX: event.clientX, lastY: event.clientY, origX: event.clientX, origY: event.clientY, moved: false, zoom };
        },
        [zoom],
    );

    const bodyHandlers: FlowNodeDragHandlers = {
        onPointerDown: useCallback(
            (event) => {
                if (isReadOnly || event.button !== 0) return;
                event.stopPropagation();
                beginDrag(event, "move");
                setIsDragging(true);
            },
            [isReadOnly, beginDrag],
        ),
        onPointerMove: useCallback(
            (event) => {
                const drag = dragRef.current;
                if (!drag || drag.mode !== "move") return;
                const dx = event.clientX - drag.lastX;
                const dy = event.clientY - drag.lastY;
                if (Math.abs(event.clientX - drag.origX) > CLICK_THRESHOLD_PX || Math.abs(event.clientY - drag.origY) > CLICK_THRESHOLD_PX) drag.moved = true;
                drag.lastX = event.clientX;
                drag.lastY = event.clientY;
                onMoveBy(dx / drag.zoom, dy / drag.zoom);
            },
            [onMoveBy],
        ),
        onPointerUp: useCallback(() => {
            const drag = dragRef.current;
            dragRef.current = null;
            setIsDragging(false);
            if (!drag || drag.mode !== "move") return;
            if (drag.moved) onMoveEnd();
            else onClick();
        }, [onClick, onMoveEnd]),
        onPointerCancel: useCallback(() => {
            dragRef.current = null;
            setIsDragging(false);
        }, []),
    };

    const handleHandlers: FlowNodeDragHandlers = {
        onPointerDown: useCallback(
            (event) => {
                if (isReadOnly || event.button !== 0) return;
                event.stopPropagation();
                beginDrag(event, "connect");
                onConnectStart?.();
            },
            [isReadOnly, beginDrag, onConnectStart],
        ),
        onPointerMove: useCallback(
            (event) => {
                if (dragRef.current?.mode !== "connect") return;
                onConnectMoveTo?.(event.clientX, event.clientY);
            },
            [onConnectMoveTo],
        ),
        onPointerUp: useCallback(
            (event) => {
                const wasConnecting = dragRef.current?.mode === "connect";
                dragRef.current = null;
                if (!wasConnecting) return;
                onConnectEnd?.(document.elementFromPoint(event.clientX, event.clientY));
            },
            [onConnectEnd],
        ),
        onPointerCancel: useCallback(() => {
            dragRef.current = null;
        }, []),
    };

    return { bodyHandlers, handleHandlers, isDragging };
}
