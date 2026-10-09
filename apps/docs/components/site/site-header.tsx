"use client";

import { useSearchContext } from "fumadocs-ui/contexts/search";
import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";

export type SiteSection = "docs" | "components" | "mcp" | "playground";

const navItems: { section: SiteSection; label: string; href: string }[] = [
    { section: "docs", label: "Docs", href: "/docs/getting-started/introduction" },
    { section: "components", label: "Components", href: "/docs/base-components" },
    { section: "mcp", label: "MCP", href: "/agent-rules" },
    // Only where the playground route exists (see NEXT_PUBLIC_PLAYGROUND_ENABLED in next.config.mjs).
    ...(process.env.NEXT_PUBLIC_PLAYGROUND_ENABLED === "true" ? [{ section: "playground" as const, label: "Playground", href: "/playground" }] : []),
];

export function LogoMark() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect x="4" y="9" width="16" height="16" rx="5" fill="var(--sp-brand-pale)" />
            <rect x="8" y="3" width="16" height="16" rx="5" fill="var(--sp-brand)" />
        </svg>
    );
}

interface SiteHeaderProps {
    /** Highlights the matching nav item with aria-current="page". */
    active?: SiteSection;
    /** "home" adds the ⌘K hint and the Get started button (home mockup); "docs" is the compact header of the docs pages. */
    variant?: "home" | "docs";
    /** Container width from the mockups: 1240 on home/MCP, 1360 on docs pages. */
    maxWidth?: number;
}

/** The glass header shared by every page, ported 1:1 from the approved "Spatial Layers" mockups. */
export function SiteHeader({ active, variant = "docs", maxWidth = 1360 }: SiteHeaderProps) {
    const { setOpenSearch } = useSearchContext();

    return (
        <div style={{ position: "relative", maxWidth, margin: "0 auto", padding: "20px 24px 0", width: "100%" }}>
            <header
                className="sp-glass"
                style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 16px", padding: "10px 12px 10px 20px", borderRadius: 20 }}
            >
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        textDecoration: "none",
                        color: "var(--sp-ink)",
                        fontWeight: 800,
                        fontSize: 18,
                        marginRight: "auto",
                    }}
                >
                    <LogoMark />
                    Odyssey
                </Link>
                <nav aria-label="Primary" style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {navItems.map((item) => (
                        <Link key={item.section} className="sp-navlink" href={item.href} aria-current={active === item.section ? "page" : undefined}>
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <ThemeSwitch />
                <button
                    type="button"
                    className="sp-btn sp-btn-ghost"
                    style={{ minWidth: 44, padding: "0 14px", gap: 10 }}
                    aria-label="Search docs"
                    onClick={() => setOpenSearch(true)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                    {variant === "home" && (
                        <span className="sp-mono sp-hide-sm" style={{ fontSize: 12, color: "var(--sp-subtle)" }}>
                            ⌘K
                        </span>
                    )}
                </button>
                {variant === "home" && (
                    <Link className="sp-btn sp-btn-primary" href="/docs/getting-started/installation">
                        Get started
                    </Link>
                )}
            </header>
        </div>
    );
}
