"use client";

import type { RadioGroupProps as AriaRadioGroupProps, RadioProps as AriaRadioProps } from "react-aria-components";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { CheckmarkCircle02Icon } from "@/components/foundations/hugeicons";
import { cx, sortCx } from "@/utils/cx";

type Size = "md" | "sm" | "responsive";

const groupGaps = { md: "gap-3", sm: "gap-2", responsive: "gap-2 md:gap-3" };

// The portrait keeps about the same size on both cards (176×264 vs 173×260), so the phone card crops more of it.
const sizes = sortCx({
    md: {
        root: "aspect-[197/261] pb-4",
        img: "top-[10.3%] left-[5.6%] h-[101%] w-[89.3%] [mask-image:radial-gradient(51%_34%_at_50%_29%,black_58%,rgba(0,0,0,0.5)_100%,transparent_142%)]",
    },
    sm: {
        root: "aspect-[181/216] pb-2",
        img: "top-[4.2%] left-[3.3%] h-[120.4%] w-[95.6%] [mask-image:radial-gradient(51%_34%_at_49%_27.5%,black_58%,rgba(0,0,0,0.5)_100%,transparent_142%)]",
    },
    responsive: {
        root: "aspect-[181/216] pb-2 md:aspect-[197/261] md:pb-4",
        img: "top-[4.2%] left-[3.3%] h-[120.4%] w-[95.6%] [mask-image:radial-gradient(51%_34%_at_49%_27.5%,black_58%,rgba(0,0,0,0.5)_100%,transparent_142%)] md:top-[10.3%] md:left-[5.6%] md:h-[101%] md:w-[89.3%] md:[mask-image:radial-gradient(51%_34%_at_50%_29%,black_58%,rgba(0,0,0,0.5)_100%,transparent_142%)]",
    },
});

export interface ModelCardGroupProps extends Omit<AriaRadioGroupProps, "className"> {
    /** Grid gap: 12px (`md`), 8px (`sm`, phone), or 8px below `md` and 12px from it (`responsive`). @default "md" */
    size?: Size;
    className?: string;
}

/** Single-choice grid of model cards for the dark model picker. Name it with `aria-label`/`aria-labelledby`. */
export const ModelCardGroup = ({ size = "md", className, ...props }: ModelCardGroupProps) => (
    <AriaRadioGroup {...props} className={cx("grid grid-cols-2 sm:grid-cols-4", groupGaps[size], className)} />
);

export interface ModelCardProps extends Omit<AriaRadioProps, "children" | "className"> {
    /** Model name, shown under the portrait and used as the accessible name. */
    name: string;
    /** Portrait; decorative unless `alt` is given (the name already labels the card). */
    src: string;
    alt?: string;
    /** `md`: the 197×261 desktop card; `sm`: the 181×216 phone card; `responsive`: `sm` below `md`, `md` from it. @default "md" */
    size?: Size;
    className?: string;
}

/**
 * A model portrait on the dark picker surface. The portrait dissolves into the card through a soft
 * radial mask; the selected card turns light blue with an inner white glow and a check badge.
 * Colours are fixed because the picker shell is always dark.
 */
export const ModelCard = ({ name, src, alt = "", size = "md", className, ...props }: ModelCardProps) => (
    <AriaRadio
        {...props}
        className={({ isSelected, isFocusVisible, isDisabled }) =>
            cx(
                "relative isolate flex w-full cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[20px] border outline-focus-ring transition duration-100 ease-linear",
                sizes[size].root,
                isSelected ? "border-transparent bg-[#BCE1FB]" : "border-[#5E5E5E] bg-[#545454] hover:border-[#7A7A7A]",
                isFocusVisible && "outline-2 outline-offset-2",
                isDisabled && "cursor-not-allowed opacity-50",
                className,
            )
        }
    >
        {({ isSelected }) => (
            <>
                <img src={src} alt={alt} className={cx("absolute -z-10 object-cover", sizes[size].img)} />
                {isSelected && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_34px_white]" />}
                <span className={cx("relative text-sm/[normal] font-semibold", isSelected ? "text-[#101419]" : "text-white")}>{name}</span>
                {isSelected && <CheckmarkCircle02Icon aria-hidden="true" className="absolute top-2 right-2 size-6 text-[#101419]" />}
            </>
        )}
    </AriaRadio>
);
