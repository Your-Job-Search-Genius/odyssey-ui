import { ColorSwatch as AriaColorSwatch } from "react-aria-components";
import type { Color } from "react-aria-components";
import "./ColorSwatch.css";

export interface ColorSwatchProps {
  /** The color to display. Pass a `Color` (via `parseColor`) or a color string. Inherited from a parent `ColorSwatchPickerItem` when omitted. */
  color?: string | Color;
  /** Overrides the auto-generated color description (e.g. "dark vibrant blue") announced to screen readers. */
  colorName?: string;
  /** Accessible label for additional context (e.g. "Background color"), announced alongside the color description. */
  "aria-label"?: string;
  /** Accessible label via reference to another element's id, as an alternative to `aria-label`. */
  "aria-labelledby"?: string;
  /** Set when an adjacent visible label already names the control this swatch decorates (e.g. inside `ColorPicker`'s trigger button). */
  "aria-hidden"?: boolean | "true" | "false";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ColorSwatch — built on `react-aria-components`' `ColorSwatch`: generating
 * a localized, human-readable color description ("dark vibrant blue") for
 * screen reader users isn't something to hand-roll (WCAG doc §6). Not in
 * the source Figma file (design-inventory.md §2.14) — radius/shadow tokens
 * reuse this system's existing scale. `color` is optional since a swatch
 * nested inside `ColorSwatchPickerItem` (see ColorSwatchPicker.tsx)
 * inherits its color from context instead. The checkerboard-behind-gradient
 * background (so alpha stays visible against any page background) is the
 * library's own recommended pattern, applied inline since the color isn't
 * known until render — matches the checkerboard already used by
 * `ColorSlider`'s track.
 */
export function ColorSwatch({ color, colorName, className, style, ...props }: ColorSwatchProps) {
  return (
    <AriaColorSwatch
      color={color}
      colorName={colorName}
      className={className ? `wsu-ColorSwatch ${className}` : "wsu-ColorSwatch"}
      style={({ color: renderColor }) => ({
        background: `linear-gradient(${renderColor}, ${renderColor}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px`,
        ...style,
      })}
      {...props}
    />
  );
}
