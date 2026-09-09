"use client";

import type { ReactNode } from "react";
import type { Color } from "react-aria-components";
import { Button as AriaButton, ColorPicker as AriaColorPicker, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { ColorArea } from "@/components/base/color-picker/color-area";
import { ColorField } from "@/components/base/color-picker/color-field";
import { ColorSlider } from "@/components/base/color-picker/color-slider";
import { ColorSwatch } from "@/components/base/color-picker/color-swatch";
import { HintText } from "@/components/base/input/hint-text";
import { ChevronDown } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";

export interface ColorPickerProps {
    /** Visible label for the trigger button. Also names the control for assistive tech. */
    label?: string;
    /** Helper text displayed below the trigger. */
    hint?: ReactNode;
    /** The current color (controlled). Pass a `Color` (via `parseColor`) or a color string. */
    value?: string | Color;
    /** The initial color (uncontrolled). Defaults to the brand color when neither `value` nor `defaultValue` is given. */
    defaultValue?: string | Color;
    /** Called on every change from any nested color component (area, sliders, field, ...). */
    onChange?: (color: Color) => void;
    /** Whether the picker is disabled. */
    isDisabled?: boolean;
    /** Popover content. Defaults to a saturation/brightness area, hue + alpha sliders, and a hex field. */
    children?: ReactNode;
    /** Class name applied to the trigger button. */
    className?: string;
}

/**
 * A ColorPicker synchronizes a color value between multiple nested color
 * components. The trigger opens a popover containing a `ColorArea`, hue and
 * alpha `ColorSlider`s, and a hex `ColorField` by default, or any custom
 * `children` you provide instead.
 */
export const ColorPicker = ({ label = "Color", hint, value, defaultValue, onChange, isDisabled, children, className }: ColorPickerProps) => {
    return (
        <div className="flex w-max flex-col gap-1.5">
            <AriaColorPicker value={value} defaultValue={value ? undefined : (defaultValue ?? "#7F56D9")} onChange={onChange}>
                <AriaDialogTrigger>
                    <AriaButton
                        isDisabled={isDisabled}
                        className={({ isFocusVisible, isPressed }) =>
                            cx(
                                "flex cursor-pointer items-center gap-2 rounded-lg bg-primary py-2 pr-3 pl-2.5 shadow-xs ring-1 ring-primary transition-shadow duration-100 ease-linear ring-inset",
                                isPressed && "bg-primary_hover",
                                isFocusVisible && "ring-2 ring-brand",
                                isDisabled && "cursor-not-allowed opacity-50",
                                className,
                            )
                        }
                    >
                        {/*
                            Wrapped (rather than passing `aria-hidden` to `ColorSwatch` directly)
                            because React Aria's `ColorSwatch` always renders its own
                            auto-generated color description as `aria-label` regardless — without
                            this wrapper that description would silently prefix the button's
                            accessible name instead of `label` alone naming it.
                        */}
                        <span aria-hidden="true">
                            <ColorSwatch className="size-5 rounded" />
                        </span>
                        <span className="text-sm font-medium text-secondary">{label}</span>
                        <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />
                    </AriaButton>

                    <AriaPopover
                        placement="bottom start"
                        offset={8}
                        className={({ isEntering, isExiting }) =>
                            cx(
                                "w-64 origin-(--trigger-anchor-point) rounded-xl bg-primary p-4 shadow-lg ring-1 ring-secondary_alt outline-hidden will-change-transform",
                                isEntering &&
                                    "duration-150 ease-out animate-in fade-in placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                                isExiting &&
                                    "duration-100 ease-in animate-out fade-out placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                            )
                        }
                    >
                        <div className="flex flex-col gap-4">
                            {children ?? (
                                <>
                                    <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" className="w-full" aria-label={label} />

                                    <div className="flex items-center gap-3">
                                        <ColorSwatch className="size-9 rounded-md" />
                                        <div className="flex flex-1 flex-col gap-3">
                                            <ColorSlider channel="hue" colorSpace="hsb" showValueLabel={false} aria-label="Hue" />
                                            <ColorSlider channel="alpha" colorSpace="hsb" showValueLabel={false} aria-label="Alpha" />
                                        </div>
                                    </div>

                                    <ColorField label="Hex" size="sm" />
                                </>
                            )}
                        </div>
                    </AriaPopover>
                </AriaDialogTrigger>
            </AriaColorPicker>

            {hint && <HintText>{hint}</HintText>}
        </div>
    );
};

ColorPicker.displayName = "ColorPicker";
