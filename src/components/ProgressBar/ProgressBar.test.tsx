import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("associates the visible label programmatically", () => {
    render(<ProgressBar label="Uploading" value={50} />);
    expect(screen.getByRole("progressbar", { name: "Uploading" })).toBeInTheDocument();
  });

  it("defaults to a 0-100 range and reports value/min/max via ARIA", () => {
    render(<ProgressBar label="Export" value={30} />);
    const bar = screen.getByRole("progressbar", { name: "Export" });
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("supports a custom min/max range", () => {
    render(<ProgressBar label="Storage" value={3.5} minValue={0} maxValue={5} />);
    const bar = screen.getByRole("progressbar", { name: "Storage" });
    expect(bar).toHaveAttribute("aria-valuenow", "3.5");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "5");
  });

  it("renders the formatted value text", () => {
    render(<ProgressBar label="Export" value={30} />);
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<ProgressBar label="Loading" isIndeterminate />);
    const bar = screen.getByRole("progressbar", { name: "Loading" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("has no axe violations, determinate or indeterminate", async () => {
    const { container } = render(
      <div>
        <ProgressBar label="Export" value={30} />
        <ProgressBar label="Loading" isIndeterminate />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
