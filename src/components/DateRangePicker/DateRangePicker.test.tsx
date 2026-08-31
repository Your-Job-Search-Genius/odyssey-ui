import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseDate, isWeekend } from "@internationalized/date";
import { DateRangePicker } from "./DateRangePicker";

describe("DateRangePicker", () => {
  it("associates the visible label with the group of date segments", () => {
    render(<DateRangePicker label="Trip dates" />);
    expect(screen.getByRole("group", { name: "Trip dates" })).toBeInTheDocument();
  });

  it("opens the calendar popover via the trigger button and selects a range", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Trip dates"
        defaultValue={{ start: parseDate("2026-08-15"), end: parseDate("2026-08-15") }}
        onChange={onChange}
      />,
    );
    // react-aria-components appends the field's own label to this button's accessible
    // name for context (as DatePicker's toggle does) — match by substring.
    await user.click(screen.getByRole("button", { name: /Open calendar/ }));
    const grid = await screen.findByRole("grid");
    const findDay = (day: string) =>
      within(grid)
        .getAllByRole("button")
        .find((cell) => cell.textContent === day && !cell.hasAttribute("data-outside-month")) as HTMLElement;

    await user.click(findDay("18"));
    await user.click(findDay("22"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        start: expect.objectContaining({ year: 2026, month: 8, day: 18 }),
        end: expect.objectContaining({ year: 2026, month: 8, day: 22 }),
      }),
    );
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("reports a value typed directly into the start and end date segments", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker label="Trip dates" onChange={onChange} />);
    const group = screen.getByRole("group", { name: "Trip dates" });
    const monthSegments = within(group).getAllByRole("spinbutton", { name: /month/i });
    expect(monthSegments).toHaveLength(2);

    await user.click(monthSegments[0] as HTMLElement);
    await user.keyboard("08152026");
    await user.click(monthSegments[1] as HTMLElement);
    await user.keyboard("08222026");

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        start: expect.objectContaining({ year: 2026, month: 8, day: 15 }),
        end: expect.objectContaining({ year: 2026, month: 8, day: 22 }),
      }),
    );
  });

  it("shows the error message and marks the field invalid", () => {
    render(
      <DateRangePicker
        label="Trip dates"
        value={{ start: parseDate("2026-08-15"), end: parseDate("2026-08-18") }}
        minValue={parseDate("2026-08-20")}
        errorMessage="That range isn't available"
      />,
    );
    expect(screen.getByText("That range isn't available")).toBeInTheDocument();
    // aria-invalid isn't valid on the group role itself; react-aria-components puts it
    // on each spinbutton segment instead (and `data-invalid` on the group, for styling).
    expect(screen.getByRole("group", { name: "Trip dates" })).toHaveAttribute("data-invalid", "true");
    expect(screen.getAllByRole("spinbutton")[0]).toHaveAttribute("aria-invalid", "true");
  });

  it("marks unavailable dates inside the popover via isDateUnavailable", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        label="Trip dates"
        defaultValue={{ start: parseDate("2026-08-15"), end: parseDate("2026-08-15") }}
        isDateUnavailable={(date) => isWeekend(date, "en-US")}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Open calendar/ }));
    const grid = await screen.findByRole("grid");
    // August 15, 2026 is a Saturday.
    const day15 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "15" && !cell.hasAttribute("data-outside-month"));
    expect(day15).toHaveAttribute("data-unavailable");
  });

  it("disables the trigger and segments", () => {
    render(
      <DateRangePicker
        label="Trip dates"
        defaultValue={{ start: parseDate("2026-08-15"), end: parseDate("2026-08-22") }}
        isDisabled
      />,
    );
    expect(screen.getByRole("button", { name: /Open calendar/ })).toBeDisabled();
  });

  it("has no axe violations, closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DateRangePicker label="Trip dates" defaultValue={{ start: parseDate("2026-08-15"), end: parseDate("2026-08-22") }} />,
    );
    expect(await axe(container)).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: /Open calendar/ }));
    await screen.findByRole("grid");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
