import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ListBox } from "./ListBox";

const items = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python", disabled: true },
];

describe("ListBox", () => {
  it("associates the accessible name with the listbox", () => {
    render(<ListBox aria-label="Languages" items={items} />);
    expect(screen.getByRole("listbox", { name: "Languages" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("selects a single option and reports the selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<ListBox aria-label="Languages" items={items} onSelectionChange={onSelectionChange} />);
    await user.click(screen.getByRole("option", { name: "TypeScript" }));
    expect(onSelectionChange).toHaveBeenCalled();
    expect(screen.getByRole("option", { name: "TypeScript" })).toHaveAttribute("aria-selected", "true");
  });

  it("supports multiple selection", async () => {
    const user = userEvent.setup();
    render(<ListBox aria-label="Languages" items={items} selectionMode="multiple" />);
    await user.click(screen.getByRole("option", { name: "JavaScript" }));
    await user.click(screen.getByRole("option", { name: "TypeScript" }));
    expect(screen.getByRole("option", { name: "JavaScript" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "TypeScript" })).toHaveAttribute("aria-selected", "true");
  });

  it("disables an item marked disabled", () => {
    render(<ListBox aria-label="Languages" items={items} />);
    expect(screen.getByRole("option", { name: "Python" })).toHaveAttribute("aria-disabled", "true");
  });

  it("filters options as the user types when searchable", async () => {
    const user = userEvent.setup();
    render(<ListBox aria-label="Languages" items={items} searchable searchLabel="Search languages" />);
    const search = screen.getByRole("searchbox", { name: "Search languages" });
    await user.type(search, "Type");
    expect(await screen.findByRole("option", { name: "TypeScript" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "JavaScript" })).not.toBeInTheDocument();
  });

  it("shows an empty state when filtering matches nothing", async () => {
    const user = userEvent.setup();
    render(<ListBox aria-label="Languages" items={items} searchable searchLabel="Search languages" />);
    const search = screen.getByRole("searchbox", { name: "Search languages" });
    await user.type(search, "zzz-no-match");
    const emptyState = await screen.findByText("No results found.");
    expect(emptyState).toBeInTheDocument();
    expect(emptyState).toHaveClass("wsu-Menu__empty");
  });

  it("supports arrow key navigation", async () => {
    const user = userEvent.setup();
    const navItems = [
      { id: "javascript", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
      { id: "python", label: "Python" },
    ];
    render(<ListBox aria-label="Languages" items={navItems} />);
    fireEvent.focus(screen.getByRole("option", { name: "JavaScript" }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "TypeScript" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Python" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("option", { name: "TypeScript" })).toHaveFocus();
  });

  it("supports Home/End navigation", async () => {
    const user = userEvent.setup();
    const navItems = [
      { id: "javascript", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
      { id: "python", label: "Python" },
    ];
    render(<ListBox aria-label="Languages" items={navItems} />);
    fireEvent.focus(screen.getByRole("option", { name: "JavaScript" }));
    await user.keyboard("{End}");
    expect(screen.getByRole("option", { name: "Python" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("option", { name: "JavaScript" })).toHaveFocus();
  });

  it("supports typeahead to jump to a matching item", async () => {
    const user = userEvent.setup();
    const navItems = [
      { id: "javascript", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
      { id: "python", label: "Python" },
    ];
    render(<ListBox aria-label="Languages" items={navItems} />);
    fireEvent.focus(screen.getByRole("option", { name: "JavaScript" }));
    await user.keyboard("Python");
    expect(screen.getByRole("option", { name: "Python" })).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ListBox aria-label="Languages" items={items} searchable searchLabel="Search languages" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
