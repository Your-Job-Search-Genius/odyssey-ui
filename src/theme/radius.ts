/** Border radius scale extracted from the Writesea Odyssey Figma "Border Radii" page. */
export const radius = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "6.25rem",
} as const;

export type RadiusToken = keyof typeof radius;
