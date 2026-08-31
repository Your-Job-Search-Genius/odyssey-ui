import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { EyeGlyph } from "../Icon/glyphs";
import "./Input.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required, no `aria-label` escape hatch). */
  label: string;
  /** Shown below the field when there's no error. Linked via `aria-describedby`. */
  helperText?: string;
  /**
   * Presence puts the field in the error state: red border, error icon,
   * and this text rendered with `role="alert"` (WCAG 3.3.1 — errors are
   * identified in text, not color alone; WCAG 4.1.3 — announced via a live
   * region). This state doesn't exist in the source Figma file at all; see
   * docs/design-inventory.md §2.4.
   */
  errorMessage?: string;
  leadingIcon?: ReactNode;
  /** Ignored for `type="password"`, which always renders the built-in show/hide toggle instead. */
  trailingIcon?: ReactNode;
  /**
   * A leading element divided from the field by a rule — the file's
   * "Leading Dropdown" (a country select) and "Web" (an `https://` prefix)
   * types. Pass a real control for the dropdown case so it stays operable;
   * this slot only supplies the divider and spacing.
   */
  prefix?: ReactNode;
  /**
   * A trailing control inside the field — the file's "Web" type puts a
   * Paste button here. The field tightens its right padding to 5px when
   * this is present, as the file does.
   */
  action?: ReactNode;
}

/**
 * Input — semantic `<input>` with our own label/helper/error wiring; native
 * semantics are already correct, so no behavior library is needed (WCAG
 * doc §6). Works both controlled (`value`+`onChange`) and uncontrolled
 * (`defaultValue`), exactly like a native input, since we never intercept
 * the value ourselves.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, errorMessage, leadingIcon, trailingIcon, prefix, action, required, disabled, id, className, style, type = "text", ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const [revealPassword, setRevealPassword] = useState(false);
  const isPassword = type === "password";
  const invalid = Boolean(errorMessage);

  const describedBy =
    [invalid ? errorId : null, helperText ? helperId : null, rest["aria-describedby"]].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className ? `wsu-Input ${className}` : "wsu-Input"} style={style}>
      <label className="wsu-Input__label" htmlFor={inputId}>
        {label}
        {required ? (
          <span className="wsu-Input__required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div
        className="wsu-Input__field"
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        data-has-action={action ? "" : undefined}
      >
        {prefix ? <span className="wsu-Input__prefix">{prefix}</span> : null}
        {leadingIcon ? (
          <span className="wsu-Input__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && revealPassword ? "text" : type}
          className="wsu-Input__control"
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            className="wsu-Input__toggle"
            onClick={() => setRevealPassword((v) => !v)}
            disabled={disabled}
            aria-pressed={revealPassword}
            aria-label={revealPassword ? "Hide password" : "Show password"}
          >
            <EyeGlyph size="sm" />
          </button>
        ) : trailingIcon ? (
          <span className="wsu-Input__icon" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
        {action ? <span className="wsu-Input__action">{action}</span> : null}
      </div>
      {invalid ? (
        <p id={errorId} className="wsu-Input__message wsu-Input__message--error" role="alert">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="wsu-Input__message">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
