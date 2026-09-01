import { createContext, useContext } from "react";
import type { DesignMode } from "./types";

export const DesignModeContext = createContext<DesignMode>("generic");

/**
 * Resolves which team's design should render here: an explicit per-instance
 * override always wins, otherwise the nearest `<ThemeProvider mode="...">`
 * in context, otherwise `"generic"` (today's default look for every
 * component).
 *
 * Component authors: call this with your own `designMode` prop as
 * `localOverride` so consumers can force a mode for a single instance
 * regardless of the ambient `ThemeProvider` mode. See
 * `docs/design-mode.md` for the full opt-in recipe.
 */
export function useDesignMode(localOverride?: DesignMode): DesignMode {
  const contextMode = useContext(DesignModeContext);
  return localOverride ?? contextMode;
}
