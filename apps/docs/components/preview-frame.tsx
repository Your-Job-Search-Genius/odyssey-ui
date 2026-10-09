"use client";

import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { useCopy } from "~/components/site/docs-mdx";
import { usePreviewThemeClass } from "~/lib/preview-theme";
import { cx } from "@/utils/cx";

interface PreviewFrameProps {
    children: ReactNode;
    /** "center" (default) for small/inline components, "start" for components that lay out their own width (tables, cards, navigation). */
    align?: "center" | "start";
    /**
     * "standalone" (default) is the approved mockup's glass preview frame:
     * Preview/Code tabs, preview light/dark toggle, Fullscreen, New tab and
     * Copy. "bare" fills the page with no chrome -- the standalone /preview
     * route opened by "New tab".
     */
    variant?: "standalone" | "bare";
    /**
     * Confines any `position: fixed` descendants (e.g. a real app's fixed
     * sidebar/header shell) to this frame instead of the actual browser
     * viewport, by giving the frame a bounded height and `contain: paint`
     * -- which the CSS spec makes a containing block for fixed-position
     * descendants, the same way `transform` does. Use for demos that render
     * always-mounted `fixed` layout shells (e.g. sidebar navigation shells),
     * so multiple examples on one page don't all pin to the real viewport
     * at once. Leave off for on-demand overlays (Modal/Drawer/Slideout
     * Menu/BottomSheet) -- those are meant to cover the real viewport when
     * opened, which is the correct, intentional behavior for that demo.
     */
    contain?: boolean;
    /** URL of the chrome-free standalone preview; when set, the toolbar shows "New tab". */
    standaloneHref?: string;
    /** Source shown in the Code tab and copied by "Copy"; without it there is no Code tab. */
    code?: string;
    /** Toolbar caption, e.g. "buttons.demo.tsx · Primary"; also the fullscreen title. */
    label?: string;
}

const icon = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
} as const;

/**
 * Scales a demo down with CSS `zoom` when it is wider than its viewer, so the
 * whole component is visible and the viewer never scrolls. Styles are written
 * directly: every pass measures at zoom 1 and applies the same ratio, so the
 * observer settles instead of looping.
 */
function useFitToWidth(viewport: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>, enabled: boolean, remeasureKey: string) {
    useEffect(() => {
        const box = viewport.current;
        const el = stage.current;
        if (!box || !el) return;
        const reset = () => {
            el.style.zoom = "";
            el.style.width = "";
            el.style.minWidth = "";
        };
        if (!enabled) return reset();

        const fit = () => {
            reset();
            const { paddingLeft, paddingRight } = getComputedStyle(box);
            const available = box.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
            const natural = el.scrollWidth;
            if (natural <= available + 1) return;
            // Pin the natural width first so a w-full stage keeps its layout, then scale it to fit.
            el.style.width = `${natural}px`;
            el.style.minWidth = "0";
            el.style.zoom = String(available / natural);
        };
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(box);
        return () => {
            observer.disconnect();
            reset();
        };
    }, [viewport, stage, enabled, remeasureKey]);
}

/**
 * The live-render boundary for every ComponentPreview / ComponentPlayground.
 * The canvas wears the library's own `.light-mode` / `.dark-mode` class (see
 * ../lib/preview-theme.tsx), following the site theme until the visitor
 * flips the preview's own toggle, so every real component renders with the
 * library's actual styling.
 */
export function PreviewFrame({ children, align = "center", variant = "standalone", contain = false, standaloneHref, code, label }: PreviewFrameProps) {
    const siteThemeClass = usePreviewThemeClass();
    const [themeOverride, setThemeOverride] = useState<"light-mode" | "dark-mode" | null>(null);
    // The navbar switch is the source of truth: when the site theme changes, every viewer
    // follows it again, dropping any one-off flip made with the viewer's own toggle.
    useEffect(() => setThemeOverride(null), [siteThemeClass]);
    const themeClass = themeOverride ?? siteThemeClass;
    const isDark = themeClass === "dark-mode";

    const frameRef = useRef<HTMLElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [tab, setTab] = useState<"preview" | "code">("preview");
    const [isFullscreen, setIsFullscreen] = useState(false);
    // Unknown until mounted (SSR); iPhone Safari has no element fullscreen at all.
    const [canFullscreen, setCanFullscreen] = useState(false);
    const { copied, copy } = useCopy(() => code ?? "");

    useEffect(() => {
        setCanFullscreen(document.fullscreenEnabled);
        // Resync on Esc / browser-UI exits, not just our own button.
        const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    // Entering or leaving fullscreen swaps the toolbar, unmounting the button that was pressed;
    // move focus to its counterpart so keyboard and NVDA users are not dropped on <body>
    // (on entry <body> is outside the fullscreen element). Covers Esc exits too.
    const enterButtonRef = useRef<HTMLButtonElement>(null);
    const exitButtonRef = useRef<HTMLButtonElement>(null);
    const wasFullscreen = useRef(false);
    useEffect(() => {
        if (isFullscreen === wasFullscreen.current) return;
        wasFullscreen.current = isFullscreen;
        (isFullscreen ? exitButtonRef : enterButtonRef).current?.focus();
    }, [isFullscreen]);

    const toggleFullscreen = () => {
        // The browser may refuse (no user activation, permissions policy); the
        // button state then simply stays as it was, so the rejection is ignored.
        const request = document.fullscreenElement ? document.exitFullscreen() : frameRef.current?.requestFullscreen();
        request?.catch(() => {});
    };

    // `contain` shells lay themselves out inside a fixed-height box, so they are never scaled.
    useFitToWidth(viewportRef, stageRef, !contain && tab === "preview", `${isFullscreen}-${themeClass}`);

    const stage = (
        <div
            ref={stageRef}
            className={cx(
                // sp-demo: the library component renders here; the site's focus ring is excluded
                // inside it so components show only their own built-in focus styles.
                "sp-demo flex min-w-full items-center gap-4",
                contain
                    ? // Bounded height + `contain: paint` gives `position: fixed` descendants a
                      // local containing block instead of the real viewport.
                      cx("relative isolate items-stretch justify-start overflow-hidden [contain:paint]", isFullscreen ? "h-[calc(100vh-10rem)]" : "h-[700px]")
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
    );

    if (variant === "bare") {
        return (
            <div ref={viewportRef} className={cx(themeClass, "not-prose min-h-screen w-full overflow-x-auto bg-primary p-8 font-body")}>
                <div className="flex min-h-[calc(100vh-4rem)] items-center">{stage}</div>
            </div>
        );
    }

    return (
        <section
            ref={frameRef}
            className="sp-preview sp-glass sp-rise not-prose"
            aria-label={label ? `Live preview: ${label}` : "Live preview"}
            style={{ borderRadius: 28, overflow: "hidden", margin: "24px 0", animationDelay: ".12s" }}
        >
            {isFullscreen ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--sp-line)" }}>
                    <span style={{ fontWeight: 800, color: isDark ? "#F3F4FF" : "#1B1838" }}>{label ?? "Preview"}</span>
                    <button ref={exitButtonRef} type="button" className="sp-btn sp-btn-ghost" onClick={toggleFullscreen} style={{ marginLeft: "auto" }}>
                        <svg {...icon} width={16} height={16} aria-hidden="true">
                            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
                        </svg>
                        Exit fullscreen
                    </button>
                </div>
            ) : (
                <div
                    style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, padding: "12px 14px", borderBottom: "1px solid var(--sp-line)" }}
                >
                    {code !== undefined && (
                        <div className="sp-seg" role="group" aria-label="View">
                            <button type="button" aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>
                                Preview
                            </button>
                            <button type="button" aria-pressed={tab === "code"} onClick={() => setTab("code")}>
                                Code
                            </button>
                        </div>
                    )}
                    {label && (
                        <span className="sp-mono" style={{ fontSize: 12.5, color: "var(--sp-subtle)", marginLeft: 6 }}>
                            {label}
                        </span>
                    )}
                    <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <button
                            type="button"
                            className="sp-tool"
                            aria-label={isDark ? "Switch preview to light" : "Switch preview to dark"}
                            aria-pressed={isDark}
                            onClick={() => setThemeOverride(isDark ? "light-mode" : "dark-mode")}
                        >
                            <svg {...icon} aria-hidden="true">
                                <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                            </svg>
                        </button>
                        {canFullscreen && (
                            <button ref={enterButtonRef} type="button" className="sp-tool" aria-label="View fullscreen" onClick={toggleFullscreen}>
                                <svg {...icon} aria-hidden="true">
                                    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                                </svg>
                                Fullscreen
                            </button>
                        )}
                        {standaloneHref && (
                            <a className="sp-tool" href={standaloneHref} target="_blank" rel="noopener" aria-label="Open component in a new tab">
                                <svg {...icon} aria-hidden="true">
                                    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                                </svg>
                                New tab
                            </a>
                        )}
                        {code !== undefined && (
                            <button type="button" className="sp-tool" aria-label={copied ? "Code copied" : "Copy code"} onClick={copy}>
                                <svg {...icon} aria-hidden="true">
                                    <rect x="9" y="9" width="11" height="11" rx="2" />
                                    <path d="M5 15V5a1 1 0 0 1 1-1h10" />
                                </svg>
                                {copied ? "Copied" : "Copy"}
                            </button>
                        )}
                        <span role="status" className="sr-only">
                            {copied ? "Code copied" : ""}
                        </span>
                    </div>
                </div>
            )}

            {tab === "code" && code !== undefined && !isFullscreen ? (
                <div className="sp-pop" style={{ margin: 14 }}>
                    <pre className="sp-code sp-mono" tabIndex={0} style={{ padding: 20, lineHeight: 1.75 }}>
                        {code}
                    </pre>
                </div>
            ) : (
                <div
                    ref={viewportRef}
                    className={cx(themeClass, "sp-pv font-body")}
                    style={
                        isFullscreen
                            ? { flex: 1, display: "flex", alignItems: "center", overflowX: "auto", padding: 32, border: 0 }
                            : { margin: 14, borderRadius: 20, padding: "clamp(24px, 4vw, 48px)", overflowX: "auto" }
                    }
                >
                    {stage}
                </div>
            )}
        </section>
    );
}
