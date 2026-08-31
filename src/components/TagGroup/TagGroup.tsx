import type { ReactNode } from "react";
import {
  Autocomplete as AriaAutocomplete,
  TagGroup as AriaTagGroup,
  TagList,
  Tag as AriaTag,
  Button as AriaButton,
  Label,
  Text,
  useFilter,
} from "react-aria-components";
import type { Key, Selection } from "react-aria-components";
import { MultiplicationSignIcon } from "@your-job-search-genius/icons";
import { SearchField } from "../SearchField/SearchField";
import "./TagGroup.css";

export interface TagOption {
  id: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TagGroupProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: string;
  items: TagOption[];
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  /** Adds a remove button to every tag — `react-aria-components` only renders it when this handler is supplied (its `Tag`'s `allowsRemoving` render prop is derived from this, not a separate flag). */
  onRemove?: (keys: Set<Key>) => void;
  /** Renders a `SearchField` above the tag list, wired to `react-aria-components`' `Autocomplete` so typing filters the visible tags in place — the "filter chips from a fixed set" recipe (e.g. picking interests). */
  searchable?: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;
  helperText?: string;
  errorMessage?: string;
  renderEmptyState?: () => ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TagGroup — built on `react-aria-components`' `TagGroup`/`TagList`/`Tag`:
 * a focusable, arrow-key-navigable set of chips with correct
 * `group`/roving-tabindex semantics and, when removable, a `Delete`/
 * `Backspace` keyboard shortcut wired to `onRemove` (WCAG doc §6). Distinct
 * from `TagsInput` — that component lets the user *type* arbitrary tags;
 * this one selects and/or removes tags from a **fixed, given** set (e.g.
 * interests, filters). Not in the source Figma file at all
 * (design-inventory.md §2.14). **Use when:** picking or filtering from a
 * known list of chip-shaped options. **Don't use when:** the value is
 * free text the user types (use `TagsInput`).
 */
export function TagGroup({
  label,
  items,
  selectionMode = "none",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  onRemove,
  searchable,
  searchLabel = "Search",
  searchPlaceholder,
  helperText,
  errorMessage,
  renderEmptyState = () => "No results found.",
  className,
  style,
}: TagGroupProps) {
  const { contains } = useFilter({ sensitivity: "base" });
  const invalid = Boolean(errorMessage);

  const tagGroup = (
    <AriaTagGroup
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={onSelectionChange}
      onRemove={onRemove}
      className={className ? `wsu-TagGroup ${className}` : "wsu-TagGroup"}
      style={style}
    >
      <Label className="wsu-TagGroup__label">{label}</Label>
      <TagList items={items} renderEmptyState={renderEmptyState} className="wsu-TagList">
        {(item) => (
          <AriaTag id={item.id} isDisabled={item.disabled} textValue={typeof item.label === "string" ? item.label : item.id} className="wsu-Tag">
            {({ allowsRemoving }) => (
              <>
                {item.label}
                {/* react-aria-components' own `Button` here, not this library's — `Tag` wires
                    the Delete/Backspace shortcut and the press handler that fires `onRemove`
                    through `ButtonContext`, keyed to `slot="remove"`; only its own `Button`
                    consumes that context, so the design system's `Button` can't be substituted
                    without losing that wiring. */}
                {allowsRemoving ? (
                  <AriaButton slot="remove" className="wsu-Tag__remove" aria-label={`Remove ${typeof item.label === "string" ? item.label : "tag"}`}>
                    <MultiplicationSignIcon size="0.6875rem" />
                  </AriaButton>
                ) : null}
              </>
            )}
          </AriaTag>
        )}
      </TagList>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-TagGroup__message wsu-TagGroup__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-TagGroup__message">
          {helperText}
        </Text>
      ) : null}
    </AriaTagGroup>
  );

  if (!searchable) {
    return tagGroup;
  }

  return (
    <AriaAutocomplete filter={contains}>
      <SearchField label={searchLabel} hideLabel placeholder={searchPlaceholder ?? searchLabel} className="wsu-TagGroup__search" />
      {tagGroup}
    </AriaAutocomplete>
  );
}
