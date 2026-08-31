import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import "./Textarea.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: string;
  helperText?: string;
  /** Presence puts the field in the error state — see Input's `errorMessage` doc for the same rationale (designed, not in Figma). */
  errorMessage?: string;
}

/**
 * Textarea — semantic `<textarea>` with the same label/helper/error wiring
 * as Input. Figma's "Rich Text" variant implies a WYSIWYG surface, which is
 * out of scope here (see docs/design-inventory.md §2.5) — this only ships
 * the plain multi-line field.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, helperText, errorMessage, required, disabled, id, className, style, rows = 4, ...rest },
  ref,
) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;
  const invalid = Boolean(errorMessage);

  const describedBy =
    [invalid ? errorId : null, helperText ? helperId : null, rest["aria-describedby"]].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className ? `wsu-Textarea ${className}` : "wsu-Textarea"} style={style}>
      <label className="wsu-Textarea__label" htmlFor={fieldId}>
        {label}
        {required ? (
          <span className="wsu-Textarea__required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        className="wsu-Textarea__control"
        disabled={disabled}
        required={required}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        data-invalid={invalid || undefined}
        {...rest}
      />
      {invalid ? (
        <p id={errorId} className="wsu-Textarea__message wsu-Textarea__message--error" role="alert">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="wsu-Textarea__message">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
