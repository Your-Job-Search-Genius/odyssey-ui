"use client";

import { type ComponentProps, type ReactNode, useRef, useState } from "react";
import { Tab as AriaTab, TabList as AriaTabList, TabPanel as AriaTabPanel, Tabs as AriaTabs } from "react-aria-components";

const copyIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </svg>
);

/** Copies `getText()` and flips the label to "Copied" for 2s; the status region tells screen readers. */
export function useCopy(getText: () => string) {
    const [copied, setCopied] = useState(false);
    const copy = () =>
        navigator.clipboard
            .writeText(getText())
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {});
    return { copied, copy };
}

/** MDX code fence: the mockup's dark `.code` block with its Copy button. */
export function DocsPre({ title, children }: ComponentProps<"pre"> & { title?: string }) {
    const ref = useRef<HTMLPreElement>(null);
    const { copied, copy } = useCopy(() => ref.current?.textContent ?? "");

    return (
        <figure className="sp-codeblock">
            {title && <figcaption className="sp-mono sp-code-title">{title}</figcaption>}
            <div style={{ position: "relative" }}>
                {/* tabIndex: long lines scroll horizontally, so keyboard users must be able to focus it. */}
                <pre ref={ref} className="sp-code sp-mono" tabIndex={0}>
                    {children}
                </pre>
                <button type="button" className="sp-copy" onClick={copy} aria-label={copied ? "Copied to clipboard" : `Copy code${title ? `: ${title}` : ""}`}>
                    {copyIcon}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <span role="status" className="sr-only">
                {copied ? "Copied to clipboard" : ""}
            </span>
        </figure>
    );
}

const variants = { info: "info", idea: "info", warn: "warn", warning: "warn", error: "error", success: "success" } as const;

/** MDX <Callout>: the mockup's tinted info box; warn/error/success keep the same shape. */
export function DocsCallout({ type = "info", title, children }: { type?: keyof typeof variants; title?: ReactNode; children?: ReactNode }) {
    const variant = variants[type] ?? "info";
    return (
        <div className={`sp-callout sp-callout-${variant}`} role={variant === "warn" || variant === "error" ? "note" : undefined}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {variant === "info" ? (
                    <>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 11v5M12 8h.01" />
                    </>
                ) : variant === "success" ? (
                    <path d="m5 12 5 5 9-10" />
                ) : (
                    <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                )}
            </svg>
            <div>
                {title && <strong style={{ display: "block" }}>{title}</strong>}
                {children}
            </div>
        </div>
    );
}

/** MDX <Tabs items={[...]}>: the mockup's segmented control, with React Aria's tab keyboard model. */
export function DocsTabs({ items, children }: { items: string[]; children?: ReactNode }) {
    return (
        <AriaTabs className="sp-tabs" defaultSelectedKey={items[0]}>
            <AriaTabList className="sp-seg" aria-label={items.join(" / ")}>
                {items.map((item) => (
                    <AriaTab key={item} id={item}>
                        {item}
                    </AriaTab>
                ))}
            </AriaTabList>
            {children}
        </AriaTabs>
    );
}

export function DocsTab({ value, children }: { value: string; children?: ReactNode }) {
    return <AriaTabPanel id={value}>{children}</AriaTabPanel>;
}
