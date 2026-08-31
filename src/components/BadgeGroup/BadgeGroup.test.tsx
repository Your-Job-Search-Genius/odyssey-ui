import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { BadgeGroup } from "./BadgeGroup";
import { CheckGlyph } from "../Icon/glyphs";

describe("BadgeGroup", () => {
  it("renders both halves", () => {
    render(<BadgeGroup label="Voice">“I’m just a guy who loves tech”</BadgeGroup>);
    expect(screen.getByText("Voice")).toBeInTheDocument();
    expect(screen.getByText("“I’m just a guy who loves tech”")).toBeInTheDocument();
  });

  it("puts the badge before the content when badgePosition is leading", () => {
    const { container } = render(
      <BadgeGroup label="Voice" badgePosition="leading">
        Content
      </BadgeGroup>,
    );
    const root = container.querySelector(".wsu-BadgeGroup")!;
    expect(root.firstElementChild).toHaveClass("wsu-BadgeGroup__badge");
  });

  it("hides a decorative icon from assistive tech", () => {
    const { container } = render(
      <BadgeGroup label="Voice" icon={<CheckGlyph />}>
        Content
      </BadgeGroup>,
    );
    expect(container.querySelector(".wsu-BadgeGroup__icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations across layouts and badge positions", async () => {
    const { container } = render(
      <div>
        {(["inline", "stacked"] as const).map((layout) =>
          (["leading", "trailing"] as const).map((pos) => (
            <BadgeGroup key={`${layout}-${pos}`} layout={layout} badgePosition={pos} label="Voice" icon={<CheckGlyph />}>
              Content
            </BadgeGroup>
          )),
        )}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
