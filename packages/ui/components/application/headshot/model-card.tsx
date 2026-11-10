"use client";

import type { RadioGroupProps as AriaRadioGroupProps, RadioProps as AriaRadioProps } from "react-aria-components";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { CheckmarkCircle02Icon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

export interface ModelCardGroupProps extends Omit<AriaRadioGroupProps, "className"> {
    className?: string;
}

/** Single-choice grid of model cards for the dark model picker. Name it with `aria-label`/`aria-labelledby`. */
export const ModelCardGroup = ({ className, ...props }: ModelCardGroupProps) => (
    <AriaRadioGroup {...props} className={cx("grid grid-cols-2 gap-3 sm:grid-cols-4", className)} />
);

export interface ModelCardProps extends Omit<AriaRadioProps, "children" | "className"> {
    /** Model name, shown under the portrait and used as the accessible name. */
    name: string;
    /** Portrait; decorative unless `alt` is given (the name already labels the card). */
    src: string;
    alt?: string;
    className?: string;
}

/**
 * A model portrait on the dark picker surface. The portrait dissolves into the card through a soft
 * radial mask; the selected card turns light blue with an inner white glow and a check badge.
 * Colours are fixed because the picker shell is always dark.
 */
export const ModelCard = ({ name, src, alt = "", className, ...props }: ModelCardProps) => (
    <AriaRadio
        {...props}
        className={({ isSelected, isFocusVisible, isDisabled }) =>
            cx(
                "relative isolate flex aspect-[197/261] w-full cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[20px] border pb-4 outline-focus-ring transition duration-100 ease-linear",
                isSelected ? "border-transparent bg-[#BCE1FB]" : "border-[#5E5E5E] bg-[#545454] hover:border-[#7A7A7A]",
                isFocusVisible && "outline-2 outline-offset-2",
                isDisabled && "cursor-not-allowed opacity-50",
                className,
            )
        }
    >
        {({ isSelected }) => (
            <>
                <img
                    src={src}
                    alt={alt}
                    className="absolute top-[10.3%] left-[5.6%] -z-10 h-[101%] w-[89.3%] [mask-image:radial-gradient(51%_34%_at_50%_29%,black_58%,rgba(0,0,0,0.5)_100%,transparent_142%)] object-cover"
                />
                {isSelected && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_34px_white]" />}
                <span className={cx("relative text-sm/[normal] font-semibold", isSelected ? "text-[#101419]" : "text-white")}>{name}</span>
                {isSelected && <CheckmarkCircle02Icon aria-hidden="true" className="absolute top-2 right-2 size-6 text-[#101419]" />}
            </>
        )}
    </AriaRadio>
);
