import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
} from "react-aria-components";
import type { Color } from "react-aria-components";
import type { ReactNode } from "react";
import { ColorSwatch } from "../ColorSwatch";
import "./ColorSwatchPicker.css";

export interface ColorSwatchPickerProps {
  children: ReactNode;
  /** The current value (controlled). Pass a `Color` (via `parseColor`) or a color string. */
  value?: string | Color;
  /** The initial value (uncontrolled). */
  defaultValue?: string | Color;
  /** Called when the selected swatch changes. */
  onChange?: (value: Color) => void;
  /** `grid` (default, wraps) or `stack` (vertical). */
  layout?: "grid" | "stack";
  /** Accessible label (WCAG 4.1.2) — required since ColorSwatchPicker has no visible label of its own. */
  "aria-label"?: string;
  /** Accessible label via reference to another element's id, as an alternative to `aria-label`. */
  "aria-labelledby"?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ColorSwatchPicker — built on `react-aria-components`' `ColorSwatchPicker`/
 * `ColorSwatchPickerItem`: single-selection roving-tabindex keyboard
 * navigation across a list of swatches (WAI-ARIA APG listbox pattern) is
 * the same category of interaction Checkbox/RadioGroup cite as unsafe to
 * hand-roll. Not in the source Figma file (design-inventory.md §2.14) —
 * radius/focus-ring tokens reuse this system's existing scale, and the
 * selected-swatch ring matches the double-ring shown in react-aria-components'
 * own docs (an outer ring alone can't stay visible against every swatch
 * color, so it's always two tones). `layout` passes straight through under
 * React Aria's own name; equivalent colors in different color spaces (e.g.
 * `#f00` and `hsl(0, 100%, 50%)`) are treated as duplicates by the library,
 * so `ColorSwatchPickerItem` colors must be unique for predictable
 * selection.
 */
export function ColorSwatchPicker({ children, className, style, ...props }: ColorSwatchPickerProps) {
  return (
    <AriaColorSwatchPicker
      className={className ? `wsu-ColorSwatchPicker ${className}` : "wsu-ColorSwatchPicker"}
      style={style}
      {...props}
    >
      {children}
    </AriaColorSwatchPicker>
  );
}

export interface ColorSwatchPickerItemProps {
  /** The color this item represents. */
  color: string | Color;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ColorSwatchPickerItem({ color, disabled, className, style }: ColorSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem
      color={color}
      isDisabled={disabled}
      className={className ? `wsu-ColorSwatchPickerItem ${className}` : "wsu-ColorSwatchPickerItem"}
      style={style}
    >
      <ColorSwatch />
    </AriaColorSwatchPickerItem>
  );
}
