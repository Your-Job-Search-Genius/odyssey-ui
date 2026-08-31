import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Tabs, TabList, TabPanel } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Figma Components/Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components` — arrow-key roving-tabindex navigation and the `tablist`/`tab`/`tabpanel` role/state wiring are the error-prone part to hand-roll. **Use when:** switching between a small number of related views without changing the URL. **Don't use when:** the choice should be a bookmarkable/shareable page (use routed navigation) or there are many options (use a Select). Hover, disabled, and focus-visible treatments are assumed — Figma's Tabs page only shows selected vs. unselected.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const items = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "billing", label: "Billing" },
];

export const Playground: Story = {
  render: () => (
    <Tabs defaultSelectedKey="profile">
      <TabList aria-label="Settings" items={items} />
      <TabPanel id="profile">Profile settings go here.</TabPanel>
      <TabPanel id="account">Account settings go here.</TabPanel>
      <TabPanel id="billing">Billing settings go here.</TabPanel>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultSelectedKey="profile">
      <TabList
        aria-label="Settings"
        items={[
          { id: "profile", label: "Profile" },
          { id: "account", label: "Account" },
          { id: "billing", label: "Billing", disabled: true },
        ]}
      />
      <TabPanel id="profile">Profile settings go here.</TabPanel>
      <TabPanel id="account">Account settings go here.</TabPanel>
      <TabPanel id="billing">Billing settings go here.</TabPanel>
    </Tabs>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <Tabs defaultSelectedKey="profile">
      <TabList aria-label="Settings" items={items} />
      <TabPanel id="profile">Profile settings go here.</TabPanel>
      <TabPanel id="account">Account settings go here.</TabPanel>
      <TabPanel id="billing">Billing settings go here.</TabPanel>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const profile = canvas.getByRole("tab", { name: "Profile" });
    profile.focus();
    await expect(profile).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText("Account settings go here.")).toBeVisible();
  },
};
