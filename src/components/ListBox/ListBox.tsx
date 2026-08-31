import type { ReactNode } from "react";
import {
  Autocomplete as AriaAutocomplete,
  ListBox as AriaListBox,
  ListBoxItem,
  useFilter,
} from "react-aria-components";
import type { Key, Selection } from "react-aria-components";
import { Tick01Icon } from "@your-job-search-genius/icons";
import { SearchField } from "../SearchField/SearchField";
import "../Select/popover-menu.css";
import "./ListBox.css";

export interface ListBoxOption {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface ListBoxProps {
  /** Accessible name for the list (WCAG 4.1.2 — a list needs a name distinguishing it from any other list on the page). */
  "aria-label": string;
  items: ListBoxOption[];
  selectionMode?: "single" | "multiple";
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  disabledKeys?: Key[];
  /**
   * Renders a `SearchField` above the list, wired to
   * `react-aria-components`' `Autocomplete` so typing filters the visible
   * rows in place — this is the library's own "filterable list" recipe
   * (docs/design-inventory.md §2.14), not a distinct Figma component.
   */
  searchable?: boolean;
  /** Accessible name for the search field when `searchable` is set. */
  searchLabel?: string;
  searchPlaceholder?: string;
  renderEmptyState?: () => ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ListBox — built on `react-aria-components`' `ListBox`/`ListBoxItem`:
 * roving-tabindex arrow-key navigation, typeahead, and correct
 * `listbox`/`option` role + `aria-selected` wiring are the error-prone part
 * to hand-roll (WCAG doc §6). Standalone, not popover-anchored (Select
 * already covers "a ListBox inside a trigger's popover") — this is the
 * inline, always-visible form: a picker embedded directly in a page or
 * panel. Row styling is shared with Select/ComboBox/Menu's popover-menu
 * chrome; the outer container borrows `.wsu-Popover`'s box-sizing reset
 * (same portal-adjacent reasoning doesn't apply here since this renders
 * inline, but the metrics match so the container is visually consistent
 * with the popover-anchored pickers beside it).
 */
export function ListBox({
  "aria-label": ariaLabel,
  items,
  selectionMode = "single",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  searchable,
  searchLabel = "Search",
  searchPlaceholder,
  renderEmptyState = () => <div className="wsu-Menu__empty">No results found.</div>,
  className,
  style,
}: ListBoxProps) {
  const { contains } = useFilter({ sensitivity: "base" });

  const list = (
    <AriaListBox
      aria-label={ariaLabel}
      items={items}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={onSelectionChange}
      disabledKeys={disabledKeys ?? items.filter((i) => i.disabled).map((i) => i.id)}
      renderEmptyState={renderEmptyState}
      className="wsu-ListBox wsu-ListBox--standalone"
    >
      {(item) => (
        <ListBoxItem
          id={item.id}
          textValue={typeof item.label === "string" ? item.label : item.id}
          className="wsu-ListBoxItem"
          data-layout={item.description ? "description" : undefined}
        >
          {({ isSelected }) => (
            <>
              {item.description ? (
                <span className="wsu-ListBoxItem__body">
                  <span className="wsu-ListBoxItem__title">{item.label}</span>
                  <span className="wsu-ListBoxItem__description">{item.description}</span>
                </span>
              ) : (
                item.label
              )}
              {isSelected ? <Tick01Icon size="1.25rem" className="wsu-ListBoxItem__check" /> : null}
            </>
          )}
        </ListBoxItem>
      )}
    </AriaListBox>
  );

  if (!searchable) {
    return (
      <div className={className ? `wsu-ListBoxContainer ${className}` : "wsu-ListBoxContainer"} style={style}>
        {list}
      </div>
    );
  }

  return (
    <AriaAutocomplete filter={contains}>
      <div className={className ? `wsu-ListBoxContainer ${className}` : "wsu-ListBoxContainer"} style={style}>
        <SearchField label={searchLabel} hideLabel placeholder={searchPlaceholder ?? searchLabel} className="wsu-ListBoxContainer__search" />
        {list}
      </div>
    </AriaAutocomplete>
  );
}
