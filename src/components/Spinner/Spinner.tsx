import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import type { IconSizeToken } from "../../theme/iconSize";
import "./Spinner.css";

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: IconSizeToken | (string & {});
  /** Accessible label for the loading state. Defaults to "Loading". */
  label?: string;
}

const SIZE_VAR: Record<string, string> = {
  xs: "var(--wsu-icon-size-xs)",
  sm: "var(--wsu-icon-size-sm)",
  md: "var(--wsu-icon-size-md)",
  lg: "var(--wsu-icon-size-lg)",
  xl: "var(--wsu-icon-size-xl)",
};

/**
 * Spinner — not present anywhere in the source Figma file (on the user's
 * "missing components" list); designed from WAI-ARIA APG's status-message
 * pattern. `role="status"` + visually-hidden text means assistive tech
 * announces the loading state without moving focus (WCAG 4.1.3). Respects
 * `prefers-reduced-motion` by slowing rather than freezing the animation —
 * a fully static spinner reads as "stuck," which is worse than a slower
 * one, so this follows the same reduced-motion pattern as Button's own
 * loading spinner rather than disabling motion entirely.
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
  { size = "md", label = "Loading", className, style, ...rest },
  ref,
) {
  const dimension = SIZE_VAR[size] ?? size;
  return (
    // `role="status"` computes its accessible name only from an explicit
    // aria-label/aria-labelledby, never "from content" the way e.g. a
    // button does (verified: a visually-hidden child span here rendered
    // with an empty accessible name in RTL's role query) — so the label
    // has to be aria-label, not hidden text content.
    <div
      ref={ref}
      role="status"
      aria-label={label}
      className={className ? `wsu-Spinner ${className}` : "wsu-Spinner"}
      style={{ width: dimension, height: dimension, ...style }}
      {...rest}
    />
  );
});
