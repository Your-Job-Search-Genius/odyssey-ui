import type { ReactNode } from "react";
import { ColorPicker as AriaColorPicker, Button as AriaButton, DialogTrigger, Popover } from "react-aria-components";
import type { Color } from "react-aria-components";
import { ColorSwatch } from "../ColorSwatch";
import { ColorArea } from "../ColorArea";
import { ColorField } from "../ColorField";
import "../Select/popover-menu.css";
import "./ColorPicker.css";

export interface ColorPickerProps {
  /** Visible trigger label (WCAG 3.3.2/4.1.2 — the swatch preview alone isn't a reliable accessible name). */
  label: string;
  /** The current color (controlled). Pass a `Color` (via `parseColor`) or a color string. */
  value?: string | Color;
  /** The initial color (uncontrolled). Defaults to white if neither `value` nor `defaultValue` is given. */
  defaultValue?: string | Color;
  /** Called on every change from any nested color component (area, field, swatch picker, ...). */
  onChange?: (value: Color) => void;
  /** Popover content. Defaults to a `ColorArea` (saturation/brightness) + `ColorField` (hex) pair. */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ColorPicker — built on `react-aria-components`' `ColorPicker`: a context
 * provider that synchronizes one color `value` across any number of nested
 * color components (`ColorArea`, `ColorField`, `ColorSwatch`, ...) without
 * each of them needing `value`/`onChange` wired by hand — not present in the
 * source Figma file (design-inventory.md §2.14), same rationale as
 * `ColorArea`/`ColorField`. The trigger opens a `Popover` through
 * `DialogTrigger` (no separate `Dialog` needed — `Popover` supplies dialog
 * semantics itself when it's `DialogTrigger`'s only overlay child, per
 * react-aria-components' own vanilla-starter recipe), sharing this
 * library's popover chrome (`Select/popover-menu.css`'s `.wsu-Popover`).
 * The trigger's `ColorSwatch` preview is wrapped in a plain `aria-hidden`
 * `<span>` so `label` alone names the button (WCAG 4.1.2) — passing
 * `aria-hidden` to `ColorSwatch` itself doesn't work, since
 * `react-aria-components`' `ColorSwatch` only forwards a fixed allowlist of
 * DOM props (verified: no `aria-*` attribute is in it) and always renders
 * its own auto-generated color description as `aria-label` regardless, so
 * without this wrapper the swatch's color name (e.g. "vibrant red") would
 * silently prefix the button's accessible name. **Use when:** composing a
 * full picker from `ColorArea`/`ColorField`/etc. behind a swatch trigger.
 * **Don't use when:** a single standalone color component is enough on its
 * own (use it directly instead).
 */
export function ColorPicker({ label, value, defaultValue, onChange, children, className, style }: ColorPickerProps) {
  return (
    <AriaColorPicker value={value} defaultValue={defaultValue} onChange={onChange}>
      <DialogTrigger>
        <AriaButton className={className ? `wsu-ColorPicker ${className}` : "wsu-ColorPicker"} style={style}>
          <span aria-hidden="true">
            <ColorSwatch className="wsu-ColorPicker__swatch" />
          </span>
          <span>{label}</span>
        </AriaButton>
        <Popover placement="bottom start" className="wsu-Popover wsu-ColorPicker__dialog">
          {children ?? (
            <>
              <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" aria-label={label} />
              <ColorField label="Hex" />
            </>
          )}
        </Popover>
      </DialogTrigger>
    </AriaColorPicker>
  );
}
