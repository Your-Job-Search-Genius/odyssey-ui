import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Card } from "./Card";

describe("Card", () => {
  it("renders collapsed by default and expands on click", async () => {
    const user = userEvent.setup();
    render(
      <Card title="Missing keywords" severity="urgent" severityLabel="Urgent">
        Add &quot;React&quot; and &quot;TypeScript&quot; to your skills section.
      </Card>,
    );
    expect(screen.getByText("Add \"React\" and \"TypeScript\" to your skills section.")).not.toBeVisible();
    await user.click(screen.getByText("Missing keywords"));
    expect(screen.getByText("Add \"React\" and \"TypeScript\" to your skills section.")).toBeVisible();
  });

  it("puts the summary in the natural tab order", async () => {
    // jsdom doesn't implement the HTML spec's native Enter/Space activation
    // behavior for <summary> (verified directly against jsdom: dispatching
    // a real Enter keydown on a focused <summary> never opens the
    // <details>), so toggle-on-Enter can't be asserted here — every real
    // browser implements it natively as part of <details>/<summary>'s
    // built-in semantics, which is exactly why this uses that element
    // instead of a hand-rolled ARIA disclosure. What we *can* verify in
    // jsdom is that the summary is reachable via Tab.
    const user = userEvent.setup();
    render(
      <Card title="Missing keywords" severity="urgent" severityLabel="Urgent">
        Detail text
      </Card>,
    );
    await user.tab();
    expect(screen.getByText("Missing keywords").closest("summary")).toHaveFocus();
  });

  it("supports defaultExpanded (uncontrolled)", () => {
    render(
      <Card title="Missing keywords" defaultExpanded>
        Detail text
      </Card>,
    );
    expect(screen.getByText("Detail text")).toBeVisible();
  });

  it("supports expanded/onExpandedChange (controlled)", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <Card title="Missing keywords" expanded={false} onExpandedChange={onExpandedChange}>
        Detail text
      </Card>,
    );
    expect(screen.getByText("Detail text")).not.toBeVisible();
    await user.click(screen.getByText("Missing keywords"));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    // Controlled: stays closed until the parent actually updates the `expanded` prop.
    rerender(
      <Card title="Missing keywords" expanded onExpandedChange={onExpandedChange}>
        Detail text
      </Card>,
    );
    expect(screen.getByText("Detail text")).toBeVisible();
  });

  it("never conveys severity by color alone when severityLabel is provided", () => {
    render(
      <Card title="Missing keywords" severity="urgent" severityLabel="Urgent">
        Detail text
      </Card>,
    );
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });

  it("renders as a non-collapsible static card", () => {
    render(
      <Card title="Résumé score" collapsible={false}>
        Detail text
      </Card>,
    );
    expect(screen.getByText("Résumé score")).toBeInTheDocument();
    expect(screen.getByText("Detail text")).toBeVisible();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("forwards a ref", () => {
    let node: HTMLElement | null = null;
    render(
      <Card
        title="Missing keywords"
        ref={(el) => {
          node = el;
        }}
      >
        Detail text
      </Card>,
    );
    expect(node).toBeInstanceOf(HTMLElement);
  });

  it("has no axe violations across every severity, collapsed and expanded", async () => {
    const severities = ["urgent", "critical", "optional", "general", "neutral"] as const;
    const { container } = render(
      <div>
        {severities.map((s) => (
          <Card key={s} title={`${s} card`} severity={s} severityLabel={s !== "neutral" ? s : undefined} defaultExpanded={s === "urgent"}>
            Body content for {s}.
          </Card>
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
