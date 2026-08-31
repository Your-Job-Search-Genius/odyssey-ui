import { forwardRef } from "react";
import {
  SearchField as AriaSearchField,
  Input as AriaInput,
  Button as AriaButton,
  Label,
  Text,
} from "react-aria-components";
import { Search02Icon, MultiplicationSignIcon } from "@your-job-search-genius/icons";
import "./SearchField.css";

export interface SearchFieldProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required, no `aria-label` escape hatch). */
  label: string;
  /** Hides the label visually while keeping it in the accessibility tree — the autocomplete/filter-bar use case, where the surrounding UI (a placeholder, a trigger button) already makes the field's purpose visually obvious. */
  hideLabel?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SearchField — built on `react-aria-components`' `SearchField`: it supplies
 * the `search` input type semantics, an Escape-to-clear keyboard shortcut,
 * and a clear button whose visibility is wired to whether there's a value —
 * all of which this system's plain `Input` deliberately doesn't own, since
 * most fields aren't search fields (WCAG doc §6). Not in the source Figma
 * file at all (see docs/design-inventory.md §2.14) — chrome matches
 * `Input`'s field box exactly (10px radius, inset stroke, focus ring) so it
 * drops into the same forms without looking like a foreign control.
 * **Use when:** filtering a collection (Menu, ListBox, GridList, TagGroup,
 * Table, CommandPalette all pair this with `react-aria-components`'
 * `Autocomplete`). **Don't use when:** the field submits a value rather
 * than filtering in place (use `Input`).
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    label,
    hideLabel,
    placeholder = "Search",
    value,
    defaultValue,
    onChange,
    disabled,
    helperText,
    errorMessage,
    className,
    style,
  },
  ref,
) {
  const invalid = Boolean(errorMessage);

  return (
    <AriaSearchField
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      isDisabled={disabled}
      isInvalid={invalid}
      aria-label={hideLabel ? label : undefined}
      className={className ? `wsu-SearchField ${className}` : "wsu-SearchField"}
      style={style}
    >
      {hideLabel ? null : <Label className="wsu-SearchField__label">{label}</Label>}
      <div className="wsu-SearchField__field">
        <Search02Icon size="1rem" className="wsu-SearchField__icon" />
        <AriaInput ref={ref} placeholder={placeholder} className="wsu-SearchField__input" />
        {/* react-aria-components renders this unconditionally and gives it no default
            accessible name — visibility is handled in CSS off the field's own `data-empty`
            state, and the name needs to be supplied here explicitly. */}
        <AriaButton className="wsu-SearchField__clear" aria-label="Clear search">
          <MultiplicationSignIcon size="0.75rem" />
        </AriaButton>
      </div>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-SearchField__message wsu-SearchField__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-SearchField__message">
          {helperText}
        </Text>
      ) : null}
    </AriaSearchField>
  );
});
