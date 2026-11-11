"use client";

import { Button as AriaButton, Slider as AriaSlider, SliderThumb as AriaSliderThumb, SliderTrack as AriaSliderTrack } from "react-aria-components";
import { GlassPill } from "@/components/application/headshot/glass-pill";
import { Rotate02Icon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

const focusRing = "cursor-pointer outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
const segment = "flex items-center border border-white/9";

// `sm` is Figma's phone toolbar (14881:11187): the desktop pills scaled ×1.21, split into two free-standing
// frosted pills (zoom + Reset first, rotate after), no outer frame and no Re-Upload pill.
// `responsive` spells both out per breakpoint so Tailwind sees every class.
const sizes = {
    md: {
        root: "inline-flex gap-1 rounded-[43px] bg-neutral-700 p-1 supports-[backdrop-filter:blur(0)]:bg-white/23 supports-[backdrop-filter:blur(0)]:backdrop-blur-[30.5px]",
        rotate: "h-[33px] gap-[6.5px] rounded-[17px] bg-white/12 px-1.5",
        icon: "size-5",
        zoom: "gap-1 rounded-[31px] bg-white/12 p-[5px] backdrop-blur-[40px]",
        slider: "",
        track: "mx-[10.5px] h-[21px] w-[167px] before:-inset-x-[10.5px] before:rounded-[10.5px]",
        thumb: "size-[17px]",
        reset: "h-[21px] rounded-[18px] px-[7px] text-sm",
        reupload: "",
    },
    sm: {
        root: "flex w-full gap-[5px]",
        rotate: "order-last h-10 gap-[8.5px] rounded-[20.6px] bg-white/40 px-[7.3px] backdrop-blur-[17px]",
        icon: "size-[24.2px]",
        zoom: "h-10 min-w-0 flex-1 gap-[5px] rounded-[37.6px] bg-white/40 p-[7.3px] backdrop-blur-[50px]",
        slider: "min-w-0 flex-1",
        track: "mx-[12.7px] h-[25.5px] before:-inset-x-[12.7px] before:rounded-[12.7px]",
        thumb: "size-[20.6px]",
        reset: "h-[25.5px] rounded-[21.8px] px-[8.5px] text-[17px]",
        reupload: "hidden",
    },
    responsive: {
        root: "flex w-full gap-[5px] md:inline-flex md:w-auto md:gap-1 md:rounded-[43px] md:bg-neutral-700 md:p-1 md:supports-[backdrop-filter:blur(0)]:bg-white/23 md:supports-[backdrop-filter:blur(0)]:backdrop-blur-[30.5px]",
        rotate: "order-last h-10 gap-[8.5px] rounded-[20.6px] bg-white/40 px-[7.3px] backdrop-blur-[17px] md:order-none md:h-[33px] md:gap-[6.5px] md:rounded-[17px] md:bg-white/12 md:px-1.5 md:backdrop-blur-none",
        icon: "size-[24.2px] md:size-5",
        zoom: "h-10 min-w-0 flex-1 gap-[5px] rounded-[37.6px] bg-white/40 p-[7.3px] backdrop-blur-[50px] md:h-auto md:flex-none md:gap-1 md:rounded-[31px] md:bg-white/12 md:p-[5px] md:backdrop-blur-[40px]",
        slider: "min-w-0 flex-1 md:flex-none",
        track: "mx-[12.7px] h-[25.5px] before:-inset-x-[12.7px] before:rounded-[12.7px] md:mx-[10.5px] md:h-[21px] md:w-[167px] md:before:-inset-x-[10.5px] md:before:rounded-[10.5px]",
        thumb: "size-[20.6px] md:size-[17px]",
        reset: "h-[25.5px] rounded-[21.8px] px-[8.5px] text-[17px] md:h-[21px] md:rounded-[18px] md:px-[7px] md:text-sm",
        reupload: "max-md:hidden",
    },
};

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
    /** Shows the Re-Upload pill (desktop only: the phone layout leaves Re-Upload to the screen's bottom bar). */
    onReupload?: () => void;
    /** `md`: one frosted toolbar (desktop). `sm`: Figma's phone layout, two full-width pills. `responsive`: `sm` below the `md` breakpoint. @default "md" */
    size?: "md" | "sm" | "responsive";
    /** Accessible name of the toolbar group. @default "Crop controls" */
    label?: string;
    /** @default "Rotate left" */
    rotateLeftLabel?: string;
    /** @default "Rotate right" */
    rotateRightLabel?: string;
    /** @default "Zoom" */
    zoomLabel?: string;
    /** @default "Reset" */
    resetLabel?: string;
    /** @default "Re-Upload" */
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
    size = "md",
    label = "Crop controls",
    rotateLeftLabel = "Rotate left",
    rotateRightLabel = "Rotate right",
    zoomLabel = "Zoom",
    resetLabel = "Reset",
    reuploadLabel = "Re-Upload",
    className,
}: CropToolbarProps) => {
    const s = sizes[size];

    return (
        // It sits on photos and dark crop surfaces, where the brand focus ring is too faint: white instead.
        <div role="group" aria-label={label} className={cx("items-stretch [--color-focus-ring:var(--color-white)]", s.root, className)}>
            <div className={cx(segment, s.rotate, "text-white")}>
                <AriaButton aria-label={rotateLeftLabel} onPress={onRotateLeft} className={cx(focusRing, "rounded-sm")}>
                    <Rotate02Icon aria-hidden="true" className={s.icon} />
                </AriaButton>
                <span aria-hidden="true" className="w-px self-stretch bg-white/18" />
                <AriaButton aria-label={rotateRightLabel} onPress={onRotateRight} className={cx(focusRing, "rounded-sm")}>
                    <Rotate02Icon aria-hidden="true" className={cx(s.icon, "-scale-x-100")} />
                </AriaButton>
            </div>

            <div className={cx(segment, s.zoom)}>
                <AriaSlider
                    aria-label={zoomLabel}
                    value={zoom}
                    onChange={onZoomChange}
                    minValue={minZoom}
                    maxValue={maxZoom}
                    step={zoomStep}
                    className={s.slider}
                >
                    {/* The track is inset by the thumb radius so the thumb never leaves the drawn pill. */}
                    <AriaSliderTrack
                        className={cx("relative before:absolute before:inset-y-0 before:border before:border-white/44 before:bg-black/22", s.track)}
                    >
                        <AriaSliderThumb
                            className={cx(
                                "top-1/2 cursor-grab rounded-full bg-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 dragging:cursor-grabbing",
                                s.thumb,
                            )}
                        />
                    </AriaSliderTrack>
                </AriaSlider>
                <AriaButton
                    onPress={onReset}
                    isDisabled={isResetDisabled}
                    className={cx(
                        focusRing,
                        "flex shrink-0 items-center bg-white/22 leading-[1.6] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50",
                        s.reset,
                    )}
                >
                    {resetLabel}
                </AriaButton>
            </div>

            {onReupload && (
                <GlassPill variant="light" onPress={onReupload} className={s.reupload}>
                    {reuploadLabel}
                </GlassPill>
            )}
        </div>
    );
};
