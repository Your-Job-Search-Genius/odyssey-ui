import { ColorArea as AriaColorArea } from "react-aria-components";
import type { Color, ColorChannel, ColorSpace } from "react-aria-components";
import { ColorThumb } from "./ColorThumb";
import "./ColorArea.css";

export interface ColorAreaProps {
  /** The current color (controlled). Pass a `Color` (via `parseColor`) or a color string. */
  value?: string | Color;
  /** The initial color (uncontrolled). Defaults to white if neither `value` nor `defaultValue` is given. */
  defaultValue?: string | Color;
  /** Called on every change as the thumb is dragged or moved by keyboard. */
  onChange?: (value: Color) => void;
  /** Called once dragging/keyboard interaction ends. */
  onChangeEnd?: (value: Color) => void;
  /** The channel driving horizontal thumb movement. Defaults per `colorSpace` if omitted. */
  xChannel?: ColorChannel;
  /** The channel driving vertical thumb movement. Defaults per `colorSpace` if omitted. */
  yChannel?: ColorChannel;
  /** The color space (`'rgb' | 'hsl' | 'hsb'`) `xChannel`/`yChannel` are interpreted in. */
  colorSpace?: ColorSpace;
  disabled?: boolean;
  /** Accessible name (WCAG 4.1.2) — required since ColorArea has no visible label of its own. */
  "aria-label"?: string;
  /** Accessible name via reference to another element's id, as an alternative to `aria-label`. */
  "aria-labelledby"?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ColorArea — built on `react-aria-components`' `ColorArea`/`ColorThumb`:
 * dragging a 2D thumb across a channel gradient while staying fully
 * keyboard-operable (arrow keys adjust both channels via two synchronized
 * `slider`-role inputs under the hood — this renders **two** `role="slider"`
 * elements, not one) is exactly the kind of interaction WCAG doc §6 flags
 * as unsafe to hand-roll. Not present in the source Figma file
 * (design-inventory.md §2.14) — radius/shadow/focus-ring/motion tokens
 * reuse this system's existing scale. `disabled` is normalized to a plain
 * boolean per this library's convention (see `Checkbox.tsx`); `xChannel`/
 * `yChannel`/`colorSpace` pass straight through under React Aria's own
 * names since this system has no other vocabulary for color channels.
 */
export function ColorArea({
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  xChannel,
  yChannel,
  colorSpace,
  disabled,
  className,
  style,
  ...props
}: ColorAreaProps) {
  return (
    <AriaColorArea
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
      xChannel={xChannel}
      yChannel={yChannel}
      colorSpace={colorSpace}
      isDisabled={disabled}
      className={className ? `wsu-ColorArea ${className}` : "wsu-ColorArea"}
      style={style}
      {...props}
    >
      <ColorThumb />
    </AriaColorArea>
  );
}
