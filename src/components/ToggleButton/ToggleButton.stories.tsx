import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import type { ReactNode } from "react";
import { SelectionIndicator } from "react-aria-components";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyLeftIcon,
  StarIcon,
  Bookmark01Icon,
  Bookmark01SolidIcon,
  Sun01Icon,
  MoonIcon,
  VolumeHighIcon,
  VolumeOff02Icon,
  GridViewIcon,
  ListViewIcon,
} from "@your-job-search-genius/icons";
import { ToggleButton, ToggleButtonGroup } from "./ToggleButton";
import "./ToggleButtonGroup.animation.css";

const meta: Meta<typeof ToggleButton> = {
  title: "Custom Components/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Not in the source Figma file at all (design-inventory.md §2.14). Built on `react-aria-components`' `ToggleButton`: correct `aria-pressed` toggle semantics plus hover/press/focus-visible state. **Use when:** a single on/off toggle (a Bold button, a favorite star) or as an item inside `ToggleButtonGroup`. **Don't use when:** the choice is a settings on/off with an immediate side effect and no visible label context (prefer `Switch`), or it's one of a fixed set of mutually-exclusive text options (prefer `RadioGroup` or `Tabs`).",
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  args: {
    children: "Bold",
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Bold" });
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
  },
};

export const DefaultSelected: Story = {
  name: "Default selected",
  args: { defaultSelected: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <ToggleButton size="sm">Small</ToggleButton>
      <ToggleButton size="md">Medium</ToggleButton>
      <ToggleButton size="lg">Large</ToggleButton>
    </div>
  ),
};

/**
 * Icon-only usage requires `aria-label` — TypeScript enforces it when
 * `children` is omitted, same contract as `Button`.
 */
export const IconOnly: Story = {
  name: "Icon-only (favorite star)",
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <ToggleButton aria-label="Bold">
        <TextBoldIcon aria-hidden />
      </ToggleButton>
      <ToggleButton aria-label="Italic">
        <TextItalicIcon aria-hidden />
      </ToggleButton>
      <ToggleButton aria-label="Favorite" defaultSelected>
        <StarIcon aria-hidden />
      </ToggleButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Controlled selection: `selected` + `onChange` mirror the pressed state
 * into React, for syncing with app state. Prefer `defaultSelected` when
 * nothing outside the button needs to know.
 */
export const ControlledSelection: Story = {
  name: "Controlled selection",
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState(false);
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ToggleButton selected={selected} onChange={setSelected}>
            Bold
          </ToggleButton>
          <p style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)", margin: 0 }}>
            {selected ? "On" : "Off"}
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};

/**
 * A save/bookmark toggle that swaps its own icon between outline and solid
 * based on selection state — a common pattern (Twitter's bookmark, Spotify's
 * save) that a plain checkbox can't do without extra markup, since the
 * render-prop-free `ToggleButton` here just reads its own `selected` state
 * back out via `useState` in the demo.
 */
export const IconSwap: Story = {
  name: "Icon swap (save/bookmark)",
  render: () => {
    function Demo() {
      const [saved, setSaved] = useState(false);
      return (
        <ToggleButton aria-label={saved ? "Remove from saved" : "Save"} selected={saved} onChange={setSaved}>
          {saved ? <Bookmark01SolidIcon aria-hidden /> : <Bookmark01Icon aria-hidden />}
        </ToggleButton>
      );
    }
    return <Demo />;
  },
};

/**
 * Two independent icon-only toggles — dark mode and mute — each swapping
 * its own icon on selection. Neither depends on the other, so they're
 * plain standalone `ToggleButton`s rather than a `ToggleButtonGroup`.
 */
export const StatefulIconToggles: Story = {
  name: "Dark mode / mute toggles",
  render: () => {
    function Demo() {
      const [dark, setDark] = useState(false);
      const [muted, setMuted] = useState(false);
      return (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <ToggleButton aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} selected={dark} onChange={setDark}>
            {dark ? <MoonIcon aria-hidden /> : <Sun01Icon aria-hidden />}
          </ToggleButton>
          <ToggleButton aria-label={muted ? "Unmute" : "Mute"} selected={muted} onChange={setMuted}>
            {muted ? <VolumeOff02Icon aria-hidden /> : <VolumeHighIcon aria-hidden />}
          </ToggleButton>
        </div>
      );
    }
    return <Demo />;
  },
};

/**
 * `ToggleButtonGroup` in `multiple` mode: each button toggles independently,
 * but arrow keys move focus between them as one unit (WAI-ARIA APG
 * "toolbar" pattern) instead of each button being its own tab stop. This is
 * the real-world case for `ToggleButton` — a rich-text formatting toolbar.
 */
export const FormattingToolbar: Story = {
  name: "Formatting toolbar (multiple selection)",
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<Set<string | number>>(new Set(["bold"]));
      return (
        <ToggleButtonGroup
          aria-label="Text formatting"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          <ToggleButton id="bold" aria-label="Bold">
            <TextBoldIcon aria-hidden />
          </ToggleButton>
          <ToggleButton id="italic" aria-label="Italic">
            <TextItalicIcon aria-hidden />
          </ToggleButton>
          <ToggleButton id="underline" aria-label="Underline">
            <TextUnderlineIcon aria-hidden />
          </ToggleButton>
          <ToggleButton id="strikethrough" aria-label="Strikethrough">
            <TextStrikethroughIcon aria-hidden />
          </ToggleButton>
        </ToggleButtonGroup>
      );
    }
    return <Demo />;
  },
};

/**
 * `ToggleButtonGroup` in `single` mode with `disallowEmptySelection` —
 * exactly a radio group's semantics to assistive tech (one value, always
 * set) but for a horizontal icon row, e.g. text alignment. Keyboard model
 * is the WAI-ARIA APG toolbar's *manual activation*, not a native radio
 * group's automatic one: arrow keys move focus between options (roving
 * tabindex), and Enter/Space then commits the focused option as selected —
 * see the "Group keyboard interaction" story below.
 */
export const AlignmentToolbar: Story = {
  name: "Alignment toolbar (single selection)",
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<Set<string | number>>(new Set(["left"]));
      return (
        <ToggleButtonGroup
          aria-label="Text alignment"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          <ToggleButton id="left" aria-label="Align left">
            <TextAlignLeftIcon aria-hidden />
          </ToggleButton>
          <ToggleButton id="center" aria-label="Align center">
            <TextAlignCenterIcon aria-hidden />
          </ToggleButton>
          <ToggleButton id="right" aria-label="Align right">
            <TextAlignRightIcon aria-hidden />
          </ToggleButton>
          <ToggleButton id="justify" aria-label="Justify">
            <TextAlignJustifyLeftIcon aria-hidden />
          </ToggleButton>
        </ToggleButtonGroup>
      );
    }
    return <Demo />;
  },
};

/**
 * A two-option `single`-selection group used as a view switcher, labeled
 * with icon + text rather than icon-only — shows the group works equally
 * well as a segmented control, not just an icon toolbar.
 */
export const ViewSwitcher: Story = {
  name: "View switcher (segmented control)",
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<Set<string | number>>(new Set(["grid"]));
      return (
        <ToggleButtonGroup
          aria-label="Layout"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          <ToggleButton id="grid">
            <GridViewIcon aria-hidden />
            Grid
          </ToggleButton>
          <ToggleButton id="list">
            <ListViewIcon aria-hidden />
            List
          </ToggleButton>
        </ToggleButtonGroup>
      );
    }
    return <Demo />;
  },
};

export const GroupKeyboardInteraction: Story = {
  name: "Group keyboard interaction",
  render: () => (
    <ToggleButtonGroup aria-label="Text alignment" selectionMode="single" disallowEmptySelection defaultSelectedKeys={["left"]}>
      <ToggleButton id="left">Left</ToggleButton>
      <ToggleButton id="center">Center</ToggleButton>
      <ToggleButton id="right">Right</ToggleButton>
    </ToggleButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole("radio", { name: "Left" });
    const center = canvas.getByRole("radio", { name: "Center" });
    const right = canvas.getByRole("radio", { name: "Right" });

    await expect(left).toHaveAttribute("aria-checked", "true");
    left.focus();
    // Roving-tabindex arrow keys move focus only — unlike a native radio
    // group, selecting the focused item still needs Enter/Space or a click.
    await userEvent.keyboard("{ArrowRight}");
    await expect(center).toHaveFocus();
    await expect(center).toHaveAttribute("aria-checked", "false");
    await expect(left).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{ArrowRight}");
    await expect(right).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(right).toHaveAttribute("aria-checked", "true");
    await expect(left).toHaveAttribute("aria-checked", "false");
  },
};

function SegmentedControlItem({ id, children }: { id: string; children: ReactNode }) {
  return (
    <ToggleButton id={id}>
      <SelectionIndicator className="wsu-SegmentedControlIndicator" />
      <span className="wsu-SegmentedControlLabel">{children}</span>
    </ToggleButton>
  );
}

/**
 * `react-aria-components`' `SelectionIndicator`: an animated pill that
 * slides between items as selection changes, via the library's own
 * shared-element transition instead of a bespoke position calculation.
 * Not part of this library's own exported API — imported directly from
 * `react-aria-components`, same rationale as `TagGroup`'s remove button —
 * and rendered inside each `ToggleButton` alongside its label; only the
 * selected item's copy is ever visible, so it reads as sliding from
 * wherever it last rendered rather than being N separate indicators.
 */
export const SegmentedControlAnimation: Story = {
  name: "Animated selection indicator (segmented control)",
  render: () => (
    <ToggleButtonGroup
      aria-label="Time period"
      className="wsu-SegmentedControlDemo"
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={["day"]}
    >
      <SegmentedControlItem id="day">Day</SegmentedControlItem>
      <SegmentedControlItem id="week">Week</SegmentedControlItem>
      <SegmentedControlItem id="month">Month</SegmentedControlItem>
      <SegmentedControlItem id="year">Year</SegmentedControlItem>
    </ToggleButtonGroup>
  ),
};
