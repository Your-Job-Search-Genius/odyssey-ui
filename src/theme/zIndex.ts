/**
 * Stacking order for portaled/overlay content. Not present in Figma (it's a
 * code-only concept) — defined once here so every overlay component shares
 * one source of truth instead of picking arbitrary z-index values.
 */
export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
} as const;

export type ZIndexToken = keyof typeof zIndex;
