import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { ToastRegion, ToastQueue, type ToastContent } from "./Toast";
import { Button } from "../Button";

const meta: Meta<typeof ToastRegion> = {
  title: "Custom Components/Toast",
  component: ToastRegion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file** (see docs/design-inventory.md §2.14). Designed from the WAI-ARIA APG alert pattern plus this system's own dark-surface/shadow/radius language — the same recipe already used for Tooltip. Built on `react-aria-components`'s (unstable) Toast. **Use when:** confirming the result of an action the user just took (saved, uploaded, deleted) without interrupting their flow. **Don't use when:** the information is critical and must be acknowledged (use a Modal) or is tied to a specific field (use inline field error text).\n\nMount a single `<ToastRegion />` near the app root; every `toastQueue.add({ title, description }, { timeout })` call anywhere in the app renders through it. Keep `timeout` at 5000ms or above, or omit it so the toast waits for the user to dismiss it (WCAG 2.2.1) — the stories below use an isolated queue per demo so they don't leak toasts across the Storybook session.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToastRegion>;

function useDemoQueue() {
  const [queue] = useState(() => new ToastQueue<ToastContent>());
  return queue;
}

export const Playground: Story = {
  render: function Playground() {
    const queue = useDemoQueue();
    return (
      <div>
        <ToastRegion queue={queue} />
        <Button
          onClick={() =>
            queue.add({
              title: "Files uploaded",
              description: "3 files uploaded successfully.",
            })
          }
        >
          Show toast
        </Button>
      </div>
    );
  },
};

export const TitleOnly: Story = {
  name: "Title only (no description)",
  render: function TitleOnly() {
    const queue = useDemoQueue();
    return (
      <div>
        <ToastRegion queue={queue} />
        <Button onClick={() => queue.add({ title: "Changes saved" })}>Save</Button>
      </div>
    );
  },
};

export const AutoDismiss: Story = {
  name: "Auto-dismiss after 5s",
  render: function AutoDismiss() {
    const queue = useDemoQueue();
    return (
      <div>
        <ToastRegion queue={queue} />
        <Button
          onClick={() =>
            queue.add(
              { title: "File has been saved!" },
              { timeout: 5000 },
            )
          }
        >
          Save file
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The timer pauses automatically while the toast is hovered or keyboard-focused, so a user who needs longer to read it never loses that chance.",
      },
    },
  },
};

export const Stacked: Story = {
  name: "Multiple toasts stack",
  render: function Stacked() {
    const queue = useDemoQueue();
    let count = 0;
    return (
      <div>
        <ToastRegion queue={queue} />
        <Button
          onClick={() => {
            count += 1;
            queue.add({ title: `Notification ${count}` });
          }}
        >
          Add toast
        </Button>
      </div>
    );
  },
};

export const ProgrammaticDismissal: Story = {
  render: function ProgrammaticDismissal() {
    const queue = useDemoQueue();
    const [toastKey, setToastKey] = useState<string | null>(null);
    return (
      <div>
        <ToastRegion queue={queue} />
        <Button
          onClick={() => {
            if (!toastKey) {
              setToastKey(
                queue.add({ title: "Processing..." }, { onClose: () => setToastKey(null) }),
              );
            } else {
              queue.close(toastKey);
            }
          }}
        >
          {toastKey ? "Cancel" : "Process"}
        </Button>
      </div>
    );
  },
};

export const ColorfulVariants: Story = {
  name: "Status variants (success / warning / error)",
  render: function ColorfulVariants() {
    const queue = useDemoQueue();
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <ToastRegion queue={queue} />
        <Button
          onClick={() =>
            queue.add({
              variant: "success",
              title: "Application submitted",
              description: "Your application was sent to the employer.",
            })
          }
        >
          Show success toast
        </Button>
        <Button
          onClick={() =>
            queue.add({
              variant: "warning",
              title: "Resume nearly full",
              description: "You're close to the one-page limit.",
            })
          }
        >
          Show warning toast
        </Button>
        <Button
          onClick={() =>
            queue.add({
              variant: "error",
              title: "Upload failed",
              description: "That file is larger than 10MB.",
            })
          }
        >
          Show error toast
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`content.variant` tints the toast's leading accent bar (success/warning/error) using this system's existing semantic and danger tokens — the dark surface itself doesn't change. Omit `variant` for the default neutral look used by every other story on this page.",
      },
    },
  },
};

export const KeyboardInteraction: Story = {
  render: function KeyboardInteraction() {
    const queue = useDemoQueue();
    return (
      <div>
        <ToastRegion queue={queue} />
        <Button onClick={() => queue.add({ title: "Delete resume?", description: "This can't be undone." })}>
          Delete resume
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Toasts render through a portal onto document.body, not inside canvasElement.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Delete resume" }));
    const toast = await body.findByText("Delete resume?");
    await expect(toast).toBeInTheDocument();
    await userEvent.click(body.getByRole("button", { name: "Close" }));
    await expect(body.queryByText("Delete resume?")).not.toBeInTheDocument();
  },
};
