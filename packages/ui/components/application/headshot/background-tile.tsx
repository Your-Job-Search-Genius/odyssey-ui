"use client";

import type { CSSProperties } from "react";
import type { RadioGroupProps as AriaRadioGroupProps, RadioProps as AriaRadioProps } from "react-aria-components";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface BackgroundTileGroupProps extends Omit<AriaRadioGroupProps, "className"> {
    className?: string;
}

/** Single-choice grid of background tiles (3 columns of 77px). Name it with `aria-label`/`aria-labelledby`. */
export const BackgroundTileGroup = ({ className, ...props }: BackgroundTileGroupProps) => (
    <AriaRadioGroup {...props} className={cx("grid grid-cols-[repeat(3,77px)] gap-2", className)} />
);

export interface BackgroundTileProps extends Omit<AriaRadioProps, "children" | "className"> {
    /** Background name, shown under the thumbnail and used as the accessible name. */
    label: string;
    /** Thumbnail photo. Decorative: the label names the option. */
    src?: string;
    /** CSS `background` for swatch-style options without a photo, e.g. a gradient. */
    swatch?: CSSProperties["background"];
    className?: string;
}

export const BackgroundTile = ({ label, src, swatch, className, ...props }: BackgroundTileProps) => (
    <AriaRadio
        {...props}
        className={({ isSelected, isFocusVisible, isDisabled }) =>
            cx(
                "flex w-[77px] cursor-pointer flex-col overflow-hidden rounded-xl border-2 outline-focus-ring transition duration-100 ease-linear",
                isSelected ? "border-brand-solid shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]" : "border-transparent",
                isFocusVisible && "outline-2 outline-offset-2",
                isDisabled && "cursor-not-allowed opacity-50",
                className,
            )
        }
    >
        <span className="block h-12 w-full overflow-hidden" style={{ background: swatch }}>
            {src && <img src={src} alt="" className="size-full object-cover" />}
        </span>
        {/* The strip is always white (it sits on the dark picker), so its text colour is fixed too. */}
        <span className="truncate bg-white px-1 py-1 text-center text-xs/[15px] font-medium text-[#364153]">{label}</span>
    </AriaRadio>
);
