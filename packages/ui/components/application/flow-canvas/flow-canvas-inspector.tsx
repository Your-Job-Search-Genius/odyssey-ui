"use client";

import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Grid01, Route, Trash01 } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import { useFlowCanvasContext } from "./flow-canvas-context";
import type { FlowEdge, FlowNode, FlowRunLogEntry, FlowSelection } from "./flow-canvas-types";
import { NODE_STATUS_LABEL, nodeStatusOf } from "./flow-canvas-utils";

export interface FlowCanvasInspectorProps<TData = unknown> {
    selection: FlowSelection;
    nodes: readonly FlowNode<TData>[];
    edges: readonly FlowEdge[];
    zoomPercent: number;
    runLog?: readonly FlowRunLogEntry[];
    isReadOnly?: boolean;
    onNodeLabelChange: (id: string, label: string) => void;
    onNodeDescriptionChange: (id: string, description: string) => void;
    onNodeRoleChange: (id: string, role: string) => void;
    onEdgeLabelChange: (id: string, label: string) => void;
    onDeleteSelected: () => void;
    onGoToNode: (id: string) => void;
}

const STATUS_BADGE_DOT: Record<string, string> = {
    idle: "bg-fg-quaternary",
    queued: "bg-fg-warning-primary",
    running: "bg-fg-brand-primary",
    done: "bg-fg-success-primary",
    skipped: "bg-fg-quaternary",
};

export const FlowCanvasInspector = <TData,>({
    selection,
    nodes,
    edges,
    zoomPercent,
    runLog,
    isReadOnly,
    onNodeLabelChange,
    onNodeDescriptionChange,
    onNodeRoleChange,
    onEdgeLabelChange,
    onDeleteSelected,
    onGoToNode,
}: FlowCanvasInspectorProps<TData>) => {
    const context = useFlowCanvasContext();
    const roleItems = Object.entries(context.roles).map(([id, role]) => ({ id, label: role.label, icon: role.icon }));

    if (selection?.type === "node") {
        const node = nodes.find((n) => n.id === selection.id);
        if (node) {
            const role = context.roles[node.role];
            const status = nodeStatusOf(node.status);
            const incoming = edges.filter((edge) => edge.target === node.id);
            const outgoing = edges.filter((edge) => edge.source === node.id);

            return (
                <div className="flex h-full flex-col gap-4">
                    <div className="flex items-center gap-3">
                        {role && <FeaturedIcon icon={role.icon} color={role.color} theme="light" size="md" />}
                        <div className="min-w-0">
                            <p className="text-xs text-quaternary">{role?.label ?? "Node"}</p>
                            <p className="truncate text-sm font-semibold text-primary">{node.label}</p>
                        </div>
                    </div>

                    <Input label="Label" size="sm" value={node.label} isDisabled={isReadOnly} onChange={(value) => onNodeLabelChange(node.id, value)} />
                    <Input
                        label="Description"
                        size="sm"
                        value={node.description ?? ""}
                        isDisabled={isReadOnly}
                        onChange={(value) => onNodeDescriptionChange(node.id, value)}
                    />
                    <Select
                        label="Type"
                        size="sm"
                        items={roleItems}
                        selectedKey={node.role}
                        isDisabled={isReadOnly}
                        onSelectionChange={(key) => key && onNodeRoleChange(node.id, String(key))}
                    >
                        {(item) => (
                            <Select.Item id={item.id} icon={item.icon}>
                                {item.label}
                            </Select.Item>
                        )}
                    </Select>

                    <div className="flex items-center gap-2 text-xs text-tertiary">
                        <span aria-hidden="true" className={cx("size-1.5 rounded-full", STATUS_BADGE_DOT[status])} />
                        {NODE_STATUS_LABEL[status]}
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-secondary pt-3">
                        <p className="text-xs font-medium text-quaternary">
                            Connections &middot; {incoming.length} in, {outgoing.length} out
                        </p>
                        {incoming.length === 0 && outgoing.length === 0 ? (
                            <p className="text-xs text-quaternary">Not connected yet. Drag from the right handle to connect to another node.</p>
                        ) : (
                            <div className="flex flex-col gap-0.5">
                                {incoming.map((edge) => {
                                    const other = nodes.find((n) => n.id === edge.source);
                                    return other ? (
                                        <button
                                            key={edge.id}
                                            type="button"
                                            onClick={() => onGoToNode(other.id)}
                                            className="flex items-center gap-2 rounded-md px-1.5 py-1 text-left text-xs text-secondary hover:bg-primary_hover"
                                        >
                                            <span aria-hidden="true" className="text-quaternary">
                                                &larr;
                                            </span>
                                            {other.label}
                                        </button>
                                    ) : null;
                                })}
                                {outgoing.map((edge) => {
                                    const other = nodes.find((n) => n.id === edge.target);
                                    return other ? (
                                        <button
                                            key={edge.id}
                                            type="button"
                                            onClick={() => onGoToNode(other.id)}
                                            className="flex items-center gap-2 rounded-md px-1.5 py-1 text-left text-xs text-secondary hover:bg-primary_hover"
                                        >
                                            <span aria-hidden="true" className="text-quaternary">
                                                &rarr;
                                            </span>
                                            {other.label}
                                            {edge.label && <span className="ml-auto text-quaternary">{edge.label}</span>}
                                        </button>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>

                    {!isReadOnly && (
                        <Button size="sm" color="tertiary-destructive" iconLeading={Trash01} className="mt-auto" onClick={onDeleteSelected}>
                            Delete node
                        </Button>
                    )}
                </div>
            );
        }
    }

    if (selection?.type === "edge") {
        const edge = edges.find((e) => e.id === selection.id);
        if (edge) {
            const source = nodes.find((n) => n.id === edge.source);
            const target = nodes.find((n) => n.id === edge.target);
            return (
                <div className="flex h-full flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <FeaturedIcon icon={Route} color="brand" theme="light" size="md" />
                        <div className="min-w-0">
                            <p className="text-xs text-quaternary">Edge</p>
                            <p className="truncate text-sm font-semibold text-primary">
                                {source?.label ?? edge.source} &rarr; {target?.label ?? edge.target}
                            </p>
                        </div>
                    </div>
                    <Input
                        label="Label"
                        size="sm"
                        placeholder="e.g. pass"
                        value={edge.label ?? ""}
                        isDisabled={isReadOnly}
                        onChange={(value) => onEdgeLabelChange(edge.id, value)}
                    />
                    {!isReadOnly && (
                        <Button size="sm" color="tertiary-destructive" iconLeading={Trash01} className="mt-auto" onClick={onDeleteSelected}>
                            Delete edge
                        </Button>
                    )}
                </div>
            );
        }
    }

    const recentLog = runLog?.slice(-8);

    return (
        <div className="flex h-full flex-col gap-4">
            <div className="flex items-center gap-3">
                <FeaturedIcon icon={Grid01} color="brand" theme="light" size="md" />
                <div>
                    <p className="text-xs text-quaternary">Nothing selected</p>
                    <p className="text-sm font-semibold text-primary">Canvas</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-secondary bg-primary px-3 py-2.5">
                    <p className="text-lg font-semibold text-primary tabular-nums">{nodes.length}</p>
                    <p className="text-xs text-quaternary">Nodes</p>
                </div>
                <div className="rounded-lg border border-secondary bg-primary px-3 py-2.5">
                    <p className="text-lg font-semibold text-primary tabular-nums">{edges.length}</p>
                    <p className="text-xs text-quaternary">Edges</p>
                </div>
                <div className="rounded-lg border border-secondary bg-primary px-3 py-2.5">
                    <p className="text-lg font-semibold text-primary tabular-nums">{Math.round(zoomPercent)}%</p>
                    <p className="text-xs text-quaternary">Zoom</p>
                </div>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-secondary pt-3">
                <p className="text-xs font-medium text-quaternary">{recentLog?.length ? "Run log" : "How to use"}</p>
                {recentLog?.length ? (
                    <div className="flex flex-col gap-1 font-mono text-xs text-tertiary">
                        {recentLog.map((entry) => (
                            <span
                                key={entry.id}
                                className={cx(entry.tone === "success" && "text-success-primary", entry.tone === "muted" && "text-quaternary")}
                            >
                                {entry.text}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-tertiary">
                        Click a node or edge to edit it here. Drag from a node&rsquo;s right handle onto another node to connect them.
                    </p>
                )}
            </div>
        </div>
    );
};
