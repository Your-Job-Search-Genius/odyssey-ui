import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Custom Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' `Slider`/`SliderTrack` — the WAI-ARIA APG slider keyboard model (arrow keys, Page Up/Down, Home/End, and multi-thumb clamping) is handled entirely by the behavior layer. Track/thumb geometry mirrors `ColorSlider`'s. **Use when:** picking one or more numeric values within a known range (a quantity, a percentage, a min/max range). **Don't use when:** the value is a color channel — use `ColorSlider` instead.",
      },
    },
  },
  args: {
    label: "Cookies to buy",
    defaultValue: 25,
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Playground: Story = {};

export const Controlled: Story = {
  name: "Controlled value (onChange vs onChangeEnd)",
  render: (args) => {
    function ControlledSlider() {
      const [currentValue, setCurrentValue] = useState(25);
      const [finalValue, setFinalValue] = useState(currentValue);
      return (
        <div>
          <Slider
            {...args}
            value={currentValue}
            onChange={(v) => setCurrentValue(Array.isArray(v) ? (v[0] ?? currentValue) : v)}
            onChangeEnd={(v) => setFinalValue(Array.isArray(v) ? (v[0] ?? currentValue) : v)}
          />
          <p style={{ marginTop: 8 }}>onChange value: {currentValue}</p>
          <p>onChangeEnd value: {finalValue}</p>
        </div>
      );
    }
    return <ControlledSlider />;
  },
};

export const MultiThumb: Story = {
  name: "Multi-thumb (range)",
  args: {
    label: "Range",
    defaultValue: [30, 60],
    thumbLabels: ["start", "end"],
  },
};

export const ValueScale: Story = {
  name: "Value scale (min/max/step)",
  args: {
    label: "Volume",
    defaultValue: 8,
    minValue: 2,
    maxValue: 20,
    step: 3,
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
