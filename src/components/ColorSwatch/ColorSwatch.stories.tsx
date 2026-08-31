import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { parseColor } from "react-aria-components";
import { ColorSwatch } from "./ColorSwatch";

const meta: Meta<typeof ColorSwatch> = {
  title: "Custom Components/ColorSwatch",
  component: ColorSwatch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' ColorSwatch — generating a localized, human-readable color description (e.g. \"dark vibrant blue\") for screen reader users isn't something to hand-roll. **Use when:** previewing a selected color, standalone or as an item inside `ColorSwatchPicker`. **Don't use when:** the color needs to be edited — pair with `ColorField`/`ColorArea`/`ColorSlider` for that.",
      },
    },
  },
  args: {
    color: parseColor("#6941C6"),
  },
};

export default meta;
type Story = StoryObj<typeof ColorSwatch>;

export const Playground: Story = {};

export const CustomColorName: Story = {
  args: { colorName: "Odyssey purple" },
};

export const WithAriaLabel: Story = {
  args: { color: parseColor("#D30D25"), "aria-label": "Background color" },
};

export const Transparent: Story = {
  args: { color: parseColor("#ffffff00") },
};

export const AccessibleName: Story = {
  args: { color: parseColor("#D30D25"), colorName: "Fire truck red", "aria-label": "Background color" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: "Fire truck red, Background color" })).toBeInTheDocument();
  },
};
