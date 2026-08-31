import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { Tabs, TabList, TabPanel } from "./Tabs";
import { Form } from "../Form";
import { Input } from "../Input";
import { Button } from "../Button";
import { Checkbox, CheckboxGroup } from "../Checkbox";
import { RadioGroup, Radio } from "../Radio";
import {
  Home01Icon,
  Folder01Icon,
  Search02Icon,
  Setting01Icon,
  Add01Icon,
  MinusSignIcon,
} from "@your-job-search-genius/icons";

const meta: Meta<typeof Tabs> = {
  title: "Figma Components/Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components` — arrow-key roving-tabindex navigation and the `tablist`/`tab`/`tabpanel` role/state wiring are the error-prone part to hand-roll. **Use when:** switching between a small number of related views without changing the URL. **Don't use when:** the choice should be a bookmarkable/shareable page (use link tabs or routed navigation) or there are many options (use a Select). Hover, disabled, and focus-visible treatments are assumed — Figma's Tabs page only shows selected vs. unselected.",
      },
    },
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    keyboardActivation: { control: "inline-radio", options: ["automatic", "manual"] },
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
  render: (args) => (
    <Tabs defaultSelectedKey="profile" {...args}>
      <TabList aria-label="Settings" items={items} />
      <TabPanel id="profile">Profile settings go here.</TabPanel>
      <TabPanel id="account">Account settings go here.</TabPanel>
      <TabPanel id="billing">Billing settings go here.</TabPanel>
    </Tabs>
  ),
};

/**
 * The react-aria docs' settings example rebuilt from this library's own form
 * primitives: each panel is a small form composed of Input, Checkbox,
 * RadioGroup, and CheckboxGroup. Panels hold real interactive content —
 * pressing Tab from a tab moves into the selected panel's first control.
 */
export const SettingsPanels: Story = {
  name: "Settings panels (composed forms)",
  parameters: {
    docs: {
      description: {
        story:
          "Each panel composes this library's form components. Only the selected panel is in the DOM, so unselected panels cost nothing and their controls can't be tabbed into by mistake.",
      },
    },
  },
  render: () => (
    <Tabs defaultSelectedKey="general" style={{ width: "26rem" }}>
      <TabList
        aria-label="Settings"
        items={[
          { id: "general", label: "General" },
          { id: "appearance", label: "Appearance" },
          { id: "notifications", label: "Notifications" },
          { id: "profile", label: "Profile" },
        ]}
      />
      <TabPanel id="general">
        <Form aria-label="General settings">
          <Input label="Homepage" name="homepage" defaultValue="react-aria.adobe.com" />
          <Checkbox label="Show sidebar" defaultChecked />
          <Checkbox label="Show status bar" />
        </Form>
      </TabPanel>
      <TabPanel id="appearance">
        <Form aria-label="Appearance settings">
          <RadioGroup label="Theme" defaultValue="auto">
            <Radio value="auto">Auto</Radio>
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
          </RadioGroup>
          <RadioGroup label="Font size" defaultValue="medium">
            <Radio value="small">Small</Radio>
            <Radio value="medium">Medium</Radio>
            <Radio value="large">Large</Radio>
          </RadioGroup>
        </Form>
      </TabPanel>
      <TabPanel id="notifications">
        <CheckboxGroup label="Notification settings" defaultValue={["account", "dms"]}>
          <Checkbox value="account" label="Account activity" />
          <Checkbox value="mentions" label="Mentions" />
          <Checkbox value="dms" label="Direct messages" />
          <Checkbox value="marketing" label="Marketing emails" />
        </CheckboxGroup>
      </TabPanel>
      <TabPanel id="profile">
        <Form aria-label="Profile settings">
          <Input label="Name" name="name" defaultValue="Devon Govett" />
          <Input label="Username" name="username" defaultValue="@devongovett" />
          <div>
            <Button>Update profile</Button>
          </div>
        </Form>
      </TabPanel>
    </Tabs>
  ),
};

/**
 * Icons accompany the text label rather than replace it — icon-only tabs
 * would need per-tab `aria-label`s and are harder to scan; the WAI-ARIA APG
 * examples keep visible labels for exactly that reason.
 */
export const WithIcons: Story = {
  name: "With icons",
  render: () => {
    const iconLabel = (Icon: typeof Home01Icon, text: string) => (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
        <Icon size="1rem" aria-hidden />
        {text}
      </span>
    );
    return (
      <Tabs defaultSelectedKey="home">
        <TabList
          aria-label="Sections"
          items={[
            { id: "home", label: iconLabel(Home01Icon, "Home") },
            { id: "files", label: iconLabel(Folder01Icon, "Files") },
            { id: "search", label: iconLabel(Search02Icon, "Search") },
            { id: "settings", label: iconLabel(Setting01Icon, "Settings") },
          ]}
        />
        <TabPanel id="home">Home content.</TabPanel>
        <TabPanel id="files">Files content.</TabPanel>
        <TabPanel id="search">Search content.</TabPanel>
        <TabPanel id="settings">Settings content.</TabPanel>
      </Tabs>
    );
  },
};

/**
 * `TabList`'s `items` prop is already a dynamic collection, so tabs can be
 * added and removed from state at runtime. The remove button refuses to
 * empty the list — a tablist with zero tabs has no valid selection.
 */
export const DynamicTabs: Story = {
  name: "Dynamic collection (add / remove tabs)",
  parameters: {
    docs: {
      description: {
        story:
          "Tabs driven from React state. The add/remove buttons are icon-only, so they carry explicit `aria-label`s; removal is capped at one remaining tab so selection always has somewhere to land.",
      },
    },
  },
  render: () => {
    function Demo() {
      const [tabs, setTabs] = useState([
        { id: 1, title: "Tab 1", content: "Tab body 1" },
        { id: 2, title: "Tab 2", content: "Tab body 2" },
        { id: 3, title: "Tab 3", content: "Tab body 3" },
      ]);
      const [nextId, setNextId] = useState(4);

      const addTab = () => {
        setTabs((tabs) => [...tabs, { id: nextId, title: `Tab ${nextId}`, content: `Tab body ${nextId}` }]);
        setNextId((id) => id + 1);
      };
      const removeTab = () => {
        setTabs((tabs) => (tabs.length > 1 ? tabs.slice(0, -1) : tabs));
      };

      return (
        <Tabs defaultSelectedKey={1} style={{ width: "24rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <TabList aria-label="Dynamic tabs" items={tabs.map((tab) => ({ id: tab.id, label: tab.title }))} />
            <Button size="sm" variant="secondary" leadingIcon={<Add01Icon />} aria-label="Add tab" onClick={addTab} />
            <Button
              size="sm"
              variant="secondary"
              leadingIcon={<MinusSignIcon />}
              aria-label="Remove tab"
              onClick={removeTab}
            />
          </div>
          {tabs.map((tab) => (
            <TabPanel key={tab.id} id={tab.id}>
              {tab.content}
            </TabPanel>
          ))}
        </Tabs>
      );
    }
    return <Demo />;
  },
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

/**
 * Controlled selection: `selectedKey` + `onSelectionChange` mirror the tab
 * state into React, for syncing with app state (analytics, unsaved-changes
 * guards, persisting the last-open tab). Prefer `defaultSelectedKey` when
 * nothing outside the Tabs needs to know.
 */
export const ControlledSelection: Story = {
  name: "Controlled selection",
  render: () => {
    function Demo() {
      const [tab, setTab] = useState<Key>("files");
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Tabs selectedKey={tab} onSelectionChange={setTab}>
            <TabList
              aria-label="Sections"
              items={[
                { id: "home", label: "Home" },
                { id: "files", label: "Files" },
                { id: "search", label: "Search", disabled: true },
                { id: "settings", label: "Settings" },
              ]}
            />
            <TabPanel id="home">Home content.</TabPanel>
            <TabPanel id="files">Files content.</TabPanel>
            <TabPanel id="search">Search content.</TabPanel>
            <TabPanel id="settings">Settings content.</TabPanel>
          </Tabs>
          <p style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)", margin: 0 }}>
            Selected tab: {String(tab)}
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};

/**
 * `orientation="vertical"` puts the track beside the panels and switches
 * arrow-key navigation to Up/Down. Suits longer tab lists or settings-style
 * layouts where horizontal space is the constraint.
 */
export const Vertical: Story = {
  render: () => (
    <Tabs defaultSelectedKey="profile" orientation="vertical" style={{ width: "24rem" }}>
      <TabList aria-label="Settings" items={items} />
      <TabPanel id="profile">Profile settings go here.</TabPanel>
      <TabPanel id="account">Account settings go here.</TabPanel>
      <TabPanel id="billing">Billing settings go here.</TabPanel>
    </Tabs>
  ),
};

/**
 * `keyboardActivation="manual"`: arrow keys move focus without selecting;
 * Enter or Space commits. Use when rendering a panel is expensive (network
 * fetch, heavy DOM) so arrowing past a tab doesn't churn panels. Default
 * `automatic` is the right choice for cheap panels — one keystroke fewer.
 */
export const ManualActivation: Story = {
  name: "Manual keyboard activation",
  render: () => (
    <Tabs defaultSelectedKey="profile" keyboardActivation="manual">
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
    await userEvent.keyboard("{ArrowRight}");
    const account = canvas.getByRole("tab", { name: "Account" });
    await expect(account).toHaveFocus();
    // Focus moved but selection did not — that's the manual contract.
    await expect(account).toHaveAttribute("aria-selected", "false");
    await userEvent.keyboard("{Enter}");
    await expect(account).toHaveAttribute("aria-selected", "true");
  },
};

/**
 * Tabs that are also navigation: `href` on an item renders that tab as a
 * real `<a>`, so it gets open-in-new-tab, copy-link, and (with react-aria's
 * `RouterProvider` configured app-side) client-side routing with selection
 * following the URL. Hash hrefs here keep the demo inside Storybook.
 */
export const TabsAsLinks: Story = {
  name: "Tabs as links",
  render: () => (
    <Tabs defaultSelectedKey="overview">
      <TabList
        aria-label="Project"
        items={[
          { id: "overview", label: "Overview", href: "#overview" },
          { id: "activity", label: "Activity", href: "#activity" },
          { id: "settings", label: "Settings", href: "#settings" },
        ]}
      />
      <TabPanel id="overview">Overview page content.</TabPanel>
      <TabPanel id="activity">Activity page content.</TabPanel>
      <TabPanel id="settings">Settings page content.</TabPanel>
    </Tabs>
  ),
};

export const AllTabsDisabled: Story = {
  render: () => (
    <Tabs defaultSelectedKey="profile" isDisabled>
      <TabList aria-label="Settings" items={items} />
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
