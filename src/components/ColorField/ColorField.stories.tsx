import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorField } from "./ColorField";

const meta: Meta<typeof ColorField> = {
  title: "Custom Components/ColorField",
  component: ColorField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' `ColorField` — parsing and validating a typed hex value or a single color channel as the user types, and clamping to the channel's range on blur, is exactly the kind of interaction that's genuinely hard to hand-roll accessibly. Chrome matches `Input`/`SearchField`'s field box exactly. **Use when:** typing an exact hex value or a single channel, often alongside `ColorArea` in a larger color picker. **Don't use when:** the value isn't a color, or a full 2D channel pair needs adjusting (use `ColorArea`).",
      },
    },
  },
  args: {
    label: "Primary color",
    placeholder: "Enter a color",
    defaultValue: parseColor("#e73623"),
  },
};

export default meta;
type Story = StoryObj<typeof ColorField>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    function ControlledColorField() {
      const [value, setValue] = useState<Color | null>(parseColor("#e73623"));
      return <ColorField {...args} value={value} onChange={setValue} />;
    }
    return <ControlledColorField />;
  },
};

export const Channel: Story = {
  name: "Single channel (e.g. paired with ColorArea)",
  args: {
    label: "Hue",
    defaultValue: parseColor("hsl(280, 70%, 50%)"),
    colorSpace: "hsl",
    channel: "hue",
    placeholder: undefined,
  },
};

export const WithHelperText: Story = {
  args: { helperText: "Accepts a 3- or 6-digit hex value." },
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  args: { errorMessage: "Enter a valid color.", defaultValue: null },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Required: Story = {
  args: { required: true },
};

export const TypingUpdatesValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, "#00ff00");
    await userEvent.tab();
    await expect(input.value.toUpperCase()).toBe("#00FF00");
  },
};
