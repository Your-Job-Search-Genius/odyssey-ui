"use client";

import type { ReactNode } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface ShutterButtonProps extends Omit<AriaButtonProps, "children" | "className"> {
    className?: string;
    /** Accessible name. @default "Take photo" */
    label?: string;
    /** Visible hint under the button, e.g. "Click the button above to take photo". */
    caption?: ReactNode;
}

/** Round camera shutter for dark camera surfaces. */
export const ShutterButton = ({ label = "Take photo", caption, className, ...props }: ShutterButtonProps) => (
    <div className={cx("flex w-[205px] flex-col items-center gap-[13px]", className)}>
        <AriaButton
            {...props}
            aria-label={label}
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
                <path d="M14.11 8.86A33 33 0 0 1 54.32 8.81" stroke="white" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </AriaButton>
        {caption && <p className="text-center text-xs leading-[1.6] font-medium text-white">{caption}</p>}
    </div>
);
