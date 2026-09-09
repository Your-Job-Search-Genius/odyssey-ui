"use client";

import { type ComponentType, useMemo, useState } from "react";
import { type IconSetId, iconSets } from "~/lib/icon-sets";
import { cx } from "@/utils/cx";

interface IconGalleryProps {
    /** Which icon barrel to browse, e.g. "icons" | "payment-icons" | "integration-icons" | "social-icons". */
    set: IconSetId;
}

const PAGE_SIZE = 240;

/**
 * A searchable, windowed grid over one of the library's icon barrels
 * (up to ~1180 entries for the main icon set) -- reads the real barrel
 * export names directly, so it can never drift from what's actually
 * exported. Click an icon to copy its import statement. Rendering is
 * capped at PAGE_SIZE with a "Show more" control rather than mounting
 * every match at once, since the full "icons" set is large enough that
 * doing so would make the page sluggish.
 */
export function IconGallery({ set }: IconGalleryProps) {
    const { module, importPath } = iconSets[set];
    const [query, setQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [copied, setCopied] = useState<string | null>(null);

    const entries = useMemo(() => Object.entries(module) as [string, ComponentType<{ className?: string }>][], [module]);

    const filtered = useMemo(() => {
        if (!query) return entries;
        const q = query.toLowerCase();
        return entries.filter(([name]) => name.toLowerCase().includes(q));
    }, [entries, query]);

    const visible = filtered.slice(0, visibleCount);

    async function handleCopy(name: string) {
        try {
            await navigator.clipboard.writeText(`import { ${name} } from "${importPath}";`);
            setCopied(name);
            setTimeout(() => setCopied((current) => (current === name ? null : current)), 1500);
        } catch {
            // Clipboard access can be denied (e.g. insecure context); the
            // button label just won't flip to "Copied!" in that case.
        }
    }

    return (
        <div className="not-prose my-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <input
                    type="search"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setVisibleCount(PAGE_SIZE);
                    }}
                    placeholder={`Search ${entries.length.toLocaleString()} icons…`}
                    className="w-full max-w-sm rounded-lg bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs ring-1 ring-primary outline-hidden ring-inset placeholder:text-placeholder focus-visible:ring-2 focus-visible:ring-brand"
                />
                <p className="text-sm text-tertiary">
                    {filtered.length.toLocaleString()} of {entries.length.toLocaleString()} icons
                    {query ? ` matching "${query}"` : ""}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {visible.map(([name, Icon]) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => handleCopy(name)}
                        className={cx(
                            "group flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-secondary p-3 text-center transition duration-100 ease-linear hover:border-brand hover:bg-secondary_hover",
                        )}
                    >
                        <Icon className="size-5 shrink-0 text-tertiary group-hover:text-brand-secondary" />
                        <span className="w-full truncate text-xs text-tertiary">{copied === name ? "Copied!" : name}</span>
                    </button>
                ))}
            </div>

            {visibleCount < filtered.length && (
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                        className="cursor-pointer rounded-lg bg-secondary px-3.5 py-2 text-sm font-semibold text-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
                    >
                        Show more ({(filtered.length - visibleCount).toLocaleString()} remaining)
                    </button>
                </div>
            )}
        </div>
    );
}
