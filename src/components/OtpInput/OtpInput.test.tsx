import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { OtpInput } from "./OtpInput";

describe("OtpInput", () => {
  it("renders one labeled box per digit inside a named group", () => {
    render(<OtpInput label="Verification code" length={4} />);
    expect(screen.getByRole("group", { name: "Verification code" })).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 1 of 4")).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 4 of 4")).toBeInTheDocument();
  });

  it("auto-advances focus as digits are typed and reports the full code", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onComplete = vi.fn();
    render(<OtpInput label="Verification code" length={4} onChange={onChange} onComplete={onComplete} />);
    await user.type(screen.getByLabelText("Digit 1 of 4"), "1");
    expect(screen.getByLabelText("Digit 2 of 4")).toHaveFocus();
    await user.type(screen.getByLabelText("Digit 2 of 4"), "2");
    await user.type(screen.getByLabelText("Digit 3 of 4"), "3");
    await user.type(screen.getByLabelText("Digit 4 of 4"), "4");
    expect(onChange).toHaveBeenLastCalledWith("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("moves back and clears the previous box on Backspace from an empty box", async () => {
    const user = userEvent.setup();
    render(<OtpInput label="Verification code" length={4} defaultValue="12" />);
    const second = screen.getByLabelText("Digit 2 of 4") as HTMLInputElement;
    second.focus();
    await user.keyboard("{Backspace}");
    expect(second.value).toBe("");
    // second is now empty; another Backspace should move to and clear the first box.
    await user.keyboard("{Backspace}");
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveFocus();
    expect((screen.getByLabelText("Digit 1 of 4") as HTMLInputElement).value).toBe("");
  });

  it("navigates between boxes with arrow keys", async () => {
    const user = userEvent.setup();
    render(<OtpInput label="Verification code" length={4} />);
    screen.getByLabelText("Digit 1 of 4").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByLabelText("Digit 2 of 4")).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveFocus();
  });

  it("distributes a pasted code across every box", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<OtpInput label="Verification code" length={4} onComplete={onComplete} />);
    const first = screen.getByLabelText("Digit 1 of 4");
    first.focus();
    await user.paste("5678");
    expect(onComplete).toHaveBeenCalledWith("5678");
    expect((screen.getByLabelText("Digit 4 of 4") as HTMLInputElement).value).toBe("8");
  });

  it("rejects non-numeric input in numeric mode", async () => {
    const user = userEvent.setup();
    render(<OtpInput label="Verification code" length={4} />);
    const first = screen.getByLabelText("Digit 1 of 4") as HTMLInputElement;
    await user.type(first, "a");
    expect(first.value).toBe("");
  });

  it("shows the error message with role=alert and marks every box invalid", () => {
    render(<OtpInput label="Verification code" length={4} errorMessage="That code didn't work" />);
    expect(screen.getByRole("alert")).toHaveTextContent("That code didn't work");
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveAttribute("aria-invalid", "true");
  });

  it("works controlled via value/onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OtpInput label="Verification code" length={4} value="12" onChange={onChange} />);
    expect((screen.getByLabelText("Digit 2 of 4") as HTMLInputElement).value).toBe("2");
    await user.type(screen.getByLabelText("Digit 3 of 4"), "3");
    expect(onChange).toHaveBeenCalledWith("123");
  });

  it("has no axe violations", async () => {
    const { container } = render(<OtpInput label="Verification code" length={4} helperText="Sent to your email" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
