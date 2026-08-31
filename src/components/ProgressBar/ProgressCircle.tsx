import { forwardRef } from "react";
import { ProgressBar as AriaProgressBar } from "react-aria-components";
import type { ProgressBarProps as AriaProgressBarProps } from "react-aria-components";
import type { IconSizeToken } from "../../theme/iconSize";
import { iconSize } from "../../theme/iconSize";
import "./ProgressCircle.css";

export interface ProgressCircleProps extends Omit<AriaProgressBarProps, "children" | "className" | "style"> {
  size?: IconSizeToken | (string & {});
  className?: string;
  style?: React.CSSProperties;
}

const STROKE_WIDTH = 2.5;
const RADIUS = 16 - STROKE_WIDTH / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * ProgressCircle — a circular rendering of the same `react-aria-components`'
 * `ProgressBar` behavior layer used by `ProgressBar`, built as an SVG
 * `<circle>` per React Aria's own reference example rather than a new
 * primitive. Sized off this system's icon scale (`iconSize`) so it drops
 * into icon-shaped slots (buttons, inline status) the way `Spinner` does;
 * unlike `Spinner`, it can show a determinate value rather than only a
 * loading state.
 *
 * **Use when:** a circular/compact footprint is needed for the same
 * ongoing-task use case as `ProgressBar`. **Don't use when:** the task has
 * no knowable progress at all and the value is purely decorative — plain
 * `Spinner` is cheaper.
 */
export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(function ProgressCircle(
  { size = "md", className, style, ...props },
  ref,
) {
  const dimension = iconSize[size as IconSizeToken] ?? size;
  return (
    <AriaProgressBar
      ref={ref}
      {...props}
      className={className ? `wsu-ProgressCircle ${className}` : "wsu-ProgressCircle"}
      style={{ width: dimension, height: dimension, ...style }}
    >
      {({ percentage, isIndeterminate }) => (
        <svg viewBox="0 0 32 32" className="wsu-ProgressCircle__svg">
          <circle
            className="wsu-ProgressCircle__track"
            cx={16}
            cy={16}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <circle
            className="wsu-ProgressCircle__fill"
            cx={16}
            cy={16}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={
              isIndeterminate ? CIRCUMFERENCE * 0.75 : CIRCUMFERENCE * (1 - (percentage ?? 0) / 100)
            }
          />
        </svg>
      )}
    </AriaProgressBar>
  );
});
