import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorPicker } from "./ColorPicker";
import { ColorField } from "../ColorField";

describe("ColorPicker", () => {
  it("names the trigger from the visible label alone, not the swatch's auto-generated color description", () => {
    render(<ColorPicker label="Fill color" />);
    expect(screen.getByRole("button", { name: "Fill color" })).toBeInTheDocument();
  });

  it("opens the popover on click and shows the default ColorArea/ColorField pair", async () => {
    const user = userEvent.setup();
    render(<ColorPicker label="Fill color" defaultValue={parseColor("#e73623")} />);
    await user.click(screen.getByRole("button", { name: /Fill color/ }));
    expect(await screen.findByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("syncs a hex value typed in the default ColorField to onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker label="Fill color" defaultValue={parseColor("#e73623")} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /Fill color/ }));
    const hexInput = await screen.findByRole("textbox");
    await user.clear(hexInput);
    await user.type(hexInput, "#00ff00");
    await user.tab();
    expect(onChange).toHaveBeenCalled();
    const last = onChange.mock.calls.at(-1)?.[0] as Color;
    expect(last.toString("hex")).toBe("#00FF00");
  });

  it("renders custom popover content instead of the default pair", async () => {
    const user = userEvent.setup();
    render(
      <ColorPicker label="Fill color">
        <ColorField label="Alpha" channel="alpha" />
      </ColorPicker>,
    );
    await user.click(screen.getByRole("button", { name: /Fill color/ }));
    expect(await screen.findByRole("textbox", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("has no axe violations, closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(<ColorPicker label="Fill color" defaultValue={parseColor("#e73623")} />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: /Fill color/ }));
    await screen.findByRole("textbox");
    expect(await axe(container)).toHaveNoViolations();
  });
});
