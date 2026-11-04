"use client";

import type { RefAttributes } from "react";
import type { PopoverProps as AriaPopoverProps } from "react-aria-components";
import { Popover as AriaPopover } from "react-aria-components";
import { cx } from "@/utils/cx";
import { SHEET_POPOVER } from "@/utils/sheet-popover";

interface PopoverProps extends AriaPopoverProps, RefAttributes<HTMLElement> {
    size: "sm" | "md" | "lg";
}

// Height caps (14rem / 16rem / 20rem) go to React Aria as `maxHeight`. A CSS max-height (it had to be
// !important to beat React Aria's inline style) stopped React Aria shrinking the list to the space left
// in the viewport, so at 200% zoom the bottom options ran off-screen.
const maxHeights = { sm: 224, md: 256, lg: 320 };

export const Popover = (props: PopoverProps) => {
    return (
        <AriaPopover
            placement="bottom"
            containerPadding={0}
            offset={4}
            maxHeight={maxHeights[props.size]}
            {...props}
            className={(state) =>
                cx(
                    "w-(--trigger-width) origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-lg bg-primary py-1 shadow-lg ring-1 ring-secondary_alt outline-hidden will-change-transform",

                    state.isEntering &&
                        "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                    state.isExiting &&
                        "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",

                    typeof props.className === "function" ? props.className(state) : props.className,

                    // Bottom sheet below md; its !important max-height beats the inline `maxHeight` above.
                    SHEET_POPOVER,
                )
            }
        />
    );
};
