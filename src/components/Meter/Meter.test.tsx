import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Meter } from "./Meter";

describe("Meter", () => {
  it("associates the visible label programmatically", () => {
    render(<Meter label="Disk usage" value={50} />);
    expect(screen.getByRole("meter", { name: "Disk usage" })).toBeInTheDocument();
  });

  it("defaults to a 0-100 range and reports value/min/max via ARIA", () => {
    render(<Meter label="Quota" value={45} />);
    const meter = screen.getByRole("meter", { name: "Quota" });
    expect(meter).toHaveAttribute("aria-valuenow", "45");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("supports a custom min/max range", () => {
    render(<Meter label="Storage" value={3.5} minValue={0} maxValue={5} />);
    const meter = screen.getByRole("meter", { name: "Storage" });
    expect(meter).toHaveAttribute("aria-valuenow", "3.5");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "5");
  });

  it("renders the formatted value text", () => {
    render(<Meter label="Quota" value={45} />);
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it.each([
    [45, "excellent"],
    [80, "fair"],
    [95, "fail"],
  ])("colors the fill by severity threshold (value=%i -> %s)", (value, severity) => {
    const { container } = render(<Meter label="Quota" value={value} />);
    expect(container.querySelector(`.wsu-Meter__fill--${severity}`)).toBeInTheDocument();
  });

  it("has no axe violations across severity thresholds", async () => {
    const { container } = render(
      <div>
        <Meter label="Excellent" value={45} />
        <Meter label="Fair" value={80} />
        <Meter label="Fail" value={95} />
      </div>,
    );
    // react-aria-components sets role="meter progressbar" (an ARIA fallback
    // list — real browsers/screen readers use the first supported role, per
    // spec, since Firefox doesn't implement the "meter" role at all). axe-core
    // 4.13 doesn't resolve that fallback list in jsdom and misreads the
    // element as roleless, so it flags aria-valuenow/-min/-max/-text as
    // disallowed — confirmed as an axe-core/jsdom false positive, not a real
    // violation, by testing role="meter" alone (passes) vs. the same markup
    // with "meter progressbar" (fails) outside any react-aria-components code.
    expect(await axe(container, { rules: { "aria-allowed-attr": { enabled: false } } })).toHaveNoViolations();
  });
});
