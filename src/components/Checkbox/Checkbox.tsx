import { forwardRef } from "react";
import type { ReactNode } from "react";
import { Checkbox as AriaCheckbox } from "react-aria-components";
import { CheckGlyph, MinusGlyph } from "../Icon/glyphs";
import "./Checkbox.css";

export interface CheckboxProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: ReactNode;
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
  { label, checked, defaultChecked, onChange, indeterminate = false, disabled, required, name, value, className, style },
  ref,
) {
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
      className={className ? `wsu-Checkbox ${className}` : "wsu-Checkbox"}
      style={style}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <span className="wsu-Checkbox__box" aria-hidden="true">
            {isIndeterminate ? <MinusGlyph size="xs" /> : isSelected ? <CheckGlyph size="xs" /> : null}
          </span>
          <span className="wsu-Checkbox__label">{label}</span>
        </>
      )}
    </AriaCheckbox>
  );
});
