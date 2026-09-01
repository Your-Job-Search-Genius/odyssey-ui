import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge } from "./Badge";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { Tick01Icon } from "@your-job-search-genius/icons";

describe("Badge", () => {
  it("renders its text content", () => {
    render(<Badge>Excellent</Badge>);
    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  it("forwards a ref to the underlying span", () => {
    let node: HTMLSpanElement | null = null;
    render(
      <Badge
        ref={(el) => {
          node = el;
        }}
      >
        Excellent
      </Badge>,
    );
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });

  it("accepts className and style passthrough", () => {
    render(
      <Badge className="custom" style={{ marginTop: 4 }}>
        Excellent
      </Badge>,
    );
    // The label sits in its own span, so walk up to the badge root.
    const el = screen.getByText("Excellent").closest(".wsu-Badge");
    expect(el).toHaveClass("wsu-Badge", "custom");
    expect(el).toHaveStyle({ marginTop: "4px" });
  });

  it("hides a decorative icon from assistive tech", () => {
    render(<Badge icon={<Tick01Icon />}>Excellent</Badge>);
    const icon = screen.getByText("Excellent").closest(".wsu-Badge")!.querySelector(".wsu-Badge__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a leading icon, a trailing icon and a count bubble", () => {
    const { rerender } = render(
      <Badge type="border" icon={<Tick01Icon />} trailingIcon={<Tick01Icon />}>
        Label
      </Badge>,
    );
    expect(
      screen.getByText("Label").closest(".wsu-Badge")!.querySelectorAll(".wsu-Badge__icon"),
    ).toHaveLength(2);

    // A count replaces the trailing icon, matching the file's Trailing/Hybrid types.
    rerender(
      <Badge type="tabs" icon={<Tick01Icon />} trailingIcon={<Tick01Icon />} count={6} countLabel="6 issues">
        Label
      </Badge>,
    );
    const root = screen.getByText("Label").closest(".wsu-Badge")!;
    expect(root.querySelectorAll(".wsu-Badge__icon")).toHaveLength(1);
    expect(screen.getByLabelText("6 issues")).toHaveTextContent("6");
  });

  it("never conveys severity by color alone — text is always present", () => {
    const severities = ["excellent", "good", "fair", "poor", "bad", "fail"] as const;
    render(
      <div>
        {severities.map((s) => (
          <Badge key={s} severity={s}>
            {s}
          </Badge>
        ))}
      </div>,
    );
    for (const s of severities) {
      expect(screen.getByText(s)).toBeInTheDocument();
    }
  });

  it("defaults to the generic design mode with no ThemeProvider mounted", () => {
    render(<Badge>Excellent</Badge>);
    expect(screen.getByText("Excellent").closest(".wsu-Badge")).toHaveClass("wsu-Badge--generic");
  });

  it("picks up the ambient ThemeProvider mode", () => {
    render(
      <ThemeProvider mode="client">
        <Badge>Excellent</Badge>
      </ThemeProvider>,
    );
    expect(screen.getByText("Excellent").closest(".wsu-Badge")).toHaveClass("wsu-Badge--client");
  });

  it("lets a local designMode prop override the ambient ThemeProvider mode", () => {
    render(
      <ThemeProvider mode="client">
        <Badge designMode="admin">Excellent</Badge>
      </ThemeProvider>,
    );
    const el = screen.getByText("Excellent").closest(".wsu-Badge")!;
    expect(el).toHaveClass("wsu-Badge--admin");
    expect(el).not.toHaveClass("wsu-Badge--client");
  });

  it("has no axe violations across every type x severity combination", async () => {
    const types = ["solid", "soft", "filled", "border", "tabs"] as const;
    const severities = ["excellent", "good", "fair", "poor", "bad", "fail"] as const;
    const { container } = render(
      <div>
        {types.map((type) =>
          severities.map((severity) => (
            <Badge key={`${type}-${severity}`} type={type} severity={severity}>
              {severity}
            </Badge>
          )),
        )}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
