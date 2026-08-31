import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "./ColorSwatchPicker";

function Swatches() {
  return (
    <>
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#080" />
      <ColorSwatchPickerItem color="#008" />
    </>
  );
}

describe("ColorSwatchPicker", () => {
  it("renders a listbox of swatch options", () => {
    render(
      <ColorSwatchPicker aria-label="Color">
        <Swatches />
      </ColorSwatchPicker>,
    );
    expect(screen.getByRole("listbox", { name: "Color" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("marks the value swatch as selected", () => {
    render(
      <ColorSwatchPicker aria-label="Color" value={parseColor("#008")}>
        <Swatches />
      </ColorSwatchPicker>,
    );
    const options = screen.getAllByRole("option");
    expect(options[2]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
  });

  it("selects a swatch on click and reports its color via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ColorSwatchPicker aria-label="Color" defaultValue={parseColor("#A00")} onChange={onChange}>
        <Swatches />
      </ColorSwatchPicker>,
    );
    await user.click(screen.getAllByRole("option")[1]!);
    expect(onChange).toHaveBeenCalled();
    const selected = onChange.mock.calls.at(-1)?.[0] as Color;
    expect(selected.toString("hex")).toBe("#008800");
  });

  it("moves focus with arrow keys and selects the focused swatch with Space", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ColorSwatchPicker aria-label="Color" defaultValue={parseColor("#A00")} onChange={onChange}>
        <Swatches />
      </ColorSwatchPicker>,
    );
    const options = screen.getAllByRole("option");
    options[0]!.focus();
    await user.keyboard("{ArrowRight}");
    expect(options[1]).toHaveFocus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalled();
    const selected = onChange.mock.calls.at(-1)?.[0] as Color;
    expect(selected.toString("hex")).toBe("#008800");
  });

  it("disables an individual swatch", () => {
    render(
      <ColorSwatchPicker aria-label="Color" defaultValue={parseColor("#A00")}>
        <ColorSwatchPickerItem color="#A00" />
        <ColorSwatchPickerItem color="#080" disabled />
      </ColorSwatchPicker>,
    );
    expect(screen.getAllByRole("option")[1]).toHaveAttribute("aria-disabled", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ColorSwatchPicker aria-label="Color" defaultValue={parseColor("#A00")}>
        <Swatches />
      </ColorSwatchPicker>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
