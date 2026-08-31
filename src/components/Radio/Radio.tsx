import { forwardRef } from "react";
import type { ReactNode } from "react";
import {
  RadioGroup as AriaRadioGroup,
  RadioField as AriaRadioField,
  RadioButton as AriaRadioButton,
  Label,
  Text,
} from "react-aria-components";
import "./Radio.css";

export interface RadioGroupProps {
  /** Visible, programmatically-associated group label (WCAG 3.3.2). */
  label: ReactNode;
  children: ReactNode;
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  /** Shown below the group when there's no error. Linked via `Text slot="description"`. */
  helperText?: string;
  /**
   * Presence puts the group in the error state and renders this text below
   * it via `Text slot="errorMessage"`, wired to the group by
   * `react-aria-components` (WCAG 3.3.1 — errors identified in text).
   */
  errorMessage?: string;
  /** `vertical` (default, matches Figma) or `horizontal`. */
  orientation?: "vertical" | "horizontal";
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RadioGroup — built on `react-aria-components`' `RadioGroup`/`RadioField`/
 * `RadioButton` for the same reason as Checkbox: roving-tabindex arrow-key
 * navigation and group semantics (`radiogroup`/`radio` roles, one label
 * announced per group) are easy to get subtly wrong by hand.
 *
 * Uses the `RadioField`/`RadioButton` composition rather than the older
 * single-component `Radio` (deprecated upstream in favor of this split, now
 * that it's available in the installed `react-aria-components` version) so
 * each option can carry its own description text.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { label, children, value, defaultValue, onChange, disabled, required, helperText, errorMessage, orientation = "vertical", name, className, style },
  ref,
) {
  const invalid = Boolean(errorMessage);

  return (
    <AriaRadioGroup
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      orientation={orientation}
      name={name}
      className={className ? `wsu-RadioGroup ${className}` : "wsu-RadioGroup"}
      style={style}
    >
      <Label className="wsu-RadioGroup__label">
        {label}
        {required ? (
          <span className="wsu-RadioGroup__required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <div className={`wsu-RadioGroup__options wsu-RadioGroup__options--${orientation}`}>{children}</div>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-RadioGroup__message wsu-RadioGroup__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-RadioGroup__message">
          {helperText}
        </Text>
      ) : null}
    </AriaRadioGroup>
  );
});

export interface RadioProps {
  value: string;
  children: ReactNode;
  /** Optional helper text rendered under the option, wired via `Text slot="description"`. */
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Radio = forwardRef<HTMLLabelElement, RadioProps>(function Radio(
  { value, children, description, disabled, className, style },
  ref,
) {
  return (
    <AriaRadioField value={value} isDisabled={disabled} className="wsu-RadioField">
      <AriaRadioButton
        ref={ref}
        className={className ? `wsu-Radio ${className}` : "wsu-Radio"}
        style={style}
      >
        <span className="wsu-Radio__dot" aria-hidden="true" />
        <span className="wsu-Radio__label">{children}</span>
      </AriaRadioButton>
      {description ? (
        <Text slot="description" className="wsu-Radio__description">
          {description}
        </Text>
      ) : null}
    </AriaRadioField>
  );
});
