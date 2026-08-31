import { createContext, useContext } from "react";
import { defaultTheme } from "./createTheme";
import type { Theme } from "./types";

export const ThemeContext = createContext<Theme>(defaultTheme);

/** Read the current theme's typed token object (e.g. for a chart that needs raw hex values in JS). */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
