import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { CheckboxGroup, Checkbox } from "./Checkbox";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Figma Components/Primitives/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `CheckboxGroup` — group semantics (`group` role, one label announced for the set) are easy to get subtly wrong by hand. Unlike RadioGroup, options are independently focusable (no roving tabindex). **Use when:** more than one option may be chosen from a small visible set. **Don't use when:** exactly one option may be chosen (use RadioGroup) or the set is large (use a multi-select Select/ListBox).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Playground: Story = {
  render: () => (
    <CheckboxGroup label="Notification preferences" defaultValue={["product"]}>
      <Checkbox value="product" label="Product Updates" />
      <Checkbox value="security" label="Security Alerts" />
      <Checkbox value="marketing" label="Marketing Emails" />
    </CheckboxGroup>
  ),
};

export const WithDescriptions: Story = {
  name: "With descriptions",
  render: () => (
    <CheckboxGroup label="Email Notification Preferences">
      <Checkbox
        value="product"
        label="Product Updates"
        description="Get notified about new features and improvements"
      />
      <Checkbox
        value="security"
        label="Security Alerts"
        description="Important notifications about your account safety"
      />
      <Checkbox
        value="marketing"
        label="Marketing Emails"
        description="Receive promotions, offers, and newsletters"
      />
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <CheckboxGroup label="Notification preferences" defaultValue={["product"]} orientation="horizontal">
      <Checkbox value="product" label="Product Updates" />
      <Checkbox value="security" label="Security Alerts" />
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <CheckboxGroup label="Notification preferences" defaultValue={["product"]} disabled>
      <Checkbox value="product" label="Product Updates" />
      <Checkbox value="security" label="Security Alerts" />
    </CheckboxGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<string[]>(["product"]);
      return (
        <CheckboxGroup label={`Notification preferences (${value.join(", ") || "none"})`} value={value} onChange={setValue}>
          <Checkbox value="product" label="Product Updates" />
          <Checkbox value="security" label="Security Alerts" />
          <Checkbox value="marketing" label="Marketing Emails" />
        </CheckboxGroup>
      );
    }
    return <Demo />;
  },
};

export const KeyboardInteraction: Story = {
  render: () => (
    <CheckboxGroup label="Notification preferences">
      <Checkbox value="product" label="Product Updates" />
      <Checkbox value="security" label="Security Alerts" />
      <Checkbox value="marketing" label="Marketing Emails" />
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const product = canvas.getByRole("checkbox", { name: "Product Updates" });
    product.focus();
    await expect(product).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(product).toBeChecked();
    await userEvent.tab();
    const security = canvas.getByRole("checkbox", { name: "Security Alerts" });
    await expect(security).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(security).toBeChecked();
    await expect(product).toBeChecked();
  },
};
