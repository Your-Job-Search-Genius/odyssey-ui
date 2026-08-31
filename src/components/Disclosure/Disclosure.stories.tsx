import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Disclosure, DisclosureHeader, DisclosurePanel, DisclosureGroup } from "./Disclosure";

const meta: Meta<typeof Disclosure> = {
  title: "Custom Components/Disclosure",
  component: Disclosure,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `Disclosure`/`DisclosureGroup` — no Figma node covers this component yet, so its chrome follows the chevron/spacing conventions Card and Sidebar already established from tokens. **Use when:** a single collapsible section, or several related ones grouped as an accordion. **Don't use when:** the content should always be visible, or navigation is the goal (use Sidebar instead).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Disclosure>;

export const Playground: Story = {
  render: () => (
    <Disclosure style={{ maxWidth: 320 }}>
      <DisclosureHeader>System Requirements</DisclosureHeader>
      <DisclosurePanel>
        Requires a modern browser with JavaScript enabled. No additional plugins are needed.
      </DisclosurePanel>
    </Disclosure>
  ),
};

export const DefaultExpanded: Story = {
  render: () => (
    <Disclosure defaultExpanded style={{ maxWidth: 320 }}>
      <DisclosureHeader>Billing Address</DisclosureHeader>
      <DisclosurePanel>123 Main St, Springfield, USA</DisclosurePanel>
    </Disclosure>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Disclosure disabled style={{ maxWidth: 320 }}>
      <DisclosureHeader>Locked Section</DisclosureHeader>
      <DisclosurePanel>This content is unavailable.</DisclosurePanel>
    </Disclosure>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [expanded, setExpanded] = useState(false);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 320 }}>
          <button type="button" onClick={() => setExpanded((v) => !v)}>
            Toggle from outside
          </button>
          <Disclosure expanded={expanded} onExpandedChange={setExpanded}>
            <DisclosureHeader>Download, Install, and Set Up</DisclosureHeader>
            <DisclosurePanel>Instructions on how to download, install, and set up.</DisclosurePanel>
          </Disclosure>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Group: Story = {
  name: "DisclosureGroup (accordion)",
  render: () => (
    <DisclosureGroup style={{ maxWidth: 320 }} defaultExpandedKeys={["personal"]}>
      <Disclosure id="personal">
        <DisclosureHeader>Personal Information</DisclosureHeader>
        <DisclosurePanel>Personal information form here.</DisclosurePanel>
      </Disclosure>
      <Disclosure id="billing">
        <DisclosureHeader>Billing Address</DisclosureHeader>
        <DisclosurePanel>Billing address form here.</DisclosurePanel>
      </Disclosure>
      <Disclosure id="shipping">
        <DisclosureHeader>Shipping Address</DisclosureHeader>
        <DisclosurePanel>Shipping address form here.</DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  ),
};

export const GroupAllowsMultiple: Story = {
  name: "DisclosureGroup (multiple expanded)",
  render: () => (
    <DisclosureGroup style={{ maxWidth: 320 }} allowsMultipleExpanded defaultExpandedKeys={["settings", "advanced"]}>
      <Disclosure id="settings">
        <DisclosureHeader>Settings</DisclosureHeader>
        <DisclosurePanel>Application settings content.</DisclosurePanel>
      </Disclosure>
      <Disclosure id="preferences">
        <DisclosureHeader>Preferences</DisclosureHeader>
        <DisclosurePanel>User preferences content.</DisclosurePanel>
      </Disclosure>
      <Disclosure id="advanced">
        <DisclosureHeader>Advanced</DisclosureHeader>
        <DisclosurePanel>Advanced configuration options.</DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <Disclosure style={{ maxWidth: 320 }}>
      <DisclosureHeader>Keyboard Test</DisclosureHeader>
      <DisclosurePanel>Toggled via Enter/Space on the header button.</DisclosurePanel>
    </Disclosure>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};
