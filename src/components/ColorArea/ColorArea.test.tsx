import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorArea } from "./ColorArea";

// A mid-range default (not already at a channel's min/max) so ArrowRight has
// room to change the value — see the "moves the x channel" test below.
const midRangeColor = () => parseColor("hsl(200, 50%, 50%)");

// Pointer-drag interaction is intentionally not tested here: jsdom has no
// real layout geometry (getBoundingClientRect) or PointerEvent capture
// semantics for useColorArea's drag handling to compute against, and no
// other component in this repo tests drag interaction. Keyboard operation
// is the accessibility-critical path and is covered thoroughly below.
//
// React Aria renders one native `role="slider"` `<input type="range">` per
// channel, but keeps the not-yet-interacted-with one `aria-hidden` "so that
// only a single '2d slider' control shows up when listing form elements for
// screen readers" (its own comment) — it's revealed once its value changes
// via keyboard. So only 1 slider is queryable by role before any keyboard
// interaction, and 2 afterward; tests that need both regardless of
// aria-hidden query the DOM directly instead of by role.

describe("ColorArea", () => {
  it("exposes the x-channel slider by role before any interaction", () => {
    render(<ColorArea aria-label="Color" defaultValue={midRangeColor()} xChannel="saturation" yChannel="lightness" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("reveals the y-channel slider once a value changes via keyboard", async () => {
    const user = userEvent.setup();
    render(<ColorArea aria-label="Color" defaultValue={midRangeColor()} xChannel="saturation" yChannel="lightness" />);
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("associates the accessible name with the channel slider", () => {
    render(<ColorArea aria-label="Background color" defaultValue={midRangeColor()} xChannel="saturation" yChannel="lightness" />);
    expect(screen.getByRole("slider")).toHaveAccessibleName(expect.stringContaining("Background color"));
  });

  it("moves the x channel on ArrowRight and reports the new color via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ColorArea aria-label="Color" defaultValue={midRangeColor()} xChannel="saturation" yChannel="lightness" onChange={onChange} />,
    );
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalled();
    const updated = onChange.mock.calls[0]?.[0] as Color;
    expect(updated.getChannelValue("saturation")).not.toBe(50);
  });

  it("fires onChangeEnd when keyboard interaction completes", async () => {
    const user = userEvent.setup();
    const onChangeEnd = vi.fn();
    render(
      <ColorArea aria-label="Color" defaultValue={midRangeColor()} xChannel="saturation" yChannel="lightness" onChangeEnd={onChangeEnd} />,
    );
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onChangeEnd).toHaveBeenCalled();
  });

  it("disables both channel inputs", () => {
    const { container } = render(
      <ColorArea aria-label="Color" defaultValue={midRangeColor()} xChannel="saturation" yChannel="lightness" disabled />,
    );
    const inputs = container.querySelectorAll('input[type="range"]');
    expect(inputs).toHaveLength(2);
    for (const input of inputs) {
      expect(input).toBeDisabled();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ColorArea aria-label="Color" defaultValue={midRangeColor()} xChannel="saturation" yChannel="lightness" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
