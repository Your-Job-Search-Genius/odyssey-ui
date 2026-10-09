"use client";

import { useEffect, useState } from "react";
import type { Folder, Node, Root } from "fumadocs-core/page-tree";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader, type SiteSection } from "./site-header";

/** Static export serves pages with a trailing slash; the page tree has none. */
export function normalizePath(path: string): string {
    return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

const sectionByFolder: Record<string, SiteSection> = {
    "getting-started": "docs",
    "base-components": "components",
    application: "components",
    foundations: "components",
    "shared-assets": "components",
    mcp: "mcp",
};

export function sectionForPath(pathname: string): SiteSection {
    return sectionByFolder[normalizePath(pathname).split("/")[2] ?? ""] ?? "docs";
}

/** The docs header: SiteHeader's compact variant with the section derived from the URL. */
export function DocsHeader() {
    return <SiteHeader variant="docs" maxWidth={1360} active={sectionForPath(usePathname())} />;
}

function NavLink({ url, name, current }: { url: string; name: React.ReactNode; current: string }) {
    const isCurrent = normalizePath(url) === current;
    return (
        <li>
            <Link href={url} className={isCurrent ? "on" : undefined} aria-current={isCurrent ? "page" : undefined}>
                {name}
            </Link>
        </li>
    );
}

function NodeList({ nodes, current }: { nodes: Node[]; current: string }) {
    return (
        <ul>
            {nodes.map((node) => {
                if (node.type === "page") return <NavLink key={node.url} url={node.url} name={node.name} current={current} />;
                if (node.type === "folder")
                    return (
                        <li key={node.$id ?? String(node.name)}>
                            {node.index ? (
                                <ul>
                                    <NavLink url={node.index.url} name={node.name} current={current} />
                                </ul>
                            ) : null}
                            <div className="sp-side-nested">
                                <NodeList nodes={node.children} current={current} />
                            </div>
                        </li>
                    );
                return null;
            })}
        </ul>
    );
}

/** The mockup's glass `.side` nav, built from the real page tree: each top-level folder is a section. */
export function DocsSidebar({ tree }: { tree: Root }) {
    const current = normalizePath(usePathname());
    const sections = tree.children.filter((node): node is Folder => node.type === "folder");
    // Below 900px the ~90 links would sit above the content on every page, so the list
    // collapses behind a disclosure button; it closes again after navigating.
    const [isNarrow, setIsNarrow] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(max-width: 899px)");
        const sync = () => setIsNarrow(query.matches);
        sync();
        query.addEventListener("change", sync);
        return () => query.removeEventListener("change", sync);
    }, []);
    useEffect(() => setIsOpen(false), [current]);

    return (
        <nav
            className="sp-side sp-glass sp-rise"
            aria-label="Documentation"
            style={{ flex: "1 1 240px", maxWidth: 280, padding: "8px 10px 18px", borderRadius: 22 }}
        >
            {isNarrow && (
                <button
                    type="button"
                    className="sp-btn sp-btn-ghost"
                    style={{ width: "100%", marginTop: 4, justifyContent: "space-between" }}
                    aria-expanded={isOpen}
                    aria-controls="sp-docs-sections"
                    onClick={() => setIsOpen((open) => !open)}
                >
                    Documentation menu
                    <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
            )}
            <div id="sp-docs-sections" hidden={isNarrow && !isOpen}>
                {sections.map((section) => (
                    <div key={section.$id ?? String(section.name)}>
                        <h3>{section.name}</h3>
                        <ul>{section.index && <NavLink url={section.index.url} name="Overview" current={current} />}</ul>
                        <NodeList nodes={section.children} current={current} />
                    </div>
                ))}
            </div>
        </nav>
    );
}
