import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorArea } from "./ColorArea";

const meta: Meta<typeof ColorArea> = {
  title: "Custom Components/ColorArea",
  component: ColorArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' ColorArea/ColorThumb — dragging a 2D thumb across a channel gradient while staying fully keyboard-operable (arrow keys adjust both channels through two synchronized `slider`-role inputs) is exactly the kind of interaction that's genuinely hard to hand-roll accessibly. **Use when:** picking a 2D pair of channels (e.g. saturation/lightness) as part of a larger color picker. **Don't use when:** only a single channel needs adjusting (a dedicated slider fits that case better) or the value isn't a color at all.",
      },
    },
  },
  args: {
    "aria-label": "Color",
    // Deliberately not at a channel boundary (saturation/lightness both
    // sit mid-range) so keyboard interaction has room to move in every
    // direction — see KeyboardInteraction below.
    defaultValue: parseColor("hsl(280, 70%, 50%)"),
    xChannel: "saturation",
    yChannel: "lightness",
  },
};

export default meta;
type Story = StoryObj<typeof ColorArea>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    function ControlledColorArea() {
      const [value, setValue] = useState<Color>(parseColor("hsl(280, 70%, 50%)"));
      return <ColorArea {...args} value={value} onChange={setValue} />;
    }
    return <ControlledColorArea />;
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Only the x-channel input is exposed to assistive tech before any
    // interaction — React Aria reveals the y-channel input once its value
    // changes via keyboard, so only one slider role exists at this point.
    const xInput = canvas.getByRole("slider") as HTMLInputElement;
    xInput.focus();
    const before = xInput.value;
    await userEvent.keyboard("{ArrowRight}");
    await expect(xInput.value).not.toBe(before);
  },
};
