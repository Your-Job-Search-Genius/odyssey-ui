"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

export interface FlowViewport {
    panX: number;
    panY: number;
    zoom: number;
}

export interface FlowViewportBounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export interface UseFlowViewportOptions {
    /** The element the viewport is measured against for cursor-anchored zoom and coordinate conversion. */
    containerRef: RefObject<HTMLElement | null>;
    minZoom?: number;
    maxZoom?: number;
    initialViewport?: FlowViewport;
}

export interface UseFlowViewportResult {
    viewport: FlowViewport;
    setViewport: (next: FlowViewport) => void;
    /** Zooms by a multiplicative factor, keeping `screenPoint` (client coordinates) fixed on screen. Defaults to the container center. */
    zoomBy: (factor: number, screenPoint?: { x: number; y: number }) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    /** Frames `bounds` (content-space) with `padding` px of margin, clamped to `maxFitZoom`. */
    fitToBounds: (bounds: FlowViewportBounds, padding?: number, maxFitZoom?: number) => void;
    resetViewport: () => void;
    /** Converts a client (screen) point into content-space coordinates. */
    screenToCanvas: (clientX: number, clientY: number) => { x: number; y: number };
    isPanning: boolean;
    startPan: (clientX: number, clientY: number) => void;
    panMove: (clientX: number, clientY: number) => void;
    endPan: () => void;
}

const DEFAULT_VIEWPORT: FlowViewport = { panX: 0, panY: 0, zoom: 1 };
const DEFAULT_ZOOM_STEP = 1.2;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Generic pan/zoom for an HTML/SVG canvas laid out as `translate(panX, panY) scale(zoom)`
 * over a fixed-size container -- cursor-anchored zoom, drag-to-pan, fit-to-bounds and
 * screen<->content coordinate conversion. No knowledge of what's being panned/zoomed, so
 * it isn't specific to Flow Canvas or any other diagram/canvas component.
 */
export function useFlowViewport({ containerRef, minZoom = 0.35, maxZoom = 2.5, initialViewport }: UseFlowViewportOptions): UseFlowViewportResult {
    const [viewport, setViewportState] = useState<FlowViewport>(initialViewport ?? DEFAULT_VIEWPORT);
    const [isPanning, setIsPanning] = useState(false);

    const viewportRef = useRef(viewport);
    useEffect(() => {
        viewportRef.current = viewport;
    }, [viewport]);

    const panRef = useRef<{ active: boolean; lastX: number; lastY: number }>({ active: false, lastX: 0, lastY: 0 });

    const setViewport = useCallback((next: FlowViewport) => {
        setViewportState({ ...next, zoom: clamp(next.zoom, minZoom, maxZoom) });
        // `minZoom`/`maxZoom` are stable per instance in practice; omitted to keep this identity stable across renders.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const zoomBy = useCallback(
        (factor: number, screenPoint?: { x: number; y: number }) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const anchorX = screenPoint ? screenPoint.x - (rect?.left ?? 0) : (rect?.width ?? 0) / 2;
            const anchorY = screenPoint ? screenPoint.y - (rect?.top ?? 0) : (rect?.height ?? 0) / 2;

            setViewportState((prev) => {
                const nextZoom = clamp(prev.zoom * factor, minZoom, maxZoom);
                const contentX = (anchorX - prev.panX) / prev.zoom;
                const contentY = (anchorY - prev.panY) / prev.zoom;
                return { zoom: nextZoom, panX: anchorX - contentX * nextZoom, panY: anchorY - contentY * nextZoom };
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [containerRef],
    );

    const zoomIn = useCallback(() => zoomBy(DEFAULT_ZOOM_STEP), [zoomBy]);
    const zoomOut = useCallback(() => zoomBy(1 / DEFAULT_ZOOM_STEP), [zoomBy]);

    const fitToBounds = useCallback(
        (bounds: FlowViewportBounds, padding = 56, maxFitZoom = 1.4) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const boundsWidth = Math.max(bounds.maxX - bounds.minX, 1);
            const boundsHeight = Math.max(bounds.maxY - bounds.minY, 1);
            const nextZoom = clamp(Math.min((rect.width - padding * 2) / boundsWidth, (rect.height - padding * 2) / boundsHeight), minZoom, maxFitZoom);
            setViewportState({
                zoom: nextZoom,
                panX: (rect.width - boundsWidth * nextZoom) / 2 - bounds.minX * nextZoom,
                panY: (rect.height - boundsHeight * nextZoom) / 2 - bounds.minY * nextZoom,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [containerRef],
    );

    const resetViewport = useCallback(() => setViewportState(initialViewport ?? DEFAULT_VIEWPORT), [initialViewport]);

    const screenToCanvas = useCallback(
        (clientX: number, clientY: number) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return { x: 0, y: 0 };
            const current = viewportRef.current;
            return { x: (clientX - rect.left - current.panX) / current.zoom, y: (clientY - rect.top - current.panY) / current.zoom };
        },
        [containerRef],
    );

    const startPan = useCallback((clientX: number, clientY: number) => {
        panRef.current = { active: true, lastX: clientX, lastY: clientY };
        setIsPanning(true);
    }, []);

    const panMove = useCallback((clientX: number, clientY: number) => {
        if (!panRef.current.active) return;
        const dx = clientX - panRef.current.lastX;
        const dy = clientY - panRef.current.lastY;
        panRef.current.lastX = clientX;
        panRef.current.lastY = clientY;
        // Pan is applied outside the scale (`translate(pan) scale(zoom)`), so a screen-pixel
        // delta maps 1:1 to a pan delta regardless of the current zoom level.
        setViewportState((prev) => ({ ...prev, panX: prev.panX + dx, panY: prev.panY + dy }));
    }, []);

    const endPan = useCallback(() => {
        panRef.current.active = false;
        setIsPanning(false);
    }, []);

    return { viewport, setViewport, zoomBy, zoomIn, zoomOut, fitToBounds, resetViewport, screenToCanvas, isPanning, startPan, panMove, endPan };
}
