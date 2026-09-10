"use client";

import { useState } from "react";
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
