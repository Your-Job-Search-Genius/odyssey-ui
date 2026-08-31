import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Separator } from "./Separator";

describe("Separator", () => {
  it("renders a horizontal separator by default", () => {
    render(<Separator />);
    const separator = screen.getByRole("separator");
    expect(separator.tagName).toBe("HR");
    expect(separator).not.toHaveAttribute("aria-orientation");
  });

  it("renders a vertical separator with aria-orientation set", () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  it("applies a custom className alongside the default one", () => {
    render(<Separator className="custom" />);
    expect(screen.getByRole("separator")).toHaveClass("wsu-Separator", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Separator />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
