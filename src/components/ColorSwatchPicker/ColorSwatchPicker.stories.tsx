import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "./ColorSwatchPicker";

const meta: Meta<typeof ColorSwatchPicker> = {
  title: "Custom Components/ColorSwatchPicker",
  component: ColorSwatchPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' ColorSwatchPicker/ColorSwatchPickerItem — single-selection roving-tabindex keyboard navigation across a list of swatches (WAI-ARIA APG listbox pattern). **Use when:** choosing from a fixed palette of colors. **Don't use when:** the user needs to dial in an arbitrary color — pair with `ColorArea`/`ColorSlider`/`ColorField` for that. Colors must be unique: equivalent colors in different color spaces (e.g. `#f00` and `hsl(0, 100%, 50%)`) are treated as duplicates.",
      },
    },
  },
  args: {
    "aria-label": "Color",
    defaultValue: parseColor("#A00"),
  },
};

export default meta;
type Story = StoryObj<typeof ColorSwatchPicker>;

export const Playground: Story = {
  render: (args) => (
    <ColorSwatchPicker {...args}>
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#f80" />
      <ColorSwatchPickerItem color="#080" />
      <ColorSwatchPickerItem color="#08f" />
      <ColorSwatchPickerItem color="#088" />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    function ControlledColorSwatchPicker() {
      const [value, setValue] = useState<Color>(parseColor("#A00"));
      return (
        <>
          <ColorSwatchPicker {...args} value={value} onChange={setValue}>
            <ColorSwatchPickerItem color="#A00" />
            <ColorSwatchPickerItem color="#080" />
            <ColorSwatchPickerItem color="#008" />
          </ColorSwatchPicker>
          <p style={{ fontSize: 12 }}>Selected color: {value.toString("hex")}</p>
        </>
      );
    }
    return <ControlledColorSwatchPicker />;
  },
};

export const Stack: Story = {
  args: { layout: "stack" },
  render: (args) => (
    <ColorSwatchPicker {...args}>
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#080" />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  ),
};

export const WithDisabledSwatch: Story = {
  render: (args) => (
    <ColorSwatchPicker {...args}>
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#080" disabled />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  ),
};

export const KeyboardInteraction: Story = {
  render: (args) => (
    <ColorSwatchPicker {...args}>
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#080" />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole("option");
    options[0]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(options[1]).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(options[1]).toHaveAttribute("aria-selected", "true");
  },
};
