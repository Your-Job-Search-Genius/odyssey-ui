import type { ReactNode } from "react";
import { useMemo } from "react";
import { defaultTheme } from "./createTheme";
import { themeToCssVariables } from "./cssVars";
import { ThemeContext } from "./ThemeContext";
import { DesignModeContext } from "./DesignModeContext";
import type { DesignMode, Theme } from "./types";

export interface ThemeProviderProps {
  /** A theme built with `createTheme()`. Defaults to the Writesea Odyssey theme. */
  theme?: Theme;
  /**
   * Which team's design this subtree should render. Defaults to
   * `"generic"` — today's default look for every component. Individual
   * components may expose their own `designMode` prop (read via
   * `useDesignMode()`) to override this for just that instance. Nest a
   * second `ThemeProvider` with a different `mode` to scope a different
   * team's design to a subtree, exactly as you would nest one with a
   * different `theme`. See `docs/design-mode.md`.
   */
  mode?: DesignMode;
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
 * theme (e.g. a dark section) to just that subtree. The same applies to
 * `mode`: like `theme`, it does not inherit from an outer `ThemeProvider`
 * when omitted on a nested one — it resets to `"generic"`.
 */
export function ThemeProvider({ theme = defaultTheme, mode = "generic", children, className, style }: ThemeProviderProps) {
  const cssVars = useMemo(() => themeToCssVariables(theme), [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <DesignModeContext.Provider value={mode}>
        <div
          className={className ? `wsu-theme-root ${className}` : "wsu-theme-root"}
          style={{ display: "contents", ...cssVars, ...style }}
        >
          {children}
        </div>
      </DesignModeContext.Provider>
    </ThemeContext.Provider>
  );
}
