"use client";

import type { CSSProperties } from "react";
import type { RadioGroupProps as AriaRadioGroupProps, RadioProps as AriaRadioProps } from "react-aria-components";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";

type Size = "md" | "sm" | "responsive";

// Desktop: 3 columns of 77px in the picker's side panel. Phone: 4 fluid columns (86px at 402px wide), gaps 3/9.
const groupSizes = {
    md: "grid-cols-[repeat(3,77px)] gap-2",
    sm: "grid-cols-4 gap-x-[3px] gap-y-[9px]",
    responsive: "grid-cols-4 gap-x-[3px] gap-y-[9px] md:grid-cols-[repeat(3,77px)] md:gap-2",
};

const sizes = sortCx({
    md: {
        root: "w-[77px] rounded-xl",
        selected: "border-brand-solid shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]",
        thumb: "h-12",
        label: "py-1 text-xs/[15px]",
    },
    sm: {
        root: "w-full rounded-[14px]",
        selected: "border-brand-200 shadow-[0_5px_7px_-1px_rgba(0,0,0,0.1),0_2px_5px_-2px_rgba(0,0,0,0.1)]",
        thumb: "h-[55px]",
        label: "py-[5px] text-sm/[17px]",
    },
    responsive: {
        root: "w-full rounded-[14px] md:w-[77px] md:rounded-xl",
        selected:
            "border-brand-200 shadow-[0_5px_7px_-1px_rgba(0,0,0,0.1),0_2px_5px_-2px_rgba(0,0,0,0.1)] md:border-brand-solid md:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]",
        thumb: "h-[55px] md:h-12",
        label: "py-[5px] text-sm/[17px] md:py-1 md:text-xs/[15px]",
    },
});

export interface BackgroundTileGroupProps extends Omit<AriaRadioGroupProps, "className"> {
    /** `md`: 3 columns of 77px (desktop); `sm`: 4 fluid columns (phone); `responsive`: `sm` below `md`. @default "md" */
    size?: Size;
    className?: string;
}

/** Single-choice grid of background tiles (3 columns of 77px; 4 fluid columns on phones). Name it with `aria-label`/`aria-labelledby`. */
export const BackgroundTileGroup = ({ size = "md", className, ...props }: BackgroundTileGroupProps) => (
    <AriaRadioGroup {...props} className={cx("grid", groupSizes[size], className)} />
);

export interface BackgroundTileProps extends Omit<AriaRadioProps, "children" | "className"> {
    /** Background name, shown under the thumbnail and used as the accessible name. */
    label: string;
    /** Thumbnail photo. Decorative: the label names the option. */
    src?: string;
    /** CSS `background` for swatch-style options without a photo, e.g. a gradient. */
    swatch?: CSSProperties["background"];
    /** `md`: the 77px desktop tile; `sm`: the phone tile (fills its column, 55px thumbnail, 14px label); `responsive`: `sm` below `md`. @default "md" */
    size?: Size;
    className?: string;
}

export const BackgroundTile = ({ label, src, swatch, size = "md", className, ...props }: BackgroundTileProps) => (
    <AriaRadio
        {...props}
        className={({ isSelected, isFocusVisible, isDisabled }) =>
            cx(
                // relative: keeps React Aria's visually hidden radio input inside the tile. Otherwise it sits against an outer
                // ancestor, at the tile's unscrolled spot, so in a long scrolling list focusing it (any click) scrolled the
                // dialog to it and the content out of view.
                "relative flex cursor-pointer flex-col overflow-hidden border-2 outline-focus-ring transition duration-100 ease-linear",
                sizes[size].root,
                isSelected ? sizes[size].selected : "border-transparent",
                isFocusVisible && "outline-2 outline-offset-2",
                isDisabled && "cursor-not-allowed opacity-50",
                className,
            )
        }
    >
        <span className={cx("block w-full overflow-hidden", sizes[size].thumb)} style={{ background: swatch }}>
            {src && <img src={src} alt="" className="size-full object-cover" />}
        </span>
        {/* The strip is always white (it sits on the dark picker), so its text colour is fixed too. */}
        <span className={cx("truncate bg-white px-1 text-center font-medium text-[#364153]", sizes[size].label)}>{label}</span>
    </AriaRadio>
);
