"use client";

import type { ComponentPropsWithRef } from "react";
import { useCallback, useState } from "react";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    heights: {
        sm: "h-60",
        md: "h-120",
        lg: "h-180",
    },
});

export interface HtmlPreviewProps extends Omit<ComponentPropsWithRef<"div">, "title" | "children"> {
    /** The HTML document or fragment to render, e.g. an email body. Rendered in a sandboxed frame, isolated from the app. */
    html: string;
    /** Accessible name of the frame, e.g. "Preview of Welcome email (English)". Required. */
    title: string;
    /** Frame height. With `autoHeight`, the initial height until the content is measured. @default "md" */
    height?: keyof typeof styles.heights;
    /**
     * Grows the frame to fit its content. Measuring needs same-origin access to the frame, which
     * this turns on (`sandbox="allow-same-origin"`); scripts stay blocked, so only use it for HTML
     * you trust not to rely on scripts or forms (e.g. your own email templates).
     * @default false
     */
    autoHeight?: boolean;
    /**
     * `white` keeps a white page behind the content in both themes (emails are designed on white);
     * `theme` uses the app's primary surface.
     * @default "white"
     */
    surface?: "white" | "theme";
}

/**
 * Renders untrusted or style-heavy HTML (email templates, provider previews) in a sandboxed
 * `<iframe srcDoc>`: no scripts, forms, popups or navigation, and none of its CSS can leak into
 * the app. The approved replacement for a raw `<iframe>`.
 */
export const HtmlPreview = ({ html, title, height = "md", autoHeight = false, surface = "white", className, ...props }: HtmlPreviewProps) => {
    const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

    const measure = useCallback(
        (frame: HTMLIFrameElement) => {
            if (!autoHeight) return;
            const doc = frame.contentDocument;
            if (!doc) return;
            setMeasuredHeight(Math.ceil(Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight ?? 0)));
        },
        [autoHeight],
    );

    return (
        <div
            {...props}
            className={cx(
                "overflow-hidden rounded-lg border border-secondary",
                // Emails are authored for a white page; keep it white even in dark mode.
                surface === "white" ? "bg-white" : "bg-primary",
                className,
            )}
        >
            <iframe
                title={title}
                srcDoc={html}
                // Empty sandbox = every restriction on. autoHeight adds only same-origin (for measuring).
                sandbox={autoHeight ? "allow-same-origin" : ""}
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={(event) => measure(event.currentTarget)}
                className={cx("block w-full border-0", measuredHeight === null && styles.heights[height])}
                style={measuredHeight === null ? undefined : { height: measuredHeight }}
            />
        </div>
    );
};
