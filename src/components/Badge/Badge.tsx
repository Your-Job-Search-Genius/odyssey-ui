import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { useDesignMode } from "../../theme/DesignModeContext";
import type { DesignMode } from "../../theme/types";
import "./Badge.css";

export type BadgeSeverity = "excellent" | "good" | "fair" | "poor" | "bad" | "fail";
export type BadgeType = "solid" | "soft" | "filled" | "border" | "tabs";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Grading colour. Drives the fill on `solid`/`soft`; on `filled`,
   * `border` and `tabs` the chrome is neutral and this only tints the
   * `count` bubble, matching the file.
   */
  severity?: BadgeSeverity;
  type?: BadgeType;
  /**
   * Force a specific team's design for this instance, overriding the
   * ambient `ThemeProvider` `mode`. Defaults to "generic" — today's
   * default look, identical to "client" until a distinct design is
   * introduced for one of them. See `docs/design-mode.md`.
   */
  designMode?: DesignMode;
  /** Leading glyph, rendered at 16px. */
  icon?: ReactNode;
  /** Trailing glyph, rendered at 16px. Ignored when `count` is set. */
  trailingIcon?: ReactNode;
  /** Trailing count bubble — the 18px tinted circle the file puts on `tabs`/`filled`/`border`. */
  count?: number;
  /** Accessible name for `count`, e.g. "6 unread". Without it the number is read bare. */
  countLabel?: string;
  children: ReactNode;
}

/**
 * Badge — semantic `<span>`, non-interactive, so no behavior library is
 * needed. Sourced from Figma node 433:4936.
 *
 * **Use when:** labeling a status or grade at a glance (e.g. a resume-score
 * severity), or a count on a tab. **Don't use when:** the chip is itself
 * clickable/removable — that's a distinct interactive "Chip" pattern.
 *
 * Two shapes exist in the file: `solid`/`soft` are 28px grading pills whose
 * colour carries the meaning, and `filled`/`border`/`tabs` are 32px neutral
 * chips where the colour only tints an optional count. Severity is never
 * the sole cue — the label always says what it means (WCAG 1.4.1).
 *
 * Also renders a `wsu-Badge--{generic|client|admin}` modifier driven by
 * `designMode` (or the ambient `ThemeProvider` `mode`) — see
 * `docs/design-mode.md`. "generic" and "client" currently share one look;
 * this is the hook a future admin-specific redesign would target.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { severity = "good", type = "soft", designMode, icon, trailingIcon, count, countLabel, children, className, ...rest },
  ref,
) {
  const resolvedMode = useDesignMode(designMode);
  const classes = [
    "wsu-Badge",
    `wsu-Badge--${type}`,
    `wsu-Badge--${severity}`,
    `wsu-Badge--${resolvedMode}`,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span ref={ref} className={classes} {...rest}>
      {icon ? (
        <span className="wsu-Badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="wsu-Badge__label">{children}</span>
      {count !== undefined ? (
        <span className="wsu-Badge__count" aria-label={countLabel}>
          {count}
        </span>
      ) : trailingIcon ? (
        <span className="wsu-Badge__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </span>
  );
});
