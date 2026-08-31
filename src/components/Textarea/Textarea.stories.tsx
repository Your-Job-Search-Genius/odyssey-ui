import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Figma Components/Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Native `<textarea>` with the same label/helper/error wiring as Input. **Use when:** collecting multiple lines of plain text. **Don't use when:** a single line suffices (use Input) or rich formatting is needed (Figma's \"Rich Text\" variant is out of scope for this primitive — see docs/design-inventory.md §2.5).",
      },
    },
  },
  args: { label: "Cover letter", placeholder: "Tell us why you're a great fit..." },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <Textarea {...args} />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <Textarea {...args} helperText="Keep it under 500 words." />
    </div>
  ),
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <Textarea {...args} errorMessage="Cover letter is required." />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <Textarea {...args} disabled defaultValue="Dear hiring manager," />
    </div>
  ),
};
