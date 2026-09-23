"use client";

import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Bell01, CheckCircle, Database01, Flag01, GitBranch01, Maximize01, XClose, Zap, ZoomIn, ZoomOut } from "@/components/foundations/icons";
import { useControllableState } from "@/hooks/use-controllable-state";
import { useFlowViewport } from "@/hooks/use-flow-viewport";
import { cx } from "@/utils/cx";
import { FlowCanvasProvider } from "./flow-canvas-context";
import { FlowCanvasEdgeLabel, FlowCanvasEdgePath } from "./flow-canvas-edge";
import { FlowCanvasInspector } from "./flow-canvas-inspector";
import { FlowCanvasMinimap } from "./flow-canvas-minimap";
import { FlowNodeCard } from "./flow-canvas-node";
import { FlowCanvasBlobs, FlowCanvasEdgeMarkers, FlowCanvasGrid, FlowCanvasSketchyFilterDefs } from "./flow-canvas-primitives";
import { FlowCanvasToolbar } from "./flow-canvas-toolbar";
import type {
    FlowConnection,
    FlowEdge,
    FlowEdgeStyle,
    FlowNode,
    FlowRoleDefinition,
    FlowRoleRegistry,
    FlowRunLogEntry,
    FlowSelection,
    FlowSpeed,
} from "./flow-canvas-types";
import { DEFAULT_GRID_SIZE, SPEED_DURATIONS, buildEdgePath, graphBounds, mergeRoles, nodeInAnchor, nodeOutAnchor, snapValue } from "./flow-canvas-utils";
import { useFlowCanvasFocus } from "./use-flow-canvas-focus";

/** The six built-in roles. Extend or override any of them with the `roles` prop -- unspecified fields are kept. */
export const DEFAULT_FLOW_ROLES: FlowRoleRegistry = {
    start: { label: "Start", icon: Zap, color: "brand" },
    process: { label: "Process", icon: Database01, color: "gray" },
    decision: { label: "Decision", icon: GitBranch01, color: "warning" },
    success: { label: "Success", icon: CheckCircle, color: "success" },
    warning: { label: "Review", icon: Flag01, color: "error" },
    end: { label: "End", icon: Bell01, color: "brand" },
};

export interface FlowCanvasProps<TData = unknown> {
    /** Controlled node array. Memoise it -- a new array identity is how `FlowCanvas` knows the graph changed. */
    nodes?: FlowNode<TData>[];
    /** Initial nodes for uncontrolled use. */
    defaultNodes?: FlowNode<TData>[];
    onNodesChange?: (nodes: FlowNode<TData>[]) => void;

    /** Controlled edge array. */
    edges?: FlowEdge[];
    /** Initial edges for uncontrolled use. */
    defaultEdges?: FlowEdge[];
    onEdgesChange?: (edges: FlowEdge[]) => void;

    /** Id of the selected node or edge (both share one id namespace). */
    selectedId?: string | null;
    defaultSelectedId?: string | null;
    onSelectedIdChange?: (id: string | null) => void;
    onNodeSelect?: (node: FlowNode<TData> | null) => void;
    onEdgeSelect?: (edge: FlowEdge | null) => void;

    /** Fired when a user drags from one node's "out" handle onto another node. */
    onConnect?: (connection: FlowConnection) => void;
    onNodeAdd?: (node: FlowNode<TData>) => void;
    onNodeDelete?: (node: FlowNode<TData>) => void;
    onEdgeDelete?: (edge: FlowEdge) => void;
    /** Fields merged onto the node the toolbar's "Add node" button creates. A function is called fresh each time. */
    newNodeDefaults?: Partial<FlowNode<TData>> | (() => Partial<FlowNode<TData>>);

    /** Partial overrides merged over `DEFAULT_FLOW_ROLES` by key -- add a new role or restyle a built-in one. */
    roles?: Record<string, Partial<FlowRoleDefinition>>;

    /** Smooth (clean bezier) or sketchy (hand-wobbled, Excalidraw-style) edges. */
    edgeStyle?: FlowEdgeStyle;
    defaultEdgeStyle?: FlowEdgeStyle;
    onEdgeStyleChange?: (style: FlowEdgeStyle) => void;

    snapToGrid?: boolean;
    defaultSnapToGrid?: boolean;
    onSnapToGridChange?: (value: boolean) => void;
    /** Content-space grid size in px used by snap-to-grid and the "Add node" button. @default 24 */
    gridSize?: number;

    /** Whether the ambient flow-dot animation is playing. */
    isPlaying?: boolean;
    defaultIsPlaying?: boolean;
    onPlayingChange?: (isPlaying: boolean) => void;
    /** Ambient flow-dot travel speed. */
    speed?: FlowSpeed;
    defaultSpeed?: FlowSpeed;
    onSpeedChange?: (speed: FlowSpeed) => void;

    /** Lines shown in the inspector's run log when nothing is selected. Purely display data. */
    runLog?: FlowRunLogEntry[];
    /** Most recent entries of `runLog` to display. @default 20 */
    maxRunLogEntries?: number;

    /** @default true */
    showToolbar?: boolean;
    /** @default true */
    showZoomControls?: boolean;
    /** @default true */
    showMinimap?: boolean;
    /** @default true */
    showInspector?: boolean;
    /** @default true */
    showLegend?: boolean;
    /** @default true */
    showHintChip?: boolean;

    /** Disables dragging, connecting, deleting and nudging. Panning, zooming, selecting and inspecting still work. */
    isReadOnly?: boolean;
    /** Governs the canvas-level shortcuts (zoom, fit view, escape, delete-selected-edge, run). Per-node editing is governed by `isReadOnly` instead. @default true */
    keyboardShortcuts?: boolean;

    /** Canvas surface height. Width always fills the measured container. @default 560 */
    height?: number | string;
    className?: string;
    style?: CSSProperties;

    /** Rendered at the end of the toolbar row -- e.g. a host app's own theme switcher. FlowCanvas never ships one itself. */
    toolbarExtra?: ReactNode;
    /** Renders extra content inside a node card, after the label/description. */
    renderNodeContent?: (node: FlowNode<TData>) => ReactNode;

    /** The toolbar's Run button only renders when this is provided. */
    onRunRequest?: () => void;
    /** Called when Reset is pressed, after the viewport has been fit back to the graph. */
    onReset?: () => void;
}

const clampGridSize = (value: number | undefined) => (value && value > 0 ? value : DEFAULT_GRID_SIZE);

export const FlowCanvas = <TData = unknown,>({
    nodes: nodesProp,
    defaultNodes,
    onNodesChange,
    edges: edgesProp,
    defaultEdges,
    onEdgesChange,
    selectedId: selectedIdProp,
    defaultSelectedId,
    onSelectedIdChange,
    onNodeSelect,
    onEdgeSelect,
    onConnect,
    onNodeAdd,
    onNodeDelete,
    onEdgeDelete,
    newNodeDefaults,
    roles: rolesProp,
    edgeStyle: edgeStyleProp,
    defaultEdgeStyle = "smooth",
    onEdgeStyleChange,
    snapToGrid: snapToGridProp,
    defaultSnapToGrid = false,
    onSnapToGridChange,
    gridSize: gridSizeProp,
    isPlaying: isPlayingProp,
    defaultIsPlaying = true,
    onPlayingChange,
    speed: speedProp,
    defaultSpeed = "normal",
    onSpeedChange,
    runLog,
    maxRunLogEntries = 20,
    showToolbar = true,
    showZoomControls = true,
    showMinimap = true,
    showInspector = true,
    showLegend = true,
    showHintChip = true,
    isReadOnly = false,
    keyboardShortcuts = true,
    height = 560,
    className,
    style,
    toolbarExtra,
    renderNodeContent,
    onRunRequest,
    onReset,
}: FlowCanvasProps<TData>) => {
    const instanceId = useId();
    const sketchyFilterId = `${instanceId}-sketchy`;
    const arrowMarkerId = `${instanceId}-arrow`;
    const arrowMarkerActiveId = `${instanceId}-arrow-active`;
    const gridPatternId = `${instanceId}-grid`;

    const [nodes, setNodes] = useControllableState<FlowNode<TData>[]>({ value: nodesProp, defaultValue: defaultNodes ?? [], onChange: onNodesChange });
    const [edges, setEdges] = useControllableState<FlowEdge[]>({ value: edgesProp, defaultValue: defaultEdges ?? [], onChange: onEdgesChange });
    const [selectedId, setSelectedId] = useControllableState<string | null>({
        value: selectedIdProp,
        defaultValue: defaultSelectedId ?? null,
        onChange: onSelectedIdChange,
    });
    const [edgeStyle, setEdgeStyle] = useControllableState<FlowEdgeStyle>({
        value: edgeStyleProp,
        defaultValue: defaultEdgeStyle,
        onChange: onEdgeStyleChange,
    });
    const [snapToGrid, setSnapToGrid] = useControllableState<boolean>({ value: snapToGridProp, defaultValue: defaultSnapToGrid, onChange: onSnapToGridChange });
    const [isPlaying, setIsPlaying] = useControllableState<boolean>({ value: isPlayingProp, defaultValue: defaultIsPlaying, onChange: onPlayingChange });
    const [speed, setSpeed] = useControllableState<FlowSpeed>({ value: speedProp, defaultValue: defaultSpeed, onChange: onSpeedChange });
    const gridSize = clampGridSize(gridSizeProp);

    const roles = useMemo(() => mergeRoles(rolesProp, DEFAULT_FLOW_ROLES), [rolesProp]);
    const reducedMotion = useReducedMotion() ?? false;

    const nodesRef = useRef(nodes);
    nodesRef.current = nodes;
    const edgesRef = useRef(edges);
    edgesRef.current = edges;

    const selection: FlowSelection = useMemo(() => {
        if (!selectedId) return null;
        if (nodes.some((n) => n.id === selectedId)) return { type: "node", id: selectedId };
        if (edges.some((e) => e.id === selectedId)) return { type: "edge", id: selectedId };
        return null;
    }, [selectedId, nodes, edges]);

    const [announcement, setAnnouncement] = useState("");
    const announce = useCallback((text: string) => setAnnouncement(text), []);
    const [hintDismissed, setHintDismissed] = useState(false);

    // --- measurement + viewport -------------------------------------------------
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const measure = useCallback(() => {
        const element = containerRef.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        setSize((prev) => (prev.width === rect.width && prev.height === rect.height ? prev : { width: rect.width, height: rect.height }));
    }, []);
    useLayoutEffect(measure, [measure]);
    useEffect(() => {
        if (!containerRef.current || typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(measure);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [measure]);

    const viewportApi = useFlowViewport({ containerRef });
    const { viewport } = viewportApi;

    const hasAutoFitted = useRef(false);
    useEffect(() => {
        if (hasAutoFitted.current || size.width === 0) return;
        hasAutoFitted.current = true;
        viewportApi.fitToBounds(graphBounds(nodesRef.current));
        // Only ever auto-fits once, the moment the container is first measured.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size.width]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const handler = (event: WheelEvent) => {
            event.preventDefault();
            viewportApi.zoomBy(event.deltaY < 0 ? 1.08 : 1 / 1.08, { x: event.clientX, y: event.clientY });
        };
        element.addEventListener("wheel", handler, { passive: false });
        return () => element.removeEventListener("wheel", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportApi.zoomBy]);

    // --- focus -------------------------------------------------------------------
    const nodeIds = useMemo(() => nodes.map((node) => node.id), [nodes]);
    const focus = useFlowCanvasFocus({ nodeIds });

    // --- selection -----------------------------------------------------------------
    const selectNode = useCallback(
        (id: string) => {
            setSelectedId(id);
            onNodeSelect?.(nodesRef.current.find((n) => n.id === id) ?? null);
            onEdgeSelect?.(null);
        },
        [setSelectedId, onNodeSelect, onEdgeSelect],
    );
    const selectEdge = useCallback(
        (id: string) => {
            setSelectedId(id);
            onEdgeSelect?.(edgesRef.current.find((e) => e.id === id) ?? null);
            onNodeSelect?.(null);
        },
        [setSelectedId, onEdgeSelect, onNodeSelect],
    );
    const clearSelection = useCallback(() => {
        setSelectedId(null);
        onNodeSelect?.(null);
        onEdgeSelect?.(null);
    }, [setSelectedId, onNodeSelect, onEdgeSelect]);

    const goToNode = useCallback(
        (id: string) => {
            selectNode(id);
            focus.focusNode(id);
        },
        [selectNode, focus],
    );

    const deleteSelected = useCallback(() => {
        if (!selection || isReadOnly) return;
        if (selection.type === "node") {
            const node = nodesRef.current.find((n) => n.id === selection.id);
            setNodes(nodesRef.current.filter((n) => n.id !== selection.id));
            setEdges(edgesRef.current.filter((edge) => edge.source !== selection.id && edge.target !== selection.id));
            if (node) onNodeDelete?.(node);
            announce(`Deleted ${node?.label ?? "node"}`);
        } else {
            const edge = edgesRef.current.find((e) => e.id === selection.id);
            setEdges(edgesRef.current.filter((e) => e.id !== selection.id));
            if (edge) onEdgeDelete?.(edge);
            announce("Edge deleted");
        }
        clearSelection();
    }, [selection, isReadOnly, setNodes, setEdges, onNodeDelete, onEdgeDelete, announce, clearSelection]);

    // --- node mutation ---------------------------------------------------------------
    const moveNodeBy = useCallback(
        (id: string, dx: number, dy: number) => setNodes(nodesRef.current.map((n) => (n.id === id ? { ...n, x: n.x + dx, y: n.y + dy } : n))),
        [setNodes],
    );
    const finishNodeMove = useCallback(
        (id: string) => {
            if (!snapToGrid) return;
            setNodes(nodesRef.current.map((n) => (n.id === id ? { ...n, x: snapValue(n.x, gridSize), y: snapValue(n.y, gridSize) } : n)));
        },
        [setNodes, snapToGrid, gridSize],
    );
    const setNodeLabel = useCallback((id: string, label: string) => setNodes(nodesRef.current.map((n) => (n.id === id ? { ...n, label } : n))), [setNodes]);
    const setNodeDescription = useCallback(
        (id: string, description: string) => setNodes(nodesRef.current.map((n) => (n.id === id ? { ...n, description } : n))),
        [setNodes],
    );
    const setNodeRole = useCallback((id: string, role: string) => setNodes(nodesRef.current.map((n) => (n.id === id ? { ...n, role } : n))), [setNodes]);
    const setEdgeLabel = useCallback((id: string, label: string) => setEdges(edgesRef.current.map((e) => (e.id === id ? { ...e, label } : e))), [setEdges]);

    const addNode = useCallback(() => {
        if (isReadOnly) return;
        const rect = containerRef.current?.getBoundingClientRect();
        const center = viewportApi.screenToCanvas((rect?.left ?? 0) + size.width / 2, (rect?.top ?? 0) + size.height / 2);
        const defaults = typeof newNodeDefaults === "function" ? newNodeDefaults() : newNodeDefaults;
        const newNode = {
            id: `n-${Date.now().toString(36)}-${Math.round(Math.random() * 1e4).toString(36)}`,
            label: "New step",
            description: "Describe this step",
            role: Object.keys(roles)[0] ?? "process",
            x: snapToGrid ? snapValue(center.x, gridSize) : center.x,
            y: snapToGrid ? snapValue(center.y, gridSize) : center.y,
            ...defaults,
        } as FlowNode<TData>;
        setNodes([...nodesRef.current, newNode]);
        onNodeAdd?.(newNode);
        selectNode(newNode.id);
        announce("Node added");
    }, [isReadOnly, viewportApi, size, newNodeDefaults, roles, snapToGrid, gridSize, setNodes, onNodeAdd, selectNode, announce]);

    const resetViewport = useCallback(() => {
        viewportApi.fitToBounds(graphBounds(nodesRef.current));
        onReset?.();
    }, [viewportApi, onReset]);

    // --- connecting ---------------------------------------------------------------
    const [tempEdge, setTempEdge] = useState<{ sourceId: string; point: { x: number; y: number }; hoverId: string | null } | null>(null);

    const connectStart = useCallback((sourceId: string) => {
        const source = nodesRef.current.find((n) => n.id === sourceId);
        if (!source) return;
        setTempEdge({ sourceId, point: nodeOutAnchor(source), hoverId: null });
    }, []);
    const connectMoveTo = useCallback(
        (sourceId: string, clientX: number, clientY: number) => {
            const point = viewportApi.screenToCanvas(clientX, clientY);
            const target = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>("[data-flow-node-id]");
            const hoverId = target && target.dataset.flowNodeId !== sourceId ? (target.dataset.flowNodeId ?? null) : null;
            setTempEdge((prev) => (prev ? { ...prev, point, hoverId } : prev));
        },
        [viewportApi],
    );
    const connectEnd = useCallback(
        (sourceId: string, dropElement: Element | null) => {
            const targetEl = dropElement?.closest<HTMLElement>("[data-flow-node-id]");
            const targetId = targetEl?.dataset.flowNodeId;
            setTempEdge(null);
            if (!targetId || targetId === sourceId) return;
            if (edgesRef.current.some((e) => e.source === sourceId && e.target === targetId)) {
                announce("Those nodes are already connected");
                return;
            }
            const newEdge: FlowEdge = { id: `e-${sourceId}-${targetId}-${Date.now().toString(36)}`, source: sourceId, target: targetId };
            setEdges([...edgesRef.current, newEdge]);
            onConnect?.({ source: sourceId, target: targetId });
            selectEdge(newEdge.id);
            const sourceLabel = nodesRef.current.find((n) => n.id === sourceId)?.label ?? sourceId;
            const targetLabel = nodesRef.current.find((n) => n.id === targetId)?.label ?? targetId;
            announce(`Connected ${sourceLabel} to ${targetLabel}`);
        },
        [setEdges, onConnect, selectEdge, announce],
    );

    // --- canvas-level pan + keyboard ----------------------------------------------
    const handleCanvasPointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (event.button !== 0) return;
            // Chrome controls (zoom, fit, hint, minimap) live inside the pan surface.
            // Capturing the pointer here retargets their click to the canvas, so the
            // button never runs. Let those events through.
            const target = event.target;
            if (target instanceof Element && target.closest("button, a, input, textarea, select, [data-flow-chrome]")) return;
            viewportApi.startPan(event.clientX, event.clientY);
            event.currentTarget.setPointerCapture(event.pointerId);
            clearSelection();
            containerRef.current?.focus({ preventScroll: true });
        },
        [viewportApi, clearSelection],
    );
    const handleCanvasPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => viewportApi.panMove(event.clientX, event.clientY), [viewportApi]);
    const handleCanvasPointerUp = useCallback(() => viewportApi.endPan(), [viewportApi]);

    const handleCanvasKeyDown = useCallback(
        (event: ReactKeyboardEvent<HTMLDivElement>) => {
            if (!keyboardShortcuts) return;
            const target = event.target as HTMLElement;
            if (target.matches("input,select,textarea") || target.hasAttribute("data-flow-node-id")) return;
            if (event.key === "Escape") clearSelection();
            else if (event.key === "+" || event.key === "=") {
                event.preventDefault();
                viewportApi.zoomIn();
            } else if (event.key === "-") {
                event.preventDefault();
                viewportApi.zoomOut();
            } else if (event.key === "0") {
                event.preventDefault();
                viewportApi.fitToBounds(graphBounds(nodesRef.current));
            } else if ((event.key === "Delete" || event.key === "Backspace") && selection) {
                event.preventDefault();
                deleteSelected();
            } else if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && onRunRequest) {
                event.preventDefault();
                onRunRequest();
            }
        },
        [keyboardShortcuts, clearSelection, viewportApi, selection, deleteSelected, onRunRequest],
    );

    const usedRoleKeys = useMemo(() => Array.from(new Set(nodes.map((node) => node.role))).filter((key) => roles[key]), [nodes, roles]);

    return (
        <FlowCanvasProvider value={{ roles, edgeStyle, reducedMotion, isReadOnly, isPlaying, sketchyFilterId, arrowMarkerId, arrowMarkerActiveId }}>
            <div className={cx("flex w-full flex-col gap-3", className)} style={{ ...style, "--flow-duration": SPEED_DURATIONS[speed] } as CSSProperties}>
                {showToolbar && (
                    <FlowCanvasToolbar
                        edgeStyle={edgeStyle}
                        onEdgeStyleChange={setEdgeStyle}
                        speed={speed}
                        onSpeedChange={setSpeed}
                        isPlaying={isPlaying}
                        onPlayingChange={setIsPlaying}
                        snapToGrid={snapToGrid}
                        onSnapToGridChange={setSnapToGrid}
                        isReadOnly={isReadOnly}
                        onRun={onRunRequest}
                        onAddNode={isReadOnly ? undefined : addNode}
                        onReset={resetViewport}
                        toolbarExtra={toolbarExtra}
                    />
                )}

                <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
                    <div
                        ref={containerRef}
                        tabIndex={0}
                        role="application"
                        aria-label="Flow diagram canvas. Tab to reach a node, arrow keys to move the focused node, Delete to remove it, Escape to deselect."
                        onPointerDown={handleCanvasPointerDown}
                        onPointerMove={handleCanvasPointerMove}
                        onPointerUp={handleCanvasPointerUp}
                        onPointerCancel={handleCanvasPointerUp}
                        onKeyDown={handleCanvasKeyDown}
                        style={{ height: typeof height === "number" ? `${height}px` : height, touchAction: "none" }}
                        className="relative w-full shrink-0 overflow-hidden rounded-2xl border border-secondary bg-secondary shadow-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring lg:min-w-0 lg:flex-1"
                    >
                        <FlowCanvasBlobs />

                        <svg className="pointer-events-none absolute inset-0 size-full overflow-hidden">
                            <defs>
                                <FlowCanvasSketchyFilterDefs id={sketchyFilterId} />
                                <FlowCanvasEdgeMarkers id={instanceId} />
                            </defs>
                            <g transform={`translate(${viewport.panX} ${viewport.panY}) scale(${viewport.zoom})`}>
                                <FlowCanvasGrid id={gridPatternId} gridSize={gridSize} />
                                {edges.map((edge) => {
                                    const source = nodes.find((n) => n.id === edge.source);
                                    const target = nodes.find((n) => n.id === edge.target);
                                    if (!source || !target) return null;
                                    const { d } = buildEdgePath(nodeOutAnchor(source), nodeInAnchor(target));
                                    return (
                                        <FlowCanvasEdgePath
                                            key={edge.id}
                                            edge={edge}
                                            d={d}
                                            isSelected={selection?.type === "edge" && selection.id === edge.id}
                                            onSelect={() => selectEdge(edge.id)}
                                        />
                                    );
                                })}
                                {tempEdge &&
                                    (() => {
                                        const sourceNode = nodes.find((n) => n.id === tempEdge.sourceId);
                                        if (!sourceNode) return null;
                                        const { d } = buildEdgePath(nodeOutAnchor(sourceNode), tempEdge.point);
                                        return (
                                            <path
                                                d={d}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeDasharray="6 5"
                                                className="pointer-events-none text-fg-brand-primary"
                                            />
                                        );
                                    })()}
                            </g>
                        </svg>

                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{ transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`, transformOrigin: "0 0" }}
                        >
                            {nodes.map((node) => (
                                <FlowNodeCard
                                    key={node.id}
                                    node={node}
                                    zoom={viewport.zoom}
                                    isSelected={selection?.type === "node" && selection.id === node.id}
                                    isDropTarget={tempEdge?.hoverId === node.id}
                                    focusProps={focus.getNodeProps(node.id)}
                                    onSelect={() => selectNode(node.id)}
                                    onMoveBy={(dx, dy) => moveNodeBy(node.id, dx, dy)}
                                    onMoveEnd={() => finishNodeMove(node.id)}
                                    onNudge={(dx, dy) => moveNodeBy(node.id, dx, dy)}
                                    onDelete={() => {
                                        selectNode(node.id);
                                        deleteSelected();
                                    }}
                                    onConnectStart={() => connectStart(node.id)}
                                    onConnectMoveTo={(clientX, clientY) => connectMoveTo(node.id, clientX, clientY)}
                                    onConnectEnd={(dropElement) => connectEnd(node.id, dropElement)}
                                    renderContent={renderNodeContent}
                                />
                            ))}
                            {edges.map((edge) => {
                                if (!edge.label) return null;
                                const source = nodes.find((n) => n.id === edge.source);
                                const target = nodes.find((n) => n.id === edge.target);
                                if (!source || !target) return null;
                                const { mid } = buildEdgePath(nodeOutAnchor(source), nodeInAnchor(target));
                                return <FlowCanvasEdgeLabel key={edge.id} label={edge.label} mid={mid} />;
                            })}
                        </div>

                        {nodes.length === 0 && (
                            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-sm text-tertiary">
                                <span>The canvas is empty.</span>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        data-flow-chrome=""
                                        onClick={addNode}
                                        className="pointer-events-auto text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
                                    >
                                        Add a node to get started
                                    </button>
                                )}
                            </div>
                        )}

                        {showHintChip && !hintDismissed && (
                            <div
                                data-flow-chrome=""
                                className="pointer-events-auto absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-secondary/60 bg-primary/70 py-1 pr-1.5 pl-2.5 text-xs text-tertiary shadow-xs backdrop-blur-sm"
                            >
                                {isReadOnly ? "Drag canvas to pan · scroll to zoom" : "Drag nodes · drag canvas to pan · scroll to zoom"}
                                <button
                                    type="button"
                                    aria-label="Dismiss hint"
                                    onClick={() => setHintDismissed(true)}
                                    className="grid size-4 place-items-center rounded-full text-quaternary hover:bg-primary_hover hover:text-tertiary"
                                >
                                    <XClose className="size-3" />
                                </button>
                            </div>
                        )}

                        {showLegend && usedRoleKeys.length > 0 && (
                            <div className="pointer-events-none absolute top-3 right-3 z-10 flex flex-wrap items-center gap-2.5 rounded-full border border-secondary/60 bg-primary/70 px-2.5 py-1 shadow-xs backdrop-blur-sm">
                                {usedRoleKeys.map((key) => (
                                    <span key={key} className="flex items-center gap-1.5 text-xs text-tertiary">
                                        <span aria-hidden="true" className="size-1.5 rounded-sm bg-current text-fg-quaternary" data-role-dot={key} />
                                        {roles[key]?.label}
                                    </span>
                                ))}
                            </div>
                        )}

                        {showZoomControls && (
                            <div
                                data-flow-chrome=""
                                className="pointer-events-auto absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-xl border border-secondary/60 bg-primary/70 p-1 shadow-xs backdrop-blur-sm"
                            >
                                <button
                                    type="button"
                                    aria-label="Zoom out"
                                    onClick={() => viewportApi.zoomOut()}
                                    className="grid size-7 place-items-center rounded-lg text-secondary hover:bg-primary_hover"
                                >
                                    <ZoomOut className="size-4" />
                                </button>
                                <span className="min-w-10 text-center font-mono text-xs text-tertiary tabular-nums">{Math.round(viewport.zoom * 100)}%</span>
                                <button
                                    type="button"
                                    aria-label="Zoom in"
                                    onClick={() => viewportApi.zoomIn()}
                                    className="grid size-7 place-items-center rounded-lg text-secondary hover:bg-primary_hover"
                                >
                                    <ZoomIn className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Fit view"
                                    title="Fit view (0)"
                                    onClick={() => viewportApi.fitToBounds(graphBounds(nodesRef.current))}
                                    className="grid size-7 place-items-center rounded-lg text-secondary hover:bg-primary_hover"
                                >
                                    <Maximize01 className="size-4" />
                                </button>
                            </div>
                        )}

                        {showMinimap && nodes.length > 0 && (
                            <div
                                data-flow-chrome=""
                                className="pointer-events-auto absolute right-3 bottom-3 z-10 h-20 w-44 overflow-hidden rounded-lg border border-secondary/60 bg-primary/70 shadow-xs backdrop-blur-sm"
                            >
                                <FlowCanvasMinimap
                                    nodes={nodes}
                                    viewport={viewport}
                                    containerSize={size}
                                    onNavigate={(point) =>
                                        viewportApi.setViewport({
                                            zoom: viewport.zoom,
                                            panX: size.width / 2 - point.x * viewport.zoom,
                                            panY: size.height / 2 - point.y * viewport.zoom,
                                        })
                                    }
                                />
                            </div>
                        )}

                        <div aria-live="polite" aria-atomic="true" className="sr-only">
                            {announcement}
                        </div>
                    </div>

                    {showInspector && (
                        <aside
                            aria-label="Inspector"
                            className="flex w-full flex-col gap-4 rounded-2xl border border-secondary bg-primary/70 p-4 shadow-xs backdrop-blur-md lg:w-72 lg:shrink-0"
                        >
                            <FlowCanvasInspector
                                selection={selection}
                                nodes={nodes}
                                edges={edges}
                                zoomPercent={viewport.zoom * 100}
                                runLog={runLog?.slice(-maxRunLogEntries)}
                                isReadOnly={isReadOnly}
                                onNodeLabelChange={setNodeLabel}
                                onNodeDescriptionChange={setNodeDescription}
                                onNodeRoleChange={setNodeRole}
                                onEdgeLabelChange={setEdgeLabel}
                                onDeleteSelected={deleteSelected}
                                onGoToNode={goToNode}
                            />
                        </aside>
                    )}
                </div>
            </div>
        </FlowCanvasProvider>
    );
};
