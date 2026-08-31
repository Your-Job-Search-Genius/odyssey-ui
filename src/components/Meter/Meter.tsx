import { forwardRef } from "react";
import type { ReactNode } from "react";
import { Meter as AriaMeter, Label } from "react-aria-components";
import type { MeterProps as AriaMeterProps } from "react-aria-components";
import "./Meter.css";

export type MeterSeverity = "excellent" | "fair" | "fail";

export interface MeterProps extends Omit<AriaMeterProps, "children" | "className" | "style"> {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function severityFor(percentage: number): MeterSeverity {
  if (percentage < 70) return "excellent";
  if (percentage < 90) return "fair";
  return "fail";
}

/**
 * Meter — built on `react-aria-components`' `Meter` (behavior layer: the
 * `meter`/`progressbar` role fallback, and `aria-valuenow`/`-min`/`-max`/
 * `-text` wiring, are easy to get subtly wrong by hand).
 *
 * No Figma source exists for this component (not in docs/design-inventory.md
 * — added ahead of a spec). Colour thresholds below 70/90% reuse this
 * library's severity grading vocabulary (see Badge/Badge.css) instead of
 * inventing a new palette, since a meter's colour typically signals how
 * "good" or "bad" the current value is.
 *
 * **Use when:** displaying a static quantity within a known range (disk
 * usage, a quota, a resume score). **Don't use when:** the value represents
 * an ongoing task's progress — use a `ProgressBar`/`Spinner` instead, since
 * assistive tech announces the two roles differently.
 */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { label, className, style, ...props },
  ref,
) {
  return (
    <AriaMeter
      ref={ref}
      {...props}
      className={className ? `wsu-Meter ${className}` : "wsu-Meter"}
      style={style}
    >
      {({ percentage, valueText }) => (
        <>
          <Label className="wsu-Meter__label">{label}</Label>
          <span className="wsu-Meter__value">{valueText}</span>
          <div className="wsu-Meter__track">
            <div
              className={`wsu-Meter__fill wsu-Meter__fill--${severityFor(percentage)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaMeter>
  );
});
