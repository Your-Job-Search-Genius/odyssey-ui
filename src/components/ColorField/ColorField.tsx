import { forwardRef } from "react";
import { ColorField as AriaColorField, Input as AriaInput, Label, Text } from "react-aria-components";
import type { Color, ColorChannel, ColorSpace } from "react-aria-components";
import "./ColorField.css";

export interface ColorFieldProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required, no `aria-label` escape hatch). */
  label: string;
  placeholder?: string;
  /** The current value (controlled). Pass a `Color` (via `parseColor`) or a color string. */
  value?: string | Color | null;
  /** The initial value (uncontrolled). */
  defaultValue?: string | Color | null;
  /** Always called with a `Color`, regardless of whether `value`/`defaultValue` was given as a string. */
  onChange?: (value: Color | null) => void;
  /** The channel this field edits. Omitted edits the color as a hex value. */
  channel?: ColorChannel;
  /** The color space `channel` is interpreted in. Ignored unless `channel` is set. */
  colorSpace?: ColorSpace;
  disabled?: boolean;
  required?: boolean;
  /** Submits the value under this name when placed in an HTML `<form>`. */
  name?: string;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ColorField — built on `react-aria-components`' `ColorField`: parsing and
 * validating a typed hex value or a single color channel as the user types,
 * clamping to the channel's range on blur, isn't safe to hand-roll (WCAG
 * doc §6). Not in the source Figma file at all (see
 * docs/design-inventory.md §2.14) — chrome matches `Input`/`SearchField`'s
 * field box exactly (10px radius, inset stroke, focus ring) so it drops
 * into the same forms without looking like a foreign control. `channel`/
 * `colorSpace` pass straight through under React Aria's own names since
 * this system has no other vocabulary for color channels (see
 * `ColorArea.tsx`). **Use when:** typing an exact hex value or a single
 * channel (e.g. as part of a larger color picker alongside `ColorArea`).
 * **Don't use when:** the value isn't a color, or a full 2D channel pair
 * needs adjusting (use `ColorArea`).
 */
export const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(function ColorField(
  {
    label,
    placeholder,
    value,
    defaultValue,
    onChange,
    channel,
    colorSpace,
    disabled,
    required,
    name,
    helperText,
    errorMessage,
    className,
    style,
  },
  ref,
) {
  const invalid = Boolean(errorMessage);

  return (
    <AriaColorField
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      channel={channel}
      colorSpace={colorSpace}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      name={name}
      className={className ? `wsu-ColorField ${className}` : "wsu-ColorField"}
      style={style}
    >
      <Label className="wsu-ColorField__label">
        {label}
        {required ? (
          <span className="wsu-ColorField__required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <div className="wsu-ColorField__field">
        <AriaInput ref={ref} placeholder={placeholder} className="wsu-ColorField__input" />
      </div>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-ColorField__message wsu-ColorField__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-ColorField__message">
          {helperText}
        </Text>
      ) : null}
    </AriaColorField>
  );
});
