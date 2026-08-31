import {
  Slider as AriaSlider,
  Label,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import type { SliderProps as AriaSliderProps } from "react-aria-components";
import "./Slider.css";

export interface SliderProps<T extends number | number[]>
  extends Omit<AriaSliderProps<T>, "children" | "className" | "style" | "isDisabled"> {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: string;
  /** Accessible name for each thumb. Required for a multi-thumb (`value`/`defaultValue` as an array) slider, since each thumb then needs its own name. */
  thumbLabels?: string[];
  /**
   * The value the fill is drawn from, instead of the track's minimum —
   * e.g. `50` centers a single-thumb fill around the track's midpoint.
   */
  fillOffset?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Slider — built on `react-aria-components`' `Slider`/`SliderTrack`, whose
 * WAI-ARIA APG slider keyboard model (arrow keys, Page Up/Down, Home/End,
 * and — for a multi-thumb range — clamping one thumb against the other) is
 * handled entirely by the behavior layer. Not in the source Figma file (see
 * docs/design-inventory.md §2.14) — chrome and thumb visual reuse
 * `ColorSlider`'s (fully-rounded pill track, white-ringed circular thumb
 * that grows on keyboard focus) rather than a new visual language, minus
 * the live-color background since a plain `Slider` has no color to paint.
 * Generic over `number` (single thumb) or `number[]` (multiple thumbs,
 * e.g. a range) — pass `thumbLabels` to name each thumb when using the
 * latter. **Use when:** picking one or more numeric values within a known
 * range (quantity, percentage, a min/max range). **Don't use when:** the
 * value is a color channel — use `ColorSlider` instead, which paints the
 * track with the live color and needs no separate value readout styling.
 */
export function Slider<T extends number | number[]>({
  label,
  thumbLabels,
  fillOffset,
  disabled,
  className,
  style,
  ...props
}: SliderProps<T>) {
  return (
    <AriaSlider
      {...props}
      isDisabled={disabled}
      className={className ? `wsu-Slider ${className}` : "wsu-Slider"}
      style={style}
    >
      <div className="wsu-Slider__header">
        <Label className="wsu-Slider__label">{label}</Label>
        <SliderOutput className="wsu-Slider__output" />
      </div>
      <SliderTrack className="wsu-Slider__track">
        {({ state }) => (
          <>
            <div className="wsu-Slider__rail">
              <SliderFill offset={fillOffset} className="wsu-Slider__fill" />
            </div>
            {state.values.map((_, i) => (
              <SliderThumb
                key={i}
                index={i}
                aria-label={thumbLabels?.[i]}
                className="wsu-Slider__thumb"
              />
            ))}
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}
