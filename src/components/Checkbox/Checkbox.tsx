import { forwardRef, useId } from "react";
import type { ReactNode } from "react";
import { Checkbox as AriaCheckbox, CheckboxGroup as AriaCheckboxGroup, Label } from "react-aria-components";
import { Tick01Icon, MinusSignIcon } from "@your-job-search-genius/icons";
import "./Checkbox.css";

export interface CheckboxProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: ReactNode;
  /** Optional helper text rendered under the label and wired via `aria-describedby`. */
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Visually a dash instead of a check; still reports `checked` via `onChange` when toggled. */
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Checkbox — built on `react-aria-components`' `Checkbox` (behavior layer
 * per WCAG doc §6: indeterminate state, the visually-hidden-native-input
 * pattern, and hover/press/focus-visible state are error-prone to hand-roll
 * correctly). Props are normalized to plain booleans (`checked`/`disabled`)
 * to match the rest of this library's API instead of React Aria's own
 * `isSelected`/`isDisabled` naming, so components read consistently
 * regardless of which one happens to power them internally.
 *
 * (react-aria-components also now ships a `CheckboxField`/`CheckboxButton`
 * composition and marks this single-component `Checkbox` as deprecated in
 * its favor — kept here since it's still fully supported and its contract
 * is well-established; worth revisiting once the newer composition's docs
 * are reachable again from this environment.)
 */
export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox(
  { label, description, checked, defaultChecked, onChange, indeterminate = false, disabled, required, name, value, className, style },
  ref,
) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <AriaCheckbox
      ref={ref}
      isSelected={checked}
      defaultSelected={defaultChecked}
      onChange={onChange}
      isIndeterminate={indeterminate}
      isDisabled={disabled}
      isRequired={required}
      name={name}
      value={value}
      // Scoped explicitly when a description is present: AriaCheckbox wraps
      // everything in a native <label>, so without this the accessible name
      // would swallow the description text too (browsers concatenate all
      // text inside the wrapping <label>).
      aria-labelledby={description ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      className={className ? `wsu-Checkbox ${className}` : "wsu-Checkbox"}
      style={style}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <span className="wsu-Checkbox__box" aria-hidden="true">
            {isIndeterminate ? <MinusSignIcon size="0.75rem" /> : isSelected ? <Tick01Icon size="0.75rem" /> : null}
          </span>
          {description ? (
            <span className="wsu-Checkbox__content">
              <span id={labelId} className="wsu-Checkbox__label">
                {label}
              </span>
              <span id={descriptionId} className="wsu-Checkbox__description">
                {description}
              </span>
            </span>
          ) : (
            <span className="wsu-Checkbox__label">{label}</span>
          )}
        </>
      )}
    </AriaCheckbox>
  );
});

export interface CheckboxGroupProps {
  /** Visible, programmatically-associated group label (WCAG 3.3.2). */
  label: ReactNode;
  children: ReactNode;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  /** `vertical` (default, matches Figma) or `horizontal`. */
  orientation?: "vertical" | "horizontal";
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * CheckboxGroup — built on `react-aria-components`' `CheckboxGroup`, same
 * rationale as RadioGroup: group semantics (`group` role, one label
 * announced for the set) are easy to get subtly wrong by hand. Unlike
 * RadioGroup, options are independently focusable (no roving tabindex),
 * since more than one may be selected at once.
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  { label, children, value, defaultValue, onChange, disabled, required, orientation = "vertical", name, className, style },
  ref,
) {
  return (
    <AriaCheckboxGroup
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      isDisabled={disabled}
      isRequired={required}
      name={name}
      className={className ? `wsu-CheckboxGroup ${className}` : "wsu-CheckboxGroup"}
      style={style}
    >
      <Label className="wsu-CheckboxGroup__label">{label}</Label>
      <div className={`wsu-CheckboxGroup__options wsu-CheckboxGroup__options--${orientation}`}>{children}</div>
    </AriaCheckboxGroup>
  );
});
