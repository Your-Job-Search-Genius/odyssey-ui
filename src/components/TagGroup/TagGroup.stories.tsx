import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { TagGroup } from "./TagGroup";

const interests = [
  { id: "news", label: "News" },
  { id: "travel", label: "Travel" },
  { id: "gaming", label: "Gaming" },
  { id: "shopping", label: "Shopping" },
  { id: "food", label: "Food" },
];

const meta: Meta<typeof TagGroup> = {
  title: "Custom Components/TagGroup",
  component: TagGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG pattern plus this system's own visual language, reusing `TagsInput`'s pill shape. Built on `react-aria-components`' `TagGroup`/`TagList`/`Tag` — a focusable, arrow-key-navigable chip set with a `Delete`/`Backspace` removal shortcut wired automatically once `onRemove` is supplied. Distinct from `TagsInput`, which lets the user type arbitrary tags: this selects and/or removes tags from a **fixed** set. **Use when:** picking or filtering from a known list of chip-shaped options (interests, categories, active filters), optionally with `searchable`. **Don't use when:** the value is free text the user types (use `TagsInput`).",
      },
    },
  },
  args: { label: "Interests", items: interests },
};

export default meta;
type Story = StoryObj<typeof TagGroup>;

export const Playground: Story = {};

export const Selectable: Story = {
  name: "Selectable (filter chips)",
  args: { selectionMode: "multiple" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Travel"));
  },
};

export const Removable: Story = {
  name: "Removable (designed, not in Figma)",
  args: { onRemove: () => {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: /Remove News/ })).toBeInTheDocument();
  },
};

export const Searchable: Story = {
  name: "Searchable (filterable via Autocomplete)",
  args: { searchable: true, searchLabel: "Search interests" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole("searchbox", { name: "Search interests" });
    await userEvent.type(search, "Gam");
    await expect(canvas.getByText("Gaming")).toBeInTheDocument();
    await expect(canvas.queryByText("News")).not.toBeInTheDocument();
  },
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  args: { selectionMode: "multiple", errorMessage: "Choose at least one interest." },
};
