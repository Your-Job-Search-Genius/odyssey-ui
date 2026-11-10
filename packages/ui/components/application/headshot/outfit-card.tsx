"use client";

import type { ReactNode } from "react";
import type { ToggleButtonProps as AriaToggleButtonProps } from "react-aria-components";
import { ToggleButton as AriaToggleButton } from "react-aria-components";
import { CheckmarkCircle02Icon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

export interface OutfitCardProps extends Omit<AriaToggleButtonProps, "children" | "className"> {
    /** Outfit photo; decorative unless `alt` is given (the caption already names the outfit). */
    src: string;
    alt?: string;
    /** Outfit name under the photo; the toggle's accessible name. */
    caption: ReactNode;
    /** Shown over the photo while selected, e.g. "Background:" (or "Bgd." on narrow cards). */
    backgroundLabel?: ReactNode;
    /** Thumbnail of the chosen background, shown after `backgroundLabel` while selected. */
    backgroundSrc?: string;
    className?: string;
}

/**
 * A multi-select outfit toggle (`aria-pressed`). Selected: a dark fade at the bottom of the photo
 * with the chosen background and a check. Set `isDisabled` once the selection limit is reached;
 * the card then dims to 30% as drawn.
 */
export const OutfitCard = ({ src, alt = "", caption, backgroundLabel = "Background:", backgroundSrc, className, ...props }: OutfitCardProps) => (
    <AriaToggleButton
        {...props}
        className={({ isDisabled }) =>
            cx("group flex w-full cursor-pointer flex-col gap-1.5 text-left outline-hidden", isDisabled && "cursor-not-allowed opacity-30", className)
        }
    >
        {({ isSelected, isFocusVisible }) => (
            <>
                <span
                    className={cx(
                        "relative block aspect-[4/5] w-full overflow-hidden rounded-xl outline-focus-ring",
                        isFocusVisible && "outline-2 outline-offset-2",
                    )}
                >
                    <img src={src} alt={alt} className="size-full object-cover" />
                    {isSelected && (
                        <>
                            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[24%] bg-linear-to-t from-black/50 to-black/0 to-77%" />
                            <span className="absolute right-[13px] bottom-[11px] left-3.5 flex items-center justify-between gap-2">
                                <span className="flex min-w-0 items-center gap-[7px] text-sm font-medium text-white">
                                    {backgroundLabel}
                                    {backgroundSrc && (
                                        <img src={backgroundSrc} alt="" className="h-6 w-[27px] shrink-0 rounded-[3px] border border-white object-cover" />
                                    )}
                                </span>
                                <CheckmarkCircle02Icon aria-hidden="true" className="size-4 shrink-0 text-white" />
                            </span>
                        </>
                    )}
                </span>
                <span className="text-sm font-medium text-primary">{caption}</span>
            </>
        )}
    </AriaToggleButton>
);
