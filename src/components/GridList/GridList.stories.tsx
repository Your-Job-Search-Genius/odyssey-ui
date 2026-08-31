import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { GridList } from "./GridList";
import { Button } from "../Button";

function avatar(initials: string) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--wsu-color-secondary-bg)",
        color: "var(--wsu-color-text-heading)",
        font: "var(--wsu-font-body-sm-semibold)",
      }}
    >
      {initials}
    </div>
  );
}

const items = [
  { id: "ada", title: "Ada Lovelace", description: "Mathematician", image: avatar("AL") },
  { id: "grace", title: "Grace Hopper", description: "Computer scientist", image: avatar("GH") },
  { id: "margaret", title: "Margaret Hamilton", description: "Software engineer", image: avatar("MH") },
  { id: "katherine", title: "Katherine Johnson", description: "Physicist", image: avatar("KJ") },
];

const meta: Meta<typeof GridList> = {
  title: "Custom Components/GridList",
  component: GridList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG grid pattern plus this system's own visual language. Built on `react-aria-components`' `GridList` — a richer sibling of `ListBox` for rows that carry more than a label (an image, a description, trailing actions), each reachable by arrow keys as its own grid cell. **Use when:** a selectable list needs a thumbnail, secondary line, or per-row action, optionally with `searchable` to filter in place. **Don't use when:** rows are plain text-only options (use `ListBox`) or the content is genuinely tabular (use `Table`).",
      },
    },
  },
  args: { "aria-label": "People", items },
};

export default meta;
type Story = StoryObj<typeof GridList>;

export const Playground: Story = {};

export const MultipleSelection: Story = {
  args: { selectionMode: "multiple" },
};

export const Searchable: Story = {
  name: "Searchable (filterable via Autocomplete)",
  args: { searchable: true, searchLabel: "Search people" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole("searchbox", { name: "Search people" });
    await userEvent.type(search, "Grace");
    await expect(canvas.getByRole("row", { name: /Grace Hopper/ })).toBeInTheDocument();
    await expect(canvas.queryByRole("row", { name: /Ada Lovelace/ })).not.toBeInTheDocument();
  },
};

export const WithActions: Story = {
  name: "With trailing actions",
  args: {
    items: items.map((item) => ({
      ...item,
      actions: (
        <Button variant="text" size="sm">
          Remove
        </Button>
      ),
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const adaRow = canvas.getByRole("row", { name: /Ada Lovelace/ });
    const graceRow = canvas.getByRole("row", { name: /Grace Hopper/ });

    // Tab into the grid (lands on the first row), then Tab again to reach
    // that row's trailing action — keyboardNavigationBehavior="tab" routes
    // Tab into the row's focusable children instead of exiting the grid.
    adaRow.focus();
    await userEvent.tab();
    await expect(within(adaRow).getByRole("button", { name: "Remove" })).toHaveFocus();

    // Shift+Tab returns to the row; Arrow keys (not Tab) move between rows.
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(adaRow).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(graceRow).toHaveFocus();
    await userEvent.tab();
    await expect(within(graceRow).getByRole("button", { name: "Remove" })).toHaveFocus();
  },
};
