import { forwardRef } from "react";
import type { ReactNode } from "react";
import { RadioGroup as AriaRadioGroup, Radio as AriaRadio, Label } from "react-aria-components";
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
  /** `vertical` (default, matches Figma) or `horizontal`. */
  orientation?: "vertical" | "horizontal";
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RadioGroup — built on `react-aria-components`' `RadioGroup`/`Radio` for
 * the same reason as Checkbox: roving-tabindex arrow-key navigation and
 * group semantics (`radiogroup`/`radio` roles, one label announced per
 * group) are easy to get subtly wrong by hand.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { label, children, value, defaultValue, onChange, disabled, required, orientation = "vertical", name, className, style },
  ref,
) {
  return (
    <AriaRadioGroup
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      isDisabled={disabled}
      isRequired={required}
      orientation={orientation}
      name={name}
      className={className ? `wsu-RadioGroup ${className}` : "wsu-RadioGroup"}
      style={style}
    >
      <Label className="wsu-RadioGroup__label">{label}</Label>
      <div className={`wsu-RadioGroup__options wsu-RadioGroup__options--${orientation}`}>{children}</div>
    </AriaRadioGroup>
  );
});

export interface RadioProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Radio = forwardRef<HTMLLabelElement, RadioProps>(function Radio(
  { value, children, disabled, className, style },
  ref,
) {
  return (
    <AriaRadio
      ref={ref}
      value={value}
      isDisabled={disabled}
      className={className ? `wsu-Radio ${className}` : "wsu-Radio"}
      style={style}
    >
      <span className="wsu-Radio__dot" aria-hidden="true" />
      <span className="wsu-Radio__label">{children}</span>
    </AriaRadio>
  );
});
