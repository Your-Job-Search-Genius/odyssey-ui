"use client";

import { useId, useState } from "react";
import type { Color } from "react-aria-components";
import { parseColor } from "react-aria-components";
import { ColorArea } from "@/components/base/color-picker/color-area";
import { ColorField } from "@/components/base/color-picker/color-field";
import { ColorPicker } from "@/components/base/color-picker/color-picker";
import { ColorSlider } from "@/components/base/color-picker/color-slider";
import { ColorSwatch } from "@/components/base/color-picker/color-swatch";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "@/components/base/color-picker/color-swatch-picker";

// ColorArea

export const ColorAreaDefault = () => {
    return <ColorArea defaultValue="hsb(280, 100%, 85%)" colorSpace="hsb" xChannel="saturation" yChannel="brightness" aria-label="Color area" />;
};

export const ColorAreaControlled = () => {
    const [color, setColor] = useState(parseColor("hsb(280, 100%, 85%)"));

    return (
        <div className="flex flex-col items-start gap-3">
            <ColorArea value={color} onChange={setColor} colorSpace="hsb" xChannel="saturation" yChannel="brightness" aria-label="Color area" />
            <ColorSwatch color={color} />
        </div>
    );
};

export const ColorAreaDisabled = () => {
    return <ColorArea defaultValue="hsb(280, 100%, 85%)" colorSpace="hsb" xChannel="saturation" yChannel="brightness" aria-label="Color area" isDisabled />;
};

// ColorField

export const ColorFieldDefault = () => {
    return <ColorField label="Color" defaultValue="#7F56D9" />;
};

export const ColorFieldChannel = () => {
    return <ColorField label="Red" channel="red" colorSpace="rgb" defaultValue="#7F56D9" />;
};

export const ColorFieldWithHint = () => {
    return <ColorField label="Color" defaultValue="#7F56D9" hint="Enter a hex color value." />;
};

export const ColorFieldRequired = () => {
    return <ColorField label="Color" isRequired />;
};

export const ColorFieldInvalid = () => {
    return <ColorField label="Color" defaultValue="#7F56D9" isInvalid hint="Please enter a valid hex color." />;
};

export const ColorFieldDisabled = () => {
    return <ColorField label="Color" defaultValue="#7F56D9" isDisabled />;
};

// ColorSlider

export const ColorSliderDefault = () => {
    return <ColorSlider label="Hue" channel="hue" colorSpace="hsb" defaultValue="hsb(280, 100%, 85%)" />;
};

export const ColorSliderAlphaChannel = () => {
    return <ColorSlider label="Alpha" channel="alpha" colorSpace="hsb" defaultValue="hsba(280, 100%, 85%, 0.5)" />;
};

export const ColorSliderVertical = () => {
    return <ColorSlider label="Hue" channel="hue" colorSpace="hsb" defaultValue="hsb(280, 100%, 85%)" orientation="vertical" />;
};

export const ColorSliderDisabled = () => {
    return <ColorSlider label="Hue" channel="hue" colorSpace="hsb" defaultValue="hsb(280, 100%, 85%)" isDisabled />;
};

// ColorSwatch

export const ColorSwatchDefault = () => {
    return <ColorSwatch color="#7F56D9" />;
};

export const ColorSwatchAccessibleName = () => {
    return <ColorSwatch color="#7F56D9" aria-label="Brand color swatch" />;
};

// ColorSwatchPicker

const SWATCHES = ["#7F56D9", "#F04438", "#F79009", "#12B76A", "#2E90FA", "#EE46BC"];

export const ColorSwatchPickerDefault = () => {
    return (
        <ColorSwatchPicker aria-label="Color swatches" defaultValue="#7F56D9">
            {SWATCHES.map((color) => (
                <ColorSwatchPickerItem key={color} color={color} />
            ))}
        </ColorSwatchPicker>
    );
};

export const ColorSwatchPickerControlled = () => {
    const [color, setColor] = useState<Color | string>("#7F56D9");

    return (
        <div className="flex flex-col items-start gap-3">
            <ColorSwatchPicker aria-label="Color swatches" value={color} onChange={setColor}>
                {SWATCHES.map((swatch) => (
                    <ColorSwatchPickerItem key={swatch} color={swatch} />
                ))}
            </ColorSwatchPicker>
            <ColorSwatch color={color} />
        </div>
    );
};

export const ColorSwatchPickerStack = () => {
    return (
        <ColorSwatchPicker aria-label="Color swatches" layout="stack" defaultValue="#7F56D9">
            {SWATCHES.map((color) => (
                <ColorSwatchPickerItem key={color} color={color} />
            ))}
        </ColorSwatchPicker>
    );
};

export const ColorSwatchPickerWithDisabledSwatch = () => {
    return (
        <ColorSwatchPicker aria-label="Color swatches" defaultValue="#7F56D9">
            {SWATCHES.map((color, index) => (
                <ColorSwatchPickerItem key={color} color={color} isDisabled={index === 1} />
            ))}
        </ColorSwatchPicker>
    );
};

// Labelled swatches (BetterShot persona: hair and eye colour)

const HAIR_COLORS = [
    ["Black", "#111827"],
    ["Brown", "#4B3621"],
    ["Blonde", "#F0E68C"],
    ["Auburn", "#B22222"],
    ["Gray", "#808080"],
    ["White", "#FFFFFF"],
] as const;

/** `color` is the value; `fill` paints the iris as a radial gradient from `color` (held to 20%) to `edge`. */
const eye = (label: string, color: string, edge: string, edgeStop = 100) => ({
    label,
    color,
    fill: `radial-gradient(circle closest-side, ${color} 20%, ${edge} ${edgeStop}%)`,
});

const EYE_COLORS = [
    eye("Very dark", "#0A0503", "#2E1F14"),
    eye("Brown", "#BB5525", "#FFE4CA"),
    eye("Dark brown", "#522105", "#996138"),
    eye("Light brown", "#B87A38", "#F2D19E"),
    eye("Amber", "#D98C0D", "#FFDE8C"),
    eye("Green-hazel", "#598526", "#C7E099"),
    eye("Hazel", "#00A244", "#E1FFE4"),
    eye("Green", "#268C2E", "#ADE5B2"),
    eye("Blue", "#3B82F6", "#CADEFF", 85),
    eye("Blue-gray", "#6B85A1", "#C7D6E5"),
    eye("Gray", "#80858C", "#D1D6DB"),
    { label: "Heterochromia", color: "#3B82F5", fill: "linear-gradient(to right, #3B82F5 23.6%, #F8A34F 71.9%)" },
];

export const ColorSwatchPickerHairColor = () => {
    const labelId = useId();

    return (
        <div className="flex flex-col gap-1.5">
            <span id={labelId} className="text-sm font-medium text-primary">
                Hair Color
            </span>
            <ColorSwatchPicker aria-labelledby={labelId} defaultValue="#111827">
                {HAIR_COLORS.map(([label, color]) => (
                    <ColorSwatchPickerItem key={label} color={color} label={label} />
                ))}
            </ColorSwatchPicker>
        </div>
    );
};

export const ColorSwatchPickerEyeColor = () => {
    const labelId = useId();
    const [value, setValue] = useState<Color | string>("#3B82F6");
    const hex = (typeof value === "string" ? parseColor(value) : value).toString("hex").toLowerCase();
    const selected = EYE_COLORS.find((item) => item.color.toLowerCase() === hex);

    return (
        <div className="flex flex-col gap-[13px]">
            <div className="flex items-center gap-1">
                <span id={labelId} className="text-sm font-medium text-tertiary">
                    Eye Color
                </span>
                {/* Value tag (BetterShot P04); a plain span until the Tag variant lands. */}
                {selected && (
                    <span className="rounded-[3px] bg-brand-50 px-[3px] py-px text-[13px] leading-[normal] font-medium text-brand-600">{selected.label}</span>
                )}
            </div>
            <ColorSwatchPicker aria-labelledby={labelId} size="lg" value={value} onChange={setValue}>
                {EYE_COLORS.map((item) => (
                    <ColorSwatchPickerItem key={item.label} color={item.color} fill={item.fill} label={item.label} />
                ))}
            </ColorSwatchPicker>
        </div>
    );
};

// ColorPicker

export const ColorPickerDefault = () => {
    return <ColorPicker label="Background color" />;
};

export const ColorPickerControlled = () => {
    const [color, setColor] = useState(parseColor("#7F56D9"));

    return (
        <div className="flex flex-col items-start gap-3">
            <ColorPicker label="Background color" value={color} onChange={setColor} />
            <p className="text-sm text-tertiary">{color.toString("hex")}</p>
        </div>
    );
};

export const ColorPickerCustom = () => {
    return (
        <ColorPicker label="Text color" defaultValue="#12B76A">
            <ColorSwatchPicker aria-label="Preset colors">
                {SWATCHES.map((color) => (
                    <ColorSwatchPickerItem key={color} color={color} />
                ))}
            </ColorSwatchPicker>
            <ColorField label="Hex" size="sm" />
        </ColorPicker>
    );
};
