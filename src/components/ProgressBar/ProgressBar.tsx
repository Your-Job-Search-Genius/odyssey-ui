import { forwardRef } from "react";
import type { ReactNode } from "react";
import { ProgressBar as AriaProgressBar, Label } from "react-aria-components";
import type { ProgressBarProps as AriaProgressBarProps } from "react-aria-components";
import "./ProgressBar.css";

export interface ProgressBarProps extends Omit<AriaProgressBarProps, "children" | "className" | "style"> {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ProgressBar — not present anywhere in the source Figma file (on the
 * user's "missing components" list); built on `react-aria-components`'
 * `ProgressBar`, whose behavior layer supplies the `progressbar` role and
 * `aria-valuenow`/`-min`/`-max`/`-text` wiring, including omitting
 * `aria-valuenow` entirely for the indeterminate case — easy to get subtly
 * wrong by hand.
 *
 * **Use when:** tracking an ongoing task (upload, multi-step wizard,
 * long-running job). **Don't use when:** displaying a static quantity
 * within a known range — use `Meter` instead, since assistive tech
 * announces the two roles differently.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { label, className, style, ...props },
  ref,
) {
  return (
    <AriaProgressBar
      ref={ref}
      {...props}
      className={className ? `wsu-ProgressBar ${className}` : "wsu-ProgressBar"}
      style={style}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <Label className="wsu-ProgressBar__label">{label}</Label>
          <span className="wsu-ProgressBar__value">{valueText}</span>
          <div className="wsu-ProgressBar__track">
            <div
              className="wsu-ProgressBar__fill"
              style={{ width: `${isIndeterminate ? 40 : (percentage ?? 0)}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
});
