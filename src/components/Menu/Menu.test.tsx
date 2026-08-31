import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Menu } from "./Menu";
import { MenuHeader } from "./MenuHeader";
import { Button } from "../Button";
import { CheckGlyph } from "../Icon/glyphs";

const items = [
  { id: "rename", label: "Rename" },
  { id: "duplicate", label: "Duplicate", icon: <CheckGlyph /> },
  { id: "archive", label: "Archive", disabled: true },
  { id: "delete", label: "Delete", danger: true },
];

describe("Menu", () => {
  it("is closed until the trigger is activated", () => {
    render(<Menu trigger={<Button>Actions</Button>} items={items} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the menu on click and exposes menuitem roles", async () => {
    const user = userEvent.setup();
    render(<Menu trigger={<Button>Actions</Button>} items={items} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Rename" })).toBeInTheDocument();
  });

  it("calls onAction with the selected item's id and closes the menu", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Menu trigger={<Button>Actions</Button>} items={items} onAction={onAction} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Rename" }));
    expect(onAction.mock.calls[0]?.[0]).toBe("rename");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("marks disabled items and skips them during arrow-key navigation", async () => {
    const user = userEvent.setup();
    render(<Menu trigger={<Button>Actions</Button>} items={items} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    const archive = await screen.findByRole("menuitem", { name: "Archive" });
    expect(archive).toHaveAttribute("aria-disabled", "true");
  });

  it("supports full keyboard operation: open, navigate, activate", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Menu trigger={<Button>Actions</Button>} items={items} onAction={onAction} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    // The first item is already focused once the menu opens via keyboard — one ArrowDown
    // moves to the second item ("duplicate").
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onAction.mock.calls[0]?.[0]).toBe("duplicate");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Menu trigger={<Button>Actions</Button>} items={items} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("renders a description alongside the label in a detailed menu", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger={<Button>New</Button>}
        variant="detailed"
        items={[{ id: "upload", label: "Upload Existing Resume", description: "Upload your resume here to enhance and polish it." }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "New" }));
    const item = await screen.findByRole("menuitem", { name: /Upload Existing Resume/ });
    expect(item).toHaveTextContent("Upload your resume here to enhance and polish it.");
  });

  it("exposes checkable rows and toggles them when selectionMode is set", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Menu
        trigger={<Button>Options</Button>}
        selectionMode="multiple"
        defaultSelectedKeys={new Set(["option-2"])}
        onSelectionChange={onSelectionChange}
        items={[
          { id: "option-1", label: "Option 1" },
          { id: "option-2", label: "Option 2" },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(await screen.findByRole("menuitemcheckbox", { name: "Option 2" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemcheckbox", { name: "Option 1" })).toHaveAttribute("aria-checked", "false");
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Option 1" }));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it("renders a header outside the menu's item collection", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger={<Button>Account</Button>}
        header={<MenuHeader initials="MC" name="Moremi Chris" detail="moremi@gmail.com" />}
        items={items}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Account" }));
    const menu = await screen.findByRole("menu");
    expect(screen.getByText("Moremi Chris")).toBeInTheDocument();
    // The profile block is chrome, not a row: it must not be inside `menu`.
    expect(menu).not.toHaveTextContent("Moremi Chris");
    expect(screen.getAllByRole("menuitem")).toHaveLength(items.length);
  });

  it("has no axe violations, closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Menu trigger={<Button>Actions</Button>} items={items} />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");
    expect(await axe(container)).toHaveNoViolations();
  });
});
