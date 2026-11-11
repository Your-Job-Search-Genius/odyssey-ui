"use client";

import { type ReactNode, createContext, useContext } from "react";
import type { ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps, ColorSwatchPickerProps as AriaColorSwatchPickerProps } from "react-aria-components";
import { ColorSwatchPicker as AriaColorSwatchPicker, ColorSwatchPickerItem as AriaColorSwatchPickerItem, parseColor, useLocale } from "react-aria-components";
import { ColorSwatch } from "@/components/base/color-picker/color-swatch";
import { cx } from "@/utils/cx";

// "tile" is the phone hair-colour grid: each swatch in a bordered tile with its label.
const SizeContext = createContext<"md" | "lg" | "tile">("md");

export interface ColorSwatchPickerProps extends Omit<AriaColorSwatchPickerProps, "layout"> {
    /**
     * `"grid"` / `"stack"` as in React Aria. `"tile"`: the phone grid, three columns of bordered tiles (41px circle over a
     * 14px label); the selected tile gets a brand border and the centre dot. `size` is ignored for tiles.
     * @default "grid"
     */
    layout?: AriaColorSwatchPickerProps["layout"] | "tile";
    /**
     * `"md"`: 36px circles in a wrapping row; the selected one shows a centre dot.
     * `"lg"`: 48px discs inside a 2px ring that turns violet when selected, in a grid of equal columns.
     * @default "md"
     */
    size?: "md" | "lg";
    /** Class name applied to the root element. */
    className?: string;
}

/**
 * A ColorSwatchPicker displays a list of color swatches and allows a user to
 * select one of them.
 */
export const ColorSwatchPicker = ({ className, layout = "grid", size = "md", ...props }: ColorSwatchPickerProps) => {
    return (
        <SizeContext.Provider value={layout === "tile" ? "tile" : size}>
            <AriaColorSwatchPicker
                {...props}
                layout={layout === "tile" ? "grid" : layout}
                className={cx(
                    layout === "tile"
                        ? "grid w-full grid-cols-3 gap-1"
                        : size === "md"
                          ? "flex flex-wrap gap-5"
                          : "grid grid-cols-[repeat(auto-fill,minmax(62px,1fr))] justify-items-center gap-x-6 gap-y-4",
                    layout === "stack" && "flex flex-col",
                    className,
                )}
            />
        </SizeContext.Provider>
    );
};

ColorSwatchPicker.displayName = "ColorSwatchPicker";

export interface ColorSwatchPickerItemProps extends AriaColorSwatchPickerItemProps {
    /** Overrides the accessible name. Defaults to `label` when it is a string, else the auto-generated color name. */
    "aria-label"?: string;
    /** Visible label under the swatch. */
    label?: ReactNode;
    /** CSS `background` painted instead of the flat `color` (e.g. a radial gradient). `color` stays the value. */
    fill?: string;
    /** Class name applied to the root element. */
    className?: string;
}

export const ColorSwatchPickerItem = ({ className, color, label, fill, "aria-label": ariaLabel, ...props }: ColorSwatchPickerItemProps) => {
    const { locale } = useLocale();
    const size = useContext(SizeContext);

    // `ListBoxItem` (which this renders as) only gets an accessible name from
    // an explicit `aria-label` — it does not derive one from descendant
    // content the way a native `<button>` would, so without this the option
    // would announce nothing. Computed up front (rather than relying on the
    // nested `ColorSwatch`'s own auto-generated description) so the name is
    // never at the mercy of screen reader/browser differences in how "name
    // from content" traverses a nested `role="img"`.
    const parsedColor = typeof color === "string" ? parseColor(color) : (color ?? parseColor("#0000"));

    // Light swatches get a dark centre dot (a white one would fall under 3:1) and keep their border when selected.
    const rgb = parsedColor.toFormat("rgb");
    const [r, g, b] = (["red", "green", "blue"] as const).map((channel) => {
        const c = rgb.getChannelValue(channel) / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const isLight = 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3;

    return (
        <AriaColorSwatchPickerItem
            {...props}
            color={color}
            aria-label={ariaLabel ?? (typeof label === "string" ? label : parsedColor.getColorName(locale))}
            className={({ isDisabled, isSelected, isFocusVisible }) =>
                cx(
                    "flex w-fit cursor-pointer flex-col items-center outline-hidden",
                    size === "md" ? "gap-1.5" : "gap-2",
                    size === "tile" &&
                        "w-full gap-[7px] rounded-[11px] border border-tertiary bg-primary px-1 py-[15px] outline-focus-ring transition duration-100 ease-linear",
                    size === "tile" && isSelected && "border-brand-500",
                    size === "tile" && isFocusVisible && "outline-2 outline-offset-2",
                    isDisabled && "cursor-not-allowed opacity-50",
                    className,
                )
            }
        >
            {({ isSelected, isFocusVisible }) => (
                <>
                    {size !== "lg" ? (
                        <span className={cx("relative flex rounded-full", size === "md" && isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring")}>
                            <ColorSwatch
                                aria-hidden="true"
                                // Tiles outline only light swatches (Figma: White); the circles keep it when selected for contrast.
                                className={cx(size === "tile" && "size-[41px]", (isSelected || size === "tile") && !isLight && "ring-0")}
                                style={fill ? { background: fill } : undefined}
                            />
                            {isSelected && <span className={cx("absolute inset-0 m-auto size-2 rounded-full", isLight ? "bg-[#101419]" : "bg-white")} />}
                        </span>
                    ) : (
                        <span
                            className={cx(
                                // The 2px ring paints outside the 56px box, as Figma's outside stroke does.
                                "rounded-full p-1 ring-2 ring-bg-primary",
                                // Figma specs #5215FF but renders it as ~#9083FF (sampled average of the ring); the render wins.
                                isSelected && "ring-[#9083FF]",
                                isFocusVisible && "outline-2 outline-offset-4 outline-focus-ring",
                            )}
                        >
                            <ColorSwatch aria-hidden="true" className="size-12 ring-0" style={fill ? { background: fill } : undefined} />
                        </span>
                    )}
                    {label && (
                        <span
                            className={cx(
                                // Size before leading: tailwind-merge drops a leading-* that precedes a text-size class.
                                size === "md" ? "text-[11px]" : size === "tile" ? "text-sm font-medium" : "text-xs",
                                "leading-[normal] whitespace-nowrap",
                                size === "tile" ? "text-primary" : "text-tertiary",
                                size === "lg" && isSelected && "font-medium text-primary",
                            )}
                        >
                            {label}
                        </span>
                    )}
                </>
            )}
        </AriaColorSwatchPickerItem>
    );
};

ColorSwatchPickerItem.displayName = "ColorSwatchPickerItem";
