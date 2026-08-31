export type DocsTheme = "light" | "dark" | "system";

const STORAGE_KEY = "odyssey-docs-theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");

export function getStoredTheme(): DocsTheme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function resolve(theme: DocsTheme): "light" | "dark" {
  return theme === "system" ? (media.matches ? "dark" : "light") : theme;
}

export function applyTheme(theme: DocsTheme): void {
  if (theme === "system") {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, theme);
  }
  document.documentElement.dataset.theme = resolve(theme);
}

/** Keeps the document in sync when the OS theme changes while on "system". */
export function watchSystemTheme(): () => void {
  const onChange = () => {
    if (getStoredTheme() === "system") {
      document.documentElement.dataset.theme = resolve("system");
    }
  };
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
