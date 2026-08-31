import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("associates the visible label and renders off by default", () => {
    render(<Switch label="Low power mode" />);
    const toggle = screen.getByRole("switch", { name: "Low power mode" });
    expect(toggle).not.toBeChecked();
  });

  it("toggles on click (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Switch label="Low power mode" />);
    const toggle = screen.getByRole("switch", { name: "Low power mode" });
    await user.click(toggle);
    expect(toggle).toBeChecked();
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it("respects defaultChecked", () => {
    render(<Switch label="Low power mode" defaultChecked />);
    expect(screen.getByRole("switch", { name: "Low power mode" })).toBeChecked();
  });

  it("supports controlled selection via checked/onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Low power mode" checked={false} onChange={onChange} />);
    const toggle = screen.getByRole("switch", { name: "Low power mode" });
    await user.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
    // Controlled: stays unchecked since the `checked` prop didn't change.
    expect(toggle).not.toBeChecked();
  });

  it("disables the switch and blocks toggling", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Low power mode" disabled onChange={onChange} />);
    const toggle = screen.getByRole("switch", { name: "Low power mode" });
    expect(toggle).toBeDisabled();
    await user.click(toggle);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows description text when there's no error", () => {
    render(<Switch label="2FA" description="Required by your organization." />);
    expect(screen.getByText("Required by your organization.")).toBeInTheDocument();
  });

  it("shows the error message instead of the description when invalid", () => {
    render(<Switch label="2FA" description="Required by your organization." errorMessage="You must accept the terms." />);
    expect(screen.getByText("You must accept the terms.")).toBeInTheDocument();
    expect(screen.queryByText("Required by your organization.")).not.toBeInTheDocument();
  });

  it("applies a custom className alongside the default one", () => {
    render(<Switch label="Low power mode" className="custom" />);
    // `wsu-Switch` is on the wrapping <label> the hidden input renders inside,
    // not on the switch-role element itself.
    expect(screen.getByRole("switch").closest("label")).toHaveClass("wsu-Switch", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Switch label="Low power mode" description="Saves battery." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
