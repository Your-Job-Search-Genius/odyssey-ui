import type { SemanticColorToken } from "./semantic";
import type { typography } from "./typography";
import type { spacing } from "./spacing";
import type { radius } from "./radius";
import type { shadow } from "./shadow";
import type { breakpoints } from "./breakpoints";
import type { zIndex } from "./zIndex";
import type { iconSize } from "./iconSize";

export type ThemeColors = Record<SemanticColorToken, string>;

export interface Theme {
  colors: ThemeColors;
  fontFamily: string;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
  breakpoints: typeof breakpoints;
  zIndex: typeof zIndex;
  iconSize: typeof iconSize;
}

/** Only the color layer is commonly overridden — that's the documented public theming surface. */
export interface ThemeOverrides {
  colors?: Partial<ThemeColors>;
  fontFamily?: string;
}

/**
 * Which team's design a subtree (or a single component instance) should
 * render. `"generic"` is the default — today's look for every component,
 * used automatically when no `ThemeProvider` `mode` or per-component
 * `designMode` override is present. See `useDesignMode()`.
 */
export type DesignMode = "generic" | "client" | "admin";
