import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseDate, isWeekend } from "@internationalized/date";
import { RangeCalendar } from "./RangeCalendar";

describe("RangeCalendar", () => {
  it("associates the accessible name with the calendar and renders a grid", () => {
    render(<RangeCalendar aria-label="Trip dates" defaultFocusedValue={parseDate("2026-08-15")} />);
    expect(screen.getByRole("application", { name: /Trip dates/ })).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("selects a range across two clicks and reports it via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangeCalendar aria-label="Trip dates" defaultFocusedValue={parseDate("2026-08-15")} onChange={onChange} />);
    const grid = screen.getByRole("grid");
    const findDay = (day: string) =>
      within(grid)
        .getAllByRole("button")
        .find((cell) => cell.textContent === day && !cell.hasAttribute("data-outside-month")) as HTMLElement;

    await user.click(findDay("10"));
    await user.click(findDay("15"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        start: expect.objectContaining({ year: 2026, month: 8, day: 10 }),
        end: expect.objectContaining({ year: 2026, month: 8, day: 15 }),
      }),
    );
  });

  it("marks the start and end cells of a committed range", () => {
    render(
      <RangeCalendar
        aria-label="Trip dates"
        defaultValue={{ start: parseDate("2026-08-10"), end: parseDate("2026-08-15") }}
      />,
    );
    const grid = screen.getByRole("grid");
    const day10 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "10" && !cell.hasAttribute("data-outside-month"));
    const day15 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "15" && !cell.hasAttribute("data-outside-month"));
    const day12 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "12" && !cell.hasAttribute("data-outside-month"));

    expect(day10).toHaveAttribute("data-selection-start");
    expect(day15).toHaveAttribute("data-selection-end");
    expect(day12).not.toHaveAttribute("data-selection-start");
    expect(day12).not.toHaveAttribute("data-selection-end");
    expect(day12?.closest('[role="gridcell"]')).toHaveAttribute("aria-selected", "true");
  });

  it("supports keyboard navigation: arrow keys move focus, Enter anchors then commits", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RangeCalendar aria-label="Trip dates" defaultFocusedValue={parseDate("2026-08-15")} onChange={onChange} />);
    const grid = screen.getByRole("grid");
    const focusedCell = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.getAttribute("tabindex") === "0");
    (focusedCell as HTMLElement).focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalled();
  });

  it("marks dates before minValue as disabled and unavailable dates via isDateUnavailable", () => {
    render(
      <RangeCalendar
        aria-label="Trip dates"
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

  it("shows the error message", () => {
    render(
      <RangeCalendar
        aria-label="Trip dates"
        defaultValue={{ start: parseDate("2026-08-10"), end: parseDate("2026-08-15") }}
        errorMessage="That range isn't available"
      />,
    );
    expect(screen.getByText("That range isn't available")).toBeInTheDocument();
  });

  it("disables the calendar", () => {
    render(<RangeCalendar aria-label="Trip dates" defaultFocusedValue={parseDate("2026-08-15")} isDisabled />);
    const grid = screen.getByRole("grid");
    const day20 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "20" && !cell.hasAttribute("data-outside-month"));
    expect(day20).toHaveAttribute("aria-disabled", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<RangeCalendar aria-label="Trip dates" defaultFocusedValue={parseDate("2026-08-15")} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
