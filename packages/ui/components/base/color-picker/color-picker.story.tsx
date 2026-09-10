import type { FC } from "react";
import * as ColorPickers from "@/components/base/color-picker/color-picker.demo";

export default {
    title: "Base components/Color picker",
};

const Decorator = (Story: FC) => (
    <div className="flex min-h-screen w-full items-start bg-primary p-8">
        <Story />
    </div>
);

// ColorArea

export const ColorAreaDefault = () => <ColorPickers.ColorAreaDefault />;
ColorAreaDefault.decorators = [Decorator];
ColorAreaDefault.storyName = "Color area / Default";

export const ColorAreaControlled = () => <ColorPickers.ColorAreaControlled />;
ColorAreaControlled.decorators = [Decorator];
ColorAreaControlled.storyName = "Color area / Controlled";

export const ColorAreaDisabled = () => <ColorPickers.ColorAreaDisabled />;
ColorAreaDisabled.decorators = [Decorator];
ColorAreaDisabled.storyName = "Color area / Disabled";

// ColorField

export const ColorFieldDefault = () => <ColorPickers.ColorFieldDefault />;
ColorFieldDefault.decorators = [Decorator];
ColorFieldDefault.storyName = "Color field / Default";

export const ColorFieldChannel = () => <ColorPickers.ColorFieldChannel />;
ColorFieldChannel.decorators = [Decorator];
ColorFieldChannel.storyName = "Color field / Channel";

export const ColorFieldWithHint = () => <ColorPickers.ColorFieldWithHint />;
ColorFieldWithHint.decorators = [Decorator];
ColorFieldWithHint.storyName = "Color field / With hint";

export const ColorFieldRequired = () => <ColorPickers.ColorFieldRequired />;
ColorFieldRequired.decorators = [Decorator];
ColorFieldRequired.storyName = "Color field / Required";

export const ColorFieldInvalid = () => <ColorPickers.ColorFieldInvalid />;
ColorFieldInvalid.decorators = [Decorator];
ColorFieldInvalid.storyName = "Color field / Invalid";

export const ColorFieldDisabled = () => <ColorPickers.ColorFieldDisabled />;
ColorFieldDisabled.decorators = [Decorator];
ColorFieldDisabled.storyName = "Color field / Disabled";

// ColorSlider

export const ColorSliderDefault = () => <ColorPickers.ColorSliderDefault />;
ColorSliderDefault.decorators = [Decorator];
ColorSliderDefault.storyName = "Color slider / Default";

export const ColorSliderAlphaChannel = () => <ColorPickers.ColorSliderAlphaChannel />;
ColorSliderAlphaChannel.decorators = [Decorator];
ColorSliderAlphaChannel.storyName = "Color slider / Alpha channel";

export const ColorSliderVertical = () => <ColorPickers.ColorSliderVertical />;
ColorSliderVertical.decorators = [Decorator];
ColorSliderVertical.storyName = "Color slider / Vertical";

export const ColorSliderDisabled = () => <ColorPickers.ColorSliderDisabled />;
ColorSliderDisabled.decorators = [Decorator];
ColorSliderDisabled.storyName = "Color slider / Disabled";

// ColorSwatch

export const ColorSwatchDefault = () => <ColorPickers.ColorSwatchDefault />;
ColorSwatchDefault.decorators = [Decorator];
ColorSwatchDefault.storyName = "Color swatch / Default";

export const ColorSwatchAccessibleName = () => <ColorPickers.ColorSwatchAccessibleName />;
ColorSwatchAccessibleName.decorators = [Decorator];
ColorSwatchAccessibleName.storyName = "Color swatch / Accessible name";

// ColorSwatchPicker

export const ColorSwatchPickerDefault = () => <ColorPickers.ColorSwatchPickerDefault />;
ColorSwatchPickerDefault.decorators = [Decorator];
ColorSwatchPickerDefault.storyName = "Color swatch picker / Default";

export const ColorSwatchPickerControlled = () => <ColorPickers.ColorSwatchPickerControlled />;
ColorSwatchPickerControlled.decorators = [Decorator];
ColorSwatchPickerControlled.storyName = "Color swatch picker / Controlled";

export const ColorSwatchPickerStack = () => <ColorPickers.ColorSwatchPickerStack />;
ColorSwatchPickerStack.decorators = [Decorator];
ColorSwatchPickerStack.storyName = "Color swatch picker / Stack layout";

export const ColorSwatchPickerWithDisabledSwatch = () => <ColorPickers.ColorSwatchPickerWithDisabledSwatch />;
ColorSwatchPickerWithDisabledSwatch.decorators = [Decorator];
ColorSwatchPickerWithDisabledSwatch.storyName = "Color swatch picker / With disabled swatch";

// ColorPicker

export const ColorPickerDefault = () => <ColorPickers.ColorPickerDefault />;
ColorPickerDefault.decorators = [Decorator];
ColorPickerDefault.storyName = "Color picker / Default";

export const ColorPickerControlled = () => <ColorPickers.ColorPickerControlled />;
ColorPickerControlled.decorators = [Decorator];
ColorPickerControlled.storyName = "Color picker / Controlled";

export const ColorPickerCustom = () => <ColorPickers.ColorPickerCustom />;
ColorPickerCustom.decorators = [Decorator];
ColorPickerCustom.storyName = "Color picker / Custom content";
