import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Link } from "./Link";

describe("Link", () => {
  it("renders an anchor with the given href", () => {
    render(<Link href="/about">About</Link>);
    const link = screen.getByRole("link", { name: "About" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/about");
  });

  it("renders a non-anchor span driven by onPress when there's no href", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Link onPress={onPress}>Press me</Link>);
    const link = screen.getByRole("link", { name: "Press me" });
    expect(link.tagName).toBe("SPAN");
    await user.click(link);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("marks a disabled link with aria-disabled and blocks onPress", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Link href="/about" isDisabled onPress={onPress}>
        About
      </Link>,
    );
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    await user.click(link);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("applies a custom className alongside the default one", () => {
    render(
      <Link href="#" className="custom">
        Home
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveClass("wsu-Link", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Link href="/about">About</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
