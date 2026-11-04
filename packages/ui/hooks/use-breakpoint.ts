"use client";

import { useEffect, useState } from "react";

// Tailwind v4's default breakpoints, in rem like Tailwind itself, so these JS checks and `md:` / `max-md:`
// classes flip at the same width even when the browser's default font size isn't 16px.
const screens = {
    sm: "40rem",
    md: "48rem",
    lg: "64rem",
    xl: "80rem",
    "2xl": "96rem",
};

/**
 * Checks whether a particular Tailwind CSS viewport size applies.
 *
 * @param size The size to check, which must either be included in Tailwind CSS's
 * list of default screen sizes, or added to the Tailwind CSS config file.
 *
 * @returns A boolean indicating whether the viewport size applies. Always `true` (desktop) on the server and
 * on the first client render, so hydration matches; the real value is applied right after mount.
 */
export const useBreakpoint = (size: "sm" | "md" | "lg" | "xl" | "2xl") => {
    const [matches, setMatches] = useState(true);

    useEffect(() => {
        const breakpoint = window.matchMedia(`(min-width: ${screens[size]})`);

        setMatches(breakpoint.matches);

        const handleChange = (value: MediaQueryListEvent) => setMatches(value.matches);

        breakpoint.addEventListener("change", handleChange);
        return () => breakpoint.removeEventListener("change", handleChange);
    }, [size]);

    return matches;
};
