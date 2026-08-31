import { semanticColor } from "./semantic";
import { fontFamily, typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { shadow } from "./shadow";
import { breakpoints } from "./breakpoints";
import { zIndex } from "./zIndex";
import { iconSize } from "./iconSize";
import type { Theme, ThemeOverrides } from "./types";
import { warnOnContrastFailures, type ContrastCheck } from "./contrast";

export const defaultTheme: Theme = {
  colors: { ...semanticColor },
  fontFamily: fontFamily.base,
  typography,
  spacing,
  radius,
  shadow,
  breakpoints,
  zIndex,
  iconSize,
};

/** The pairings we audit on every theme, default or custom — kept in sync with docs/design-inventory.md §1.3. */
function buildContrastChecks(colors: Theme["colors"]): ContrastCheck[] {
  return [
    { label: "text-heading on surface-default", foreground: colors["text-heading"], background: colors["surface-default"], kind: "text" },
    { label: "text-on-inverse on surface-inverse", foreground: colors["text-on-inverse"], background: colors["surface-inverse"], kind: "text" },
    { label: "text-body on surface-default", foreground: colors["text-body"], background: colors["surface-default"], kind: "text" },
    { label: "text-subtle on surface-default", foreground: colors["text-subtle"], background: colors["surface-default"], kind: "text" },
    { label: "text-danger on surface-default", foreground: colors["text-danger"], background: colors["surface-default"], kind: "text" },
    { label: "text-success on surface-default", foreground: colors["text-success"], background: colors["surface-default"], kind: "text" },
    { label: "text-warning on surface-default", foreground: colors["text-warning"], background: colors["surface-default"], kind: "text" },
    { label: "primary-text on primary-bg", foreground: colors["primary-text"], background: colors["primary-bg"], kind: "text" },
    { label: "primary-text on primary-bg-hover", foreground: colors["primary-text"], background: colors["primary-bg-hover"], kind: "text" },
    { label: "danger-text on danger-bg", foreground: colors["danger-text"], background: colors["danger-bg"], kind: "text" },
    { label: "secondary-text on secondary-bg", foreground: colors["secondary-text"], background: colors["secondary-bg"], kind: "text" },
    { label: "border-focus on surface-default", foreground: colors["border-focus"], background: colors["surface-default"], kind: "non-text" },
    { label: "field-border-focus on surface-default", foreground: colors["field-border-focus"], background: colors["surface-default"], kind: "non-text" },
    { label: "severity-good-soft-text on severity-good-soft-bg", foreground: colors["severity-good-soft-text"], background: colors["severity-good-soft-bg"], kind: "text" },
    { label: "severity-good-solid-text on severity-good-solid-bg", foreground: colors["severity-good-solid-text"], background: colors["severity-good-solid-bg"], kind: "text" },
    { label: "severity-excellent-soft-text on severity-excellent-soft-bg", foreground: colors["severity-excellent-soft-text"], background: colors["severity-excellent-soft-bg"], kind: "text" },
    { label: "severity-excellent-solid-text on severity-excellent-solid-bg", foreground: colors["severity-excellent-solid-text"], background: colors["severity-excellent-solid-bg"], kind: "text" },
    { label: "severity-fair-solid-text on severity-fair-solid-bg", foreground: colors["severity-fair-solid-text"], background: colors["severity-fair-solid-bg"], kind: "text" },
    { label: "severity-fail-soft-text on severity-fail-soft-bg", foreground: colors["severity-fail-soft-text"], background: colors["severity-fail-soft-bg"], kind: "text" },
    { label: "severity-fail-solid-text on severity-fail-solid-bg", foreground: colors["severity-fail-solid-text"], background: colors["severity-fail-solid-bg"], kind: "text" },
  ];
}

/**
 * Builds a Theme from the Writesea Odyssey defaults plus any overrides. This
 * is the primary theming API: a consumer installs the package and calls
 * `createTheme({ colors: { "primary-bg": "#0B5FFF", ... } })` to reskin the
 * library without forking it. In development, every text/background and
 * boundary/background pairing we know about is re-audited for AA contrast
 * and logged via `console.warn` on failure — including pairings introduced
 * by the override, not just the shipped defaults.
 */
export function createTheme(overrides: ThemeOverrides = {}): Theme {
  const colors: Theme["colors"] = { ...semanticColor, ...overrides.colors };

  const theme: Theme = {
    colors,
    fontFamily: overrides.fontFamily ?? fontFamily.base,
    typography,
    spacing,
    radius,
    shadow,
    breakpoints,
    zIndex,
    iconSize,
  };

  if (process.env.NODE_ENV !== "production") {
    warnOnContrastFailures(buildContrastChecks(colors));
  }

  return theme;
}
