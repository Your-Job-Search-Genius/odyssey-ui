"use client";

import { type ReactNode, useRef } from "react";
import { useControlledState } from "@react-stately/utils";
import type {
    ButtonProps as AriaButtonProps,
    TooltipProps as AriaTooltipProps,
    TooltipTriggerComponentProps as AriaTooltipTriggerComponentProps,
} from "react-aria-components";
import { Button as AriaButton, OverlayArrow as AriaOverlayArrow, Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger } from "react-aria-components";
import { cx } from "@/utils/cx";

/**
 * React Aria closes a tooltip when any scrollable parent of its trigger scrolls. Tabbing to a trigger outside the
 * visible area opens the tooltip on focus, and then the browser scrolls the trigger into view, so keyboard users
 * lost the tooltip straight away (WCAG 1.4.13). A close that comes from a scroll event within this many ms of a
 * keyboard-focus open is that scroll, and is ignored. Later scrolls still close the tooltip, because React Aria
 * doesn't reposition it when a parent scrolls.
 */
const FOCUS_SCROLL_GRACE_MS = 100;

/**
 * React Aria collections (Table, GridList, ListBox, ...) are a single tab stop. On Tab they move focus to their last
 * tabbable element and let the browser's Tab carry on from there, so a trigger in the last row got focus for an
 * instant and its tooltip flashed open and shut. That hop happens while the Tab keydown is still being dispatched
 * (the browser's own Tab moves focus after dispatch) and without preventDefault (a focus trap prevents it), so an
 * open requested then is skipped: focus is about to move on.
 */
let tabKeyDown: KeyboardEvent | null = null;
if (typeof window !== "undefined") {
    window.addEventListener("keydown", (event) => event.key === "Tab" && (tabKeyDown = event), true);
}
const isFocusPassingThrough = () => !!tabKeyDown && tabKeyDown.eventPhase !== Event.NONE && !tabKeyDown.defaultPrevented;

interface TooltipProps extends AriaTooltipTriggerComponentProps, Omit<AriaTooltipProps, "children"> {
    /**
     * The title of the tooltip.
     */
    title: ReactNode;
    /**
     * The description of the tooltip.
     */
    description?: ReactNode;
    /**
     * Whether to show the arrow on the tooltip.
     *
     * @default false
     */
    arrow?: boolean;
    /**
     * Delay in milliseconds before the tooltip is shown.
     *
     * @default 300
     */
    delay?: number;
}

export const Tooltip = ({
    title,
    description,
    children,
    arrow = false,
    delay = 300,
    closeDelay = 0,
    trigger,
    isDisabled,
    isOpen,
    defaultOpen,
    offset = 8,
    crossOffset,
    placement = "top",
    onOpenChange,
    ...tooltipProps
}: TooltipProps) => {
    const isTopOrBottomLeft = ["top left", "top end", "bottom left", "bottom end"].includes(placement);
    const isTopOrBottomRight = ["top right", "top start", "bottom right", "bottom start"].includes(placement);
    // Set negative cross offset for left and right placement to visually balance the tooltip.
    const calculatedCrossOffset = isTopOrBottomLeft ? -12 : isTopOrBottomRight ? 12 : 0;

    const [open, setOpen] = useControlledState(isOpen, defaultOpen ?? false, onOpenChange);
    const focusOpenedAt = useRef<number | null>(null);
    const handleOpenChange = (next: boolean) => {
        if (next) {
            if (isFocusPassingThrough()) return;
            focusOpenedAt.current = document.activeElement?.matches(":focus-visible") ? performance.now() : null;
        } else if (focusOpenedAt.current !== null && window.event?.type === "scroll" && performance.now() - focusOpenedAt.current < FOCUS_SCROLL_GRACE_MS) {
            return;
        }
        setOpen(next);
    };

    return (
        <AriaTooltipTrigger {...{ trigger, delay, closeDelay, isDisabled }} isOpen={open} onOpenChange={handleOpenChange}>
            {children}

            <AriaTooltip
                {...tooltipProps}
                offset={offset}
                placement={placement}
                crossOffset={crossOffset ?? calculatedCrossOffset}
                className={({ isEntering, isExiting }) => cx(isEntering && "ease-out animate-in", isExiting && "ease-in animate-out")}
            >
                {({ isEntering, isExiting }) => (
                    <div
                        className={cx(
                            "z-50 flex max-w-xs origin-(--trigger-anchor-point) flex-col items-start gap-1 rounded-lg bg-tooltip-bg px-3 shadow-md will-change-transform",
                            description ? "py-3" : "py-2",

                            isEntering &&
                                "ease-out animate-in fade-in zoom-in-95 in-placement-left:slide-in-from-right-0.5 in-placement-right:slide-in-from-left-0.5 in-placement-top:slide-in-from-bottom-0.5 in-placement-bottom:slide-in-from-top-0.5",
                            isExiting &&
                                "ease-in animate-out fade-out zoom-out-95 in-placement-left:slide-out-to-right-0.5 in-placement-right:slide-out-to-left-0.5 in-placement-top:slide-out-to-bottom-0.5 in-placement-bottom:slide-out-to-top-0.5",
                        )}
                    >
                        <span className="text-xs font-medium text-white">{title}</span>

                        {description && <span className="text-xs font-medium text-tooltip-supporting-text">{description}</span>}

                        {arrow && (
                            <AriaOverlayArrow>
                                <svg
                                    viewBox="0 0 100 100"
                                    className="size-2.5 fill-tooltip-bg in-placement-left:-rotate-90 in-placement-right:rotate-90 in-placement-top:rotate-0 in-placement-bottom:rotate-180"
                                >
                                    <path d="M0,0 L50,50 L100,0 Z" />
                                </svg>
                            </AriaOverlayArrow>
                        )}
                    </div>
                )}
            </AriaTooltip>
        </AriaTooltipTrigger>
    );
};

interface TooltipTriggerProps extends AriaButtonProps {}

export const TooltipTrigger = ({ children, className, ...buttonProps }: TooltipTriggerProps) => {
    return (
        <AriaButton
            {...buttonProps}
            className={(values) =>
                cx(
                    "h-max w-max rounded-sm outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                    typeof className === "function" ? className(values) : className,
                )
            }
        >
            {children}
        </AriaButton>
    );
};
