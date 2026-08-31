import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete } from "./Autocomplete";

const items = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
];

const meta: Meta<typeof Autocomplete> = {
  title: "Custom Components/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG pattern plus this system's own visual language (radius, spacing, colour and focus tokens), and re-checked against the corrected tokens after the Figma audit. ComboBox with free-text entry allowed — the typed value is accepted even when it doesn't match any suggestion. Not a distinct Figma component; a thin, documented configuration of ComboBox (see docs/design-inventory.md §2.14). **Use when:** suggesting known values (e.g. skills) while still accepting anything the user types. **Don't use when:** the value must be restricted to the list (use ComboBox).",
      },
    },
  },
  args: { label: "Skill", items, placeholder: "e.g. React" },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

export const Playground: Story = {};
