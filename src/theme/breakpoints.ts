/**
 * Breakpoints. "mobile" and "desktop" are confirmed from the Figma "Layout &
 * Grids" page; "tablet" has no source in the file and is our own addition
 * (documented in docs/design-inventory.md §1.8) so reflow/responsive
 * behavior has a sane middle step.
 */
export const breakpoints = {
  mobile: "402px",
  tablet: "768px",
  desktop: "1440px",
} as const;

export type BreakpointToken = keyof typeof breakpoints;
