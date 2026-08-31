import { forwardRef } from "react";
import { Group as AriaGroup } from "react-aria-components";
import type { GroupRenderProps } from "react-aria-components";
import "./Group.css";

export interface GroupProps {
  children: React.ReactNode | ((values: GroupRenderProps) => React.ReactNode);
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  /** An accessibility role for the group. Defaults to `"group"`. Use `"region"` when the contents
   * are important enough to belong in the page's table of contents, or `"presentation"` when the
   * grouping is visual only and doesn't represent a semantic set of controls. */
  role?: "group" | "region" | "presentation";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Group — built on `react-aria-components`' `Group`: a styled container for
 * a set of related controls (e.g. a segmented input, or an input paired
 * with an inline button) that reports hover/focus-within/disabled/invalid
 * state as data attributes, so the whole set can share one field box and
 * one focus ring instead of each control drawing its own. Not in the
 * source Figma file at all (see docs/design-inventory.md §2.14) — chrome
 * matches `Input`/`ColorField`'s field box exactly so composite controls
 * built from it drop into the same forms without looking foreign.
 */
export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  { children, disabled, invalid, readOnly, role = "group", className, style },
  ref,
) {
  return (
    <AriaGroup
      ref={ref}
      role={role}
      isDisabled={disabled}
      isInvalid={invalid}
      isReadOnly={readOnly}
      className={className ? `wsu-Group ${className}` : "wsu-Group"}
      style={style}
    >
      {children}
    </AriaGroup>
  );
});
