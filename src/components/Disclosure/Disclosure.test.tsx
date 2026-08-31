import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { Disclosure, DisclosureHeader, DisclosurePanel, DisclosureGroup } from "./Disclosure";

describe("Disclosure", () => {
  it("is collapsed by default and expands on click", async () => {
    const user = userEvent.setup();
    render(
      <Disclosure>
        <DisclosureHeader>System Requirements</DisclosureHeader>
        <DisclosurePanel>Details here</DisclosurePanel>
      </Disclosure>,
    );
    const trigger = screen.getByRole("button", { name: "System Requirements" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("starts expanded via defaultExpanded", () => {
    render(
      <Disclosure defaultExpanded>
        <DisclosureHeader>Billing Address</DisclosureHeader>
        <DisclosurePanel>123 Main St</DisclosurePanel>
      </Disclosure>,
    );
    expect(screen.getByRole("button", { name: "Billing Address" })).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles via keyboard (Enter)", async () => {
    const user = userEvent.setup();
    render(
      <Disclosure>
        <DisclosureHeader>Section</DisclosureHeader>
        <DisclosurePanel>Content</DisclosurePanel>
      </Disclosure>,
    );
    const trigger = screen.getByRole("button", { name: "Section" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("works controlled via expanded/onExpandedChange", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [expanded, setExpanded] = useState(false);
      return (
        <Disclosure expanded={expanded} onExpandedChange={setExpanded}>
          <DisclosureHeader>Section</DisclosureHeader>
          <DisclosurePanel>Content</DisclosurePanel>
        </Disclosure>
      );
    }
    render(<Controlled />);
    const trigger = screen.getByRole("button", { name: "Section" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("does not expand when disabled", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(
      <Disclosure disabled onExpandedChange={onExpandedChange}>
        <DisclosureHeader>Locked</DisclosureHeader>
        <DisclosurePanel>Content</DisclosurePanel>
      </Disclosure>,
    );
    await user.click(screen.getByRole("button", { name: "Locked" }));
    expect(onExpandedChange).not.toHaveBeenCalled();
  });

  it("has no axe violations across collapsed, expanded, and disabled states", async () => {
    const { container } = render(
      <div>
        <Disclosure>
          <DisclosureHeader>Collapsed</DisclosureHeader>
          <DisclosurePanel>Content</DisclosurePanel>
        </Disclosure>
        <Disclosure defaultExpanded>
          <DisclosureHeader>Expanded</DisclosureHeader>
          <DisclosurePanel>Content</DisclosurePanel>
        </Disclosure>
        <Disclosure disabled>
          <DisclosureHeader>Disabled</DisclosureHeader>
          <DisclosurePanel>Content</DisclosurePanel>
        </Disclosure>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("DisclosureGroup", () => {
  it("expands the default expanded key and keeps others collapsed", () => {
    render(
      <DisclosureGroup defaultExpandedKeys={["a"]}>
        <Disclosure id="a">
          <DisclosureHeader>First</DisclosureHeader>
          <DisclosurePanel>First content</DisclosurePanel>
        </Disclosure>
        <Disclosure id="b">
          <DisclosureHeader>Second</DisclosureHeader>
          <DisclosurePanel>Second content</DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>,
    );
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute("aria-expanded", "false");
  });

  it("collapses the previously expanded item when a new one opens (single-expand mode)", async () => {
    const user = userEvent.setup();
    render(
      <DisclosureGroup defaultExpandedKeys={["a"]}>
        <Disclosure id="a">
          <DisclosureHeader>First</DisclosureHeader>
          <DisclosurePanel>First content</DisclosurePanel>
        </Disclosure>
        <Disclosure id="b">
          <DisclosureHeader>Second</DisclosureHeader>
          <DisclosurePanel>Second content</DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>,
    );
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute("aria-expanded", "true");
  });

  it("allows multiple expanded items when allowsMultipleExpanded is set", async () => {
    const user = userEvent.setup();
    render(
      <DisclosureGroup allowsMultipleExpanded defaultExpandedKeys={["a"]}>
        <Disclosure id="a">
          <DisclosureHeader>First</DisclosureHeader>
          <DisclosurePanel>First content</DisclosurePanel>
        </Disclosure>
        <Disclosure id="b">
          <DisclosureHeader>Second</DisclosureHeader>
          <DisclosurePanel>Second content</DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>,
    );
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute("aria-expanded", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DisclosureGroup defaultExpandedKeys={["a"]}>
        <Disclosure id="a">
          <DisclosureHeader>First</DisclosureHeader>
          <DisclosurePanel>First content</DisclosurePanel>
        </Disclosure>
        <Disclosure id="b">
          <DisclosureHeader>Second</DisclosureHeader>
          <DisclosurePanel>Second content</DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
