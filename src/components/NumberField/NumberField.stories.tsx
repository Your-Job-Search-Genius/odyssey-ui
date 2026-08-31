import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { I18nProvider } from "react-aria-components";
import { NumberField } from "./NumberField";
import { Form } from "../Form";
import { Button } from "../Button";

const meta: Meta<typeof NumberField> = {
  title: "Custom Components/NumberField",
  component: NumberField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' `NumberField` — locale-aware number parsing/formatting and typed-character filtering (`formatOptions`), min/max clamping, and step-based increment/decrement, none of which are safe to hand-roll. The field box mirrors `DatePicker`'s group exactly. **Use when:** the value is a plain quantity (a count, a percentage, a currency amount). **Don't use when:** the value is a date/time/color (use `DateField`/`ColorField`) or free text (use `Input`).",
      },
    },
  },
  args: {
    label: "Cookies to buy",
    defaultValue: 25,
  },
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Playground: Story = {};

export const Controlled: Story = {
  name: "Controlled value",
  render: (args) => {
    function ControlledNumberField() {
      const [value, setValue] = useState(25);
      return (
        <div>
          <NumberField {...args} value={value} onChange={setValue} />
          <p style={{ marginTop: 8 }}>Current value: {value}</p>
        </div>
      );
    }
    return <ControlledNumberField />;
  },
};

export const FormatOptions: Story = {
  name: "Format options (currency)",
  args: {
    label: "Price",
    defaultValue: 45,
    formatOptions: { style: "currency", currency: "USD" },
  },
};

export const Percent: Story = {
  name: "Format options (percent)",
  args: {
    label: "Sales tax",
    defaultValue: 0.05,
    formatOptions: { style: "percent" },
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

export const NumberingSystem: Story = {
  name: "Numbering system (I18nProvider)",
  render: (args) => (
    <I18nProvider locale="ar-AE-u-nu-arab">
      <NumberField {...args} />
    </I18nProvider>
  ),
  args: {
    label: "Value",
    defaultValue: 1024,
  },
};

export const InForm: Story = {
  name: "In a form",
  render: () => (
    <div style={{ width: "16rem" }}>
      <Form>
        <NumberField label="Width" name="width" required />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  ),
};

export const WithHelperText: Story = {
  args: { helperText: "Enter a whole number." },
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  args: { errorMessage: "Enter a value between 1 and 100.", defaultValue: undefined },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Required: Story = {
  args: { required: true },
};

export const StepperButtonsUpdateValue: Story = {
  name: "Stepper buttons update the value",
  args: { defaultValue: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox") as HTMLInputElement;
    await expect(input).toHaveValue("5");
    await userEvent.click(canvas.getByRole("button", { name: /Increase/ }));
    await expect(input).toHaveValue("6");
    await userEvent.click(canvas.getByRole("button", { name: /Decrease/ }));
    await userEvent.click(canvas.getByRole("button", { name: /Decrease/ }));
    await expect(input).toHaveValue("4");
  },
};
