import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorField } from "./ColorField";

describe("ColorField", () => {
  it("associates the visible label with the input", () => {
    render(<ColorField label="Primary color" />);
    expect(screen.getByRole("textbox", { name: "Primary color" })).toBeInTheDocument();
  });

  it("renders the given value as a hex string", () => {
    render(<ColorField label="Color" value={parseColor("#e73623")} />);
    expect(screen.getByRole("textbox")).toHaveValue("#E73623");
  });

  it("reports the parsed color once the typed hex value is committed on blur", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorField label="Color" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "#00ff00");
    await user.tab();
    expect(onChange).toHaveBeenCalled();
    const last = onChange.mock.calls.at(-1)?.[0] as Color;
    expect(last.toString("hex")).toBe("#00FF00");
  });

  it("edits a single channel when colorSpace/channel are given", () => {
    render(
      <ColorField label="Hue" value={parseColor("hsl(200, 50%, 50%)")} colorSpace="hsl" channel="hue" />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("200°");
  });

  it("marks required fields with the native required attribute, not color alone", () => {
    render(<ColorField label="Color" required />);
    expect(screen.getByRole("textbox")).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows the error message and marks the field invalid", () => {
    render(<ColorField label="Color" errorMessage="Not a valid color" />);
    expect(screen.getByText("Not a valid color")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows helper text when there's no error", () => {
    render(<ColorField label="Color" helperText="Accepts a hex value" />);
    expect(screen.getByText("Accepts a hex value")).toBeInTheDocument();
  });

  it("disables the input", () => {
    render(<ColorField label="Color" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ColorField label="Color" helperText="Accepts a hex value" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
