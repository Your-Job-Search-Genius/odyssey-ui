import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";
import { CloseGlyph } from "../Icon/glyphs";

const meta: Meta<typeof Tooltip> = {
  title: "Custom Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG pattern plus this system's own visual language (radius, spacing, colour and focus tokens), and re-checked against the corrected tokens after the Figma audit. Built on `react-aria-components`. Not present in the source Figma file (see docs/design-inventory.md §2.9) — designed from WAI-ARIA APG. **Use when:** a short supplemental hint for an already-labeled control (e.g. clarifying an icon-only button). **Don't use when:** the content is essential to using the control (put it in a visible label instead — a tooltip's content isn't available to touch-only users) or the content is interactive (use a Popover).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {
  render: () => (
    <Tooltip content="Delete this item">
      <Button>Delete</Button>
    </Tooltip>
  ),
};

export const OnIconOnlyButton: Story = {
  render: () => (
    <Tooltip content="Close">
      <Button leadingIcon={<CloseGlyph />} aria-label="Close" variant="text" />
    </Tooltip>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The classic use case: the button's own aria-label already gives it a name, the tooltip is a bonus visual hint for sighted mouse/keyboard users.",
      },
    },
  },
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", padding: "3rem" }}>
      {(["top", "right", "bottom", "left"] as const).map((placement) => (
        <Tooltip key={placement} content={`Placement: ${placement}`} placement={placement}>
          <Button variant="secondary">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <Tooltip content="Delete this item" delay={0}>
      <Button>Delete</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button")).toHaveFocus();
    await expect(await canvas.findByRole("tooltip")).toBeVisible();
    await userEvent.keyboard("{Escape}");
  },
};
