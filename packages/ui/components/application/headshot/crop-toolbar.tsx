"use client";

import { Button as AriaButton, Slider as AriaSlider, SliderThumb as AriaSliderThumb, SliderTrack as AriaSliderTrack } from "react-aria-components";
import { GlassPill } from "@/components/application/headshot/glass-pill";
import { Rotate02Icon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

const focusRing = "cursor-pointer outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
const segment = "flex items-center border border-white/9 bg-white/12";

export interface CropToolbarProps {
    zoom: number;
    onZoomChange: (zoom: number) => void;
    /** @default 1 */
    minZoom?: number;
    /** @default 3 */
    maxZoom?: number;
    /** @default 0.01 */
    zoomStep?: number;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onReset: () => void;
    /** Dims "Reset" when there is nothing to reset. */
    isResetDisabled?: boolean;
    onReupload: () => void;
    /** Accessible name of the toolbar group. @default "Crop controls" */
    label?: string;
    rotateLeftLabel?: string;
    rotateRightLabel?: string;
    zoomLabel?: string;
    resetLabel?: string;
    reuploadLabel?: string;
    className?: string;
}

/** Frosted toolbar under the crop area: rotate, zoom, reset and re-upload. */
export const CropToolbar = ({
    zoom,
    onZoomChange,
    minZoom = 1,
    maxZoom = 3,
    zoomStep = 0.01,
    onRotateLeft,
    onRotateRight,
    onReset,
    isResetDisabled,
    onReupload,
    label = "Crop controls",
    rotateLeftLabel = "Rotate left",
    rotateRightLabel = "Rotate right",
    zoomLabel = "Zoom",
    resetLabel = "Reset",
    reuploadLabel = "Re-Upload",
    className,
}: CropToolbarProps) => (
    <div
        role="group"
        aria-label={label}
        className={cx(
            "inline-flex items-stretch gap-1 rounded-[43px] bg-neutral-700 p-1 supports-[backdrop-filter:blur(0)]:bg-white/23 supports-[backdrop-filter:blur(0)]:backdrop-blur-[30.5px]",
            className,
        )}
    >
        <div className={cx(segment, "h-[33px] gap-[6.5px] rounded-[17px] px-1.5 text-white")}>
            <AriaButton aria-label={rotateLeftLabel} onPress={onRotateLeft} className={cx(focusRing, "rounded-sm")}>
                <Rotate02Icon aria-hidden="true" className="size-5" />
            </AriaButton>
            <span aria-hidden="true" className="h-[31px] w-px bg-white/18" />
            <AriaButton aria-label={rotateRightLabel} onPress={onRotateRight} className={cx(focusRing, "rounded-sm")}>
                <Rotate02Icon aria-hidden="true" className="size-5 -scale-x-100" />
            </AriaButton>
        </div>

        <div className={cx(segment, "gap-1 rounded-[31px] p-[5px] backdrop-blur-[40px]")}>
            <AriaSlider aria-label={zoomLabel} value={zoom} onChange={onZoomChange} minValue={minZoom} maxValue={maxZoom} step={zoomStep}>
                {/* The track is inset by the thumb radius so the thumb never leaves the drawn pill. */}
                <AriaSliderTrack className="relative mx-[10.5px] h-[21px] w-[167px] before:absolute before:-inset-x-[10.5px] before:inset-y-0 before:rounded-[10.5px] before:border before:border-white/44 before:bg-black/22">
                    <AriaSliderThumb className="top-1/2 size-[17px] cursor-grab rounded-full bg-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 dragging:cursor-grabbing" />
                </AriaSliderTrack>
            </AriaSlider>
            <AriaButton
                onPress={onReset}
                isDisabled={isResetDisabled}
                className={cx(
                    focusRing,
                    "flex h-[21px] items-center rounded-[18px] bg-white/22 px-[7px] text-sm leading-[1.6] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50",
                )}
            >
                {resetLabel}
            </AriaButton>
        </div>

        <GlassPill variant="light" onPress={onReupload}>
            {reuploadLabel}
        </GlassPill>
    </div>
);
