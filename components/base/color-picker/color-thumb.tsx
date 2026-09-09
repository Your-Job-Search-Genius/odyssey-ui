"use client";

import { ColorThumb as AriaColorThumb, type ColorThumbProps as AriaColorThumbProps } from "react-aria-components";
import { cx } from "@/utils/cx";

/**
 * Draggable handle shared by `ColorArea` and `ColorSlider`. Unlike the plain
 * `Slider` thumb, its fill color reflects the currently selected color
 * (applied automatically by React Aria), so styling here only owns the
 * ring/shadow chrome that keeps the handle visible against any hue.
 */
export const ColorThumb = (props: AriaColorThumbProps) => {
    return (
        <AriaColorThumb
            {...props}
            className={({ isFocusVisible, isDragging, isDisabled }) =>
                cx(
                    "top-1/2 left-1/2 box-border size-6 cursor-grab rounded-full shadow-md ring-2 ring-fg-white ring-inset",
                    isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                    isDragging && "cursor-grabbing",
                    isDisabled && "cursor-not-allowed opacity-50",
                )
            }
        />
    );
};

ColorThumb.displayName = "ColorThumb";
