import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { GridList } from "./GridList";
import { Button } from "../Button";

const items = [
  { id: "ada", title: "Ada Lovelace", description: "Mathematician" },
  { id: "grace", title: "Grace Hopper", description: "Computer scientist" },
  { id: "margaret", title: "Margaret Hamilton", description: "Software engineer", disabled: true },
];

describe("GridList", () => {
  it("associates the accessible name with the grid", () => {
    render(<GridList aria-label="People" items={items} />);
    expect(screen.getByRole("grid", { name: "People" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("selects a row and reports the selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<GridList aria-label="People" items={items} onSelectionChange={onSelectionChange} />);
    await user.click(screen.getByRole("row", { name: /Ada Lovelace/ }));
    expect(onSelectionChange).toHaveBeenCalled();
    expect(screen.getByRole("row", { name: /Ada Lovelace/ })).toHaveAttribute("aria-selected", "true");
  });

  it("disables a row marked disabled", () => {
    render(<GridList aria-label="People" items={items} />);
    expect(screen.getByRole("row", { name: /Margaret Hamilton/ })).toHaveAttribute("aria-disabled", "true");
  });

  it("filters rows as the user types when searchable", async () => {
    const user = userEvent.setup();
    render(<GridList aria-label="People" items={items} searchable searchLabel="Search people" />);
    const search = screen.getByRole("searchbox", { name: "Search people" });
    await user.type(search, "Grace");
    expect(await screen.findByRole("row", { name: /Grace Hopper/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Ada Lovelace/ })).not.toBeInTheDocument();
  });

  it("shows a styled empty state when filtering matches nothing", async () => {
    const user = userEvent.setup();
    render(<GridList aria-label="People" items={items} searchable searchLabel="Search people" />);
    const search = screen.getByRole("searchbox", { name: "Search people" });
    await user.type(search, "zzz-no-match");
    const emptyState = await screen.findByText("No results found.");
    expect(emptyState).toHaveClass("wsu-Menu__empty");
  });

  it("reaches a row's trailing action with Tab, and Arrow keys move between rows", async () => {
    const user = userEvent.setup();
    const itemsWithActions = items.map((item) => ({
      ...item,
      actions: (
        <Button variant="text" size="sm">
          Remove
        </Button>
      ),
    }));
    render(<GridList aria-label="People" items={itemsWithActions} />);
    const adaRow = screen.getByRole("row", { name: /Ada Lovelace/ });
    const graceRow = screen.getByRole("row", { name: /Grace Hopper/ });

    await user.tab();
    expect(adaRow).toHaveFocus();
    await user.tab();
    expect(within(adaRow).getByRole("button", { name: "Remove" })).toHaveFocus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(adaRow).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(graceRow).toHaveFocus();
    await user.tab();
    expect(within(graceRow).getByRole("button", { name: "Remove" })).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<GridList aria-label="People" items={items} searchable searchLabel="Search people" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
