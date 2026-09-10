"use client";

import { ColorSwatch as AriaColorSwatch, type ColorSwatchProps as AriaColorSwatchProps } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface ColorSwatchProps extends AriaColorSwatchProps {
    /**
     * Set when an adjacent visible label already names the control this
     * swatch decorates (e.g. inside `ColorPicker`'s trigger button), so the
     * swatch's own auto-generated color description doesn't get announced
     * as (or prefixed onto) that control's accessible name.
     */
    "aria-hidden"?: boolean | "true" | "false";
    /** Class name applied to the root element. */
    className?: string;
}

/**
 * A ColorSwatch displays a preview of a color. A checkerboard pattern is
 * composited behind the color so partially transparent (alpha) colors
 * remain visible against any page background.
 */
export const ColorSwatch = ({ className, style, ...props }: ColorSwatchProps) => {
    return (
        <AriaColorSwatch
            {...props}
            style={({ color, defaultStyle }) => ({
                ...defaultStyle,
                background: `linear-gradient(${color}, ${color}), repeating-conic-gradient(var(--color-bg-quaternary) 0% 25%, transparent 0% 50%) 50% / 8px 8px`,
                ...(typeof style === "function" ? style({ color, defaultStyle }) : style),
            })}
            className={cx("size-8 shrink-0 rounded-md ring-1 ring-primary ring-inset", className)}
        />
    );
};

ColorSwatch.displayName = "ColorSwatch";
