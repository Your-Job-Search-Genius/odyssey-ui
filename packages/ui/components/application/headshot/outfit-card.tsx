"use client";

import type { ReactNode } from "react";
import type { ToggleButtonProps as AriaToggleButtonProps } from "react-aria-components";
import { ToggleButton as AriaToggleButton } from "react-aria-components";
import { CheckmarkCircle02Icon } from "@/components/foundations/hugeicons";
import { cx, sortCx } from "@/utils/cx";

// `md` is the 240px desktop card; `sm` the 178px phone card; `responsive` is `sm` below `md` and `md` from it.
const sizes = sortCx({
    md: {
        root: "gap-1.5",
        photo: "rounded-xl",
        row: "right-[13px] bottom-[11px] left-3.5",
        label: "gap-[7px] text-sm",
        thumb: "h-6 w-[27px] rounded-[3px]",
        check: "size-4",
        caption: "text-sm",
    },
    sm: {
        root: "gap-1",
        photo: "rounded-[9px]",
        row: "right-2 bottom-2 left-2.5",
        label: "gap-[5px] text-[10px]/[15px]",
        thumb: "h-[18px] w-5 rounded-[2px]",
        check: "size-[18px]",
        caption: "text-[13px]/[15px]",
    },
    responsive: {
        root: "gap-1 md:gap-1.5",
        photo: "rounded-[9px] md:rounded-xl",
        row: "right-2 bottom-2 left-2.5 md:right-[13px] md:bottom-[11px] md:left-3.5",
        label: "gap-[5px] text-[10px]/[15px] md:gap-[7px] md:text-sm",
        thumb: "h-[18px] w-5 rounded-[2px] md:h-6 md:w-[27px] md:rounded-[3px]",
        check: "size-[18px] md:size-4",
        caption: "text-[13px]/[15px] md:text-sm",
    },
});

export interface OutfitCardProps extends Omit<AriaToggleButtonProps, "children" | "className"> {
    /** Outfit photo; decorative unless `alt` is given (the caption already names the outfit). */
    src: string;
    alt?: string;
    /** Outfit name under the photo; the toggle's accessible name. */
    caption: ReactNode;
    /** Shown over the photo while selected, e.g. "Background:" (or "Bgd." on narrow cards). @default "Background:" */
    backgroundLabel?: ReactNode;
    /** Thumbnail of the chosen background, shown after `backgroundLabel` while selected. */
    backgroundSrc?: string;
    /**
     * `md` is the 240px desktop card (14px caption); `sm` is the 178px phone card (13/15 caption, 10px label,
     * 20×18 thumbnail, 18px check); `responsive` is `sm` below the `md` breakpoint and `md` from it.
     * @default "md"
     */
    size?: keyof typeof sizes;
    className?: string;
}

/**
 * A multi-select outfit toggle (`aria-pressed`). Selected: a dark fade at the bottom of the photo
 * with the chosen background and a check. Set `isDisabled` once the selection limit is reached;
 * the card then dims to 30% as drawn.
 */
export const OutfitCard = ({ src, alt = "", caption, backgroundLabel = "Background:", backgroundSrc, size = "md", className, ...props }: OutfitCardProps) => {
    const s = sizes[size];

    return (
        <AriaToggleButton
            {...props}
            className={({ isDisabled }) =>
                cx("group flex w-full cursor-pointer flex-col text-left outline-hidden", s.root, isDisabled && "cursor-not-allowed opacity-30", className)
            }
        >
            {({ isSelected, isFocusVisible }) => (
                <>
                    <span
                        className={cx(
                            "relative block aspect-[4/5] w-full overflow-hidden outline-focus-ring",
                            s.photo,
                            isFocusVisible && "outline-2 outline-offset-2",
                        )}
                    >
                        <img src={src} alt={alt} className="size-full object-cover" />
                        {isSelected && (
                            <>
                                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[24%] bg-linear-to-t from-black/50 to-black/0 to-77%" />
                                <span className={cx("absolute flex items-center justify-between gap-2", s.row)}>
                                    <span className={cx("flex min-w-0 items-center font-medium text-white", s.label)}>
                                        {backgroundLabel}
                                        {backgroundSrc && (
                                            <img src={backgroundSrc} alt="" className={cx("shrink-0 border border-white object-cover", s.thumb)} />
                                        )}
                                    </span>
                                    <CheckmarkCircle02Icon aria-hidden="true" className={cx("shrink-0 text-white", s.check)} />
                                </span>
                            </>
                        )}
                    </span>
                    <span className={cx("font-medium text-primary", s.caption)}>{caption}</span>
                </>
            )}
        </AriaToggleButton>
    );
};
