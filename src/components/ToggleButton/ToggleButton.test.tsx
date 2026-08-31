import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ToggleButton, ToggleButtonGroup } from "./ToggleButton";

describe("ToggleButton", () => {
  it("renders a button with aria-pressed, off by default", () => {
    render(<ToggleButton>Bold</ToggleButton>);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles aria-pressed on click (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<ToggleButton>Bold</ToggleButton>);
    const button = screen.getByRole("button", { name: "Bold" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("respects defaultSelected", () => {
    render(<ToggleButton defaultSelected>Bold</ToggleButton>);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled selection via selected/onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ToggleButton selected={false} onChange={onChange}>
        Bold
      </ToggleButton>,
    );
    const button = screen.getByRole("button", { name: "Bold" });
    await user.click(button);
    expect(onChange).toHaveBeenCalledWith(true);
    // Controlled: stays unpressed since the `selected` prop didn't change.
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("disables the button and blocks toggling", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ToggleButton disabled onChange={onChange}>
        Bold
      </ToggleButton>,
    );
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies a custom className alongside the default one", () => {
    render(<ToggleButton className="custom">Bold</ToggleButton>);
    expect(screen.getByRole("button")).toHaveClass("wsu-ToggleButton", "custom");
  });

  it("marks an icon-only button as icon-only and uses aria-label as its name", () => {
    render(<ToggleButton aria-label="Bold" />);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveClass("wsu-ToggleButton--icon-only");
  });

  it("has no axe violations", async () => {
    const { container } = render(<ToggleButton>Bold</ToggleButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ToggleButtonGroup", () => {
  it("defaults to single selection with radiogroup/radio semantics", () => {
    render(
      <ToggleButtonGroup aria-label="Alignment" defaultSelectedKeys={["left"]}>
        <ToggleButton id="left">Left</ToggleButton>
        <ToggleButton id="right">Right</ToggleButton>
      </ToggleButtonGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Alignment" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Right" })).toHaveAttribute("aria-checked", "false");
  });

  it("moves selection between items on click in single mode", async () => {
    const user = userEvent.setup();
    render(
      <ToggleButtonGroup aria-label="Alignment" defaultSelectedKeys={["left"]}>
        <ToggleButton id="left">Left</ToggleButton>
        <ToggleButton id="right">Right</ToggleButton>
      </ToggleButtonGroup>,
    );
    await user.click(screen.getByRole("radio", { name: "Right" }));
    expect(screen.getByRole("radio", { name: "Right" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute("aria-checked", "false");
  });

  it("moves focus with arrow keys without changing selection", async () => {
    const user = userEvent.setup();
    render(
      <ToggleButtonGroup aria-label="Alignment" defaultSelectedKeys={["left"]}>
        <ToggleButton id="left">Left</ToggleButton>
        <ToggleButton id="center">Center</ToggleButton>
        <ToggleButton id="right">Right</ToggleButton>
      </ToggleButtonGroup>,
    );
    screen.getByRole("radio", { name: "Left" }).focus();
    await user.keyboard("{ArrowRight}");
    // Roving-tabindex arrow keys move focus only, same as the toolbar pattern —
    // unlike a native radio group, selection still requires Enter/Space or a click.
    expect(screen.getByRole("radio", { name: "Center" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Center" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute("aria-checked", "true");

    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Center" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute("aria-checked", "false");
  });

  it("allows independent multi-selection in multiple mode", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ToggleButtonGroup aria-label="Formatting" selectionMode="multiple" onSelectionChange={onSelectionChange}>
        <ToggleButton id="bold">Bold</ToggleButton>
        <ToggleButton id="italic">Italic</ToggleButton>
      </ToggleButtonGroup>,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    await user.click(screen.getByRole("button", { name: "Italic" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "true");
    expect(onSelectionChange).toHaveBeenCalledTimes(2);
  });

  it("disables every item when the group is disabled", () => {
    render(
      <ToggleButtonGroup aria-label="Alignment" disabled defaultSelectedKeys={["left"]}>
        <ToggleButton id="left">Left</ToggleButton>
        <ToggleButton id="right">Right</ToggleButton>
      </ToggleButtonGroup>,
    );
    expect(screen.getByRole("radio", { name: "Left" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Right" })).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ToggleButtonGroup aria-label="Formatting" selectionMode="multiple">
        <ToggleButton id="bold">Bold</ToggleButton>
        <ToggleButton id="italic">Italic</ToggleButton>
      </ToggleButtonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
