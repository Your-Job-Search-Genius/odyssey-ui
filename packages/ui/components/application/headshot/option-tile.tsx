"use client";

import type { RadioGroupProps as AriaRadioGroupProps, RadioProps as AriaRadioProps } from "react-aria-components";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { CheckmarkCircle02Icon } from "@/components/foundations/hugeicons";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cx, sortCx } from "@/utils/cx";

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

// Figma: md 109×141 (persona rows), sm 137×177 (phone rows), lg 197×255 (Browse-all grid, fluid down to its column).
const styles = sortCx({
    md: {
        root: "h-[141px] w-[109px] rounded-[10px] border",
        selected: "p-px",
        inner: "rounded-[9px] p-[5px]",
        innerSelected: "bg-linear-to-b from-[#F7F7F7] to-white to-78%",
        chip: "",
    },
    sm: {
        root: "h-[177px] w-[137px] rounded-[13px] border",
        selected: "p-px",
        inner: "rounded-[12px] px-[7px] pb-2",
        innerSelected: "",
        chip: "rounded-[4px] p-1 text-[17px] leading-[22px]",
    },
    lg: {
        root: "aspect-[197/255] w-[197px] max-w-full rounded-[20px] border-2",
        selected: "",
        inner: "rounded-[18px] pb-[9px] pl-[7px]",
        innerSelected: "",
        chip: "px-[5px]",
    },
});

export interface OptionTileProps extends Omit<AriaRadioProps, "children" | "className"> {
    /** Option name, shown in the chip and used as the accessible name. */
    label: string;
    /** Preview image; decorative unless `alt` is given (the label already names the option). */
    src?: string;
    alt?: string;
    /**
     * `md` is the 109×141 persona tile; `sm` the 137×177 phone tile (17px chip); `lg` the 197×255 Browse-all tile
     * (16px chip, check mark when selected; shrinks to its column); `responsive` is `sm` below `md` and `md` above.
     * @default "md"
     */
    size?: "md" | "sm" | "lg" | "responsive";
    /** When the image fades out towards the chip: only on the selected tile, on every tile, or never. @default "selected" */
    fade?: "none" | "selected" | "always";
    /** Fade start and end, in % of the tile's height (opaque before the first, gone after the second). @default [34, 73] */
    fadeStops?: [number, number];
    className?: string;
}

export const OptionTile = ({ label, src, alt = "", size = "md", fade = "selected", fadeStops = [34, 73], className, ...props }: OptionTileProps) => {
    const isDesktop = useBreakpoint("md");
    const s = styles[size === "responsive" ? (isDesktop ? "md" : "sm") : size];

    return (
        <AriaRadio
            {...props}
            className={({ isSelected, isFocusVisible, isDisabled }) =>
                cx(
                    // relative: keeps React Aria's visually hidden radio input inside the tile. Otherwise it sits against an outer
                    // ancestor, at the tile's unscrolled spot, so in a long scrolling list focusing it (any click) scrolled the
                    // dialog to it and the content out of view.
                    "relative flex shrink-0 cursor-pointer overflow-hidden bg-primary outline-focus-ring transition duration-100 ease-linear",
                    s.root,
                    isSelected ? cx("border-brand-solid", s.selected) : "border-[#F2F2F2] hover:border-primary dark:border-secondary",
                    isFocusVisible && "outline-2 outline-offset-2",
                    isDisabled && "cursor-not-allowed opacity-50",
                    className,
                )
            }
        >
            {({ isSelected }) => (
                <span className={cx("relative flex size-full flex-col justify-end overflow-hidden", s.inner, isSelected && s.innerSelected)}>
                    {src && (
                        // Figma masks the whole tile, so the fade runs over the tile's height; the image box is the same share of every size.
                        <span
                            className="absolute inset-0"
                            style={
                                fade === "always" || (fade === "selected" && isSelected)
                                    ? { maskImage: `linear-gradient(to bottom, black ${fadeStops[0]}%, transparent ${fadeStops[1]}%)` }
                                    : undefined
                            }
                        >
                            <img src={src} alt={alt} className="absolute top-[8.5%] left-[18.3%] h-[71%] w-[67%] object-contain" />
                        </span>
                    )}
                    <Badge type="option" size={s === styles.lg ? "lg" : undefined} className={cx("relative self-start", s.chip)}>
                        {label}
                    </Badge>
                    {s === styles.lg && isSelected && (
                        <CheckmarkCircle02Icon aria-hidden="true" className="absolute right-1.5 bottom-[9px] size-6 text-fg-brand-primary" />
                    )}
                </span>
            )}
        </AriaRadio>
    );
};
