import { Separator as AriaSeparator } from "react-aria-components";
import type { SeparatorProps } from "react-aria-components";
import "./Separator.css";

export type { SeparatorProps };

/**
 * Not in the source Figma file. Built directly on `react-aria-components`'
 * `Separator` — a purely presentational divider between groups of content
 * (e.g. menu sections or page regions), exposed via `role="separator"`
 * (or `"none"` when nested in an already-labeled list, per the behavior
 * layer). Styled from this system's border/spacing tokens rather than a
 * new visual language.
 */
export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <AriaSeparator
      {...props}
      className={className ? `wsu-Separator ${className}` : "wsu-Separator"}
    />
  );
}
