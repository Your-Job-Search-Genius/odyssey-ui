import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Button } from "./Button";
import { Tick01Icon } from "@your-job-search-genius/icons";

describe("Button", () => {
  it("renders its label and forwards a ref", () => {
    let node: HTMLButtonElement | null = null;
    render(
      <Button
        ref={(el) => {
          node = el;
        }}
      >
        Save
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(node).toBeInstanceOf(HTMLButtonElement);
  });

  it("accepts className and style passthrough", () => {
    render(
      <Button className="custom" style={{ marginTop: 4 }}>
        Save
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Save" });
    expect(el).toHaveClass("wsu-Button", "custom");
    expect(el).toHaveStyle({ marginTop: "4px" });
  });

  it("fires onClick on pointer click and on keyboard activation", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    button.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("sets aria-busy and disables the button while loading", () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });

  it("requires and applies an aria-label for an icon-only button", () => {
    render(<Button leadingIcon={<Tick01Icon />} aria-label="Mark complete" />);
    expect(screen.getByRole("button", { name: "Mark complete" })).toBeInTheDocument();
  });

  it("has no axe violations across every variant", async () => {
    const { container } = render(
      <div>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="text">Text</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button leadingIcon={<Tick01Icon />} aria-label="Icon only" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
