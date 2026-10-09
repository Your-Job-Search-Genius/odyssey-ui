"use client";

import { AnchorProvider, type TOCItemType, useActiveAnchor } from "fumadocs-core/toc";

function TocLinks({ toc }: { toc: TOCItemType[] }) {
    const active = useActiveAnchor();
    return (
        <>
            {toc.map((item) => {
                const isActive = active === item.url.slice(1);
                return (
                    <a
                        key={item.url}
                        href={item.url}
                        className={isActive ? "on" : undefined}
                        aria-current={isActive ? "location" : undefined}
                        style={item.depth > 2 ? { paddingLeft: 14 + (item.depth - 2) * 12 } : undefined}
                    >
                        {item.title}
                    </a>
                );
            })}
        </>
    );
}

/** The mockup's "On this page" column, tracking the heading in view. Hidden under 1100px (spatial-docs.css). */
export function DocsToc({ toc }: { toc: TOCItemType[] }) {
    const items = toc.filter((item) => item.depth <= 3);
    if (items.length === 0) return null;

    return (
        <AnchorProvider toc={items} single>
            <aside className="sp-toc-col sp-rise" style={{ flex: "0 0 200px", paddingTop: 20, animationDelay: ".16s" }}>
                <div
                    style={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: "var(--sp-subtle)",
                        marginBottom: 10,
                    }}
                >
                    On this page
                </div>
                <nav className="sp-toc" aria-label="On this page">
                    <TocLinks toc={items} />
                </nav>
            </aside>
        </AnchorProvider>
    );
}
