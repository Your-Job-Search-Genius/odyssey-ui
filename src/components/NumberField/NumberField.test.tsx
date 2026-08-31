import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  it("associates the visible label with the input", () => {
    render(<NumberField label="Cookies to buy" />);
    expect(screen.getByRole("textbox", { name: "Cookies to buy" })).toBeInTheDocument();
  });

  it("renders the given value formatted for the locale", () => {
    render(<NumberField label="Count" value={1024} />);
    expect(screen.getByRole("textbox")).toHaveValue("1,024");
  });

  it("increments the value when the increment button is pressed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberField label="Count" defaultValue={5} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Increase Count" }));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("decrements the value when the decrement button is pressed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberField label="Count" defaultValue={5} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Decrease Count" }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("clamps to maxValue on increment", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberField label="Count" defaultValue={10} maxValue={10} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Increase Count" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies formatOptions to the displayed value", () => {
    render(<NumberField label="Discount" value={0.25} formatOptions={{ style: "percent" }} />);
    expect(screen.getByRole("textbox")).toHaveValue("25%");
  });

  it("marks required fields with the native required attribute, not visuals alone", () => {
    render(<NumberField label="Width" required />);
    expect(screen.getByRole("textbox")).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows the error message and marks the field invalid", () => {
    render(<NumberField label="Width" errorMessage="Enter a valid width" />);
    expect(screen.getByText("Enter a valid width")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows helper text when there's no error", () => {
    render(<NumberField label="Width" helperText="Measured in pixels" />);
    expect(screen.getByText("Measured in pixels")).toBeInTheDocument();
  });

  it("disables the input and stepper buttons", () => {
    render(<NumberField label="Count" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increase Count" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Decrease Count" })).toBeDisabled();
  });

  it("submits the raw numeric value under the given name", () => {
    render(<NumberField label="Width" name="width" defaultValue={42} />);
    // react-aria-components renders a hidden native input carrying the raw value for form submission.
    expect(document.querySelector('input[name="width"]')).toHaveValue("42");
  });

  it("has no axe violations", async () => {
    const { container } = render(<NumberField label="Count" helperText="A whole number" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
