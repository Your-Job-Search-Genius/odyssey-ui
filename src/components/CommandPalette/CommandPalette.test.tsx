import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CommandPalette } from "./CommandPalette";

const items = [
  { id: "default", label: "Make Default Resume" },
  { id: "review", label: "Review against a job" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

describe("CommandPalette", () => {
  it("is closed until isOpen is true", () => {
    render(<CommandPalette isOpen={false} onOpenChange={vi.fn()} items={items} enableShortcut={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders every command when open", () => {
    render(<CommandPalette isOpen onOpenChange={vi.fn()} items={items} enableShortcut={false} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(items.length);
  });

  it("filters commands as the user types", async () => {
    const user = userEvent.setup();
    render(<CommandPalette isOpen onOpenChange={vi.fn()} items={items} enableShortcut={false} />);
    const search = screen.getByRole("searchbox", { name: "Search commands" });
    await user.type(search, "delete");
    expect(await screen.findByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("shows a styled empty state when no commands match", async () => {
    const user = userEvent.setup();
    render(<CommandPalette isOpen onOpenChange={vi.fn()} items={items} enableShortcut={false} />);
    const search = screen.getByRole("searchbox", { name: "Search commands" });
    await user.type(search, "zzz-no-match");
    const emptyState = await screen.findByText("No results found.");
    expect(emptyState).toHaveClass("wsu-Menu__empty");
  });

  it("calls onAction and closes when a command is chosen", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    render(<CommandPalette isOpen onOpenChange={onOpenChange} items={items} onAction={onAction} enableShortcut={false} />);
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onAction).toHaveBeenCalledWith("edit");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("selects the highlighted command with the keyboard", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    render(<CommandPalette isOpen onOpenChange={onOpenChange} items={items} onAction={onAction} enableShortcut={false} />);
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onAction).toHaveBeenCalledWith("review");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("opens via the ⌘J/Ctrl+J shortcut when enabled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<CommandPalette isOpen={false} onOpenChange={onOpenChange} items={items} />);
    await user.keyboard("{Control>}j{/Control}");
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("does not register the shortcut when disabled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<CommandPalette isOpen={false} onOpenChange={onOpenChange} items={items} enableShortcut={false} />);
    await user.keyboard("{Control>}j{/Control}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<CommandPalette isOpen onOpenChange={onOpenChange} items={items} enableShortcut={false} />);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("has no axe violations when open", async () => {
    const { container } = render(<CommandPalette isOpen onOpenChange={vi.fn()} items={items} enableShortcut={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
