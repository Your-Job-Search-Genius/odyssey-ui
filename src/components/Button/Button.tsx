import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "accent" | "text";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonCommonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Visual style. Figma calls these Primary/Secondary/Accent/Text. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Defaults to `lg` (Figma's "Default" size). */
  size?: ButtonSize;
  /** Icon rendered before the label (or alone, for an icon-only button). */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. Ignored on an icon-only button. */
  trailingIcon?: ReactNode;
  /** Replaces the label with a spinner and sets `aria-busy`; the button stays disabled while true. */
  loading?: boolean;
  /** Stretch to the width of its container. */
  fullWidth?: boolean;
}

export type ButtonProps =
  | (ButtonCommonProps & { children: ReactNode; "aria-label"?: string })
  | (ButtonCommonProps & { children?: undefined; "aria-label": string });

/**
 * Button — semantic `<button>`, no React Aria needed: native keyboard/focus/
 * activation semantics are already correct (WCAG 2.1.1, 2.5.2, 4.1.2).
 *
 * Icon-only usage (`leadingIcon` with no `children`) requires `aria-label`
 * — TypeScript enforces it (WCAG 2.5.3 Label in Name, 4.1.2).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "lg",
    leadingIcon,
    trailingIcon,
    loading = false,
    fullWidth = false,
    disabled,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  const isIconOnly = children === undefined;
  const classes = [
    "wsu-Button",
    `wsu-Button--${variant}`,
    `wsu-Button--${size}`,
    fullWidth ? "wsu-Button--full-width" : "",
    isIconOnly ? "wsu-Button--icon-only" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="wsu-Button__spinner" aria-hidden="true" />
      ) : leadingIcon ? (
        <span className="wsu-Button__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      {/* Label stays in the DOM while loading — for a labeled button it's the accessible
          name (WCAG 4.1.2); for an icon-only button the name instead comes from the
          required aria-label, which is unaffected by what's rendered here. */}
      {children !== undefined ? <span className="wsu-Button__label">{children}</span> : null}
      {!loading && trailingIcon && !isIconOnly ? (
        <span className="wsu-Button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});
