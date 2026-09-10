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
    /**
     * Confines any `position: fixed` descendants (e.g. a real app's fixed
     * sidebar/header shell) to this frame instead of the actual browser
     * viewport, by giving the frame a bounded height and `contain: paint`
     * -- which the CSS spec makes a containing block for fixed-position
     * descendants, the same way `transform` does. Use for demos that render
     * always-mounted `fixed` layout shells (e.g. app-navigation sidebars),
     * so multiple examples on one page don't all pin to the real viewport
     * at once. Leave off for on-demand overlays (Modal/Drawer/Slideout
     * Menu/BottomSheet) -- those are meant to cover the real viewport when
     * opened, which is the correct, intentional behavior for that demo.
     */
    contain?: boolean;
}

/**
 * The isolated live-render boundary for every ComponentPreview /
 * ComponentPlayground. Wraps children in the library's own
 * `.light-mode` / `.dark-mode` class (see ../lib/preview-theme.tsx) so
 * every real component renders with the library's actual dark-mode
 * styling, independent of Fumadocs' own `.dark`-based chrome.
 */
export function PreviewFrame({ children, align = "center", variant = "standalone", contain = false }: PreviewFrameProps) {
    const themeClass = usePreviewThemeClass();

    return (
        <div className={themeClass}>
            {/*
             * Demo content is arbitrary and sometimes wider than the tile
             * (full grids of variants, tables, etc.) -- `overflow-x-auto`
             * on this outer box guarantees it always scrolls *inside* the
             * frame rather than bleeding out of it.
             */}
            <div
                className={cx(
                    "not-prose w-full overflow-x-auto overflow-y-visible bg-primary p-8",
                    variant === "standalone" && "rounded-xl border border-secondary",
                )}
            >
                <div
                    className={cx(
                        "flex min-w-full items-center gap-4",
                        contain
                            ? // Bounded height + `contain: paint` gives `position: fixed` descendants a
                              // local containing block instead of the real viewport.
                              "relative isolate h-[700px] items-stretch justify-start overflow-hidden [contain:paint]"
                            : cx(
                                  "min-h-24",
                                  // `w-fit` + `mx-auto` centers content that fits within the
                                  // frame; content wider than the frame naturally scrolls
                                  // from its left edge instead of overflowing symmetrically.
                                  align === "center" ? "mx-auto w-fit justify-center" : "w-full justify-start",
                              ),
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
