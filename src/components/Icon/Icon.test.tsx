import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Icon } from "./Icon";
import { CheckGlyph } from "./glyphs";

describe("Icon", () => {
  it("is hidden from assistive tech by default", () => {
    render(
      <Icon data-testid="icon">
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes an accessible name when given a label", () => {
    render(
      <Icon label="Warning">
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    expect(screen.getByRole("img", { name: "Warning" })).toBeInTheDocument();
  });

  it("forwards a ref to the underlying svg element", () => {
    let node: SVGSVGElement | null = null;
    render(
      <Icon
        ref={(el) => {
          node = el;
        }}
      >
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    expect(node).toBeInstanceOf(SVGSVGElement);
  });

  it("accepts className and style passthrough", () => {
    render(
      <Icon data-testid="icon" className="custom" style={{ opacity: 0.5 }}>
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    const el = screen.getByTestId("icon");
    expect(el).toHaveClass("wsu-Icon", "custom");
    expect(el).toHaveStyle({ opacity: "0.5" });
  });

  it("resolves size tokens to CSS variables", () => {
    render(
      <Icon data-testid="icon" size="lg">
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    expect(screen.getByTestId("icon")).toHaveStyle({ width: "var(--wsu-icon-size-lg)" });
  });

  it("has no axe violations decorative or labeled", async () => {
    const { container } = render(
      <div>
        <CheckGlyph label="Completed" />
        <CheckGlyph />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
