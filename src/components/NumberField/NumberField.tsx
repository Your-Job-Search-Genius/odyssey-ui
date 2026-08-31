import { forwardRef } from "react";
import { NumberField as AriaNumberField, Group, Input as AriaInput, Button as AriaButton, Label, Text } from "react-aria-components";
import { Add01Icon, MinusSignIcon } from "@your-job-search-genius/icons";
import "./NumberField.css";

export interface NumberFieldProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required, no `aria-label` escape hatch). */
  label: string;
  placeholder?: string;
  /** The current value (controlled). */
  value?: number;
  /** The initial value (uncontrolled). */
  defaultValue?: number;
  /** Called once editing is committed (on blur, increment, or decrement) — not on every keystroke. */
  onChange?: (value: number) => void;
  /** Formatting — and, in turn, which typed characters are allowed — per `Intl.NumberFormatOptions` (e.g. `{style: 'currency', currency: 'USD'}`). */
  formatOptions?: Intl.NumberFormatOptions;
  /** The smallest value allowed. Steps are computed starting from this value. */
  minValue?: number;
  /** The largest value allowed. */
  maxValue?: number;
  /** The amount the value changes per increment/decrement. */
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Submits the raw numeric value (not the formatted string) under this name when placed in an HTML `<form>`. */
  name?: string;
  /** Custom label for the increment button. Defaults to the localized string "Increment". */
  incrementAriaLabel?: string;
  /** Custom label for the decrement button. Defaults to the localized string "Decrement". */
  decrementAriaLabel?: string;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * NumberField — built on `react-aria-components`' `NumberField`: locale-aware
 * number parsing/formatting and typed-character filtering (`formatOptions`),
 * min/max clamping, and step-based increment/decrement are all genuinely
 * hard to get right by hand (WCAG doc §6). Not in the source Figma file at
 * all (see docs/design-inventory.md §2.14) — the field box mirrors
 * `DatePicker`'s group (44px row, 10px radius, inset 1px stroke) so it drops
 * into the same forms without looking like a foreign control, with the
 * stepper buttons occupying the trailing edge the way `DatePicker`'s trigger
 * does. **Use when:** the value is a plain quantity (a count, a percentage,
 * a currency amount). **Don't use when:** the value is a date/time/color
 * (use `DateField`/`ColorField`) or free text (use `Input`).
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    label,
    placeholder,
    value,
    defaultValue,
    onChange,
    formatOptions,
    minValue,
    maxValue,
    step,
    disabled,
    readOnly,
    required,
    name,
    incrementAriaLabel,
    decrementAriaLabel,
    helperText,
    errorMessage,
    className,
    style,
  },
  ref,
) {
  const invalid = Boolean(errorMessage);

  return (
    <AriaNumberField
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      formatOptions={formatOptions}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isRequired={required}
      isInvalid={invalid}
      name={name}
      incrementAriaLabel={incrementAriaLabel}
      decrementAriaLabel={decrementAriaLabel}
      className={className ? `wsu-NumberField ${className}` : "wsu-NumberField"}
      style={style}
    >
      <Label className="wsu-NumberField__label">
        {label}
        {required ? (
          <span className="wsu-NumberField__required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <Group className="wsu-NumberField__group">
        <AriaInput ref={ref} placeholder={placeholder} className="wsu-NumberField__input" />
        <AriaButton slot="decrement" className="wsu-NumberField__stepper wsu-NumberField__stepper--decrement">
          <MinusSignIcon size="0.875rem" />
        </AriaButton>
        <AriaButton slot="increment" className="wsu-NumberField__stepper wsu-NumberField__stepper--increment">
          <Add01Icon size="0.875rem" />
        </AriaButton>
      </Group>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-NumberField__message wsu-NumberField__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-NumberField__message">
          {helperText}
        </Text>
      ) : null}
    </AriaNumberField>
  );
});
