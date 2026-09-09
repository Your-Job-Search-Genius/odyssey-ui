"use client";

import { ColorArea as AriaColorArea, type ColorAreaProps as AriaColorAreaProps } from "react-aria-components";
import { ColorThumb } from "@/components/base/color-picker/color-thumb";
import { cx } from "@/utils/cx";

export interface ColorAreaProps extends AriaColorAreaProps {
    /** Class name applied to the root element. */
    className?: string;
}

/**
 * A color area allows users to adjust two channels of an RGB, HSL or HSB
 * color value (e.g. saturation and brightness) against a two-dimensional
 * gradient. The gradient background is computed and applied automatically by
 * React Aria — this component only owns shape, size and the thumb chrome.
 */
export const ColorArea = ({ className, ...props }: ColorAreaProps) => {
    return (
        <AriaColorArea
            {...props}
            className={({ isDisabled }) => cx("size-48 shrink-0 touch-none rounded-lg", isDisabled && "cursor-not-allowed opacity-50", className)}
        >
            <ColorThumb />
        </AriaColorArea>
    );
};

ColorArea.displayName = "ColorArea";
