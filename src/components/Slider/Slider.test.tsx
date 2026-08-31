import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("exposes a single-thumb slider by role", () => {
    render(<Slider label="Cookies to buy" defaultValue={25} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("associates the visible label with the slider", () => {
    render(<Slider label="Cookies to buy" defaultValue={25} />);
    expect(screen.getByRole("slider")).toHaveAccessibleName(expect.stringContaining("Cookies to buy"));
  });

  it("moves the value on ArrowRight and reports it via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider label="Cookies to buy" defaultValue={25} onChange={onChange} />);
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(26);
  });

  it("fires onChangeEnd when keyboard interaction completes", async () => {
    const user = userEvent.setup();
    const onChangeEnd = vi.fn();
    render(<Slider label="Cookies to buy" defaultValue={25} onChangeEnd={onChangeEnd} />);
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onChangeEnd).toHaveBeenCalledWith(26);
  });

  it("renders one thumb per value and names each from thumbLabels", () => {
    render(
      <Slider
        label="Range"
        defaultValue={[30, 60]}
        thumbLabels={["start", "end"]}
      />,
    );
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAccessibleName(expect.stringContaining("start"));
    expect(sliders[1]).toHaveAccessibleName(expect.stringContaining("end"));
  });

  it("clamps steps to minValue/maxValue/step", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider
        label="Volume"
        defaultValue={8}
        minValue={2}
        maxValue={20}
        step={3}
        onChange={onChange}
      />,
    );
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(11);
  });

  it("disables the slider", () => {
    render(<Slider label="Cookies to buy" defaultValue={25} disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Slider label="Cookies to buy" defaultValue={25} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with multiple thumbs", async () => {
    const { container } = render(
      <Slider label="Range" defaultValue={[30, 60]} thumbLabels={["start", "end"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
