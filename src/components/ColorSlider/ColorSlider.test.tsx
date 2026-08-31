import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorSlider } from "./ColorSlider";

// A mid-range default (not already at the channel's min/max) so ArrowRight has
// room to change the value — see the "moves the channel" test below.
const midRangeColor = () => parseColor("hsl(200, 50%, 50%)");

describe("ColorSlider", () => {
  it("exposes a single channel slider by role", () => {
    render(<ColorSlider label="Hue" defaultValue={midRangeColor()} channel="hue" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("associates the visible label with the slider", () => {
    render(<ColorSlider label="Hue" defaultValue={midRangeColor()} channel="hue" />);
    expect(screen.getByRole("slider")).toHaveAccessibleName(expect.stringContaining("Hue"));
  });

  it("moves the channel on ArrowRight and reports the new color via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorSlider label="Saturation" defaultValue={midRangeColor()} channel="saturation" onChange={onChange} />);
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalled();
    const updated = onChange.mock.calls[0]?.[0] as Color;
    expect(updated.getChannelValue("saturation")).not.toBe(50);
  });

  it("fires onChangeEnd when keyboard interaction completes", async () => {
    const user = userEvent.setup();
    const onChangeEnd = vi.fn();
    render(<ColorSlider label="Hue" defaultValue={midRangeColor()} channel="hue" onChangeEnd={onChangeEnd} />);
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onChangeEnd).toHaveBeenCalled();
  });

  it("disables the channel input", () => {
    render(<ColorSlider label="Hue" defaultValue={midRangeColor()} channel="hue" disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ColorSlider label="Hue" defaultValue={midRangeColor()} channel="hue" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
