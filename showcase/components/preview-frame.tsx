"use client";

import type { ReactNode } from "react";
import { usePreviewThemeClass } from "~/lib/preview-theme";
import { cx } from "@/utils/cx";

interface PreviewFrameProps {
    children: ReactNode;
    /** "center" (default) for small/inline components, "start" for components that lay out their own width (tables, cards, navigation). */
    align?: "center" | "start";
    /**
     * "standalone" (default) draws its own bordered, rounded tile --
     * used by ComponentPreview. "embedded" skips the border/rounding
     * (just the theme-class boundary + padding) so it can be composed
     * as the top section of a larger card, e.g. ComponentPlayground,
     * which supplies one shared border for the whole control.
     */
    variant?: "standalone" | "embedded";
}

/**
 * The isolated live-render boundary for every ComponentPreview /
 * ComponentPlayground. Wraps children in the library's own
 * `.light-mode` / `.dark-mode` class (see ../lib/preview-theme.tsx) so
 * every real component renders with the library's actual dark-mode
 * styling, independent of Fumadocs' own `.dark`-based chrome.
 */
export function PreviewFrame({ children, align = "center", variant = "standalone" }: PreviewFrameProps) {
    const themeClass = usePreviewThemeClass();

    return (
        <div className={themeClass}>
            {/*
             * Demo content is arbitrary and sometimes wider than the tile
             * (full grids of variants, tables, etc.) -- `overflow-x-auto`
             * on this outer box guarantees it always scrolls *inside* the
             * frame rather than bleeding out of it.
             */}
            <div className={cx("not-prose w-full overflow-x-auto bg-primary p-8", variant === "standalone" && "rounded-xl border border-secondary")}>
                <div
                    className={cx(
                        "flex min-h-24 min-w-full items-center gap-4",
                        // `w-fit` + `mx-auto` centers content that fits within the
                        // frame; content wider than the frame naturally scrolls
                        // from its left edge instead of overflowing symmetrically.
                        align === "center" ? "mx-auto w-fit justify-center" : "w-full justify-start",
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
