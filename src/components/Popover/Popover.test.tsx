import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Popover } from "./Popover";
import { Button } from "../Button";

describe("Popover", () => {
  it("is not rendered until triggered", () => {
    render(
      <Popover trigger={<Button>Settings</Button>}>
        <p>Content</p>
      </Popover>,
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("opens on trigger press and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>Settings</Button>}>
        <p>Content</p>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Settings" });
    await user.click(trigger);
    expect(await screen.findByText("Content")).toBeVisible();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Content")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("wraps a custom trigger element in Pressable", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<span role="button" tabIndex={0}>Open</span>}>
        <p>Content</p>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByText("Content")).toBeVisible();
  });

  it("supports a custom trigger element via triggerRef, controlled by isOpen", async () => {
    function Demo({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) {
      const anchorRef = useRef<HTMLSpanElement>(null);
      return (
        <>
          <span ref={anchorRef}>Anchor</span>
          <Popover triggerRef={anchorRef} isOpen={isOpen} onOpenChange={onOpenChange}>
            <p>Anchored content</p>
          </Popover>
        </>
      );
    }

    const onOpenChange = vi.fn();
    const { rerender } = render(<Demo isOpen={false} onOpenChange={onOpenChange} />);
    expect(screen.queryByText("Anchored content")).not.toBeInTheDocument();

    rerender(<Demo isOpen onOpenChange={onOpenChange} />);
    expect(await screen.findByText("Anchored content")).toBeVisible();

    const user = userEvent.setup();
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("hides the pointer arrow when hideArrow is set", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover trigger={<Button>Settings</Button>} hideArrow>
        <p>Content</p>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Settings" }));
    await screen.findByText("Content");
    expect(container.querySelector(".wsu-Popover__arrow")).not.toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover trigger={<Button>Settings</Button>}>
        <p>Content</p>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Settings" }));
    await screen.findByText("Content");
    expect(await axe(container)).toHaveNoViolations();
  });
});
