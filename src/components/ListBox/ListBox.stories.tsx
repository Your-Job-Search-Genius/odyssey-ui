import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  Autocomplete as AriaAutocomplete,
  ListBox as AriaListBox,
  ListBoxItem,
  useAsyncList,
} from "react-aria-components";
import { ListBox } from "./ListBox";
import { SearchField } from "../SearchField/SearchField";

const items = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust", disabled: true },
  { id: "go", label: "Go" },
];

const skills = [
  { id: "react", label: "React", description: "Component-based UI library" },
  { id: "graphql", label: "GraphQL", description: "Query language for APIs" },
  { id: "docker", label: "Docker", description: "Container runtime and image format" },
];

const meta: Meta<typeof ListBox> = {
  title: "Custom Components/ListBox",
  component: ListBox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG listbox pattern plus this system's own visual language, sharing row chrome with Select/ComboBox/Menu. Built on `react-aria-components`' `ListBox` — a standalone, always-visible picker (not popover-anchored, unlike Select's internal listbox). **Use when:** the options should stay visible on the page rather than behind a trigger, optionally with `searchable` to filter a longer list in place. **Don't use when:** the picker should collapse behind a trigger (use `Select`) or accept free text (use `ComboBox`/`Autocomplete`).",
      },
    },
  },
  args: { "aria-label": "Languages", items },
};

export default meta;
type Story = StoryObj<typeof ListBox>;

export const Playground: Story = {};

export const MultipleSelection: Story = {
  args: { selectionMode: "multiple" },
};

export const WithDescriptions: Story = {
  args: { "aria-label": "Skills", items: skills },
};

export const Searchable: Story = {
  name: "Searchable (filterable via Autocomplete)",
  args: { searchable: true, searchLabel: "Search languages" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole("searchbox", { name: "Search languages" });
    await userEvent.type(search, "Type");
    await expect(canvas.getByRole("option", { name: "TypeScript" })).toBeInTheDocument();
    await expect(canvas.queryByRole("option", { name: "JavaScript" })).not.toBeInTheDocument();
  },
};

export const EmptyState: Story = {
  name: "Searchable with no matches",
  args: { searchable: true, searchLabel: "Search languages", items: [] },
};

/**
 * The "fully controlled" async recipe from `react-aria-components`' own
 * docs: `Autocomplete`'s `inputValue`/`onInputChange` drive an external data
 * source instead of the built-in client-side `filter`, and the collection
 * renders whatever that source currently holds. Simulated here with an
 * in-memory word list behind an artificial delay rather than a real network
 * call, so the story stays deterministic and dependency-free — the pattern
 * (not the data source) is what this demonstrates.
 */
function AsyncSearchExample() {
  const list = useAsyncList<{ id: string; label: string }>({
    async load({ filterText }) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const all = [
        { id: "apple", label: "Apple" },
        { id: "apricot", label: "Apricot" },
        { id: "banana", label: "Banana" },
        { id: "blueberry", label: "Blueberry" },
        { id: "cherry", label: "Cherry" },
        { id: "cranberry", label: "Cranberry" },
      ];
      const query = (filterText ?? "").toLowerCase();
      return { items: query ? all.filter((item) => item.label.toLowerCase().includes(query)) : all };
    },
  });

  return (
    <AriaAutocomplete inputValue={list.filterText} onInputChange={list.setFilterText}>
      <div className="wsu-ListBoxContainer" style={{ width: 260 }}>
        <SearchField label="Search fruit" hideLabel placeholder="Search fruit" className="wsu-ListBoxContainer__search" />
        <AriaListBox
          aria-label="Fruit"
          items={list.items}
          renderEmptyState={() => (list.isLoading ? "Loading…" : "No results found.")}
          className="wsu-ListBox wsu-ListBox--standalone"
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.label} className="wsu-ListBoxItem">
              {item.label}
            </ListBoxItem>
          )}
        </AriaListBox>
      </div>
    </AriaAutocomplete>
  );
}

export const AsyncLoading: Story = {
  name: "Async loading (controlled inputValue)",
  render: () => <AsyncSearchExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole("searchbox", { name: "Search fruit" });
    await userEvent.type(search, "cher");
    await expect(await canvas.findByRole("option", { name: "Cherry" })).toBeInTheDocument();
  },
};
