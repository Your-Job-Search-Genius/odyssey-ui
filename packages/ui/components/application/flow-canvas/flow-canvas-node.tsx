"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { HelpCircle } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import { useFlowCanvasContext } from "./flow-canvas-context";
import { FlowCanvasStatusChip } from "./flow-canvas-primitives";
import type { FlowNode, FlowRoleDefinition } from "./flow-canvas-types";
import { nodeSize, nodeStatusOf, portOffsetY } from "./flow-canvas-utils";
import { useFlowNodeDrag } from "./use-flow-canvas-drag";
import type { FlowCanvasFocusItemProps } from "./use-flow-canvas-focus";

const FALLBACK_ROLE: FlowRoleDefinition = { label: "Unknown", icon: HelpCircle, color: "gray" };

/** Port names sit just outside the card, above the handle, so they never cover the card's content. */
const PORT_LABEL =
    "pointer-events-none absolute bottom-full mb-0.5 rounded-full bg-primary/90 px-1.5 text-[11px] leading-4 font-medium whitespace-nowrap text-tertiary shadow-xs ring-1 ring-secondary";

const NUDGE_STEP = 12;
const NUDGE_STEP_LARGE = 96;

export interface FlowNodeCardProps<TData = unknown> {
    node: FlowNode<TData>;
    isSelected: boolean;
    isDropTarget: boolean;
    zoom: number;
    focusProps: FlowCanvasFocusItemProps;
    onSelect: () => void;
    onMoveBy: (dx: number, dy: number) => void;
    onMoveEnd: () => void;
    onNudge: (dx: number, dy: number) => void;
    onDelete: () => void;
    onConnectStart: (portId: string | undefined) => void;
    onConnectMoveTo: (clientX: number, clientY: number) => void;
    onConnectEnd: (dropElement: Element | null) => void;
    renderContent?: (node: FlowNode<TData>) => ReactNode;
}

export const FlowNodeCard = <TData,>({
    node,
    isSelected,
    isDropTarget,
    zoom,
    focusProps,
    onSelect,
    onMoveBy,
    onMoveEnd,
    onNudge,
    onDelete,
    onConnectStart,
    onConnectMoveTo,
    onConnectEnd,
    renderContent,
}: FlowNodeCardProps<TData>) => {
    const context = useFlowCanvasContext();
    const role = context.roles[node.role] ?? FALLBACK_ROLE;
    const Icon = node.icon ?? role.icon;
    const status = nodeStatusOf(node.status);
    const sketchy = context.edgeStyle === "sketchy";
    const { width, height } = nodeSize(node);
    const descriptionId = useId();
    const tooltipId = useId();
    // One unnamed handle per side unless the node declares named ports.
    const inPorts: { id?: string; label?: string }[] = node.inputs?.length ? node.inputs.map((p) => ({ id: p.id, label: p.label ?? p.id })) : [{}];
    const outPorts: { id?: string; label?: string }[] = node.outputs?.length ? node.outputs.map((p) => ({ id: p.id, label: p.label ?? p.id })) : [{}];
    const portSummary = node.outputs?.length ? `, outputs ${node.outputs.map((p) => p.label ?? p.id).join(", ")}` : "";
    const describedBy = [node.description && descriptionId, node.tooltip && tooltipId].filter(Boolean).join(" ") || undefined;

    const { bodyHandlers, handleHandlers, isDragging } = useFlowNodeDrag({
        isReadOnly: context.isReadOnly,
        zoom,
        onMoveBy,
        onMoveEnd,
        onClick: onSelect,
        onConnectStart,
        onConnectMoveTo,
        onConnectEnd,
    });

    return (
        <div
            {...bodyHandlers}
            ref={focusProps.ref}
            data-flow-node-id={node.id}
            tabIndex={focusProps.tabIndex}
            role="button"
            aria-label={`${node.label}, ${role.label} node${status !== "idle" ? `, ${status}` : ""}${portSummary}`}
            aria-pressed={isSelected}
            aria-describedby={describedBy}
            onFocus={focusProps.onFocus}
            onKeyDown={(event) => {
                focusProps.onKeyDown(event);
                if (event.defaultPrevented || context.isReadOnly) return;
                const step = event.shiftKey ? NUDGE_STEP_LARGE : NUDGE_STEP;
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    event.stopPropagation();
                    onNudge(-step, 0);
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    event.stopPropagation();
                    onNudge(step, 0);
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    event.stopPropagation();
                    onNudge(0, -step);
                } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    event.stopPropagation();
                    onNudge(0, step);
                } else if (event.key === "Delete" || event.key === "Backspace") {
                    event.preventDefault();
                    event.stopPropagation();
                    onDelete();
                } else if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    onSelect();
                }
            }}
            style={{ left: node.x - width / 2, top: node.y - height / 2, width, height }}
            className={cx(
                "group/flow-node pointer-events-auto absolute flex items-center gap-3 rounded-2xl bg-primary/80 px-3.5 shadow-sm ring-1 ring-secondary backdrop-blur-md transition-[box-shadow,ring-color,opacity] duration-100 ease-linear select-none",
                context.isReadOnly ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab",
                "hover:shadow-lg hover:ring-primary focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                isSelected && "shadow-lg ring-2 ring-brand",
                isDropTarget && "ring-2 ring-brand",
                status === "skipped" && "opacity-45",
                sketchy && "rounded-[62px_14px_46px_16px/16px_46px_14px_62px] ring-transparent",
            )}
        >
            {sketchy && (
                <svg className="pointer-events-none absolute inset-0 size-full text-fg-quaternary" aria-hidden="true">
                    <rect
                        x={1}
                        y={1}
                        width="calc(100% - 2px)"
                        height="calc(100% - 2px)"
                        rx={20}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        filter={`url(#${context.sketchyFilterId})`}
                    />
                </svg>
            )}

            {inPorts.map((port) => (
                <span
                    key={port.id ?? "in"}
                    aria-hidden="true"
                    data-flow-in-port-id={port.id}
                    style={{ top: height / 2 + portOffsetY(node, node.inputs, port.id) }}
                    className={cx(
                        "absolute left-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-primary transition-colors duration-100 ease-linear",
                        // Named inputs are drop targets of their own; the default one only decorates the card edge.
                        port.id ? "pointer-events-auto" : "pointer-events-none",
                        isSelected ? "border-fg-brand-secondary" : "border-fg-quaternary",
                    )}
                >
                    {port.label && <span className={cx(PORT_LABEL, "right-full mr-2")}>{port.label}</span>}
                </span>
            ))}
            {outPorts.map((port) => (
                <span
                    key={port.id ?? "out"}
                    {...handleHandlers}
                    aria-hidden="true"
                    data-flow-port-id={port.id}
                    title={port.label ? `Drag to connect "${port.label}"` : "Drag to connect"}
                    style={{ top: height / 2 + portOffsetY(node, node.outputs, port.id) }}
                    className={cx(
                        "absolute right-0 size-3.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-primary transition-transform duration-100 ease-linear",
                        context.isReadOnly ? "pointer-events-none opacity-50" : "cursor-crosshair hover:scale-125",
                        isSelected ? "border-fg-brand-secondary" : "border-fg-quaternary",
                    )}
                >
                    {port.label && <span className={cx(PORT_LABEL, "left-full ml-2")}>{port.label}</span>}
                </span>
            ))}

            <FeaturedIcon icon={Icon} color={role.color} theme="light" size="md" className="pointer-events-none shrink-0" />

            <span className="pointer-events-none flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={cx("truncate text-sm font-semibold text-primary", sketchy && "font-handwritten text-base")}>{node.label}</span>
                {node.description && (
                    // The visible line truncates; the id'd copy keeps the full text for assistive tech.
                    <span aria-hidden="true" className={cx("truncate text-xs text-tertiary", sketchy && "font-handwritten text-sm")}>
                        {node.description}
                    </span>
                )}
                {node.description && (
                    <span id={descriptionId} className="sr-only">
                        {node.description}
                    </span>
                )}
            </span>

            {node.tooltip && (
                <span
                    id={tooltipId}
                    role="tooltip"
                    className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-80 -translate-x-1/2 rounded-lg bg-primary-solid px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-100 ease-linear group-hover/flow-node:visible group-hover/flow-node:opacity-100 group-focus-visible/flow-node:visible group-focus-visible/flow-node:opacity-100"
                >
                    {node.tooltip}
                </span>
            )}

            {renderContent?.(node)}

            <FlowCanvasStatusChip status={status} reducedMotion={context.reducedMotion} />
        </div>
    );
};
