import { palette } from "./palette";

/**
 * Semantic color layer. Components reference *these* names (surfaced as
 * `--wsu-color-*` CSS custom properties), never the raw palette. This is
 * also where every documented AA contrast fix from
 * docs/design-inventory.md §1.3 is applied — the literal Figma value is
 * noted in a comment, the shipped value is the passing substitute.
 */
export const semanticColor = {
  // Surfaces
  "surface-default": palette.white,
  "surface-subtle": palette.gray[50],
  "surface-raised": palette.white,
  /** Dark/inverse surface for high-contrast overlays like Tooltip — not a distinct Figma page, composed from the Gray scale. */
  "surface-inverse": palette.gray[900],
  "text-on-inverse": palette.white,
  /** Light brand tint for a selected/highlighted row (e.g. the active Sidebar item). */
  "surface-accent": palette.primary[25],

  // Text
  "text-heading": palette.gray[900],
  /** Between heading and body — Figma's `semantic/text/text-subheading`, used for secondary actions. */
  "text-subheading": palette.gray[700],
  "text-body": palette.gray[600],
  "text-subtle": palette.gray[500],
  "text-disabled": palette.gray[400],
  "text-on-primary": palette.white,
  /** AA FIX: Figma uses Error/500 #FA1D37 (3.97:1 on white, fails normal text). */
  "text-danger": palette.error[600],
  /** AA FIX: Success/500 #12B76A is 2.62:1 on white; not used as text in Figma, reserved safely. */
  "text-success": palette.success[700],
  /** AA FIX: Warning/500 #FABB00 is 1.73:1 on white; Warning/700 is still large-text-only (4.46:1). */
  "text-warning": palette.warning[800],
  /** Figma "Grayscale/Base" (#666970) — the secondary line of a menu header. Sits between `text-body` and `text-subtle`; 5.50:1 on white. */
  "text-meta": "#666970",

  // Borders
  "border-default": palette.gray[200],
  "border-subtle": palette.gray[100],
  "border-disabled": palette.gray[200],
  "border-focus": palette.primary[500],
  "border-danger": palette.error[600],

  // Icons
  /**
   * Stroke color of the file's icon set — the "Dark" color style (#141B34),
   * used by every Hugeicons glyph placed on the Dropdown page and elsewhere.
   * It is deliberately not one of the gray-scale text colors: it is a touch
   * bluer and darker than `text-heading`, and Figma keeps the two separate.
   */
  "icon-default": "#141b34",

  // Primary (brand) button/action colors
  "primary-bg": palette.primary[900],
  "primary-bg-hover": palette.primary[700],
  "primary-bg-active": palette.primary[900],
  "primary-bg-disabled": palette.primary[200],
  "primary-text": palette.white,

  // Secondary button
  "secondary-bg": palette.gray[50],
  "secondary-bg-hover": palette.gray[100],
  "secondary-text": palette.gray[900],
  "secondary-border": palette.gray[100],

  // Danger button
  "danger-bg": palette.error[600],
  "danger-bg-hover": palette.error[700],
  "danger-bg-active": palette.error[800],
  "danger-bg-disabled": palette.error[200],
  "danger-text": palette.white,

  // Form fields
  "field-bg": palette.white,
  "field-bg-disabled": palette.gray[50],
  "field-placeholder": palette.gray[500],
  "field-border": palette.gray[200],
  "field-border-focus": palette.primary[500],
  "field-border-danger": palette.error[600],

  // Focus ring — see docs/design-inventory.md §1.3 for the AA-fix rationale.
  "focus-ring": "rgba(105,65,198,0.55)",

  // Severity / grading scale (Badge, Cards). Re-sourced directly from the
  // Badge page (Figma node 433:4936), which turned out to define its own
  // colours rather than reuse the hue primitives above — an earlier pass had
  // derived these from the palette and landed on a completely different look
  // (dark background + white text, where the file uses a bright background
  // with dark text and a gloss highlight).
  //
  // Eight of the file's twelve pairings fail the 4.5:1 AA floor. Each is
  // fixed by the smallest change that keeps the file's visual language —
  // darkening the *text* on the bright fills, except solid Fail, whose
  // intent is white-on-red, where the background is darkened instead. The
  // literal file value is noted on every line that moved; all twelve
  // shipped pairs are verified ≥4.5:1.
  "severity-excellent-soft-bg": "#D8FFE3",
  "severity-excellent-soft-text": "#066C23", // 6.09:1 — file value, passes
  "severity-excellent-solid-bg": "#19F958",
  "severity-excellent-solid-text": "#066C23", // 4.64:1 — file value, passes

  "severity-good-soft-bg": "#DBF6FF",
  /** AA FIX: file's `#27a4ff` is 2.38:1 here. */
  "severity-good-soft-text": "#1B72B2", // 4.55:1
  "severity-good-solid-bg": "#19C3F9",
  /** AA FIX: file's `#0070c1` is 2.50:1 here. */
  "severity-good-solid-text": "#00497F", // 4.52:1

  "severity-fair-soft-bg": "#FFF9DB",
  /** AA FIX: file's `#c18b00` is 2.85:1 here. */
  "severity-fair-soft-text": "#946B00", // 4.54:1
  "severity-fair-solid-bg": "#F9D519",
  /** AA FIX: file's `#c18b00` is 2.09:1 here. */
  "severity-fair-solid-text": "#795700", // 4.58:1

  "severity-poor-soft-bg": "#FFECDB",
  "severity-poor-soft-text": "#953900", // 6.38:1 — file value, passes
  "severity-poor-solid-bg": "#FF8D29",
  /** AA FIX: file's `#953900` is 3.18:1 here. */
  "severity-poor-solid-text": "#6F2A00", // 4.53:1

  "severity-bad-soft-bg": "#FEEADC",
  "severity-bad-soft-text": "#6C2306", // 9.58:1 — file value, passes
  "severity-bad-solid-bg": "#F97319",
  /** AA FIX: file's `#6c2306` is 3.98:1 here. */
  "severity-bad-solid-text": "#5D1E05", // 4.53:1

  "severity-fail-soft-bg": "#FEDCDD",
  /** AA FIX: file's `#f9191d` is 3.18:1 here. */
  "severity-fail-soft-text": "#C91417", // 4.59:1
  /** AA FIX: white on the file's `#f9191d` is 4.05:1; the background is darkened instead so the white-on-red intent survives. */
  "severity-fail-solid-bg": "#EA171B",
  "severity-fail-solid-text": palette.white, // 4.53:1

  // Issue-card tints (Figma node 433:7931). A separate scale from the
  // grading severities above with its own vocabulary — the Cards page
  // never uses Excellent/Good/Fair/Poor/Bad/Fail. Text on every tint is
  // gray/base, which clears AA comfortably at these lightnesses.
  //
  // FLAGGED: "General" is the same #FFF0F0 as "Urgent" in the file. Kept
  // as its own token so it can diverge without a breaking change, but the
  // duplication is the file's, not ours.
  "card-urgent-bg": "#FFF0F0",
  "card-critical-bg": "#FFF1E6",
  "card-optional-bg": "#E6F0FF",
  "card-general-bg": "#FFF0F0",
  /** The neutral issue card is white with a hairline border rather than a tint. */
  "card-neutral-border": "#F0F0F0",
} as const;

export type SemanticColorToken = keyof typeof semanticColor;
