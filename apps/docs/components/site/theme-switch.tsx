"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Light/dark switch for the navbar. Stable name + aria-pressed (NVDA reads
 * "Dark mode, toggle button, pressed / not pressed"), icon shows the current
 * theme. The theme is unknown until mounted, so the first render is neutral
 * to avoid a hydration mismatch.
 */
export function ThemeSwitch() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted && resolvedTheme === "dark";

    return (
        <button
            type="button"
            className="sp-btn sp-btn-ghost"
            style={{ minWidth: 44, padding: "0 14px" }}
            aria-label="Dark mode"
            aria-pressed={isDark}
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                {isDark ? (
                    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                ) : (
                    <>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </>
                )}
            </svg>
        </button>
    );
}
