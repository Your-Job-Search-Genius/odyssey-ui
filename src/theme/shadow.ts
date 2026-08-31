/** Elevation scale extracted from the Writesea Odyssey Figma "Shadows & Blurs" page. */
export const shadow = {
  xs: "0px 1px 2px 0px rgba(0,0,0,0.05)",
  sm: "0px 3px 6px 0px rgba(0,0,0,0.08)",
  md: "0px 6px 12px 0px rgba(0,0,0,0.05)",
  lg: "0px 15px 30px 0px rgba(0,0,0,0.07)",
  xl: "0px 8px 24px 0px rgba(0,0,0,0.3)",
  "2xl": "0px 10px 30px 0px rgba(0,0,0,0.4)",
  "3xl": "0px 12px 40px 0px rgba(0,0,0,0.5)",
  /**
   * Focus ring. The source file's literal `#D8D2FF` @ 47% opacity ring
   * measures ~1.44:1 against a white page — below the 3:1 WCAG 1.4.11
   * non-text contrast floor for a focus indicator. Widened + darkened here
   * (see docs/design-inventory.md §1.3) so the ring alone clears 3:1; it is
   * still paired with a border-color change on every focusable control,
   * never used as the sole focus cue. The `0 1px 2px` layer underneath is
   * the file's own (`shadow/focus-active` stacks it with the ring) and is
   * kept as-is — only the ring's color was changed.
   */
  focusRing: "0px 1px 2px 0px rgba(10,13,18,0.05), 0px 0px 0px 4px rgba(105,65,198,0.55)",
  /**
   * Inset form, for controls whose focus ring would otherwise be clipped by
   * a scrolling ancestor — table cells, menu items. Needed as its own token
   * because `box-shadow: inset var(--wsu-shadow-focus-ring)` only insets
   * the *first* layer of a multi-layer shadow, silently turning the ring
   * back into an outer one.
   */
  focusRingInset: "inset 0px 0px 0px 4px rgba(105,65,198,0.55)",
} as const;

export type ShadowToken = keyof typeof shadow;
