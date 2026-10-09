"use client";

import Link from "next/link";

/** Footer from the approved home mockup. The theme switch lives in the navbar (SiteHeader). */
export function SiteFooter() {
    return (
        <footer style={{ position: "relative", borderTop: "1px solid var(--sp-line)" }}>
            <div
                style={{
                    maxWidth: 1240,
                    margin: "0 auto",
                    padding: "32px 24px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px 32px",
                    alignItems: "center",
                    fontSize: 14,
                    color: "var(--sp-subtle)",
                }}
            >
                <span style={{ fontWeight: 800, color: "var(--sp-ink)" }}>Writesea Odyssey</span>
                <Link href="/docs/getting-started/installation" style={{ color: "var(--sp-muted)" }}>
                    Installation
                </Link>
                <Link href="/docs/base-components" style={{ color: "var(--sp-muted)" }}>
                    Components
                </Link>
                <Link href="/agent-rules" style={{ color: "var(--sp-muted)" }}>
                    MCP
                </Link>
                {process.env.NEXT_PUBLIC_PLAYGROUND_ENABLED === "true" && (
                    <Link href="/playground" style={{ color: "var(--sp-muted)" }}>
                        Playground
                    </Link>
                )}
                <span style={{ marginLeft: "auto" }}>React 19 · Tailwind CSS v4 · React Aria</span>
            </div>
        </footer>
    );
}
