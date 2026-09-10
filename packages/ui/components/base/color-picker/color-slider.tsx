"use client";

import type { ColorSliderProps as AriaColorSliderProps } from "react-aria-components";
import { ColorSlider as AriaColorSlider, Label as AriaLabel, SliderOutput as AriaSliderOutput, SliderTrack as AriaSliderTrack } from "react-aria-components";
import { ColorThumb } from "@/components/base/color-picker/color-thumb";
import { cx } from "@/utils/cx";

// Checkerboard pattern composited behind the channel gradient so an alpha
// channel stays visible against any page background. Harmless (fully
// covered) for channels that don't include transparency.
const CHECKERBOARD = "repeating-conic-gradient(var(--color-bg-quaternary) 0% 25%, transparent 0% 50%) 50% / 12px 12px";

export interface ColorSliderProps extends AriaColorSliderProps {
    /** Visible label text. Falls back to `aria-label`/`aria-labelledby` when omitted. */
    label?: string;
    /** Whether to show the formatted channel value next to the label. */
    showValueLabel?: boolean;
    /** Class name applied to the root element. */
    className?: string;
}

/**
 * A color slider allows users to adjust an individual channel of a color
 * value (e.g. hue, saturation or alpha) along a one-dimensional gradient
 * track.
 */
export const ColorSlider = ({ label, showValueLabel = true, className, orientation = "horizontal", ...props }: ColorSliderProps) => {
    return (
        <AriaColorSlider
            {...props}
            orientation={orientation}
            className={({ isDisabled }) =>
                cx(
                    "flex gap-2",
                    orientation === "horizontal" ? "w-full flex-col" : "h-48 flex-col items-center",
                    isDisabled && "cursor-not-allowed opacity-50",
                    className,
                )
            }
        >
            {(label || showValueLabel) && (
                <div className="flex w-full items-center justify-between gap-2">
                    {label && <AriaLabel className="text-sm font-medium text-secondary">{label}</AriaLabel>}
                    {showValueLabel && <AriaSliderOutput className="text-sm text-tertiary tabular-nums" />}
                </div>
            )}

            <AriaSliderTrack
                className={cx("relative touch-none rounded-full", orientation === "horizontal" ? "h-6 w-full" : "h-full w-6")}
                style={({ defaultStyle }) => ({
                    ...defaultStyle,
                    background: `${defaultStyle.background}, ${CHECKERBOARD}`,
                })}
            >
                <ColorThumb />
            </AriaSliderTrack>
        </AriaColorSlider>
    );
};

ColorSlider.displayName = "ColorSlider";
