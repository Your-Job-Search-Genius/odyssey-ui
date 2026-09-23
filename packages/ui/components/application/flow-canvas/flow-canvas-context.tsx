"use client";

import { createContext, useContext } from "react";
import type { FlowEdgeStyle, FlowRoleRegistry } from "./flow-canvas-types";

/**
 * Canvas-wide, rarely-changing config every node/edge/chrome piece needs. Kept
 * deliberately small: per-item state (selection, drag, drop-target) is passed as
 * direct props from `FlowCanvas`'s render loop instead, the same way `Chart`'s own
 * per-mark state never lives in `ChartContext`. Split into its own file (rather than
 * living in flow-canvas.tsx) purely to avoid a circular import -- `flow-canvas.tsx`
 * renders `FlowNodeCard`/`FlowCanvasEdgePath`, which both need to consume this
 * context, mirroring how `select-shared.tsx` breaks the same cycle for `Select`.
 */
export interface FlowCanvasContextValue {
    roles: FlowRoleRegistry;
    edgeStyle: FlowEdgeStyle;
    reducedMotion: boolean;
    isReadOnly: boolean;
    /** Whether ambient flow-dot animation is playing. Paused by setting `animationPlayState` per dot -- never touches `document.body`. */
    isPlaying: boolean;
    /** Id of the shared `feTurbulence`/`feDisplacementMap` filter used by sketchy-mode edges and node outlines. */
    sketchyFilterId: string;
    arrowMarkerId: string;
    arrowMarkerActiveId: string;
}

const FlowCanvasContext = createContext<FlowCanvasContextValue | null>(null);

export const FlowCanvasProvider = FlowCanvasContext.Provider;

export function useFlowCanvasContext(): FlowCanvasContextValue {
    const context = useContext(FlowCanvasContext);
    if (!context) throw new Error("useFlowCanvasContext must be used inside <FlowCanvas>.");
    return context;
}
