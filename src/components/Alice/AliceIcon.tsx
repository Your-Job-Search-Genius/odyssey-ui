import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import "./AliceIcon.css";

export type AliceIconState = "idle" | "action" | "loading";

export interface AliceIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** `idle` and `action` are the sparkle marks; `loading` is the animated orb. Defaults to `idle`. */
  state?: AliceIconState;
  /** Any CSS length. Defaults to 18px, the size used throughout the Alice page. */
  size?: string;
  /**
   * Accessible name. Omit for a decorative mark (the default) — it's then
   * hidden from assistive tech. The `loading` state additionally carries
   * `role="status"` when labeled, so a screen reader announces it.
   */
  label?: string;
}

/**
 * Alice's assistant mark — Figma node 462:599 (`Alice Icon`), states
 * `Alice Idle` / `Alice Action` / `Loading`.
 *
 * The sparkle paths and the orb's gradient are hand-authored: the file
 * fills them with a paint style named "Alice" whose stops aren't exposed
 * as variables, and its vector assets sit on a host this environment's
 * egress policy blocks, so neither the exact path data nor the exact
 * gradient stops could be extracted. Geometry (18px box, 5.21% inset) and
 * the overall blue-to-violet ramp match the file; the curve details are an
 * approximation. See docs/design-inventory.md §2.15.
 */
export const AliceIcon = forwardRef<HTMLSpanElement, AliceIconProps>(function AliceIcon(
  { state = "idle", size = "1.125rem", label, className, style, ...rest },
  ref,
) {
  const a11y = label
    ? { role: state === "loading" ? "status" : "img", "aria-label": label }
    : { "aria-hidden": true };

  return (
    <span
      ref={ref}
      className={className ? `wsu-AliceIcon ${className}` : "wsu-AliceIcon"}
      data-state={state}
      style={{ width: size, height: size, ...style }}
      {...a11y}
      {...rest}
    >
      {state === "loading" ? (
        <span className="wsu-AliceIcon__orb" />
      ) : (
        <svg viewBox="0 0 18 18" fill="none" focusable="false" aria-hidden="true">
          <defs>
            <linearGradient id="wsu-alice-grad" x1="0" y1="18" x2="18" y2="0">
              <stop offset="0" stopColor="var(--wsu-alice-mark-from)" />
              <stop offset="1" stopColor="var(--wsu-alice-mark-to)" />
            </linearGradient>
          </defs>
          {/* Primary four-point sparkle, inset 5.21% like the file. */}
          <path
            d="M9 0.94c.42 3.2 1.03 5.05 2.13 6.06 1.1 1 3.09 1.57 5.93 2-2.84.43-4.83 1-5.93 2-1.1 1.01-1.71 2.86-2.13 6.06-.42-3.2-1.03-5.05-2.13-6.06-1.1-1-3.09-1.57-5.93-2 2.84-.43 4.83-1 5.93-2C7.97 5.99 8.58 4.14 9 .94Z"
            fill="url(#wsu-alice-grad)"
          />
          {state === "action" ? (
            /* The Action state adds the small secondary sparkle. */
            <path
              d="M15.05 0c.19 1.44.46 2.27.96 2.72.5.46 1.39.71 2.67.9-1.28.2-2.17.45-2.67.9-.5.46-.77 1.29-.96 2.73-.19-1.44-.46-2.27-.96-2.72-.5-.46-1.39-.71-2.67-.9 1.28-.2 2.17-.45 2.67-.9.5-.46.77-1.29.96-2.73Z"
              fill="url(#wsu-alice-grad)"
              transform="translate(-1.2 0.4) scale(0.82)"
            />
          ) : null}
        </svg>
      )}
    </span>
  );
});
