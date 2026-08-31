import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Input as AriaInput } from "react-aria-components";
import { Group } from "./Group";

describe("Group", () => {
  it("renders its children with a group role by default", () => {
    render(
      <Group>
        <AriaInput aria-label="Value" />
      </Group>,
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("supports the region and presentation roles", () => {
    const { rerender } = render(
      <Group role="region">
        <AriaInput aria-label="Value" />
      </Group>,
    );
    expect(screen.getByRole("region")).toBeInTheDocument();

    rerender(
      <Group role="presentation">
        <AriaInput aria-label="Value" />
      </Group>,
    );
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("marks itself focus-within when a child receives focus", async () => {
    const user = userEvent.setup();
    render(
      <Group>
        <AriaInput aria-label="Value" />
      </Group>,
    );
    const group = screen.getByRole("group");
    expect(group).not.toHaveAttribute("data-focus-within");
    await user.click(screen.getByLabelText("Value"));
    expect(group).toHaveAttribute("data-focus-within");
  });

  it("marks itself disabled and disables focus", () => {
    render(
      <Group disabled>
        <AriaInput aria-label="Value" />
      </Group>,
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-disabled");
  });

  it("marks itself invalid", () => {
    render(
      <Group invalid>
        <AriaInput aria-label="Value" />
      </Group>,
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-invalid");
  });

  it("marks itself read-only", () => {
    render(
      <Group readOnly>
        <AriaInput aria-label="Value" />
      </Group>,
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-readonly");
  });

  it("applies a custom className alongside the base class", () => {
    render(
      <Group className="custom">
        <AriaInput aria-label="Value" />
      </Group>,
    );
    expect(screen.getByRole("group")).toHaveClass("wsu-Group", "custom");
  });

  it("supports function children with render props", () => {
    render(
      <Group>{({ isDisabled }) => <span>{isDisabled ? "disabled" : "enabled"}</span>}</Group>,
    );
    expect(screen.getByText("enabled")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Group>
        <AriaInput aria-label="Value" />
      </Group>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
