import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Sidebar } from "./Sidebar";
import type { SidebarItemData } from "./Sidebar";

const items: SidebarItemData[] = [
  { id: "home", label: "Home", href: "/home" },
  { id: "resumes", label: "Resumes", href: "/resumes" },
  {
    id: "interview",
    label: "Interview",
    children: [
      { id: "mock", label: "Mock Interview", href: "/interview/mock" },
      { id: "questions", label: "Question Bank", href: "/interview/questions" },
    ],
  },
];

describe("Sidebar", () => {
  it("renders as a labeled navigation landmark", () => {
    render(<Sidebar aria-label="Main" items={items} />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("marks the active item with aria-current, not color alone", () => {
    render(<Sidebar aria-label="Main" items={items} activeId="resumes" />);
    expect(screen.getByRole("link", { name: "Resumes" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("renders items without an href as buttons and fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Sidebar aria-label="Main" items={[{ id: "logout", label: "Log out", onClick }]} />);
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("nests children under a keyboard-focusable disclosure", async () => {
    render(<Sidebar aria-label="Main" items={items} />);
    expect(screen.queryByRole("link", { name: "Mock Interview" })).not.toBeVisible();
    const summary = screen.getByText("Interview").closest("summary")!;
    expect(summary).toBeInTheDocument();
  });

  it("auto-expands the branch containing the active item", () => {
    render(<Sidebar aria-label="Main" items={items} activeId="mock" />);
    expect(screen.getByRole("link", { name: "Mock Interview" })).toBeVisible();
  });

  it("marks the active submenu item with aria-current, distinct from a top-level active item", () => {
    render(<Sidebar aria-label="Main" items={items} activeId="mock" />);
    expect(screen.getByRole("link", { name: "Mock Interview" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Question Bank" })).not.toHaveAttribute("aria-current");
  });

  it("renders a top-level item's icon but ignores an icon set on a submenu item", () => {
    const itemsWithIcons: SidebarItemData[] = [
      {
        id: "interview",
        label: "Interview",
        icon: <svg data-testid="parent-icon" />,
        children: [{ id: "mock", label: "Mock Interview", href: "/interview/mock", icon: <svg data-testid="child-icon" /> }],
      },
    ];
    render(<Sidebar aria-label="Main" items={itemsWithIcons} />);
    expect(screen.getByTestId("parent-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("child-icon")).not.toBeInTheDocument();
  });

  it("forwards a ref to the nav element", () => {
    let node: HTMLElement | null = null;
    render(
      <Sidebar
        aria-label="Main"
        items={items}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLElement);
    expect((node as HTMLElement | null)?.tagName).toBe("NAV");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Sidebar aria-label="Main" items={items} activeId="resumes" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
