/**
 * Icon sizing scale. Not a distinct Figma page — inferred from the icon
 * sizes actually observed across components (checkbox glyphs at 20px,
 * button icons at 16/20/24px, close buttons at 20px) and rounded to a
 * clean rem scale so it composes with the rest of the type/spacing system.
 */
export const iconSize = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem",
} as const;

export type IconSizeToken = keyof typeof iconSize;
