import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { parseColor } from "react-aria-components";
import { ColorSwatch } from "./ColorSwatch";

describe("ColorSwatch", () => {
  it("exposes an image role with a generated color description", () => {
    render(<ColorSwatch color="#f00" />);
    const swatch = screen.getByRole("img");
    expect(swatch).toHaveAccessibleName();
  });

  it("uses colorName to override the generated description", () => {
    render(<ColorSwatch color="#f00" colorName="Fire truck red" />);
    expect(screen.getByRole("img", { name: "Fire truck red" })).toBeInTheDocument();
  });

  it("appends aria-label to the color description", () => {
    render(<ColorSwatch color="#f00" colorName="Fire truck red" aria-label="Background color" />);
    expect(screen.getByRole("img", { name: "Fire truck red, Background color" })).toBeInTheDocument();
  });

  it("accepts a parsed Color value", () => {
    render(<ColorSwatch color={parseColor("#00ff00")} colorName="Green" />);
    expect(screen.getByRole("img", { name: "Green" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ColorSwatch color="#f00" colorName="Fire truck red" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
