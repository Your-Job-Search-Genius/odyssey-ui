import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Figma Components/Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `Checkbox` — indeterminate state and the hidden-native-input pattern are easy to get subtly wrong by hand. **Use when:** a single independent on/off choice, or one item in a multi-select list. **Don't use when:** only one option in a set may be selected (use Radio) or the choice takes effect immediately without a submit step (consider a Switch instead — not yet in this library). The default unchecked border is intentionally darker than Figma's literal value — see the AA-fix note in Checkbox.css.",
      },
    },
  },
  args: { label: "Accept terms and conditions" },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Checkbox {...args} label="Unchecked" />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Indeterminate" indeterminate />
      <Checkbox {...args} label="Disabled" disabled />
      <Checkbox {...args} label="Disabled + checked" disabled defaultChecked />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return <Checkbox label={checked ? "Checked" : "Unchecked"} checked={checked} onChange={setChecked} />;
    }
    return <Demo />;
  },
};

export const SelectAllIndeterminate: Story = {
  name: "Select-all (indeterminate) pattern",
  render: () => {
    function Demo() {
      const [items, setItems] = useState([false, true, false]);
      const allChecked = items.every(Boolean);
      const noneChecked = items.every((v) => !v);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Checkbox
            label="Select all"
            checked={allChecked}
            indeterminate={!allChecked && !noneChecked}
            onChange={(checked) => setItems(items.map(() => checked))}
          />
          <div style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {items.map((checked, i) => (
              <Checkbox
                key={i}
                label={`Item ${i + 1}`}
                checked={checked}
                onChange={(next) => setItems(items.map((v, idx) => (idx === i ? next : v)))}
              />
            ))}
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("checkbox");
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(box).toBeChecked();
  },
};
