import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button";

const meta: Meta<typeof Modal> = {
  title: "Figma Components/Composites/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' ModalOverlay/Modal/Dialog, which supplies every accessibility guarantee this component needs: focus trapped while open, focus restored to the trigger on close, closes on Escape, locks body scroll, renders through a portal. **Use when:** a focused task or confirmation that should interrupt the current flow. **Don't use when:** the content is a lightweight, non-blocking hint anchored to a trigger (use Popover once it ships). The backdrop color is this library's own choice — Figma never defined one anywhere in the file.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Playground: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Delete resume</Button>
          <Modal
            isOpen={open}
            onOpenChange={setOpen}
            title="Delete resume?"
            description="This can't be undone."
            footer={
              <>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setOpen(false)}>
                  Delete
                </Button>
              </>
            }
          >
            <p>Deleting this resume removes it from every job application draft.</p>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
};

export const Sizes: Story = {
  render: () => {
    function Demo() {
      const [size, setSize] = useState<"sm" | "md" | "lg" | null>(null);
      return (
        <>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={() => setSize("sm")}>Small</Button>
            <Button onClick={() => setSize("md")}>Medium</Button>
            <Button onClick={() => setSize("lg")}>Large</Button>
          </div>
          <Modal isOpen={size !== null} onOpenChange={(o) => !o && setSize(null)} title={`${size} modal`} size={size ?? "md"}>
            <p>Modal body content.</p>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
};

export const NonDismissable: Story = {
  name: "Non-dismissable (must use the buttons)",
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Start critical process</Button>
          <Modal
            isOpen={open}
            onOpenChange={setOpen}
            title="Processing..."
            isDismissable={false}
            footer={
              <Button variant="primary" onClick={() => setOpen(false)}>
                Done
              </Button>
            }
          >
            <p>Escape and outside-click are disabled here — only the button below closes it.</p>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
};

export const KeyboardInteraction: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open modal</Button>
          <Modal isOpen={open} onOpenChange={setOpen} title="Delete resume?">
            <p>Are you sure?</p>
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Modal content renders through a portal onto document.body, not inside canvasElement.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Open modal" }));
    await expect(body.getByRole("dialog", { name: "Delete resume?" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
  },
};
