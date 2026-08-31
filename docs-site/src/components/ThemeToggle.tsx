import { useEffect, useState } from "react";
import {
  ComputerIcon,
  MoonIcon,
  Sun03Icon,
} from "@your-job-search-genius/icons";
import {
  applyTheme,
  getStoredTheme,
  watchSystemTheme,
  type DocsTheme,
} from "../lib/theme";

const NEXT: Record<DocsTheme, DocsTheme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABEL: Record<DocsTheme, string> = {
  light: "Theme: light. Switch to dark.",
  dark: "Theme: dark. Switch to system.",
  system: "Theme: system. Switch to light.",
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<DocsTheme>(() => getStoredTheme());

  useEffect(() => watchSystemTheme(), []);

  const cycle = () => {
    const next = NEXT[theme];
    setTheme(next);
    applyTheme(next);
  };

  const Icon =
    theme === "light" ? Sun03Icon : theme === "dark" ? MoonIcon : ComputerIcon;

  return (
    <button
      type="button"
      className="docs-icon-btn"
      onClick={cycle}
      aria-label={LABEL[theme]}
      title={LABEL[theme]}
    >
      <Icon size={18} />
    </button>
  );
}
