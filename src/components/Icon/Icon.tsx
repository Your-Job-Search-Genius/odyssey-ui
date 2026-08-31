import { forwardRef } from "react";
import type { SVGProps } from "react";
import type { IconSizeToken } from "../../theme/iconSize";
import "./Icon.css";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children" | "width" | "height"> {
  /** Icon size token. Defaults to `md` (20px). Accepts a raw CSS length for one-off cases. */
  size?: IconSizeToken | (string & {});
  /**
   * Accessible name. Omit for a purely decorative icon (the default) — it's
   * then hidden from assistive tech via `aria-hidden`. Provide a label when
   * the icon is the *only* content conveying meaning (e.g. an icon-only
   * button's icon should still get its label from the button itself, not
   * here — reserve this for a standalone/informational icon).
   */
  label?: string;
  /** Icon glyph content — `<path>`/`<circle>`/etc, or another icon's inner markup. */
  children: React.ReactNode;
}

const SIZE_VAR: Record<string, string> = {
  xs: "var(--wsu-icon-size-xs)",
  sm: "var(--wsu-icon-size-sm)",
  md: "var(--wsu-icon-size-md)",
  lg: "var(--wsu-icon-size-lg)",
  xl: "var(--wsu-icon-size-xl)",
};

/**
 * Base wrapper every icon glyph renders through. Inherits `currentColor`,
 * sizes from the icon-size token scale, and is hidden from screen readers
 * unless given a `label`. The Writesea Odyssey glyph set itself hasn't been
 * extracted yet (deferred per project scope) — this contract is what every
 * future generated icon component (`<CancelIcon />`, `<ArrowRightIcon />`,
 * ...) and every consumer-supplied custom SVG will render through.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { size = "md", label, className, style, children, ...rest },
  ref,
) {
  const dimension = SIZE_VAR[size] ?? size;
  const a11yProps = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg
      ref={ref}
      className={className ? `wsu-Icon ${className}` : "wsu-Icon"}
      style={{ width: dimension, height: dimension, ...style }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      focusable="false"
      {...a11yProps}
      {...rest}
    >
      {children}
    </svg>
  );
});
