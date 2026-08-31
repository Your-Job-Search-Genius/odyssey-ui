import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Separator } from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "Custom Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built directly on `react-aria-components`' `Separator` — a purely presentational divider between groups of content. **Use when:** dividing sections of a page, or items within a menu or toolbar. **Don't use when:** the boundary is between form fields — the existing field-box tokens already draw their own edges.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <p>Section one content.</p>
      <Separator {...args} style={{ margin: "0.75rem 0" }} />
      <p>Section two content.</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("separator")).toBeInTheDocument();
  },
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", height: "2.5rem" }}>
      <span>Profile</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
      <Separator orientation="vertical" />
      <span>Log out</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separators = canvas.getAllByRole("separator");
    await expect(separators[0]).toHaveAttribute("aria-orientation", "vertical");
  },
};
