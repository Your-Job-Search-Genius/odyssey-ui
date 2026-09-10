"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Keeps the library's own `.light-mode` / `.dark-mode` class (see
 * ../../../packages/ui/styles/theme.css and the `dark:` custom-variant in
 * ./global.css) in sync with next-themes' resolved theme, applied to
 * `<html>` itself -- not just the isolated <PreviewFrame> boundary (see
 * ./preview-theme.tsx). Every semantic color token (`text-primary`,
 * `bg-secondary`, ...) used across this app -- the home page, docs prose,
 * props tables, icon gallery, playground UI -- only resolves its dark
 * value under `.dark-mode`, so without this the whole app outside of live
 * component demos stayed stuck on light-mode token values while the page
 * itself went dark, making text unreadable.
 *
 * The matching inline script rendered in app/layout.tsx sets the class
 * synchronously before hydration (mirroring next-themes' own no-flash
 * script) so there's no flash of wrong-mode text on first paint; this
 * effect takes over for every toggle after that.
 */
export function ThemeClassSync() {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!resolvedTheme) return;
        const root = document.documentElement;
        root.classList.remove("light-mode", "dark-mode");
        root.classList.add(resolvedTheme === "dark" ? "dark-mode" : "light-mode");
    }, [resolvedTheme]);

    return null;
}
