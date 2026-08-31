import type { ReactNode } from "react";
import { useMemo } from "react";
import { defaultTheme } from "./createTheme";
import { themeToCssVariables } from "./cssVars";
import { ThemeContext } from "./ThemeContext";
import type { Theme } from "./types";

export interface ThemeProviderProps {
  /** A theme built with `createTheme()`. Defaults to the Writesea Odyssey theme. */
  theme?: Theme;
  children: ReactNode;
  /** Passed through to the wrapper element — use to add your own class alongside the theme scope. */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scopes a Theme to its subtree by applying `--wsu-*` CSS custom properties
 * as inline style on a wrapper element. The wrapper is `display: contents`
 * so it never participates in layout (flex/grid children see straight
 * through it) — it exists purely to carry the CSS variable scope. Because
 * this only ever renders inline styles (no `document`/`window` access, no
 * stylesheet injection, no effects), the server and first client render are
 * byte-identical — no hydration flash.
 *
 * Nest a second `ThemeProvider` anywhere in the tree to scope a different
 * theme (e.g. a dark section) to just that subtree.
 */
export function ThemeProvider({ theme = defaultTheme, children, className, style }: ThemeProviderProps) {
  const cssVars = useMemo(() => themeToCssVariables(theme), [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={className ? `wsu-theme-root ${className}` : "wsu-theme-root"}
        style={{ display: "contents", ...cssVars, ...style }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
