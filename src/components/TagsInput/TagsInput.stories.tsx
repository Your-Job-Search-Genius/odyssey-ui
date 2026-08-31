import type { Meta, StoryObj } from "@storybook/react";
import { TagsInput } from "./TagsInput";

const meta: Meta<typeof TagsInput> = {
  title: "Figma Components/Primitives/TagsInput",
  component: TagsInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'The "Tags" type from Figma\'s Inputs page (node 433:10374). Split out of `Input` rather than added as a prop, because it owns an array value rather than a string, plus its own keyboard contract. Enter commits the typed text; Backspace on an empty field removes the last tag; every tag has its own remove button so the set is fully keyboard-operable, and additions and removals are announced through a polite live region. The file specifies none of that behaviour — only the resting appearance — so it follows the WAI-ARIA pattern.',
      },
    },
  },
  args: { label: "Skills" },
};

export default meta;
type Story = StoryObj<typeof TagsInput>;

export const Playground: Story = {};

export const Empty: Story = {
  name: "Empty (the file's Default state)",
  args: { helperText: "This is a helper text" },
};

export const WithTags: Story = {
  args: { defaultValue: ["React", "TypeScript", "CSS"], helperText: "This is a helper text" },
};

export const Wrapping: Story = {
  name: "Wrapping past one line",
  args: {
    defaultValue: ["React", "TypeScript", "CSS", "Accessibility", "Design Systems", "Storybook", "Testing"],
  },
};

export const Invalid: Story = {
  args: { defaultValue: ["React"], errorMessage: "Add at least three skills" },
};

export const Disabled: Story = {
  args: { defaultValue: ["React", "CSS"], disabled: true },
};
