import type { Meta, StoryObj } from "@storybook/react";
import { Meter } from "./Meter";

const meta: Meta<typeof Meter> = {
  title: "Figma Components/Primitives/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `Meter` — a read-only indicator of a quantity within a known range, distinct from a progress bar which tracks an ongoing task. No Figma source exists for this component; colour thresholds reuse this library's severity grading vocabulary (see Badge) rather than inventing a new palette. **Use when:** displaying a static quantity against a range (disk usage, a quota, a resume score). **Don't use when:** the value represents an ongoing operation's progress — use a `ProgressBar`/`Spinner` instead.",
      },
    },
  },
  args: { label: "Disk usage", value: 45 },
};

export default meta;
type Story = StoryObj<typeof Meter>;

export const Playground: Story = {};

export const Thresholds: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "16rem" }}>
      <Meter label="Excellent (< 70%)" value={45} />
      <Meter label="Fair (70–89%)" value={80} />
      <Meter label="Fail (>= 90%)" value={95} />
    </div>
  ),
};

export const CustomRange: Story = {
  render: () => <Meter label="Storage used" value={3.5} minValue={0} maxValue={5} style={{ width: "16rem" }} />,
};
