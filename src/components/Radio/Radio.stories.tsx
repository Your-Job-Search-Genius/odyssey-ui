import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { RadioGroup, Radio } from "./Radio";

const meta: Meta<typeof RadioGroup> = {
  title: "Figma Components/Primitives/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `RadioGroup`/`Radio` — arrow-key roving-tabindex navigation between options is the error-prone part to hand-roll. **Use when:** exactly one option must be chosen from a small visible set. **Don't use when:** the set is large (use Select) or more than one option can be chosen (use Checkbox).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Playground: Story = {
  render: () => (
    <RadioGroup label="Preferred contact method" defaultValue="email">
      <Radio value="email">Email</Radio>
      <Radio value="phone">Phone</Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup label="Plan" defaultValue="monthly" orientation="horizontal">
      <Radio value="monthly">Monthly</Radio>
      <Radio value="annual">Annual</Radio>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup label="Preferred contact method" defaultValue="email" disabled>
      <Radio value="email">Email</Radio>
      <Radio value="phone">Phone</Radio>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState("email");
      return (
        <RadioGroup label={`Preferred contact method (${value})`} value={value} onChange={setValue}>
          <Radio value="email">Email</Radio>
          <Radio value="phone">Phone</Radio>
          <Radio value="sms">SMS</Radio>
        </RadioGroup>
      );
    }
    return <Demo />;
  },
};

export const KeyboardInteraction: Story = {
  render: () => (
    <RadioGroup label="Preferred contact method" defaultValue="email">
      <Radio value="email">Email</Radio>
      <Radio value="phone">Phone</Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole("radio", { name: "Email" });
    email.focus();
    await expect(email).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "Phone" })).toHaveFocus();
    await expect(canvas.getByRole("radio", { name: "Phone" })).toBeChecked();
  },
};
