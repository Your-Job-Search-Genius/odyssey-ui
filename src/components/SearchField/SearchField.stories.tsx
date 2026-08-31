import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { SearchField } from "./SearchField";

const meta: Meta<typeof SearchField> = {
  title: "Custom Components/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG search pattern plus this system's own visual language (radius, spacing, colour and focus tokens), matching `Input`'s field box exactly. Built on `react-aria-components`' `SearchField` — it supplies `search` input semantics, an Escape-to-clear shortcut, and a clear button wired to whether there's a value. **Use when:** filtering a collection (pair with `react-aria-components`' `Autocomplete` — every filterable variant of Menu/ListBox/GridList/TagGroup/Table/CommandPalette in this library uses this). **Don't use when:** the field submits a value rather than filtering in place (use `Input`).",
      },
    },
  },
  args: { label: "Search" },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Playground: Story = {};

export const HiddenLabel: Story = {
  name: "Hidden label (designed, not in Figma)",
  args: { hideLabel: true, placeholder: "Search commands..." },
};

export const WithHelperText: Story = {
  args: { helperText: "Matches by title or description." },
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  args: { errorMessage: "Search query is too short." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Read-only query" },
};

export const ClearButton: Story = {
  name: "Clear button appears once typed",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox", { name: "Search" });
    await userEvent.type(input, "hello");
    const clear = canvas.getByRole("button", { name: /clear search/i });
    await expect(clear).toBeVisible();
    await userEvent.click(clear);
    await expect(input).toHaveValue("");
  },
};
