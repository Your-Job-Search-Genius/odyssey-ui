"use client";

import type { ReactNode } from "react";
import type { Selection } from "react-aria-components";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { BezierCurve02, PauseCircle, Pencil01, PlayCircle, Plus, RefreshCw01 } from "@/components/foundations/icons";
import type { FlowEdgeStyle, FlowSpeed } from "./flow-canvas-types";

export interface FlowCanvasToolbarProps {
    edgeStyle: FlowEdgeStyle;
    onEdgeStyleChange: (style: FlowEdgeStyle) => void;
    speed: FlowSpeed;
    onSpeedChange: (speed: FlowSpeed) => void;
    isPlaying: boolean;
    onPlayingChange: (isPlaying: boolean) => void;
    snapToGrid: boolean;
    onSnapToGridChange: (value: boolean) => void;
    isReadOnly?: boolean;
    /** The Run button only renders when this is provided. */
    onRun?: () => void;
    onAddNode?: () => void;
    onReset: () => void;
    /** Rendered at the end of the toolbar row -- e.g. a host app's own theme switcher. FlowCanvas never ships one itself. */
    toolbarExtra?: ReactNode;
}

const pickKey = <T extends string>(keys: Selection): T | undefined => {
    if (keys === "all") return undefined;
    const [key] = keys;
    return key as T | undefined;
};

export const FlowCanvasToolbar = ({
    edgeStyle,
    onEdgeStyleChange,
    speed,
    onSpeedChange,
    isPlaying,
    onPlayingChange,
    snapToGrid,
    onSnapToGridChange,
    isReadOnly,
    onRun,
    onAddNode,
    onReset,
    toolbarExtra,
}: FlowCanvasToolbarProps) => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-secondary bg-primary/70 p-2 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
            {onRun && (
                <Button size="sm" color="primary" iconLeading={PlayCircle} onClick={onRun}>
                    Run
                </Button>
            )}
            {!isReadOnly && onAddNode && (
                <Button size="sm" color="secondary" iconLeading={Plus} onClick={onAddNode}>
                    Add node
                </Button>
            )}
            <Button size="sm" color="secondary" iconLeading={RefreshCw01} aria-label="Reset canvas" onClick={onReset} />
        </div>

        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-quaternary">Edges</span>
            <ButtonGroup
                size="sm"
                disallowEmptySelection
                selectedKeys={[edgeStyle]}
                onSelectionChange={(keys) => onEdgeStyleChange(pickKey(keys) ?? edgeStyle)}
            >
                <ButtonGroupItem id="smooth" iconLeading={BezierCurve02}>
                    Smooth
                </ButtonGroupItem>
                <ButtonGroupItem id="sketchy" iconLeading={Pencil01}>
                    Sketchy
                </ButtonGroupItem>
            </ButtonGroup>
        </div>

        {!isReadOnly && <Checkbox size="sm" label="Snap to grid" isSelected={snapToGrid} onChange={onSnapToGridChange} />}

        <div className="ml-auto flex items-center gap-2">
            <Button
                size="sm"
                color="tertiary"
                iconLeading={isPlaying ? PauseCircle : PlayCircle}
                aria-label={isPlaying ? "Pause ambient flow" : "Play ambient flow"}
                onClick={() => onPlayingChange(!isPlaying)}
            />
            <ButtonGroup size="sm" disallowEmptySelection selectedKeys={[speed]} onSelectionChange={(keys) => onSpeedChange(pickKey(keys) ?? speed)}>
                <ButtonGroupItem id="slow">Slow</ButtonGroupItem>
                <ButtonGroupItem id="normal">Normal</ButtonGroupItem>
                <ButtonGroupItem id="fast">Fast</ButtonGroupItem>
            </ButtonGroup>
        </div>

        {toolbarExtra}
    </div>
);
