"use client";

import type { ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps, ColorSwatchPickerProps as AriaColorSwatchPickerProps } from "react-aria-components";
import { ColorSwatchPicker as AriaColorSwatchPicker, ColorSwatchPickerItem as AriaColorSwatchPickerItem, parseColor, useLocale } from "react-aria-components";
import { ColorSwatch } from "@/components/base/color-picker/color-swatch";
import { Check } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";

export interface ColorSwatchPickerProps extends AriaColorSwatchPickerProps {
    /** Class name applied to the root element. */
    className?: string;
}

/**
 * A ColorSwatchPicker displays a list of color swatches and allows a user to
 * select one of them.
 */
export const ColorSwatchPicker = ({ className, layout = "grid", ...props }: ColorSwatchPickerProps) => {
    return <AriaColorSwatchPicker {...props} layout={layout} className={cx("flex flex-wrap gap-2", layout === "stack" && "flex-col", className)} />;
};

ColorSwatchPicker.displayName = "ColorSwatchPicker";

export interface ColorSwatchPickerItemProps extends AriaColorSwatchPickerItemProps {
    /** Overrides the auto-generated color name used as the item's accessible name. */
    "aria-label"?: string;
    /** Class name applied to the root element. */
    className?: string;
}

export const ColorSwatchPickerItem = ({ className, color, "aria-label": ariaLabel, ...props }: ColorSwatchPickerItemProps) => {
    const { locale } = useLocale();

    // `ListBoxItem` (which this renders as) only gets an accessible name from
    // an explicit `aria-label` — it does not derive one from descendant
    // content the way a native `<button>` would, so without this the option
    // would announce nothing. Computed up front (rather than relying on the
    // nested `ColorSwatch`'s own auto-generated description) so the name is
    // never at the mercy of screen reader/browser differences in how "name
    // from content" traverses a nested `role="img"`.
    const parsedColor = typeof color === "string" ? parseColor(color) : (color ?? parseColor("#0000"));

    return (
        <AriaColorSwatchPickerItem
            {...props}
            color={color}
            aria-label={ariaLabel ?? parsedColor.getColorName(locale)}
            className={({ isFocusVisible, isSelected, isDisabled }) =>
                cx(
                    "relative w-fit cursor-pointer rounded-md outline-hidden",
                    isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                    isSelected && "ring-2 ring-fg-primary ring-offset-2 ring-offset-bg-primary",
                    isDisabled && "cursor-not-allowed opacity-40",
                    className,
                )
            }
        >
            {({ isSelected }) => (
                <>
                    <ColorSwatch aria-hidden="true" />
                    {isSelected && (
                        <Check aria-hidden="true" className="absolute inset-0 m-auto size-4 rounded-full bg-primary p-0.5 text-fg-brand-primary shadow-sm" />
                    )}
                </>
            )}
        </AriaColorSwatchPickerItem>
    );
};

ColorSwatchPickerItem.displayName = "ColorSwatchPickerItem";
