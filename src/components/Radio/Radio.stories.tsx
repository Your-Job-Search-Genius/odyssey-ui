import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { RadioGroup, Radio } from "./Radio";
import { Form } from "../Form/Form";
import { Button } from "../Button/Button";

const meta: Meta<typeof RadioGroup> = {
  title: "Figma Components/Primitives/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `RadioGroup`/`RadioField`/`RadioButton` — arrow-key roving-tabindex navigation between options is the error-prone part to hand-roll. **Use when:** exactly one option must be chosen from a small visible set. **Don't use when:** the set is large (use Select) or more than one option can be chosen (use Checkbox).",
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

export const WithDescriptions: Story = {
  name: "With descriptions (per-option)",
  render: () => (
    <RadioGroup label="Shipping method" defaultValue="standard">
      <Radio value="standard" description="Delivers in 5–7 business days">
        Standard Shipping (Free)
      </Radio>
      <Radio value="expedited" description="Delivers in 2–3 business days">
        Expedited Shipping ($9.99)
      </Radio>
      <Radio value="overnight" description="Next-day delivery">
        Overnight Shipping ($19.99)
      </Radio>
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

export const WithHelperText: Story = {
  render: () => (
    <RadioGroup label="Favorite sport" helperText="Used to personalize your news feed.">
      <Radio value="soccer">Soccer</Radio>
      <Radio value="baseball">Baseball</Radio>
      <Radio value="basketball">Basketball</Radio>
    </RadioGroup>
  ),
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  render: () => (
    <RadioGroup label="Favorite sport" required errorMessage="Choose a sport to continue.">
      <Radio value="soccer">Soccer</Radio>
      <Radio value="baseball">Baseball</Radio>
      <Radio value="basketball">Basketball</Radio>
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

export const DisabledOption: Story = {
  name: "Disabled (single option)",
  render: () => (
    <RadioGroup label="Shipping method" defaultValue="standard">
      <Radio value="standard" description="Delivers in 5–7 business days">
        Standard Shipping (Free)
      </Radio>
      <Radio value="overnight" description="Currently unavailable in your area" disabled>
        Overnight Shipping ($19.99)
      </Radio>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <>
          <RadioGroup label="Favorite sport" value={value} onChange={setValue}>
            <Radio value="soccer">Soccer</Radio>
            <Radio value="baseball">Baseball</Radio>
            <Radio value="basketball">Basketball</Radio>
          </RadioGroup>
          <p style={{ marginTop: 8 }}>Current selection: {value || "None"}</p>
        </>
      );
    }
    return <Demo />;
  },
};

export const FormExample: Story = {
  name: "Form (name + required + submit)",
  render: () => (
    <div style={{ width: "20rem" }}>
      <Form>
        <RadioGroup label="Favorite pet" name="pet" required>
          <Radio value="dog">Dog</Radio>
          <Radio value="cat">Cat</Radio>
          <Radio value="dragon">Dragon</Radio>
        </RadioGroup>
        <Button type="submit" style={{ marginTop: 8 }}>
          Submit
        </Button>
      </Form>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Submitting without a selection blocks natively and moves focus into the group.
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await expect(canvas.getByRole("radio", { name: "Dog" })).toHaveFocus();
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
