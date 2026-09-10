"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Fumadocs UI's own chrome (sidebar, TOC, search dialog) is themed via
 * next-themes' default `.dark` class + Fumadocs' own `--color-fd-*`
 * variables. The component library instead uses its own `.light-mode` /
 * `.dark-mode` classes (see ../../styles/theme.css and
 * .storybook/preview.ts's `withThemeByClassName`).
 *
 * Rather than reconfiguring Fumadocs' internal ThemeProvider to emit a
 * class it wasn't built for, this hook reads the *resolved* theme
 * (RootProvider already renders a next-themes `<ThemeProvider>` above
 * everything, so `useTheme()` works anywhere in the tree) and returns
 * the matching library class name. Apply it only to the isolated
 * live-component-preview boundary (`<ComponentPreview>` /
 * `<ComponentPlayground>`) so every real component renders with the
 * library's actual dark-mode styling, pixel-identical to Storybook,
 * without touching Fumadocs' own chrome at all.
 */
export function usePreviewThemeClass(): "light-mode" | "dark-mode" {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Before hydration, next-themes hasn't resolved the real theme yet.
    // Default to light to avoid a flash of incorrectly-styled preview
    // content; this reconciles itself on mount.
    if (!mounted) return "light-mode";

    return resolvedTheme === "dark" ? "dark-mode" : "light-mode";
}
