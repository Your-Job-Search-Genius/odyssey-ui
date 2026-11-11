"use client";

import { type ReactNode, useId } from "react";
import type { PopoverProps as AriaPopoverProps } from "react-aria-components";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/** Wraps the trigger (any pressable, e.g. `Button`) and the `Popover`; opens on press. */
export const PopoverTrigger = AriaDialogTrigger;

// The explainer's width: 273px on desktop; on phones Figma runs it nearly edge to edge (385px of 402).
const sizes = {
    md: "w-[273px] max-w-[calc(100vw-2rem)]",
    sm: "w-[calc(100vw-17px)]",
    responsive: "w-[calc(100vw-17px)] md:w-[273px]",
};

interface PopoverProps extends Omit<AriaPopoverProps, "children"> {
    /** Body content: text for the explainer, any content (e.g. a `QRCard`) for `bare`. It also names the dialog unless `aria-label` is set. */
    children: ReactNode;
    /**
     * `default` is the dark text explainer (padded `#151515` box). `bare` draws no surface, padding or width, so rich
     * content such as a `QRCard` brings its own; prefer an `aria-label` then.
     * @default "default"
     */
    variant?: "default" | "bare";
    /**
     * Explainer width: `md` 273px (desktop); `sm` the phone explainer, nearly the full viewport width (385px of 402);
     * `responsive` is `sm` below the `md` breakpoint and `md` from it. Ignored by `bare`.
     * @default "md"
     */
    size?: keyof typeof sizes;
    /** Label of the button that dismisses the popover ("Okay! Got It"). Omit for no button (Escape and an outside press still close it). */
    acknowledgeLabel?: ReactNode;
    /** Called when the acknowledgement button is pressed, before the popover closes. */
    onAcknowledge?: () => void;
    "aria-label"?: string;
}

/**
 * Dark, interactive explainer anchored to its trigger: body text plus an optional acknowledgement button.
 * Unlike `Tooltip` it is a non-modal dialog, so it opens on press, can hold focusable content, and returns
 * focus to the trigger when it closes. Use `Tooltip` for a hover/focus label with nothing to press.
 */
export const Popover = ({
    children,
    variant = "default",
    size = "md",
    acknowledgeLabel,
    onAcknowledge,
    placement = "bottom start",
    offset = 8,
    // Phones: 8px keeps the nearly full-width explainer clear of the screen edges.
    containerPadding = size === "md" ? 12 : 8,
    className,
    "aria-label": ariaLabel,
    ...props
}: PopoverProps) => {
    const bodyId = useId();

    return (
        <AriaPopover
            {...props}
            placement={placement}
            offset={offset}
            containerPadding={containerPadding}
            className={(state) =>
                cx(
                    "z-50 origin-(--trigger-anchor-point) will-change-transform",
                    state.isEntering &&
                        "duration-150 ease-out in-placement-left:slide-in-from-right-0.5 in-placement-right:slide-in-from-left-0.5 in-placement-top:slide-in-from-bottom-0.5 in-placement-bottom:slide-in-from-top-0.5 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95",
                    state.isExiting && "duration-100 ease-in motion-safe:animate-out motion-safe:fade-out motion-safe:zoom-out-95",
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            <AriaDialog
                aria-label={ariaLabel}
                aria-labelledby={ariaLabel ? undefined : bodyId}
                className={cx(
                    "outline-hidden",
                    // The brand focus ring barely shows on #151515, so focus inside the explainer is drawn in white.
                    variant === "default" &&
                        cx("flex flex-col items-start gap-2.5 rounded-[14px] bg-popover p-2.5 [--color-focus-ring:var(--color-white)]", sizes[size]),
                )}
            >
                <div id={bodyId} className={variant === "default" ? "w-full text-sm/[1.4] text-popover" : undefined}>
                    {children}
                </div>
                {acknowledgeLabel && (
                    <Button size="xs" color="secondary" slot="close" onPress={onAcknowledge}>
                        {acknowledgeLabel}
                    </Button>
                )}
            </AriaDialog>
        </AriaPopover>
    );
};
