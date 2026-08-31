import type { Theme } from "./types";
import type { CSSProperties } from "react";

/**
 * Converts a Theme object into a flat `--wsu-*` custom-property map.
 * Used by ThemeProvider to apply a theme via inline style (no stylesheet
 * injection, so it's identical on server and client — no hydration flash),
 * and mirrored statically in `tokens.css` for consumers who only want to
 * override CSS variables without touching JS.
 */
export function themeToCssVariables(theme: Theme): CSSProperties {
  const vars: Record<string, string> = {
    "--wsu-font-family": theme.fontFamily,
  };

  for (const [token, value] of Object.entries(theme.colors)) {
    vars[`--wsu-color-${token}`] = value;
  }

  for (const [token, value] of Object.entries(theme.spacing)) {
    vars[`--wsu-space-${token}`] = value;
  }

  for (const [token, value] of Object.entries(theme.radius)) {
    vars[`--wsu-radius-${token}`] = value;
  }

  for (const [token, value] of Object.entries(theme.shadow)) {
    vars[`--wsu-shadow-${kebab(token)}`] = value;
  }

  for (const [token, value] of Object.entries(theme.zIndex)) {
    vars[`--wsu-z-${kebab(token)}`] = String(value);
  }

  for (const [token, value] of Object.entries(theme.breakpoints)) {
    vars[`--wsu-breakpoint-${token}`] = value;
  }

  for (const [token, value] of Object.entries(theme.iconSize)) {
    vars[`--wsu-icon-size-${token}`] = value;
  }

  for (const [token, style] of Object.entries(theme.typography)) {
    const name = kebab(token);
    vars[`--wsu-font-${name}`] = `${style.fontWeight} ${style.fontSize}/${style.lineHeight} ${theme.fontFamily}`;
    vars[`--wsu-tracking-${name}`] = style.letterSpacing;
  }

  return vars as CSSProperties;
}

function kebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
