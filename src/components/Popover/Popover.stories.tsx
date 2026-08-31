import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useRef, useState } from "react";
import { Popover } from "./Popover";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Setting02Icon, More01Icon } from "@your-job-search-genius/icons";

const meta: Meta<typeof Popover> = {
  title: "Custom Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file as its own component** (docs/design-inventory.md §5 only documents its chrome as the shared primitive behind Select/ComboBox/Menu's popovers). This component reuses that same chrome — `.wsu-Popover` in `Select/popover-menu.css` — for arbitrary content instead of a list. Built on `react-aria-components`' `DialogTrigger`/`Popover`. **Use when:** interactive or richer content anchored to a trigger (a settings panel, an inline form). **Don't use when:** the content is a single line of supplemental text (use `Tooltip`) or a list of actions or options (use `Menu`/`Select`, which already carry this same chrome).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

/**
 * The common case: an icon-only trigger button opens a popover holding a
 * small group of controls. `trigger` is wrapped internally in `Pressable`,
 * the same mechanism `Menu`'s `trigger` prop uses, so any of this
 * library's own components — or a custom element with the right ARIA role
 * (see `CustomTrigger` below) — can open it.
 */
export const Playground: Story = {
  render: () => {
    function Demo() {
      const [wifi, setWifi] = useState(true);
      const [bluetooth, setBluetooth] = useState(true);
      const [mute, setMute] = useState(false);
      return (
        <Popover trigger={<Button leadingIcon={<Setting02Icon />} aria-label="Settings" variant="secondary" />}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "12rem" }}>
            <Checkbox label="Wi-Fi" checked={wifi} onChange={setWifi} />
            <Checkbox label="Bluetooth" checked={bluetooth} onChange={setBluetooth} />
            <Checkbox label="Mute" checked={mute} onChange={setMute} />
          </div>
        </Popover>
      );
    }
    return <Demo />;
  },
};

/**
 * `DialogTrigger`'s trigger just needs to forward its ref and spread DOM
 * props onto a focusable element with an interactive ARIA role — it
 * doesn't have to be this library's `Button`. Any component or plain
 * element that does that qualifies (see the API docs' own "Custom
 * trigger" section); a `<span>` needs an explicit `role="button"` and
 * `tabIndex={0}` for the same reason, since a bare `<span>` carries
 * neither.
 */
export const CustomTrigger: Story = {
  render: () => (
    <Popover trigger={
      <span role="button" tabIndex={0} className="wsu-Button wsu-Button--secondary wsu-Button--lg">
        Custom trigger
      </span>
    }>
      <p style={{ margin: 0, maxWidth: "16rem" }}>
        This popover was opened by a plain <code>&lt;span role=&quot;button&quot;&gt;</code>, not the library&apos;s Button.
      </p>
    </Popover>
  ),
};

/**
 * Omit `trigger` and supply `triggerRef` + `isOpen`/`onOpenChange` instead
 * to position the popover against an element other than its own open/close
 * control. Since there's no `DialogTrigger` in the tree here, this mode is
 * always controlled — the consumer owns `isOpen` and decides what closes
 * it (here, a second button).
 */
export const CustomAnchor: Story = {
  render: () => {
    function Demo() {
      const [isOpen, setOpen] = useState(false);
      const anchorRef = useRef<HTMLSpanElement>(null);
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Show info
          </Button>
          <span ref={anchorRef} style={{ color: "var(--wsu-color-text-subtle)" }}>
            Popover points at me, not the button
          </span>
          <Popover triggerRef={anchorRef} isOpen={isOpen} onOpenChange={setOpen}>
            <p style={{ margin: 0 }}>Anchored to the label, opened by the button.</p>
          </Popover>
        </div>
      );
    }
    return <Demo />;
  },
};

/** All four base placements, each with its arrow rotated to match. */
export const Placements: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "3rem", padding: "4rem" }}>
      {(["top", "right", "bottom", "left"] as const).map((placement) => (
        <Popover key={placement} placement={placement} trigger={<Button variant="secondary">{placement}</Button>}>
          <p style={{ margin: 0 }}>Placement: {placement}</p>
        </Popover>
      ))}
    </div>
  ),
};

/** `hideArrow` drops the pointer arrow and tightens the offset — for a popover anchored to a wide region rather than a single point. */
export const WithoutArrow: Story = {
  render: () => (
    <Popover trigger={<Button variant="secondary">More options</Button>} hideArrow>
      <p style={{ margin: 0 }}>No arrow here.</p>
    </Popover>
  ),
};

/** A trigger without a visible label still needs an accessible name (WCAG 4.1.2) — enforced here via `aria-label`, same as an icon-only `Button`. */
export const IconOnlyTrigger: Story = {
  render: () => (
    <Popover trigger={<Button leadingIcon={<More01Icon />} aria-label="More actions" variant="text" />}>
      <p style={{ margin: 0 }}>More actions content.</p>
    </Popover>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <Popover trigger={<Button variant="secondary">Settings</Button>}>
      <Checkbox label="Wi-Fi" defaultChecked />
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Settings" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByRole("checkbox", { name: "Wi-Fi" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
  },
};
