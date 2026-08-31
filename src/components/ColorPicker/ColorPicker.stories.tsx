import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorPicker } from "./ColorPicker";
import { ColorArea } from "../ColorArea";
import { ColorField } from "../ColorField";

const meta: Meta<typeof ColorPicker> = {
  title: "Custom Components/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' `ColorPicker` — a context provider that synchronizes one color value across any number of nested color components (`ColorArea`, `ColorField`, `ColorSwatch`, ...) so they never need `value`/`onChange` wired by hand. **Use when:** composing a full picker from `ColorArea`/`ColorField`/etc. behind a swatch trigger. **Don't use when:** a single standalone color component is enough on its own.",
      },
    },
  },
  args: {
    label: "Fill color",
    defaultValue: parseColor("hsl(280, 70%, 50%)"),
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    function ControlledColorPicker() {
      const [value, setValue] = useState<Color>(parseColor("hsl(280, 70%, 50%)"));
      return (
        <>
          <ColorPicker {...args} value={value} onChange={setValue} />
          <p style={{ marginTop: 12, fontSize: 12 }}>Selected color: {value.toString("hsl")}</p>
        </>
      );
    }
    return <ControlledColorPicker />;
  },
};

export const CustomChildren: Story = {
  name: "Custom popover content",
  args: {
    children: (
      <>
        <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" aria-label="Fill color area" />
        <ColorField label="Hex" />
        <ColorField label="Alpha" channel="alpha" />
      </>
    ),
  },
};

export const OpenAndEditHex: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Fill color/ }));
    const hexInput = await canvas.findByRole("textbox");
    await userEvent.clear(hexInput);
    await userEvent.type(hexInput, "#00ff00");
    await userEvent.tab();
    await expect((hexInput as HTMLInputElement).value.toUpperCase()).toBe("#00FF00");
  },
};
