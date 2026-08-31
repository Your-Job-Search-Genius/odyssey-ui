import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";
import { ProgressCircle } from "./ProgressCircle";

const meta: Meta<typeof ProgressBar> = {
  title: "Custom Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' `ProgressBar` — a linear indicator of an ongoing task's progress, distinct from `Meter` which displays a static quantity within a known range. **Use when:** tracking an upload, multi-step wizard, or other long-running job. **Don't use when:** the value represents a fixed quantity rather than progress toward completion — use `Meter` instead.",
      },
    },
  },
  args: { label: "Uploading", value: 40 },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Playground: Story = {};

export const Indeterminate: Story = {
  args: { label: "Loading", value: undefined, isIndeterminate: true },
};

export const CustomRange: Story = {
  render: () => <ProgressBar label="Storage migrated" value={3.5} minValue={0} maxValue={5} style={{ width: "16rem" }} />,
};

export const Circle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`ProgressCircle` renders the same behavior layer as an SVG ring instead of a bar, sized off this system's icon scale so it drops into icon-shaped slots the way `Spinner` does.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <ProgressCircle key={size} aria-label={`${size} progress`} size={size} value={65} />
      ))}
    </div>
  ),
};

export const CircleIndeterminate: Story = {
  render: () => <ProgressCircle aria-label="Loading" size="lg" isIndeterminate />,
};
