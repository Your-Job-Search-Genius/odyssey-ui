import { ColorSlider as AriaColorSlider, Label, SliderOutput, SliderTrack } from "react-aria-components";
import type { Color, ColorChannel, ColorSpace } from "react-aria-components";
import { ColorThumb } from "../ColorArea/ColorThumb";
import "./ColorSlider.css";

export interface ColorSliderProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required). */
  label: string;
  /** The current color (controlled). Pass a `Color` (via `parseColor`) or a color string. */
  value?: string | Color;
  /** The initial color (uncontrolled). */
  defaultValue?: string | Color;
  /** The single channel this slider adjusts, e.g. `'hue'`, `'saturation'`, `'alpha'`. */
  channel: ColorChannel;
  /** The color space `channel` is interpreted in, when the channel name alone is ambiguous (e.g. `'saturation'` exists in both `hsl` and `hsb`). */
  colorSpace?: ColorSpace;
  /** Called on every change as the thumb is dragged or moved by keyboard. */
  onChange?: (value: Color) => void;
  /** Called once dragging/keyboard interaction ends. */
  onChangeEnd?: (value: Color) => void;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ColorSlider — built on `react-aria-components`' `ColorSlider`/`SliderTrack`:
 * shares its `ColorThumb` visual with `ColorArea` (docs/design-inventory.md
 * §2.14), keyboard-operable single-channel adjustment via one `slider`-role
 * input. Unlike `ColorArea`, a single channel leaves room for a visible
 * label and live value readout, so `label` is required and rendered (not
 * just `aria-label`) per this library's convention (see `Checkbox.tsx`,
 * `Select.tsx`). The track's `background` is computed by the library from
 * the live color; a checkerboard layer is composited behind it so the
 * `alpha` channel's transparency stays visible against any page background,
 * and is harmless — fully opaque — for every other channel.
 */
export function ColorSlider({
  label,
  value,
  defaultValue,
  channel,
  colorSpace,
  onChange,
  onChangeEnd,
  orientation,
  disabled,
  className,
  style,
}: ColorSliderProps) {
  return (
    <AriaColorSlider
      value={value}
      defaultValue={defaultValue}
      channel={channel}
      colorSpace={colorSpace}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
      orientation={orientation}
      isDisabled={disabled}
      className={className ? `wsu-ColorSlider ${className}` : "wsu-ColorSlider"}
      style={style}
    >
      <div className="wsu-ColorSlider__header">
        <Label className="wsu-ColorSlider__label">{label}</Label>
        <SliderOutput className="wsu-ColorSlider__output" />
      </div>
      <SliderTrack
        className="wsu-ColorSlider__track"
        style={({ defaultStyle }) => ({
          background: `${defaultStyle.background}, repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px`,
        })}
      >
        <ColorThumb />
      </SliderTrack>
    </AriaColorSlider>
  );
}
