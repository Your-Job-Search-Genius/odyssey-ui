"use client";

import type { RadioGroupProps as AriaRadioGroupProps, RadioProps as AriaRadioProps } from "react-aria-components";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

export interface OptionTileGroupProps extends Omit<AriaRadioGroupProps, "className"> {
    className?: string;
}

/**
 * Single-choice group of option tiles (hair style, hair texture, eyewear). Arrow keys move the
 * selection. Name it with `aria-label`/`aria-labelledby`. Wraps a `Carousel` fine: pass
 * `className="block"` and put the tiles inside `Carousel.Item`s.
 */
export const OptionTileGroup = ({ className, ...props }: OptionTileGroupProps) => (
    <AriaRadioGroup orientation="horizontal" {...props} className={cx("flex gap-[7px]", className)} />
);

export interface OptionTileProps extends Omit<AriaRadioProps, "children" | "className"> {
    /** Option name, shown in the chip and used as the accessible name. */
    label: string;
    /** Preview image; decorative unless `alt` is given (the label already names the option). */
    src?: string;
    alt?: string;
    className?: string;
}

export const OptionTile = ({ label, src, alt = "", className, ...props }: OptionTileProps) => (
    <AriaRadio
        {...props}
        className={({ isSelected, isFocusVisible, isDisabled }) =>
            cx(
                "flex h-[141px] w-[109px] shrink-0 cursor-pointer overflow-hidden rounded-[10px] border bg-primary outline-focus-ring transition duration-100 ease-linear",
                isSelected ? "border-brand-solid p-px" : "border-[#F2F2F2] hover:border-primary dark:border-secondary",
                isFocusVisible && "outline-2 outline-offset-2",
                isDisabled && "cursor-not-allowed opacity-50",
                className,
            )
        }
    >
        {({ isSelected }) => (
            <span
                className={cx(
                    "relative flex size-full flex-col justify-end overflow-hidden rounded-[9px] p-[5px]",
                    isSelected && "bg-linear-to-b from-[#F7F7F7] to-white to-78%",
                )}
            >
                {src && (
                    <img
                        src={src}
                        alt={alt}
                        className={cx(
                            "absolute top-2 left-2 h-[calc(100%-33px)] w-[calc(100%-16px)] object-contain",
                            isSelected && "[mask-image:linear-gradient(to_bottom,black_34%,transparent_73%)]",
                        )}
                    />
                )}
                <Badge type="option" className="relative self-start">
                    {label}
                </Badge>
            </span>
        )}
    </AriaRadio>
);
