import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ProgressCircle } from "./ProgressCircle";

describe("ProgressCircle", () => {
  it("exposes the accessible label via aria-label", () => {
    render(<ProgressCircle aria-label="Uploading" value={50} />);
    expect(screen.getByRole("progressbar", { name: "Uploading" })).toBeInTheDocument();
  });

  it("reports value/min/max via ARIA", () => {
    render(<ProgressCircle aria-label="Export" value={30} />);
    const circle = screen.getByRole("progressbar", { name: "Export" });
    expect(circle).toHaveAttribute("aria-valuenow", "30");
    expect(circle).toHaveAttribute("aria-valuemin", "0");
    expect(circle).toHaveAttribute("aria-valuemax", "100");
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<ProgressCircle aria-label="Loading" isIndeterminate />);
    const circle = screen.getByRole("progressbar", { name: "Loading" });
    expect(circle).not.toHaveAttribute("aria-valuenow");
  });

  it("has no axe violations, determinate or indeterminate", async () => {
    const { container } = render(
      <div>
        <ProgressCircle aria-label="Export" value={30} />
        <ProgressCircle aria-label="Loading" isIndeterminate />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
