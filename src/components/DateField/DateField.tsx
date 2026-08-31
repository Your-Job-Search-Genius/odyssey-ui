import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Label,
  Text,
} from "react-aria-components";
import type { DateFieldProps as AriaDateFieldProps, DateValue } from "react-aria-components";
import "./DateField.css";

export interface DateFieldProps<T extends DateValue> extends Omit<AriaDateFieldProps<T>, "className" | "style" | "children"> {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required, no `aria-label` escape hatch). */
  label: string;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DateField — built on `react-aria-components`' `DateField`/`DateInput`:
 * splitting a date into individually-editable, arrow-key-adjustable
 * segments and formatting/parsing per the user's locale and calendar
 * system isn't safe to hand-roll (WCAG doc §6). Not in the source Figma
 * file (design-inventory.md §2.14) — field chrome matches `Input`'s/
 * `ColorField`'s field box exactly (10px radius, inset stroke, focus
 * ring); the focused-segment highlight reuses the primary color token
 * rather than inventing a new selection color. **Use when:** typing an
 * exact date/time value directly (e.g. a birthdate, an appointment time).
 * **Don't use when:** the user should pick visually from a grid (use
 * `Calendar`, or compose both behind a trigger for a full date picker).
 */
export function DateField<T extends DateValue>({
  label,
  helperText,
  errorMessage,
  className,
  style,
  isInvalid,
  ...props
}: DateFieldProps<T>) {
  const invalid = isInvalid ?? Boolean(errorMessage);

  return (
    <AriaDateField
      {...props}
      isInvalid={invalid}
      className={className ? `wsu-DateField ${className}` : "wsu-DateField"}
      style={style}
    >
      <Label className="wsu-DateField__label">{label}</Label>
      <AriaDateInput className="wsu-DateField__field">
        {(segment) => <AriaDateSegment segment={segment} className="wsu-DateField__segment" />}
      </AriaDateInput>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-DateField__message wsu-DateField__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-DateField__message">
          {helperText}
        </Text>
      ) : null}
    </AriaDateField>
  );
}
