import { ComboBox } from "../ComboBox";
import type { ComboBoxProps } from "../ComboBox";

export type AutocompleteProps = Omit<ComboBoxProps, "allowsCustomValue">;

/**
 * Autocomplete — ComboBox with free-text entry allowed: the typed value is
 * accepted even when it doesn't match any suggestion, unlike ComboBox
 * (which requires selecting a real option). Not a distinct Figma
 * component or React Aria primitive — a thin, documented configuration of
 * ComboBox, per docs/design-inventory.md §2.14 ("designed to match
 * system" for anything absent from the source file).
 */
export function Autocomplete(props: AutocompleteProps) {
  return <ComboBox {...props} allowsCustomValue />;
}
