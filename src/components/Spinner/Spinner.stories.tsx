import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Custom Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG pattern plus this system's own visual language (radius, spacing, colour and focus tokens), and re-checked against the corrected tokens after the Figma audit. Not present anywhere in the source Figma file — designed from WAI-ARIA APG's status-message pattern. **Use when:** indicating an in-progress async operation. Announces via `role=\"status\"` (a live region) so assistive tech hears the loading state without focus moving, and slows down (rather than freezing) under `prefers-reduced-motion`.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Spinner key={size} size={size} label={`${size} spinner`} />
      ))}
    </div>
  ),
};
