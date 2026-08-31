import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Card } from "./Card";
import { AlertCircleGlyph } from "../Icon/glyphs";

const SEVERITIES = ["urgent", "critical", "optional", "general", "neutral"] as const;

const meta: Meta<typeof Card> = {
  title: "Figma Components/Composites/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The \"Issues\" family from Figma's Cards page: a severity-tinted, expandable summary row, built on native `<details>`/`<summary>` — no ARIA or behavior library needed, since the browser already implements keyboard toggling and accessible expanded state for this element. **Use when:** a resume-review-style flagged item that can expand for detail. **Don't use when:** the content should always be visible (skip `collapsible`) or it's not tied to a severity grade (plain Card with no `severity`). Severity colors are consolidated onto the same `severity.*` tokens Badge uses, not Figma's slightly different Card tints — see docs/design-inventory.md §1.2. The broader Review/Inline-Review card sub-families aren't implemented yet; this covers the reusable primitive they'd compose.",
      },
    },
  },
  args: {
    title: "Missing keywords",
    severity: "urgent",
    severityLabel: "Urgent",
    icon: <AlertCircleGlyph />,
    children: 'Add "React" and "TypeScript" to your skills section to match this job description.',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Playground: Story = {};

export const Severities: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "24rem" }}>
      {SEVERITIES.map((severity) => (
        <Card key={severity} {...args} severity={severity} severityLabel={severity !== "neutral" ? severity : undefined} title={`${severity} finding`} />
      ))}
    </div>
  ),
};

export const DefaultExpanded: Story = {
  args: { defaultExpanded: true },
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <Card {...args} />
    </div>
  ),
};

export const NonCollapsible: Story = {
  args: { collapsible: false },
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <Card {...args} />
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <Card {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByText("Missing keywords").closest("summary")).toHaveFocus();
    await userEvent.click(canvas.getByText("Missing keywords"));
    await expect(canvas.getByText(/Add "React"/)).toBeVisible();
  },
};
