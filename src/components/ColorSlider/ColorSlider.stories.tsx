import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorSlider } from "./ColorSlider";

const meta: Meta<typeof ColorSlider> = {
  title: "Custom Components/ColorSlider",
  component: ColorSlider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' ColorSlider/SliderTrack, reusing the same `ColorThumb` visual as `ColorArea`. **Use when:** adjusting a single color channel (hue, saturation, alpha, ...) on its own. **Don't use when:** two channels need adjusting together — `ColorArea` fits that case instead.",
      },
    },
  },
  args: {
    label: "Hue",
    defaultValue: parseColor("hsl(280, 70%, 50%)"),
    channel: "hue",
  },
};

export default meta;
type Story = StoryObj<typeof ColorSlider>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    function ControlledColorSlider() {
      const [value, setValue] = useState<Color>(parseColor("hsl(280, 70%, 50%)"));
      return <ColorSlider {...args} value={value} onChange={setValue} />;
    }
    return <ControlledColorSlider />;
  },
};

export const AlphaChannel: Story = {
  args: {
    label: "Alpha",
    defaultValue: parseColor("hsla(280, 70%, 50%, 0.5)"),
    channel: "alpha",
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("slider") as HTMLInputElement;
    input.focus();
    const before = input.value;
    await userEvent.keyboard("{ArrowRight}");
    await expect(input.value).not.toBe(before);
  },
};
