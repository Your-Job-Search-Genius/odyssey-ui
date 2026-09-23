"use client";

/**
 * The playground's live preview (design system plan, Section 5.3 /
 * 6.1). Loaded inside an iframe by the main playground page; receives
 * the current UITree via postMessage and renders it with ui-tree's
 * renderTree() against the real, generated componentMap/iconMap (see
 * lib/playground/component-map.generated.ts) so the preview is
 * pixel-identical to production, not a stand-in.
 *
 * Known gap, not silently accepted: primitive nodes' classNames come
 * from tree JSON data at runtime, not literal source text, so Tailwind's
 * build-time scanner (which only sees literal class strings -- see
 * app/global.css's @source comment) cannot guarantee every token-backed
 * class the registry allows has real CSS generated for it. In practice
 * this is low-risk: every allowedTailwindPatterns class is a real
 * utility built on tokens already used pervasively throughout
 * packages/ui's ~200 component files, which Tailwind does scan, so the
 * overwhelming majority of agent-generated classes already have
 * generated CSS as a side effect. A registry-driven Tailwind safelist
 * would close this gap completely; not built here.
 */
import { useEffect, useState } from "react";
import { renderTree } from "@your-job-search-genius/ui-tree";
import type { UITree } from "@your-job-search-genius/ui-tree";
import { componentMap, iconMap } from "~/lib/playground/component-map.generated";

type IncomingMessage = { type: "tree"; tree: UITree } | { type: "theme"; mode: "light" | "dark" };

export default function PreviewPage() {
    const [tree, setTree] = useState<UITree | null>(null);

    useEffect(() => {
        function onMessage(event: MessageEvent) {
            const data = event.data as IncomingMessage | undefined;
            if (!data || typeof data !== "object") return;
            if (data.type === "tree") setTree(data.tree);
            if (data.type === "theme") {
                document.documentElement.classList.toggle("dark-mode", data.mode === "dark");
            }
        }
        window.addEventListener("message", onMessage);
        // Tell the parent the preview is ready to receive a tree -- the
        // parent may have tried to post one before this listener was
        // attached (e.g. on the very first paint after an iframe reload).
        window.parent.postMessage({ type: "preview_ready" }, "*");
        return () => window.removeEventListener("message", onMessage);
    }, []);

    useEffect(() => {
        function onClick(event: MouseEvent) {
            const target = (event.target as HTMLElement | null)?.closest("[data-node-id]");
            const nodeId = target?.getAttribute("data-node-id");
            if (nodeId) window.parent.postMessage({ type: "select", nodeId }, "*");
        }
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, []);

    if (!tree) {
        return <div className="flex h-screen items-center justify-center text-sm text-tertiary">Waiting for a canvas to preview...</div>;
    }

    return <div className="min-h-screen bg-primary p-6">{renderTree(tree, { componentMap, iconMap })}</div>;
}
