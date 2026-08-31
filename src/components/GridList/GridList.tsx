import type { ReactNode } from "react";
import {
  Autocomplete as AriaAutocomplete,
  GridList as AriaGridList,
  GridListItem,
  useFilter,
} from "react-aria-components";
import type { Key, Selection } from "react-aria-components";
import { Tick01Icon } from "@your-job-search-genius/icons";
import { SearchField } from "../SearchField/SearchField";
import "./GridList.css";

export interface GridListOption {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** A leading thumbnail/avatar/icon — the file has no source for this row shape, so no fixed size is enforced; supply a pre-sized element. */
  image?: ReactNode;
  /** Trailing controls (e.g. a remove button) — kept out of arrow-key navigation the same way Menu's `actions` slot is. */
  actions?: ReactNode;
  disabled?: boolean;
  textValue?: string;
}

export interface GridListProps {
  /** Accessible name for the grid list (WCAG 4.1.2). */
  "aria-label": string;
  items: GridListOption[];
  selectionMode?: "single" | "multiple";
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  disabledKeys?: Key[];
  /** Renders a `SearchField` above the grid, wired to `react-aria-components`' `Autocomplete` so typing filters the visible rows in place. */
  searchable?: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;
  renderEmptyState?: () => ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GridList — built on `react-aria-components`' `GridList`/`GridListItem`:
 * a richer sibling of `ListBox` for rows that carry more than a label (an
 * image, a description, trailing actions), which is why it's a grid of
 * cells rather than a flat list under the hood — each row's interactive
 * parts (like `actions`) need their own arrow-key-reachable cell, which
 * `ListBox`'s single-cell rows can't provide (WCAG doc §6). Not in the
 * source Figma file (design-inventory.md §2.14); row layout borrows
 * ListBox's chrome plus a leading `image` slot.
 */
export function GridList({
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
}: GridListProps) {
  const { contains } = useFilter({ sensitivity: "base" });

  const grid = (
    <AriaGridList
      aria-label={ariaLabel}
      items={items}
      keyboardNavigationBehavior="tab"
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={onSelectionChange}
      disabledKeys={disabledKeys ?? items.filter((i) => i.disabled).map((i) => i.id)}
      renderEmptyState={renderEmptyState}
      className="wsu-GridList"
    >
      {(item) => (
        <GridListItem
          id={item.id}
          textValue={item.textValue ?? (typeof item.title === "string" ? item.title : item.id)}
          className="wsu-GridListItem"
        >
          {({ isSelected }) => (
            <>
              {selectionMode ? (
                isSelected ? (
                  <Tick01Icon size="1.25rem" className="wsu-GridListItem__check" data-state="checked" />
                ) : (
                  <span className="wsu-GridListItem__checkPlaceholder" aria-hidden="true" />
                )
              ) : null}
              {item.image ? (
                <span className="wsu-GridListItem__image" aria-hidden="true">
                  {item.image}
                </span>
              ) : null}
              <span className="wsu-GridListItem__body">
                <span className="wsu-GridListItem__title">{item.title}</span>
                {item.description ? <span className="wsu-GridListItem__description">{item.description}</span> : null}
              </span>
              {item.actions ? <span className="wsu-GridListItem__actions">{item.actions}</span> : null}
            </>
          )}
        </GridListItem>
      )}
    </AriaGridList>
  );

  if (!searchable) {
    return (
      <div className={className ? `wsu-GridListContainer ${className}` : "wsu-GridListContainer"} style={style}>
        {grid}
      </div>
    );
  }

  return (
    <AriaAutocomplete filter={contains}>
      <div className={className ? `wsu-GridListContainer ${className}` : "wsu-GridListContainer"} style={style}>
        <SearchField label={searchLabel} hideLabel placeholder={searchPlaceholder ?? searchLabel} className="wsu-GridListContainer__search" />
        {grid}
      </div>
    </AriaAutocomplete>
  );
}
