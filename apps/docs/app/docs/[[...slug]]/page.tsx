import { Fragment } from "react";
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb";
import { findNeighbour } from "fumadocs-core/page-tree";
import type { TOCItemType } from "fumadocs-core/toc";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMDXComponents } from "~/components/mdx";
import { DocsToc } from "~/components/site/docs-toc";
import { source } from "~/lib/source";

type Props = {
    params: Promise<{ slug?: string[] }>;
};

/** Docs folder -> registry category, for the component pages' accessibility notes. */
const registryCategory: Record<string, string> = {
    "base-components": "base",
    application: "application",
    foundations: "foundations",
    "shared-assets": "shared-assets",
};

function Breadcrumb({ url }: { url: string }) {
    const items = getBreadcrumbItems(url, source.getPageTree(), { includeRoot: true, includePage: true });
    return (
        <div style={{ fontSize: 14, color: "var(--sp-subtle)" }}>
            {items.map((item, i) => (
                <Fragment key={i}>
                    {i > 0 && <span aria-hidden="true"> / </span>}
                    {item.url && i < items.length - 1 ? (
                        <Link href={item.url} style={{ color: "var(--sp-subtle)" }}>
                            {item.name}
                        </Link>
                    ) : (
                        item.name
                    )}
                </Fragment>
            ))}
        </div>
    );
}

function PrevNext({ url }: { url: string }) {
    const { previous, next } = findNeighbour(source.getPageTree(), url);
    if (!previous && !next) return null;
    const card = { padding: "18px 20px", borderRadius: 18, textDecoration: "none", color: "var(--sp-ink)" } as const;
    return (
        <nav aria-label="Pagination" style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {previous ? (
                <Link className="sp-glass" href={previous.url} style={card}>
                    <div style={{ fontSize: 13, color: "var(--sp-subtle)" }}>← Previous</div>
                    <div style={{ fontWeight: 800, fontSize: 17, marginTop: 4 }}>{previous.name}</div>
                </Link>
            ) : (
                <span />
            )}
            {next && (
                <Link className="sp-glass" href={next.url} style={{ ...card, textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: "var(--sp-subtle)" }}>Next →</div>
                    <div style={{ fontWeight: 800, fontSize: 17, marginTop: 4 }}>{next.name}</div>
                </Link>
            )}
        </nav>
    );
}

/** Example headings (h3 under "## Examples") for the mockup's Examples card. */
function exampleLinks(toc: TOCItemType[]): TOCItemType[] {
    const start = toc.findIndex((item) => item.depth === 2 && item.url === "#examples");
    if (start === -1) return [];
    const rest = toc.slice(start + 1);
    const end = rest.findIndex((item) => item.depth <= 2);
    return (end === -1 ? rest : rest.slice(0, end)).filter((item) => item.depth === 3);
}

function ComponentCards({ slug, toc }: { slug: string[]; toc: TOCItemType[] }) {
    const prefix = `${registryCategory[slug[0]!]}/${slug.slice(1).join("/")}`;
    const notes = loadRegistry().components.filter((c) => (c.id === prefix || c.id.startsWith(`${prefix}/`)) && c.a11y);
    const examples = exampleLinks(toc);
    if (notes.length === 0 && examples.length === 0) return null;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {notes.length > 0 && (
                <section className="sp-glass sp-rise" style={{ padding: 26, borderRadius: 24, animationDelay: ".24s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                background: "var(--sp-tint)",
                                color: "var(--sp-brand)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="5" r="2" />
                                <path d="M5 9h14M12 9v12M9 21l3-6 3 6" />
                            </svg>
                        </span>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Accessibility</h2>
                    </div>
                    <dl style={{ margin: "18px 0 0", display: "grid", gap: 14, fontSize: 15 }}>
                        {notes.map((c) => (
                            <div key={c.id}>
                                <dt style={{ fontWeight: 700 }}>{c.name}</dt>
                                <dd style={{ margin: "4px 0 0", color: "var(--sp-muted)" }}>{c.a11y}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
            {examples.length > 0 && (
                <section className="sp-glass sp-rise" style={{ padding: 26, borderRadius: 24, animationDelay: ".3s" }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Examples</h2>
                    <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                        {examples.map((e) => (
                            <li key={e.url}>
                                <a
                                    href={e.url}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px 14px",
                                        borderRadius: 12,
                                        textDecoration: "none",
                                        color: "var(--sp-ink)",
                                        background: "var(--sp-ghost)",
                                        fontWeight: 600,
                                        fontSize: 15,
                                    }}
                                >
                                    {e.title}
                                    <span aria-hidden="true" style={{ color: "var(--sp-brand)" }}>
                                        →
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

export default async function Page({ params }: Props) {
    const { slug = [] } = await params;
    const page = source.getPage(slug);
    if (!page) notFound();

    const MDX = page.data.body;
    const isComponentPage = slug.length > 1 && slug[0]! in registryCategory;

    if (isComponentPage) {
        // Approved c-component layout: header block on the ground, glass sections stacked, no TOC column.
        return (
            <main id="main-content" style={{ flex: "999 1 560px", minWidth: 0, display: "grid", gap: 24 }}>
                <section className="sp-rise" style={{ animationDelay: ".06s" }}>
                    <Breadcrumb url={page.url} />
                    <h1 style={{ margin: "10px 0 0", fontSize: "clamp(36px, 4vw, 52px)", letterSpacing: "-0.03em", fontWeight: 800 }}>{page.data.title}</h1>
                    {page.data.description && (
                        <p style={{ margin: "12px 0 0", fontSize: 18, lineHeight: 1.6, color: "var(--sp-muted)", maxWidth: 680 }}>{page.data.description}</p>
                    )}
                </section>
                <div className="sp-prose sp-prose-component" style={{ minWidth: 0 }}>
                    <MDX components={getMDXComponents()} />
                </div>
                <ComponentCards slug={slug} toc={page.data.toc} />
            </main>
        );
    }

    // Approved c-start layout: one glass article plus the "On this page" column.
    return (
        <>
            <main id="main-content" style={{ flex: "999 1 560px", minWidth: 0 }}>
                <article className="sp-glass sp-rise" style={{ padding: "clamp(24px, 4vw, 52px)", borderRadius: 28, animationDelay: ".08s" }}>
                    <Breadcrumb url={page.url} />
                    <h1 style={{ margin: "12px 0 0", fontSize: "clamp(36px, 4vw, 48px)", letterSpacing: "-0.03em", fontWeight: 800 }}>{page.data.title}</h1>
                    {page.data.description && (
                        <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.6, color: "var(--sp-muted)", maxWidth: 640 }}>{page.data.description}</p>
                    )}
                    <div className="sp-prose" style={{ marginTop: 28 }}>
                        <MDX components={getMDXComponents()} />
                    </div>
                    <PrevNext url={page.url} />
                </article>
            </main>
            <DocsToc toc={page.data.toc} />
        </>
    );
}

export async function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const page = source.getPage(slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}
