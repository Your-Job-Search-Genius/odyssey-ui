import { describe, expect, it } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { ToastRegion, ToastQueue, type ToastContent, type ToastOptions } from "./Toast";

function setup() {
  const queue = new ToastQueue<ToastContent>();
  render(<ToastRegion queue={queue} />);
  return queue;
}

/**
 * `queue.add`/`queue.close` mutate a subscription react-stately manages
 * outside any React event handler, so — unlike the `userEvent` calls
 * elsewhere in this file, which wrap themselves — these need an explicit
 * `act()` or the assertion right after can run before React flushes.
 */
function addToast(queue: ToastQueue<ToastContent>, content: ToastContent, options?: ToastOptions) {
  let key = "";
  act(() => {
    key = queue.add(content, options);
  });
  return key;
}

function closeToast(queue: ToastQueue<ToastContent>, key: string) {
  act(() => {
    queue.close(key);
  });
}

describe("ToastRegion", () => {
  it("renders nothing when no toast is queued", () => {
    setup();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("shows a toast with its title as the accessible name", () => {
    const queue = setup();
    addToast(queue, { title: "Files uploaded" });
    expect(screen.getByRole("alertdialog", { name: "Files uploaded" })).toBeInTheDocument();
  });

  it("shows the description when provided", () => {
    const queue = setup();
    addToast(queue, { title: "Files uploaded", description: "3 files uploaded successfully." });
    expect(screen.getByText("3 files uploaded successfully.")).toBeInTheDocument();
  });

  it("dismisses via the close button", async () => {
    const user = userEvent.setup();
    const queue = setup();
    addToast(queue, { title: "Files uploaded" });
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("auto-dismisses after its timeout and calls onClose", async () => {
    const queue = setup();
    let closed = false;
    addToast(queue, { title: "File has been saved!" }, { timeout: 10, onClose: () => (closed = true) });
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(closed).toBe(true);
  });

  it("can be dismissed programmatically via the key returned from add()", async () => {
    const queue = setup();
    const key = addToast(queue, { title: "Processing..." });
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    closeToast(queue, key);
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("stacks multiple toasts, most recent first", () => {
    const queue = setup();
    addToast(queue, { title: "First" });
    addToast(queue, { title: "Second" });
    const toasts = screen.getAllByRole("alertdialog");
    expect(toasts).toHaveLength(2);
    expect(toasts[0]).toHaveAccessibleName("Second");
    expect(toasts[1]).toHaveAccessibleName("First");
  });

  it("has no axe violations", async () => {
    const queue = setup();
    addToast(queue, { title: "Files uploaded", description: "3 files uploaded successfully." });
    const region = screen.getByRole("region");
    expect(await axe(region)).toHaveNoViolations();
  });

  it("pauses its timer while focused, so a keyboard user never loses a toast mid-read", async () => {
    const user = userEvent.setup();
    const queue = setup();
    addToast(queue, { title: "File has been saved!" }, { timeout: 10 });
    const toast = screen.getByRole("alertdialog");
    act(() => {
      toast.focus();
    });
    // Give the (paused) timer a chance to fire if pausing didn't actually work.
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.keyboard("{Tab}");
  });

  it("does not render toasts queued on a different ToastQueue instance", () => {
    const queueA = new ToastQueue<ToastContent>();
    const queueB = new ToastQueue<ToastContent>();
    function Demo() {
      return <ToastRegion queue={queueA} />;
    }
    render(<Demo />);
    act(() => {
      queueB.add({ title: "On the other queue" });
    });
    expect(screen.queryByText("On the other queue")).not.toBeInTheDocument();
  });

  it("defaults to the shared toastQueue singleton when no queue prop is passed", async () => {
    const { toastQueue } = await import("./Toast");
    function Demo() {
      const [, force] = useState(0);
      return (
        <div>
          <ToastRegion />
          <button type="button" onClick={() => (toastQueue.add({ title: "Default queue" }), force((n) => n + 1))}>
            Add
          </button>
        </div>
      );
    }
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("alertdialog", { name: "Default queue" })).toBeInTheDocument();
  });
});
