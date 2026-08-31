import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tabs, TabList, TabPanel } from "./Tabs";

const items = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "billing", label: "Billing", disabled: true },
];

function Demo(props: Partial<React.ComponentProps<typeof Tabs>>) {
  return (
    <Tabs defaultSelectedKey="profile" {...props}>
      <TabList aria-label="Settings" items={items} />
      <TabPanel id="profile">Profile content</TabPanel>
      <TabPanel id="account">Account content</TabPanel>
      <TabPanel id="billing">Billing content</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("exposes tablist/tab/tabpanel roles", () => {
    render(<Demo />);
    expect(screen.getByRole("tablist", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Profile content");
  });

  it("switches panels on click", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole("tab", { name: "Account" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account content");
  });

  it("navigates and activates tabs with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    screen.getByRole("tab", { name: "Profile" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
  });

  it("skips disabled tabs during keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    screen.getByRole("tab", { name: "Account" }).focus();
    await user.keyboard("{ArrowRight}");
    // Billing is disabled — focus should wrap back to Profile, not land on Billing.
    expect(screen.getByRole("tab", { name: "Profile" })).toHaveFocus();
  });

  it("moves focus without selecting under manual keyboard activation", async () => {
    const user = userEvent.setup();
    render(<Demo keyboardActivation="manual" />);
    screen.getByRole("tab", { name: "Profile" }).focus();
    await user.keyboard("{ArrowRight}");
    const account = screen.getByRole("tab", { name: "Account" });
    expect(account).toHaveFocus();
    expect(account).toHaveAttribute("aria-selected", "false");
    await user.keyboard("{Enter}");
    expect(account).toHaveAttribute("aria-selected", "true");
  });

  it("renders link tabs as anchors", () => {
    render(
      <Tabs defaultSelectedKey="home">
        <TabList
          aria-label="Site"
          items={[
            { id: "home", label: "Home", href: "/home" },
            { id: "about", label: "About", href: "/about" },
          ]}
        />
        <TabPanel id="home">Home content</TabPanel>
        <TabPanel id="about">About content</TabPanel>
      </Tabs>,
    );
    const home = screen.getByRole("tab", { name: "Home" });
    expect(home.tagName).toBe("A");
    expect(home).toHaveAttribute("href", "/home");
  });

  it("calls onSelectionChange", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Demo onSelectionChange={onSelectionChange} />);
    await user.click(screen.getByRole("tab", { name: "Account" }));
    expect(onSelectionChange).toHaveBeenCalledWith("account");
  });

  it("supports vertical orientation with arrow-key navigation", async () => {
    const user = userEvent.setup();
    render(<Demo orientation="vertical" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    screen.getByRole("tab", { name: "Profile" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
  });

  it("disables every tab and blocks selection when isDisabled is set", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Demo isDisabled onSelectionChange={onSelectionChange} />);
    const profile = screen.getByRole("tab", { name: "Profile" });
    expect(profile).toHaveAttribute("aria-disabled", "true");
    expect(profile).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Account" }));
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Profile content");
  });

  it("keeps a force-mounted panel in the DOM but inert when not selected", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultSelectedKey="profile">
        <TabList aria-label="Settings" items={items} />
        <TabPanel id="profile">Profile content</TabPanel>
        <TabPanel id="account" shouldForceMount>
          Account content
        </TabPanel>
        <TabPanel id="billing">Billing content</TabPanel>
      </Tabs>,
    );
    expect(screen.getByText("Account content")).not.toBeVisible();
    await user.click(screen.getByRole("tab", { name: "Account" }));
    expect(screen.getByText("Account content")).toBeVisible();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
