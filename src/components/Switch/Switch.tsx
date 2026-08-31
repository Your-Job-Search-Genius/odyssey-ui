import { forwardRef } from "react";
import type { ReactNode } from "react";
import { SwitchField as AriaSwitchField, SwitchButton as AriaSwitchButton, Text } from "react-aria-components";
import "./Switch.css";

export interface SwitchProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: ReactNode;
  /** Optional helper text rendered under the label, wired via `Text slot="description"`. */
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  /**
   * Presence puts the switch in the error state and renders this text below
   * it via `Text slot="errorMessage"`, wired to the field by
   * `react-aria-components` (WCAG 3.3.1 — errors identified in text).
   */
  errorMessage?: string;
  name?: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Switch — built on `react-aria-components`' `SwitchField`/`SwitchButton`
 * composition (the current, non-deprecated API, same reasoning as
 * RadioGroup/Radio) for the visually-hidden-native-input pattern and
 * hover/press/focus-visible state.
 *
 * Not in source Figma yet — styled to match the token usage and geometry
 * conventions of Checkbox/Radio (20px control height, `text-subtle` border
 * for the 3:1 non-text contrast floor) rather than a specific Figma node.
 */
export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(function Switch(
  { label, description, checked, defaultChecked, onChange, disabled, required, errorMessage, name, value, className, style },
  ref,
) {
  const invalid = Boolean(errorMessage);

  return (
    <AriaSwitchField
      isSelected={checked}
      defaultSelected={defaultChecked}
      onChange={onChange}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      name={name}
      value={value}
      className="wsu-SwitchField"
    >
      <AriaSwitchButton
        ref={ref}
        className={className ? `wsu-Switch ${className}` : "wsu-Switch"}
        style={style}
      >
        <span className="wsu-Switch__track" aria-hidden="true">
          <span className="wsu-Switch__handle" />
        </span>
        <span className="wsu-Switch__label">{label}</span>
      </AriaSwitchButton>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-Switch__message wsu-Switch__message--error">
          {errorMessage}
        </Text>
      ) : description ? (
        <Text slot="description" className="wsu-Switch__message">
          {description}
        </Text>
      ) : null}
    </AriaSwitchField>
  );
});
