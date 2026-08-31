import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseDate } from "@internationalized/date";
import { DateField } from "./DateField";

describe("DateField", () => {
  it("associates the visible label with the segment group", () => {
    render(<DateField label="Appointment date" />);
    expect(screen.getByRole("group", { name: "Appointment date" })).toBeInTheDocument();
  });

  it("renders the given value split across segments", () => {
    render(<DateField label="Appointment date" value={parseDate("2026-08-31")} />);
    const segments = screen.getAllByRole("spinbutton");
    expect(segments.map((s) => s.textContent)).toEqual(["8", "31", "2026"]);
  });

  it("reports the parsed date via onChange once all segments are filled in", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateField label="Appointment date" onChange={onChange} />);
    const segments = screen.getAllByRole("spinbutton");
    (segments[0] as HTMLElement).focus();
    await user.keyboard("08312026");
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ year: 2026, month: 8, day: 31 }));
  });

  it("supports keyboard navigation: arrow keys increment the focused segment", async () => {
    const onChange = vi.fn();
    // August 15 (not 31) so incrementing the month never lands on a day that
    // doesn't exist in the target month (e.g. "September 31"), which would
    // defer onChange until blur instead of firing it eagerly.
    render(<DateField label="Appointment date" value={parseDate("2026-08-15")} onChange={onChange} />);
    const monthSegment = screen.getByLabelText(/^month/i);
    monthSegment.focus();
    fireEvent.keyDown(monthSegment, { key: "ArrowUp" });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ month: 9 })));
  });

  it("shows the error message and marks the field invalid", () => {
    const { container } = render(<DateField label="Appointment date" errorMessage="That date isn't available" isInvalid />);
    expect(screen.getByText("That date isn't available")).toBeInTheDocument();
    expect(container.querySelector(".wsu-DateField")).toHaveAttribute("data-invalid");
  });

  it("shows helper text when there's no error", () => {
    render(<DateField label="Appointment date" helperText="Use MM/DD/YYYY format." />);
    expect(screen.getByText("Use MM/DD/YYYY format.")).toBeInTheDocument();
  });

  it("disables every segment", () => {
    render(<DateField label="Appointment date" value={parseDate("2026-08-31")} isDisabled />);
    for (const segment of screen.getAllByRole("spinbutton")) {
      expect(segment).toHaveAttribute("aria-disabled", "true");
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<DateField label="Appointment date" helperText="Use MM/DD/YYYY format." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
