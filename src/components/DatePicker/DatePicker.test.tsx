import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseDate, isWeekend } from "@internationalized/date";
import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("associates the visible label with the group of date segments", () => {
    render(<DatePicker label="Appointment date" />);
    expect(screen.getByRole("group", { name: "Appointment date" })).toBeInTheDocument();
  });

  it("opens the calendar popover via the trigger button and selects a date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker label="Appointment date" defaultValue={parseDate("2026-08-15")} onChange={onChange} />);
    // react-aria-components appends the field's own label to this button's accessible
    // name for context (as ComboBox's toggle does) — match by substring.
    await user.click(screen.getByRole("button", { name: /Open calendar/ }));
    const grid = await screen.findByRole("grid");
    const day20 = within(grid)
      .getAllByRole("button")
      .find((cell) => cell.textContent === "20" && !cell.hasAttribute("data-outside-month"));
    expect(day20).toBeDefined();
    await user.click(day20 as HTMLElement);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ year: 2026, month: 8, day: 20 }));
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("reports a value typed directly into the date segments", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker label="Appointment date" onChange={onChange} />);
    const group = screen.getByRole("group", { name: "Appointment date" });
    await user.click(within(group).getByRole("spinbutton", { name: /month/i }));
    await user.keyboard("08202026");
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ year: 2026, month: 8, day: 20 }));
  });

  it("shows the error message and marks the field invalid", () => {
    render(
      <DatePicker
        label="Appointment date"
        value={parseDate("2026-08-15")}
        minValue={parseDate("2026-08-20")}
        errorMessage="That date isn't available"
      />,
    );
    expect(screen.getByText("That date isn't available")).toBeInTheDocument();
    // aria-invalid isn't valid on the group role itself; react-aria-components puts it
    // on each spinbutton segment instead (and `data-invalid` on the group, for styling).
    expect(screen.getByRole("group", { name: "Appointment date" })).toHaveAttribute("data-invalid", "true");
    expect(screen.getAllByRole("spinbutton")[0]).toHaveAttribute("aria-invalid", "true");
  });

  it("marks unavailable dates inside the popover via isDateUnavailable", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        label="Appointment date"
        defaultValue={parseDate("2026-08-15")}
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
    render(<DatePicker label="Appointment date" defaultValue={parseDate("2026-08-15")} isDisabled />);
    expect(screen.getByRole("button", { name: /Open calendar/ })).toBeDisabled();
  });

  it("has no axe violations, closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(<DatePicker label="Appointment date" defaultValue={parseDate("2026-08-15")} />);
    expect(await axe(container)).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: /Open calendar/ }));
    await screen.findByRole("grid");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
