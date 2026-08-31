import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button";

function Demo({ initialOpen = true, isDismissable }: { initialOpen?: boolean; isDismissable?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        title="Delete resume?"
        description="This can't be undone."
        isDismissable={isDismissable}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      >
        <p>Deleting this resume removes it from every job application draft.</p>
      </Modal>
    </div>
  );
}

describe("Modal", () => {
  it("renders as a labeled dialog when open", () => {
    render(<Demo />);
    expect(screen.getByRole("dialog", { name: "Delete resume?" })).toBeInTheDocument();
  });

  it("is not rendered when closed", () => {
    render(<Demo initialOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("traps focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const dialog = screen.getByRole("dialog");
    // Cycle focus forward several times — it should never land outside the dialog.
    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("restores focus to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<Demo initialOpen={false} />);
    const trigger = screen.getByRole("button", { name: "Open modal" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes on Escape when dismissable", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("does not close on Escape when isDismissable is false", async () => {
    const user = userEvent.setup();
    render(<Demo isDismissable={false} />);
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) via the close button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal isOpen onOpenChange={onOpenChange} title="Title">
        Body
      </Modal>,
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("keeps showing the last open content during the close transition, even if the consumer clears its backing state in the same handler that closes it", () => {
    // Reproduces a common consumer pattern: `onOpenChange={(open) => !open && setItem(null)}`.
    // Modal.css gives the dialog a fade-out `[data-exiting]` animation, so react-aria-components
    // keeps it mounted for that transition after `isOpen` goes false — if Modal re-rendered from
    // live props during that window, the title/body would flash to whatever the now-cleared state
    // produces instead of staying on the real content the user was looking at.
    const { rerender } = render(
      <Modal isOpen onOpenChange={() => {}} title="Delete Resume.pdf?">
        <p>Resume.pdf</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog", { name: "Delete Resume.pdf?" })).toBeInTheDocument();

    rerender(
      <Modal isOpen={false} onOpenChange={() => {}} title="Delete null?">
        <p>no item</p>
      </Modal>,
    );

    expect(screen.queryByText("Delete null?")).not.toBeInTheDocument();
    expect(screen.queryByText("no item")).not.toBeInTheDocument();
  });
});
