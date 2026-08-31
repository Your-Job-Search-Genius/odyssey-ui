import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Input } from "./Input";
import { SearchGlyph, ChevronDownGlyph } from "../Icon/glyphs";
import { Button } from "../Button";

const meta: Meta<typeof Input> = {
  title: "Figma Components/Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Native `<input>` with our label/helper/error wiring — no behavior library needed. **Use when:** collecting a single line of text/email/password/etc. **Don't use when:** the value spans multiple lines (use Textarea) or is picked from a fixed set (use Select/Combobox). `label` is required — there's no `aria-label`-only escape hatch, so every Input always has a programmatic, visible label (WCAG 3.3.2). The error state doesn't exist in the source Figma file; it's designed from WAI-ARIA APG conventions using the system's existing danger-text token.",
      },
    },
  },
  args: {
    label: "Email address",
    placeholder: "you@example.com",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <Input {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState("");
      return (
        <div style={{ width: "20rem" }}>
          <Input label="Controlled value" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithHelperText: Story = {
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <Input {...args} helperText="We'll only use this to send your resume feedback." />
    </div>
  ),
};

export const Required: Story = {
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <Input {...args} required />
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <Input {...args} label="Search" placeholder="Search templates" leadingIcon={<SearchGlyph />} />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <Input label="Password" type="password" defaultValue="hunter2" />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <Input {...args} disabled defaultValue="you@example.com" />
    </div>
  ),
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <Input {...args} defaultValue="not-an-email" errorMessage="Enter a valid email address" />
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <Input label="Password" type="password" defaultValue="hunter2" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password") as HTMLInputElement;
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.tab();
    const toggle = canvas.getByRole("button", { name: "Show password" });
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(input).toHaveAttribute("type", "text");
  },
};

/**
 * The remaining input types from Figma's Inputs page (node 433:10223).
 * Leading Dropdown and Web both use the divided `prefix` slot; Web adds a
 * trailing `action`. Tags is its own component — see TagsInput.
 */
export const FigmaTypes: Story = {
  name: "Figma types (Leading Dropdown, Web, Password, Trailing Icon)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "27.125rem" }}>
      <Input
        label="Phone number"
        prefix={
          <>
            US
            <ChevronDownGlyph size="1rem" />
          </>
        }
        placeholder="Placeholder"
        helperText="This is a helper text"
      />
      <Input
        label="Website"
        prefix="https://"
        placeholder="placeholder"
        action={
          <Button variant="accent" size="sm">
            Paste
          </Button>
        }
        helperText="This is a helper text"
      />
      <Input label="Password" type="password" placeholder="Placeholder" helperText="This is a helper text" />
      <Input
        label="Search"
        trailingIcon={<SearchGlyph />}
        placeholder="Placeholder"
        helperText="This is a helper text"
      />
    </div>
  ),
};
