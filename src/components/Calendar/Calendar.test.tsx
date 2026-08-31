import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseDate, isWeekend } from "@internationalized/date";
import { Calendar } from "./Calendar";

describe("Calendar", () => {
  it("associates the accessible name with the calendar and renders a grid", () => {
    render(<Calendar aria-label="Appointment date" defaultFocusedValue={parseDate("2026-08-15")} />);
    expect(screen.getByRole("application", { name: /Appointment date/ })).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("selects a date on click and reports it via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar aria-label="Appointment date" defaultFocusedValue={parseDate("2026-08-15")} onChange={onChange} />);
    const grid = screen.getByRole("grid");
    const day20 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "20" && !cell.hasAttribute("data-outside-month"));
    expect(day20).toBeDefined();
    await user.click(day20 as HTMLElement);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ year: 2026, month: 8, day: 20 }));
    // aria-selected lives on the ancestor gridcell <td>, not the button div itself.
    expect(day20?.closest('[role="gridcell"]')).toHaveAttribute("aria-selected", "true");
  });

  it("supports keyboard navigation: arrow keys move focus, Enter selects", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar aria-label="Appointment date" defaultFocusedValue={parseDate("2026-08-15")} onChange={onChange} />);
    const grid = screen.getByRole("grid");
    const focusedCell = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.getAttribute("tabindex") === "0");
    (focusedCell as HTMLElement).focus();
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalled();
  });

  it("marks dates before minValue as disabled and unavailable dates via isDateUnavailable", () => {
    render(
      <Calendar
        aria-label="Appointment date"
        defaultFocusedValue={parseDate("2026-08-15")}
        minValue={parseDate("2026-08-10")}
        isDateUnavailable={(date) => isWeekend(date, "en-US")}
      />,
    );
    const grid = screen.getByRole("grid");
    const day5 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "5" && !cell.hasAttribute("data-outside-month"));
    expect(day5).toHaveAttribute("aria-disabled", "true");

    // August 15, 2026 is a Saturday.
    const day15 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "15" && !cell.hasAttribute("data-outside-month"));
    expect(day15).toHaveAttribute("data-unavailable");
  });

  it("shows the error message and links it to the selected cell via aria-describedby", () => {
    render(<Calendar aria-label="Appointment date" value={parseDate("2026-08-20")} errorMessage="That date isn't available" />);
    const message = screen.getByText("That date isn't available");
    const grid = screen.getByRole("grid");
    const selectedGridcell = within(grid)
      .getAllByRole("gridcell")
      .find((cell) => cell.getAttribute("aria-selected") === "true");
    expect(selectedGridcell).toBeDefined();
    const selectedButton = selectedGridcell?.querySelector('[role="button"]');
    expect(selectedButton?.getAttribute("aria-describedby")).toContain(message.id);
  });

  it("disables the calendar", () => {
    render(<Calendar aria-label="Appointment date" defaultFocusedValue={parseDate("2026-08-15")} isDisabled />);
    const grid = screen.getByRole("grid");
    const day20 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "20" && !cell.hasAttribute("data-outside-month"));
    expect(day20).toHaveAttribute("aria-disabled", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Calendar aria-label="Appointment date" defaultFocusedValue={parseDate("2026-08-15")} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
