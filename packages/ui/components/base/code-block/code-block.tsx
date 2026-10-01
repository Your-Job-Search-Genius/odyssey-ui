"use client";

import type { ComponentPropsWithRef } from "react";
import { Button } from "@/components/base/buttons/button";
import { Check, Copy01 } from "@/components/foundations/icons";
import { useClipboard } from "@/hooks/use-clipboard";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    maxHeights: {
        none: "",
        sm: "max-h-40",
        md: "max-h-80",
        lg: "max-h-120",
    },
});

export interface CodeBlockProps extends Omit<ComponentPropsWithRef<"div">, "children" | "onCopy"> {
    /** The text to show, verbatim: code, JSON, a log excerpt, an API key. */
    code: string;
    /** A short caption above the code, e.g. "JSON" or "Request body". Display only -- there is no syntax highlighting. */
    language?: string;
    /** Accessible name for the scrollable region. Defaults to `language`, then "Code". */
    "aria-label"?: string;
    /** Wraps long lines instead of scrolling horizontally. Use for prose-like logs and messages. @default false */
    isWrapped?: boolean;
    /** Caps the height; longer content scrolls inside the block (keyboard-scrollable). @default "none" */
    maxHeight?: keyof typeof styles.maxHeights;
    /** Shows a copy button. @default true */
    showCopy?: boolean;
    /** Called after a copy attempt, e.g. to show a toast. */
    onCopy?: (result: { success: boolean }) => void;
}

/**
 * Monospace, read-only block for code, JSON payloads and logs, with an optional copy button.
 * Use it instead of a raw `<pre>`/`<code>`.
 */
export const CodeBlock = ({
    code,
    language,
    isWrapped = false,
    maxHeight = "none",
    showCopy = true,
    onCopy,
    className,
    "aria-label": ariaLabel,
    ...props
}: CodeBlockProps) => {
    const { copied, copy } = useClipboard();
    const isScrollable = maxHeight !== "none" || !isWrapped;

    return (
        <div {...props} className={cx("relative overflow-hidden rounded-lg border border-secondary bg-secondary", className)}>
            {(language || showCopy) && (
                <div className="flex min-h-10 items-center justify-between gap-2 border-b border-secondary py-1.5 pr-1.5 pl-3">
                    <span className="text-xs font-medium text-tertiary">{language}</span>
                    {showCopy && (
                        <Button
                            size="xs"
                            color="tertiary"
                            iconLeading={copied ? Check : Copy01}
                            aria-label={copied ? "Copied" : "Copy to clipboard"}
                            onClick={async () => {
                                const result = await copy(code);
                                onCopy?.(result);
                            }}
                        />
                    )}
                </div>
            )}
            <pre
                // Focusable so keyboard users can scroll an overflowing block (WCAG 2.1.1).
                tabIndex={isScrollable ? 0 : undefined}
                role={isScrollable ? "region" : undefined}
                aria-label={isScrollable ? (ariaLabel ?? language ?? "Code") : undefined}
                className={cx(
                    "m-0 overflow-auto p-3 font-mono text-xs leading-5 text-primary outline-focus-ring focus-visible:outline-2 focus-visible:-outline-offset-2",
                    isWrapped ? "break-all whitespace-pre-wrap" : "whitespace-pre",
                    styles.maxHeights[maxHeight],
                )}
            >
                <code>{code}</code>
            </pre>
            {/* Announces the copy result; the icon swap alone is visual-only. */}
            <span aria-live="polite" className="sr-only">
                {copied ? "Copied to clipboard" : ""}
            </span>
        </div>
    );
};
