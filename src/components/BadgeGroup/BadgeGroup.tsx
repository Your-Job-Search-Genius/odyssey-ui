import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import "./BadgeGroup.css";

export type BadgeGroupLayout = "inline" | "stacked";
export type BadgeGroupBadgePosition = "leading" | "trailing";

export interface BadgeGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The neutral half — the quoted input, rating or heading the badge annotates. */
  children: ReactNode;
  /** The badge half's text. */
  label: ReactNode;
  /** Optional 18px glyph before the badge label. */
  icon?: ReactNode;
  /** Which side the badge sits on. Figma calls this Title Position. Defaults to `trailing`. */
  badgePosition?: BadgeGroupBadgePosition;
  /** `inline` joins the two halves into one pill; `stacked` puts the badge under the content. */
  layout?: BadgeGroupLayout;
}

/**
 * BadgeGroup — Figma node 433:5019. A two-part chip: a neutral half
 * carrying content and a coloured half carrying a label, joined into a
 * single rounded shape.
 *
 * The two halves meet flush, so only the outer corners are rounded;
 * logical properties keep that correct when the badge moves to the leading
 * side or under RTL.
 *
 * AA FIX: the file fills the badge with `#3488ff` (blue/500) and sets
 * white 14px text on it, which is 3.44:1 — under the 4.5:1 floor. Uses
 * blue/600 (#0668F4, 4.89:1), the nearest passing shade of the same hue,
 * so the design's colour reads the same.
 */
export const BadgeGroup = forwardRef<HTMLDivElement, BadgeGroupProps>(function BadgeGroup(
  { children, label, icon, badgePosition = "trailing", layout = "inline", className, ...rest },
  ref,
) {
  const classes = [
    "wsu-BadgeGroup",
    `wsu-BadgeGroup--${layout}`,
    `wsu-BadgeGroup--badge-${badgePosition}`,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = <div className="wsu-BadgeGroup__content">{children}</div>;
  const badge = (
    <div className="wsu-BadgeGroup__badge">
      {icon ? (
        <span className="wsu-BadgeGroup__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="wsu-BadgeGroup__label">{label}</span>
    </div>
  );

  return (
    <div ref={ref} className={classes} {...rest}>
      {badgePosition === "leading" ? (
        <>
          {badge}
          {content}
        </>
      ) : (
        <>
          {content}
          {badge}
        </>
      )}
    </div>
  );
});
