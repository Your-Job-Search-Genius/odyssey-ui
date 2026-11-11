"use client";

import type { ReactNode } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { cx } from "@/utils/cx";

// The ring's four quarters, clockwise from the top: one per pose.
const quarters = [
    "M14.91 8.82A33 33 0 0 1 55.09 8.82",
    "M61.18 14.91A33 33 0 0 1 61.18 55.09",
    "M55.09 61.18A33 33 0 0 1 14.91 61.18",
    "M8.82 55.09A33 33 0 0 1 8.82 14.91",
];

export interface ShutterButtonProps extends Omit<AriaButtonProps, "children" | "className"> {
    className?: string;
    /** Accessible name. @default "Take photo" */
    label?: string;
    /** Visible hint under the button, e.g. "Click the button above to take photo". */
    caption?: ReactNode;
    /**
     * Pose progress on the ring (Figma webcam states): quarters before it are done (green), this one is white.
     * 0-3 for the four poses, 4 when all are done. Unset shows the plain ring with the top quarter lit.
     */
    currentStep?: number;
    /** Appended to the accessible name when `currentStep` is set. @default (step, total) => `photo ${step} of ${total}` */
    stepLabel?: (step: number, total: number) => string;
}

/** Round camera shutter for dark camera surfaces. */
export const ShutterButton = ({
    label = "Take photo",
    caption,
    currentStep,
    stepLabel = (step, total) => `photo ${step} of ${total}`,
    className,
    ...props
}: ShutterButtonProps) => {
    const step = currentStep ?? 0;

    return (
        // A dark camera surface: the brand focus ring is too faint there, so it is white.
        <div className={cx("flex w-[205px] flex-col items-center gap-[13px] [--color-focus-ring:var(--color-white)]", className)}>
            <AriaButton
                {...props}
                aria-label={currentStep === undefined ? label : `${label}, ${stepLabel(Math.min(step + 1, quarters.length), quarters.length)}`}
                className="-my-0.5 size-[70px] shrink-0 cursor-pointer rounded-full outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition motion-safe:duration-100 motion-safe:pressed:scale-95"
            >
                <svg aria-hidden="true" viewBox="0 0 70 70" fill="none" className="size-full">
                    <circle cx="35" cy="35" r="28" fill="white" />
                    <path
                        d="M61.18 14.91A33 33 0 0 1 68 35a33 33 0 0 1-6.82 20.09M55.09 8.82A33 33 0 0 0 35 2a33 33 0 0 0-20.09 6.82M8.82 14.91A33 33 0 0 0 2 35a33 33 0 0 0 6.82 20.09M14.91 61.18A33 33 0 0 0 35 68a33 33 0 0 0 20.09-6.82"
                        stroke="white"
                        strokeOpacity="0.38"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    {quarters.slice(0, step + 1).map((d, index) => (
                        <path key={d} d={d} className={index < step ? "stroke-[#32D583]" : "stroke-white"} strokeWidth="4" strokeLinecap="round" />
                    ))}
                </svg>
            </AriaButton>
            {caption && <p className="text-center text-xs leading-[1.6] font-medium text-white">{caption}</p>}
        </div>
    );
};
