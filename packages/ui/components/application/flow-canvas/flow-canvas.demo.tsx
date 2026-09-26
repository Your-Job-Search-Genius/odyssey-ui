"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { ShieldTick } from "@/components/foundations/icons";
import { DEFAULT_FLOW_ROLES, FlowCanvas } from "./flow-canvas";
import type { FlowEdge, FlowEdgeStatus, FlowNode, FlowNodeStatus, FlowRunLogEntry } from "./flow-canvas-types";

const basicNodes: FlowNode[] = [
    { id: "received", label: "Application received", description: "Webhook trigger", role: "start", x: 80, y: 220 },
    { id: "screen", label: "Screen resume", description: "Parse & score", role: "process", x: 380, y: 220 },
    { id: "decision", label: "Shortlist?", description: "Decision", role: "decision", x: 680, y: 220 },
    { id: "interview", label: "Interview", description: "Auto-scheduled", role: "success", x: 980, y: 100 },
    { id: "followup", label: "Needs follow-up", description: "Manual review", role: "warning", x: 980, y: 340 },
    { id: "offer", label: "Offer", description: "Send update", role: "end", x: 1280, y: 220 },
];

const basicEdges: FlowEdge[] = [
    { id: "e-received-screen", source: "received", target: "screen" },
    { id: "e-screen-decision", source: "screen", target: "decision" },
    { id: "e-decision-interview", source: "decision", target: "interview", label: "pass" },
    { id: "e-decision-followup", source: "decision", target: "followup", label: "flag" },
    { id: "e-interview-offer", source: "interview", target: "offer" },
    { id: "e-followup-offer", source: "followup", target: "offer" },
];

const cloneNodes = () => basicNodes.map((node) => ({ ...node }));
const cloneEdges = () => basicEdges.map((edge) => ({ ...edge }));

/** Full default chrome, uncontrolled -- the shape most consumers reach for first. */
export const FlowCanvasBasic = () => <FlowCanvas defaultNodes={cloneNodes()} defaultEdges={cloneEdges()} />;

/** External state via `nodes`/`edges`/`selectedId` + their `onChange` callbacks, with a button mutating state from outside the canvas. */
export const FlowCanvasControlled = () => {
    const [nodes, setNodes] = useState<FlowNode[]>(cloneNodes);
    const [edges, setEdges] = useState<FlowEdge[]>(cloneEdges);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    size="sm"
                    color="secondary"
                    onClick={() =>
                        setNodes((prev) => prev.map((node) => (node.id === "screen" ? { ...node, status: node.status === "done" ? "idle" : "done" } : node)))
                    }
                >
                    Toggle &ldquo;Screen resume&rdquo; done
                </Button>
                <Button size="sm" color="tertiary" onClick={() => setSelectedId(null)}>
                    Clear selection
                </Button>
                <span className="text-xs text-tertiary">Selected: {selectedId ?? "none"}</span>
            </div>
            <FlowCanvas
                nodes={nodes}
                onNodesChange={setNodes}
                edges={edges}
                onEdgesChange={setEdges}
                selectedId={selectedId}
                onSelectedIdChange={setSelectedId}
                height={440}
            />
        </div>
    );
};

/** `isReadOnly` with every chrome piece hidden -- for embedding a status summary where editing doesn't make sense. */
export const FlowCanvasMinimalEmbed = () => (
    <FlowCanvas
        defaultNodes={cloneNodes().map((node, index) => ({
            ...node,
            status: (index < 2 ? "done" : index === 2 ? "running" : "idle") as FlowNodeStatus,
        }))}
        defaultEdges={cloneEdges().map((edge, index) => ({ ...edge, status: (index < 2 ? "traversed" : "idle") as FlowEdgeStatus }))}
        isReadOnly
        showToolbar={false}
        showMinimap={false}
        showInspector={false}
        showZoomControls={false}
        showHintChip={false}
        height={320}
    />
);

/** Editable graph with the top toolbar and the right inspector hidden. Zoom, legend, minimap, and the hint chip stay. */
export const FlowCanvasNoToolbar = () => <FlowCanvas defaultNodes={cloneNodes()} defaultEdges={cloneEdges()} showToolbar={false} showInspector={false} />;

const customRoleNodes: FlowNode[] = [
    { id: "start", label: "New submission", role: "start", x: 80, y: 160 },
    { id: "validate", label: "Validate fields", description: "Custom role", role: "validation", x: 380, y: 160 },
    { id: "store", label: "Store record", role: "process", x: 680, y: 160 },
    { id: "confirm", label: "Confirmed", role: "end", x: 980, y: 160 },
];
const customRoleEdges: FlowEdge[] = [
    { id: "e-start-validate", source: "start", target: "validate" },
    { id: "e-validate-store", source: "validate", target: "store" },
    { id: "e-store-confirm", source: "store", target: "confirm" },
];

/** `roles` merges partial overrides over `DEFAULT_FLOW_ROLES` by key -- here adding a 7th, fully custom role. */
export const FlowCanvasCustomRoles = () => (
    <FlowCanvas
        defaultNodes={customRoleNodes.map((node) => ({ ...node }))}
        defaultEdges={customRoleEdges.map((edge) => ({ ...edge }))}
        roles={{ validation: { label: "Validation", icon: ShieldTick, color: "success" } }}
        height={340}
    />
);

/** Excalidraw-style hand-wobbled edges and node outlines. */
export const FlowCanvasSketchyMode = () => <FlowCanvas defaultNodes={cloneNodes()} defaultEdges={cloneEdges()} defaultEdgeStyle="sketchy" height={440} />;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Kahn's algorithm topological sort -- used only to pick a valid execution order for the fake run below. */
function computeTopoOrder(nodes: FlowNode[], edges: FlowEdge[]): string[] {
    const indegree = new Map<string, number>(nodes.map((node) => [node.id, 0]));
    edges.forEach((edge) => indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1));
    const queue = nodes.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
    const order: string[] = [];
    while (queue.length > 0) {
        const id = queue.shift() as string;
        order.push(id);
        edges.forEach((edge) => {
            if (edge.source !== id) return;
            const next = (indegree.get(edge.target) ?? 0) - 1;
            indegree.set(edge.target, next);
            if (next === 0) queue.push(edge.target);
        });
    }
    return order;
}

/**
 * A fake pipeline executor: topological order, alternating which branch the
 * decision node takes each run. This entire function is demo-only fixture
 * code -- `FlowCanvas` itself never computes execution order. A real
 * integration replaces this with a subscription to an actual backend that
 * writes into the same `nodes`/`edges`/`runLog` state shown here.
 */
export const FlowCanvasRunSimulation = () => {
    const [nodes, setNodes] = useState<FlowNode[]>(cloneNodes);
    const [edges, setEdges] = useState<FlowEdge[]>(cloneEdges);
    const [runLog, setRunLog] = useState<FlowRunLogEntry[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const branchRef = useRef(false);
    const runTokenRef = useRef(0);

    const setNodeStatus = (id: string, status: FlowNodeStatus) => setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, status } : node)));
    const setEdgeStatus = (id: string, status: FlowEdgeStatus) => setEdges((prev) => prev.map((edge) => (edge.id === id ? { ...edge, status } : edge)));
    const log = (text: string, tone?: FlowRunLogEntry["tone"]) => setRunLog((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, text, tone }]);

    const run = async () => {
        if (isRunning) return;
        const token = ++runTokenRef.current;
        setIsRunning(true);
        branchRef.current = !branchRef.current;
        setRunLog([]);
        setNodes((prev) => prev.map((node) => ({ ...node, status: "idle" })));
        setEdges((prev) => prev.map((edge) => ({ ...edge, status: "idle" })));
        await sleep(50);

        const order = computeTopoOrder(basicNodes, basicEdges);
        const done = new Set<string>();
        const mutedEdgeIds = new Set<string>();

        for (const id of order) {
            if (runTokenRef.current !== token) return;
            const node = basicNodes.find((n) => n.id === id);
            if (!node) continue;
            const incoming = basicEdges.filter((edge) => edge.target === id);

            if (incoming.length > 0) {
                const feeding = incoming.filter((edge) => done.has(edge.source) && !mutedEdgeIds.has(edge.id));
                if (feeding.length === 0) {
                    setNodeStatus(id, "skipped");
                    incoming.forEach((edge) => setEdgeStatus(edge.id, "muted"));
                    log(`skip    ${node.label}`, "muted");
                    continue;
                }
                feeding.forEach((edge) => setEdgeStatus(edge.id, "active"));
                await sleep(650);
                if (runTokenRef.current !== token) return;
                feeding.forEach((edge) => setEdgeStatus(edge.id, "traversed"));
            }

            setNodeStatus(id, "running");
            await sleep(650);
            if (runTokenRef.current !== token) return;
            setNodeStatus(id, "done");
            done.add(id);
            log(`done    ${node.label}`, "success");

            if (id === "decision") {
                const outgoing = basicEdges.filter((edge) => edge.source === id);
                const pick = outgoing[branchRef.current ? 1 : 0] ?? outgoing[0];
                outgoing.forEach((edge) => {
                    if (edge.id !== pick?.id) {
                        setEdgeStatus(edge.id, "muted");
                        mutedEdgeIds.add(edge.id);
                    }
                });
                const targetLabel = basicNodes.find((n) => n.id === pick?.target)?.label ?? pick?.target;
                log(`route   ${node.label} → ${targetLabel}`);
            }
        }

        setIsRunning(false);
        log("complete", "success");
    };

    return <FlowCanvas nodes={nodes} onNodesChange={setNodes} edges={edges} onEdgesChange={setEdges} runLog={runLog} onRunRequest={run} height={460} />;
};

/** No nodes -- the built-in empty state. */
export const FlowCanvasEmpty = () => <FlowCanvas defaultNodes={[]} defaultEdges={[]} height={320} />;

// Re-exported so the "Custom roles" example in the docs page can show the
// full default registry alongside the one role it adds.
export { DEFAULT_FLOW_ROLES };
