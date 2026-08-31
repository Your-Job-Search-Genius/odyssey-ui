import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Breadcrumbs, Breadcrumb } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders every crumb's label", () => {
    render(
      <Breadcrumbs>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb href="#">React Aria</Breadcrumb>
        <Breadcrumb>Breadcrumbs</Breadcrumb>
      </Breadcrumbs>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("React Aria")).toBeInTheDocument();
    expect(screen.getByText("Breadcrumbs")).toBeInTheDocument();
  });

  it("marks only the last crumb as current and non-navigable", () => {
    render(
      <Breadcrumbs>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb>Breadcrumbs</Breadcrumb>
      </Breadcrumbs>,
    );
    const home = screen.getByRole("link", { name: "Home" });
    expect(home).toHaveAttribute("href", "#");
    expect(home).not.toHaveAttribute("aria-current");

    const current = screen.getByRole("link", { name: "Breadcrumbs" });
    expect(current).not.toHaveAttribute("href");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("aria-disabled", "true");
  });

  it("supports the dynamic items + render-function collection API", () => {
    const items = [
      { id: 1, label: "Home" },
      { id: 2, label: "Trendy" },
      { id: 3, label: "March 2022 Assets" },
    ];
    render(<Breadcrumbs items={items}>{(item) => <Breadcrumb>{item.label}</Breadcrumb>}</Breadcrumbs>);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Trendy")).toBeInTheDocument();
    expect(screen.getByText("March 2022 Assets")).toBeInTheDocument();
  });

  it("calls onAction with the pressed crumb's key when it isn't the current crumb", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const items = [
      { id: "home", label: "Home" },
      { id: "trendy", label: "Trendy" },
    ];
    render(<Breadcrumbs items={items} onAction={onAction}>{(item) => <Breadcrumb>{item.label}</Breadcrumb>}</Breadcrumbs>);
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(onAction).toHaveBeenCalledWith("home");
  });

  it("does not fire onAction for the current (last) crumb", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const items = [
      { id: "home", label: "Home" },
      { id: "trendy", label: "Trendy" },
    ];
    render(<Breadcrumbs items={items} onAction={onAction}>{(item) => <Breadcrumb>{item.label}</Breadcrumb>}</Breadcrumbs>);
    await user.click(screen.getByRole("link", { name: "Trendy" }));
    expect(onAction).not.toHaveBeenCalled();
  });

  it("disables an individual crumb via isDisabled and blocks its onAction", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Breadcrumbs onAction={onAction}>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb href="#" isDisabled>
          Archived
        </Breadcrumb>
        <Breadcrumb>Current</Breadcrumb>
      </Breadcrumbs>,
    );
    const archived = screen.getByRole("link", { name: "Archived" });
    expect(archived).toHaveAttribute("aria-disabled", "true");
    // Disabled crumbs render as a <span> (not an <a>), so they're never
    // keyboard/native-navigable even though the href attribute is still present.
    expect(archived.tagName).toBe("SPAN");
    await user.click(archived);
    expect(onAction).not.toHaveBeenCalled();
  });

  it("disables every crumb when Breadcrumbs.isDisabled is set", () => {
    render(
      <Breadcrumbs isDisabled>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb>Current</Breadcrumb>
      </Breadcrumbs>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-disabled", "true");
  });

  it("navigates the browser via a real href when clicked", () => {
    render(
      <Breadcrumbs>
        <Breadcrumb href="/home">Home</Breadcrumb>
        <Breadcrumb>Current</Breadcrumb>
      </Breadcrumbs>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/home");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb href="#">React Aria</Breadcrumb>
        <Breadcrumb>Breadcrumbs</Breadcrumb>
      </Breadcrumbs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
