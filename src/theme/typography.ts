/** Type scale extracted from the Writesea Odyssey Figma "Typography" page. */
export const fontFamily = {
  base: '"Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;

export interface TypeStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
}

const base = fontFamily.base;

export const typography = {
  displayLg: { fontFamily: base, fontWeight: 700, fontSize: "6rem", lineHeight: "7rem", letterSpacing: "0" },
  displayMd: { fontFamily: base, fontWeight: 700, fontSize: "4rem", lineHeight: "4.75rem", letterSpacing: "0" },
  displaySm: { fontFamily: base, fontWeight: 700, fontSize: "2.5rem", lineHeight: "3rem", letterSpacing: "0" },
  displayTitle: { fontFamily: base, fontWeight: 700, fontSize: "1.875rem", lineHeight: "2.375rem", letterSpacing: "-0.019em" },
  headingLg: { fontFamily: base, fontWeight: 600, fontSize: "1.5rem", lineHeight: "2rem", letterSpacing: "0" },
  headingMd: { fontFamily: base, fontWeight: 600, fontSize: "1.25rem", lineHeight: "1.75rem", letterSpacing: "0" },
  headingSm: { fontFamily: base, fontWeight: 600, fontSize: "1.125rem", lineHeight: "1.625rem", letterSpacing: "0" },
  bodyLg: { fontFamily: base, fontWeight: 600, fontSize: "1.125rem", lineHeight: "1.75rem", letterSpacing: "0" },
  bodyMd: { fontFamily: base, fontWeight: 500, fontSize: "1rem", lineHeight: "1.5rem", letterSpacing: "0" },
  /** Figma's "Body/Base-Semibold" — same metrics as bodyMd at weight 600. Used for
      the title line of a menu row with a description (node 433:9016). */
  bodyMdSemibold: { fontFamily: base, fontWeight: 600, fontSize: "1rem", lineHeight: "1.5rem", letterSpacing: "0" },
  bodySm: { fontFamily: base, fontWeight: 500, fontSize: "0.875rem", lineHeight: "1.25rem", letterSpacing: "0" },
} satisfies Record<string, TypeStyle>;

export type TypographyToken = keyof typeof typography;
