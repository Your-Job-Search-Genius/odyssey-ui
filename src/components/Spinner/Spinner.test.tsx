import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("announces via role=status with a default accessible label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Saving your resume" />);
    expect(screen.getByRole("status", { name: "Saving your resume" })).toBeInTheDocument();
  });

  it("forwards a ref and supports className/style passthrough", () => {
    let node: HTMLDivElement | null = null;
    render(
      <Spinner
        className="custom"
        style={{ opacity: 0.5 }}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByRole("status")).toHaveClass("wsu-Spinner", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Spinner label="Loading results" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
