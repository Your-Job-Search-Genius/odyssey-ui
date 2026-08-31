import type { ReactNode } from "react";
import {
  ComboBox as AriaComboBox,
  Input as AriaInput,
  Button as AriaButton,
  Popover,
  ListBox,
  ListBoxItem,
  Label,
  Text,
  VisuallyHidden,
} from "react-aria-components";
import type { Key } from "react-aria-components";
import { ArrowDown01SharpIcon, Tick01Icon } from "@your-job-search-genius/icons";
import "../Select/popover-menu.css";
import "./ComboBox.css";

export interface ComboBoxOption {
  id: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ComboBoxProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: string;
  items: ComboBoxOption[];
  placeholder?: string;
  selectedKey?: Key | null;
  defaultSelectedKey?: Key;
  onSelectionChange?: (key: Key | null) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  /** When true, the typed text is accepted as-is even if it doesn't match any option (what powers the Autocomplete component). Defaults to false — the value must match a list item. */
  allowsCustomValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ComboBox — built on `react-aria-components`' `ComboBox`: it's a Select
 * plus free-text filtering, which raises the same "can't restyle a native
 * control this much and keep it accessible" problem, just with a larger
 * accessible-name/typeahead/filtering surface to get right (WCAG doc §6).
 * Shares Select's popover-menu chrome.
 */
export function ComboBox({
  label,
  items,
  placeholder,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  inputValue,
  defaultInputValue,
  onInputChange,
  disabled,
  required,
  helperText,
  errorMessage,
  allowsCustomValue,
  className,
  style,
}: ComboBoxProps) {
  const invalid = Boolean(errorMessage);

  return (
    <AriaComboBox
      // `defaultItems` (not `items`) so react-aria-components auto-filters by
      // inputValue using its built-in contains-filter — `items` is the "fully
      // controlled, you filter it yourself" form, which silently rendered the
      // unfiltered list here until this was caught by ComboBox.test.tsx.
      defaultItems={items}
      // Default is 'input' (opens only once the user starts typing) — 'focus' opens on
      // click/focus too, showing every option immediately like a familiar dropdown.
      menuTrigger="focus"
      // Otherwise the popover just closes when the filter matches nothing,
      // and the "No matches" renderEmptyState below never gets a chance to show.
      allowsEmptyCollection
      allowsCustomValue={allowsCustomValue}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={onSelectionChange}
      inputValue={inputValue}
      defaultInputValue={defaultInputValue}
      onInputChange={onInputChange}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      className={className ? `wsu-ComboBox ${className}` : "wsu-ComboBox"}
      style={style}
    >
      <Label className="wsu-ComboBox__label">
        {label}
        {required ? (
          <span className="wsu-ComboBox__required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <div className="wsu-ComboBox__field">
        <AriaInput placeholder={placeholder} className="wsu-ComboBox__input" />
        {/* react-aria-components' Button here auto-sets its own aria-labelledby
            (self id + the field's Label id), which — per accname precedence —
            silences a plain `aria-label` prop entirely (verified by inspecting
            the rendered DOM: the computed name came out as just "Document
            type", not "Show suggestions"). VisuallyHidden text is the pattern
            the library actually reads for this case, since the self-reference
            in aria-labelledby picks up the button's own visible/hidden content. */}
        <AriaButton className="wsu-ComboBox__toggle">
          <VisuallyHidden>Show suggestions</VisuallyHidden>
          <ArrowDown01SharpIcon size="1rem" />
        </AriaButton>
      </div>
      <Popover className="wsu-Popover">
        {/* No `items` prop here — ComboBox already filters its top-level `items` collection
            by `inputValue` and hands the filtered result down via context; passing `items`
            again on ListBox re-renders the full unfiltered list instead. */}
        <ListBox className="wsu-ListBox" renderEmptyState={() => <div className="wsu-ComboBox__empty">No matches</div>}>
          {(item: ComboBoxOption) => (
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
      </Popover>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-ComboBox__message wsu-ComboBox__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-ComboBox__message">
          {helperText}
        </Text>
      ) : null}
    </AriaComboBox>
  );
}
