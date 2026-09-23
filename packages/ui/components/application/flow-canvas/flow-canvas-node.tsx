"use client";

import type { ReactNode } from "react";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { HelpCircle } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import { useFlowCanvasContext } from "./flow-canvas-context";
import { FlowCanvasStatusChip } from "./flow-canvas-primitives";
import type { FlowNode, FlowRoleDefinition } from "./flow-canvas-types";
import { NODE_HEIGHT, NODE_WIDTH, nodeStatusOf } from "./flow-canvas-utils";
import { useFlowNodeDrag } from "./use-flow-canvas-drag";
import type { FlowCanvasFocusItemProps } from "./use-flow-canvas-focus";

const FALLBACK_ROLE: FlowRoleDefinition = { label: "Unknown", icon: HelpCircle, color: "gray" };

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
    onConnectStart: () => void;
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
            aria-label={`${node.label}, ${role.label} node${status !== "idle" ? `, ${status}` : ""}`}
            aria-pressed={isSelected}
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
            style={{ left: node.x - NODE_WIDTH / 2, top: node.y - NODE_HEIGHT / 2, width: NODE_WIDTH, height: NODE_HEIGHT }}
            className={cx(
                "pointer-events-auto absolute flex items-center gap-3 rounded-2xl bg-primary/80 px-3.5 shadow-sm ring-1 ring-secondary backdrop-blur-md transition-[box-shadow,ring-color,opacity] duration-100 ease-linear",
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

            <span
                aria-hidden="true"
                className={cx(
                    "pointer-events-none absolute top-1/2 left-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-primary transition-colors duration-100 ease-linear",
                    isSelected ? "border-fg-brand-secondary" : "border-fg-quaternary",
                )}
            />
            <span
                {...handleHandlers}
                aria-hidden="true"
                title="Drag to connect"
                className={cx(
                    "absolute top-1/2 right-0 size-3.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-primary transition-transform duration-100 ease-linear",
                    context.isReadOnly ? "pointer-events-none opacity-50" : "cursor-crosshair hover:scale-125",
                    isSelected ? "border-fg-brand-secondary" : "border-fg-quaternary",
                )}
            />

            <FeaturedIcon icon={Icon} color={role.color} theme="light" size="md" className="pointer-events-none shrink-0" />

            <span className="pointer-events-none flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={cx("truncate text-sm font-semibold text-primary", sketchy && "font-handwritten text-base")}>{node.label}</span>
                {node.description && <span className={cx("truncate text-xs text-tertiary", sketchy && "font-handwritten text-sm")}>{node.description}</span>}
            </span>

            {renderContent?.(node)}

            <FlowCanvasStatusChip status={status} reducedMotion={context.reducedMotion} />
        </div>
    );
};
