import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { Tabs, TabList, TabPanel } from "../Tabs";
import { ChartGlyph, StarCircleGlyph } from "../Icon/glyphs";

const meta: Meta<typeof Modal> = {
  title: "Figma Components/Composites/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' ModalOverlay/Modal/Dialog, which supplies every accessibility guarantee this component needs: focus trapped while open, focus restored to the trigger on close, closes on Escape, locks body scroll, renders through a portal. **Use when:** a focused task or confirmation that should interrupt the current flow. **Don't use when:** the content is a lightweight, non-blocking hint anchored to a trigger (use Popover once it ships).\n\nThe chrome comes from the Modals page (node `144:33142`): the panel from `433:9598` (14px padding, 10px gap, 12px radius, no border), the header from the `Modal Header` set (`433:9554`) and the footer from `Modal Footer` (`433:9582`). The scrim is `433:9608` — `rgba(78,78,78,0.76)` under an 8px blur. The panel's own drop shadow is this library's addition; the file gives its modals none.",
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

/* ------------------------------------------------------------------ *
 * The Modal Header set, node 433:9554 — one story per variant.
 * ------------------------------------------------------------------ */

function HeaderDemo({ label, ...modalProps }: { label: string } & Partial<React.ComponentProps<typeof Modal>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        size="sm"
        title="Header"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
        {...modalProps}
      >
        <p>Modal body content.</p>
      </Modal>
    </>
  );
}

/** Modal Header / Default — node 433:9555. */
export const FigmaHeaderDefault: Story = {
  name: "Figma — Header: Default",
  render: () => <HeaderDemo label="Default header" />,
};

/**
 * Modal Header / Variant5 — node 433:9559: a centered Heading/Large title
 * and no close control. Escape and outside-click still close it, so the
 * dialog is never a trap (WCAG 2.1.2).
 */
export const FigmaHeaderCentered: Story = {
  name: "Figma — Header: Variant5 (centered)",
  render: () => <HeaderDemo label="Centered header" titleSize="lg" align="center" showCloseButton={false} />,
};

/** Modal Header / With Badge — node 433:9562. */
export const FigmaHeaderWithBadge: Story = {
  name: "Figma — Header: With Badge",
  render: () => <HeaderDemo label="Header with badge" badge={<Badge type="border" trailingIcon={<StarCircleGlyph />}>Neo-Classic</Badge>} />,
};

/** Modal Header / With Icon — node 433:9567. */
export const FigmaHeaderWithIcon: Story = {
  name: "Figma — Header: With Icon",
  render: () => <HeaderDemo label="Header with icon" icon={<ChartGlyph />} />,
};

/** Modal Header / With Description — node 433:9572. */
export const FigmaHeaderWithDescription: Story = {
  name: "Figma — Header: With Description",
  render: () => <HeaderDemo label="Header with description" icon={<ChartGlyph />} description="Description" />,
};

/**
 * Modal Header / With Tabs — node 458:946: a Body/Small-Semibold title
 * beside a grouped Tabs, and no close control. The file's own frame hugs
 * its content at a 13px gap; in a real panel the pair is spread across the
 * header's width instead.
 */
export const FigmaHeaderWithTabs: Story = {
  name: "Figma — Header: With Tabs",
  render: function WithTabs() {
    const [open, setOpen] = useState(false);
    const options = ["option-1", "option-2", "option-3"];
    return (
      <>
        <Button onClick={() => setOpen(true)}>Header with tabs</Button>
        <Modal
          isOpen={open}
          onOpenChange={setOpen}
          size="sm"
          title="Header"
          titleSize="sm"
          showCloseButton={false}
          headerAction={<TabList aria-label="View" items={options.map((id, i) => ({ id, label: `Option ${i + 1}` }))} />}
          footerLayout="single"
          footer={
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          }
          /* The TabList in the header and its panels in the body have to be
             one Tabs subtree, and Tabs can't go around <Modal> — react-aria
             renders a collection's children twice to build it, and the
             dialog's portal escapes that pass, mounting two dialogs. */
          contentWrapper={(dialogContent) => <Tabs defaultSelectedKey="option-2">{dialogContent}</Tabs>}
        >
          {options.map((id, i) => (
            <TabPanel key={id} id={id}>
              Body content for option {i + 1}.
            </TabPanel>
          ))}
        </Modal>
      </>
    );
  },
};

/* ------------------------------------------------------------------ *
 * The Modal Footer set, node 433:9582.
 * ------------------------------------------------------------------ */

function FooterDemo({ label, ...modalProps }: { label: string } & Partial<React.ComponentProps<typeof Modal>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <Modal isOpen={open} onOpenChange={setOpen} size="sm" title="Header" {...modalProps}>
        <p>Modal body content.</p>
      </Modal>
    </>
  );
}

/** Modal Footer / Single CTA — node 433:9583. */
export const FigmaFooterSingle: Story = {
  name: "Figma — Footer: Single CTA",
  render: function SingleCta() {
    const [, force] = useState(0);
    return (
      <FooterDemo
        label="Single CTA"
        footerLayout="single"
        footer={
          <Button variant="primary" size="sm" onClick={() => force((n) => n + 1)}>
            Confirm
          </Button>
        }
      />
    );
  },
};

/** Modal Footer / Horizontal — node 433:9585. */
export const FigmaFooterHorizontal: Story = {
  name: "Figma — Footer: Horizontal",
  render: () => (
    <FooterDemo
      label="Horizontal"
      footerLayout="horizontal"
      footer={
        <>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </>
      }
    />
  ),
};

/** Modal Footer / Stacked — node 433:9588: primary above secondary. */
export const FigmaFooterStacked: Story = {
  name: "Figma — Footer: Stacked",
  render: () => (
    <FooterDemo
      label="Stacked"
      footerLayout="stacked"
      footer={
        <>
          <Button variant="primary" size="sm">
            Primary Button
          </Button>
          <Button variant="secondary" size="sm">
            Secondary-button
          </Button>
        </>
      }
    />
  ),
};

/**
 * Modal Footer / Stacked Inverted — node 433:9591. The same `stacked`
 * layout with the buttons in the other order, rather than a
 * `column-reverse` that would leave the visual order out of step with the
 * DOM and focus order (WCAG 1.3.2).
 */
export const FigmaFooterStackedInverted: Story = {
  name: "Figma — Footer: Stacked Inverted",
  render: () => (
    <FooterDemo
      label="Stacked Inverted"
      footerLayout="stacked"
      footer={
        <>
          <Button variant="secondary" size="sm">
            Secondary-button
          </Button>
          <Button variant="primary" size="sm">
            Primary Button
          </Button>
        </>
      }
    />
  ),
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
