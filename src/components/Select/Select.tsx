import type { ReactNode } from "react";
import {
  Select as AriaSelect,
  Button as AriaButton,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  Label,
  Text,
  Autocomplete as AriaAutocomplete,
  useFilter,
} from "react-aria-components";
import type { Key } from "react-aria-components";
import { ArrowDown01SharpIcon, Tick01Icon } from "@your-job-search-genius/icons";
import { SearchField } from "../SearchField/SearchField";
import "./popover-menu.css";
import "./Select.css";

export interface SelectOption {
  id: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: string;
  items: SelectOption[];
  placeholder?: string;
  selectedKey?: Key | null;
  defaultSelectedKey?: Key;
  onSelectionChange?: (key: Key | null) => void;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  /**
   * Renders a `SearchField` at the top of the popover, wired to
   * `react-aria-components`' `Autocomplete` so typing filters the option
   * list in place — this library's own "searchable select" recipe
   * (docs/design-inventory.md §2.14) for long option lists, not a distinct
   * Figma component.
   */
  searchable?: boolean;
  /** Accessible name for the search field when `searchable` is set. */
  searchLabel?: string;
  searchPlaceholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Select — built on `react-aria-components`' `Select`/`ListBox`/`Popover`:
 * restyling a native `<select>` to this degree isn't possible while
 * keeping its listbox popup accessible, so the behavior layer takes over
 * `combobox`/`listbox` roles, typeahead, and keyboard nav entirely (WCAG
 * doc §6). Sits on the shared popover-menu chrome in popover-menu.css.
 */
export function Select({
  label,
  items,
  placeholder = "Select an option",
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  disabled,
  required,
  helperText,
  errorMessage,
  searchable,
  searchLabel = "Search",
  searchPlaceholder,
  className,
  style,
}: SelectProps) {
  const invalid = Boolean(errorMessage);
  const { contains } = useFilter({ sensitivity: "base" });

  const listbox = (
    <ListBox items={items} className="wsu-ListBox">
      {(item) => (
        <ListBoxItem id={item.id} isDisabled={item.disabled} textValue={String(item.label)} className="wsu-ListBoxItem">
          {({ isSelected }) => (
            <>
              {item.label}
              {isSelected ? <Tick01Icon size="1.25rem" className="wsu-ListBoxItem__check" /> : null}
            </>
          )}
        </ListBoxItem>
      )}
    </ListBox>
  );

  return (
    <AriaSelect
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={onSelectionChange}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      className={className ? `wsu-Select ${className}` : "wsu-Select"}
      style={style}
    >
      <Label className="wsu-Select__label">
        {label}
        {required ? (
          <span className="wsu-Select__required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      {/* react-aria-components' Button unconditionally strips aria-invalid (its
          filterDOMProps allowlist for arbitrary DOM props only covers a short list —
          dir, lang, hidden, inert, translate, "data-" prefixed attributes, and global
          events — aria-invalid isn't in it, verified by rendering this and inspecting
          the DOM), so it can't be forwarded here. WCAG 3.3.1 is still met: the error is
          identified in visible text, linked to this button via aria-describedby below
          (react-aria-components wires that part automatically from the
          Text slot="errorMessage" below). */}
      <AriaButton className="wsu-Select__trigger">
        <SelectValue className="wsu-Select__value">{({ isPlaceholder, selectedText }) => (isPlaceholder ? placeholder : selectedText)}</SelectValue>
        <ArrowDown01SharpIcon size="1rem" className="wsu-Select__chevron" />
      </AriaButton>
      <Popover className="wsu-Popover">
        {searchable ? (
          <AriaAutocomplete filter={contains}>
            <SearchField label={searchLabel} hideLabel placeholder={searchPlaceholder ?? searchLabel} className="wsu-Select__search" />
            {listbox}
          </AriaAutocomplete>
        ) : (
          listbox
        )}
      </Popover>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-Select__message wsu-Select__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-Select__message">
          {helperText}
        </Text>
      ) : null}
    </AriaSelect>
  );
}
