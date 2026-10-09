import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewErrorBoundary } from "~/components/preview-error-boundary";
import { PreviewFrame } from "~/components/preview-frame";
import { demoRegistry } from "~/lib/demo-registry";
import { getDemoExportNames } from "~/lib/demo-sources";
import { isRenderableDemo, parsePreviewSlug } from "~/lib/preview-href";

/** Standalone, chrome-free render of one demo export -- the target of PreviewFrame's "Open in new tab". */
export function generateStaticParams() {
    return Object.keys(demoRegistry).flatMap((demo) =>
        getDemoExportNames(demo)
            .filter((name) => isRenderableDemo(demoRegistry[demo]?.[name]))
            .map((name) => ({ slug: [...demo.split("/"), name] })),
    );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const parsed = parsePreviewSlug((await params).slug);
    return { title: parsed ? `${parsed.exportName} · ${parsed.demo}` : "Preview", robots: { index: false } };
}

export default async function StandalonePreviewPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const parsed = parsePreviewSlug((await params).slug);
    const Demo = parsed ? demoRegistry[parsed.demo]?.[parsed.exportName] : undefined;
    if (!parsed || !isRenderableDemo(Demo)) notFound();

    return (
        <main id="main-content" className="flex min-h-screen flex-col">
            <h1 className="sr-only">{`${parsed.exportName} preview`}</h1>
            <PreviewFrame align="center" variant="bare">
                <PreviewErrorBoundary label={`${parsed.demo}#${parsed.exportName}`}>
                    <Demo />
                </PreviewErrorBoundary>
            </PreviewFrame>
        </main>
    );
}
