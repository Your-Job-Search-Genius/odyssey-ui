import type { ReactNode } from "react";
import { DocsHeader, DocsSidebar } from "~/components/site/docs-sidebar";
import { SiteFooter } from "~/components/site/site-footer";
import { SiteOrbs } from "~/components/site/site-orbs";
import { source } from "~/lib/source";

/** The "Spatial Layers" docs shell (approved c-start mockup): glass header, glass sidebar, then each page's main + TOC. */
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* overflow-x: clip (not hidden) keeps the orbs contained without breaking the sticky sidebar. */}
            <div style={{ position: "relative", overflowX: "clip", minHeight: "100vh" }}>
                <SiteOrbs
                    orbs={[
                        { size: 480, color: "var(--sp-orb-1)", opacity: 0.6, position: { top: -160, left: "30%" } },
                        { size: 380, color: "var(--sp-orb-2)", opacity: 0.55, position: { top: 900, right: -120 } },
                    ]}
                />
                <DocsHeader />
                <div
                    style={{
                        position: "relative",
                        maxWidth: 1360,
                        margin: "0 auto",
                        padding: 24,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 24,
                        alignItems: "flex-start",
                    }}
                >
                    <DocsSidebar tree={source.getPageTree()} />
                    {children}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
