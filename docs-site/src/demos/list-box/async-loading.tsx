import {
  Autocomplete as AriaAutocomplete,
  ListBox as AriaListBox,
  ListBoxItem,
  useAsyncList,
} from "react-aria-components";
import { SearchField } from "@your-job-search-genius/odyssey-ui";

interface Fruit {
  id: string;
  label: string;
}

export default function ListBoxAsyncLoading() {
  const list = useAsyncList<Fruit>({
    async load({ filterText }) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const all: Fruit[] = [
        { id: "apple", label: "Apple" },
        { id: "apricot", label: "Apricot" },
        { id: "banana", label: "Banana" },
        { id: "blueberry", label: "Blueberry" },
        { id: "cherry", label: "Cherry" },
        { id: "cranberry", label: "Cranberry" },
      ];
      const query = (filterText ?? "").toLowerCase();
      return {
        items: query ? all.filter((item) => item.label.toLowerCase().includes(query)) : all,
      };
    },
  });

  return (
    <AriaAutocomplete inputValue={list.filterText} onInputChange={list.setFilterText}>
      <div className="wsu-ListBoxContainer" style={{ width: 260 }}>
        <SearchField
          label="Search fruit"
          hideLabel
          placeholder="Search fruit"
          className="wsu-ListBoxContainer__search"
        />
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
