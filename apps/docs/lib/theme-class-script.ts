/**
 * Inline, pre-hydration script (see app/layout.tsx) that sets the
 * library's `.light-mode` / `.dark-mode` class on `<html>` synchronously,
 * mirroring next-themes' own no-flash script (storageKey "theme",
 * defaultTheme "system" -- see fumadocs-ui's RootProvider) but for our
 * class instead of theirs. Runs during HTML parsing, before React
 * hydrates, so there's no flash of light-mode-colored text on a
 * dark-themed first paint. ThemeClassSync (./theme-class-sync.tsx) keeps
 * the class in sync for every toggle after that.
 */
export const themeClassScript = `(function(){try{var stored=localStorage.getItem("theme");var theme=stored==="light"||stored==="dark"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var root=document.documentElement;root.classList.remove("light-mode","dark-mode");root.classList.add(theme==="dark"?"dark-mode":"light-mode")}catch(e){}})();`;
