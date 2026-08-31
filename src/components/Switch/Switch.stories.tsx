import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Switch } from "./Switch";
import { Form } from "../Form/Form";
import { Button } from "../Button/Button";

const meta: Meta<typeof Switch> = {
  title: "Figma Components/Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `SwitchField`/`SwitchButton` composition — the hidden-native-input pattern and hover/press/focus-visible state are easy to get subtly wrong by hand. **Use when:** a single on/off setting takes effect immediately, with no separate submit step. **Don't use when:** the choice is one of several independent items in a list, or won't apply until a form is submitted (use Checkbox instead). Not yet in source Figma — styled to match the token usage and geometry conventions of Checkbox/Radio.",
      },
    },
  },
  args: { label: "Low power mode" },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};

export const Selection: Story = {
  name: "Selection (controlled)",
  render: (args) => {
    function Demo() {
      const [selected, setSelection] = useState(false);
      return (
        <>
          <Switch {...args} checked={selected} onChange={setSelection} />
          <p style={{ marginTop: 8 }}>{selected ? "Low" : "High"} power mode active.</p>
        </>
      );
    }
    return <Demo />;
  },
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Switch {...args} label="Off" />
      <Switch {...args} label="On" defaultChecked />
      <Switch {...args} label="Disabled" disabled />
      <Switch {...args} label="Disabled + on" disabled defaultChecked />
    </div>
  ),
};

export const WithDescription: Story = {
  name: "With description",
  render: (args) => (
    <Switch
      {...args}
      label="Two-factor authentication"
      description="Your organization requires two-factor authentication."
    />
  ),
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  render: (args) => (
    <Switch {...args} label="Accept usage terms" required errorMessage="You must accept the terms to continue." />
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return <Switch label={checked ? "On" : "Off"} checked={checked} onChange={setChecked} />;
    }
    return <Demo />;
  },
};

export const FormExample: Story = {
  name: "Form (name + required + submit)",
  render: () => (
    <div style={{ width: "20rem" }}>
      <Form>
        <Switch
          name="two-factor"
          label="Two-factor authentication"
          required
          description="Your organization requires two-factor authentication."
        />
        <Button type="submit" style={{ marginTop: 8 }}>
          Submit
        </Button>
      </Form>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await expect(canvas.getByRole("switch", { name: "Two-factor authentication" })).toHaveFocus();
  },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch");
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(toggle).toBeChecked();
  },
};
