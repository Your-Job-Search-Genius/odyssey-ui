import type { ComponentType } from "react";

/** URL of the chrome-free standalone preview for one demo export (app/preview/[...slug]). Prefixed with the base path because it is opened via a plain <a target="_blank">. */
export function previewHref(demo: string, exportName: string): string {
    return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/preview/${demo}/${encodeURIComponent(exportName)}`;
}

export function parsePreviewSlug(slug: string[]): { demo: string; exportName: string } | null {
    if (slug.length < 2) return null;
    return { demo: slug.slice(0, -1).join("/"), exportName: decodeURIComponent(slug[slug.length - 1]!) };
}

/** Demo modules can also export Storybook story objects (the *.story.tsx fallback); only function components get a standalone page. */
export function isRenderableDemo(value: unknown): value is ComponentType {
    return typeof value === "function";
}
