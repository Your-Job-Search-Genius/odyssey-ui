import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ChevronDown } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";

export interface SidebarItemData {
    id: string;
    label: ReactNode;
    /** Ignored on a child/submenu item — the submenu rows have no icon slot at all (see `SidebarSubItem`). */
    icon?: ReactNode;
    href?: string;
    onClick?: () => void;
    /** Nested items — rendered as a `<details>`/`<summary>` disclosure. Only one level deep, matching the source design. */
    children?: SidebarItemData[];
}

export interface SidebarProps {
    /** Landmark label (WCAG: a page with more than one `<nav>` needs each one named). */
    "aria-label": string;
    items: SidebarItemData[];
    /** id of the currently active item — rendered with `aria-current="page"` and the active-rail indicator, never color alone. */
    activeId?: string;
    /** Optional block above the nav list — a workspace/institution identity slot. */
    header?: ReactNode;
    /** Optional block below the nav list, bottom-aligned when the nav is given a fixed height. */
    footer?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

// No `outline-hidden` here: it sets `--tw-outline-style: none`, which `focus-visible:outline-2`
// would inherit — silently erasing the ring (WCAG 2.4.7). Matches button.tsx's focus styling.
const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/**
 * The rail is a real inline element (the row's first flex child) rather than an
 * absolutely-positioned `::before` hanging outside the item's box. It's always in the DOM,
 * transparent unless active, so hover/active never reflow the row.
 */
function SidebarRail({ active }: { active?: boolean }) {
    return <span className={cx("h-5.5 w-0.5 shrink-0 rounded-[0.3125rem] bg-transparent", active && "bg-brand-solid")} aria-hidden="true" />;
}

const itemBoxClasses = "box-border w-full rounded-[0.4375rem] py-1.5 pr-2.5 pl-[0.3125rem]";
// Active/hover text pairs with the pill background the same way the Badge brand pill does
// (text-utility-brand-700 on bg-utility-brand-50): 6.2:1 in light mode and 8.6:1 in dark mode,
// clearing WCAG 1.4.3's 4.5:1 floor in both — the non-utility brand tokens measure 4.29:1 (light)
// and 1.49:1 (dark) here, so they can't be used for this text.
const itemClasses = cx(
    itemBoxClasses,
    "flex min-h-6 cursor-pointer items-center gap-[0.3125rem] border-0 bg-transparent text-left text-sm text-primary no-underline hover:text-utility-brand-700",
    "aria-[current=page]:bg-utility-brand-50 aria-[current=page]:text-utility-brand-700",
    FOCUS_RING,
);

/** Top-level rows only — child/submenu rows have no icon or rail slot (see `SidebarSubItem`). */
function SidebarItem({ item, activeId, depth }: { item: SidebarItemData; activeId?: string; depth: number }) {
    const isActive = item.id === activeId;

    if (item.children?.length) {
        const isBranchActive = hasActiveDescendant(item, activeId);
        return (
            <li>
                <details className={cx(itemBoxClasses, "flex flex-col gap-[0.3125rem]")} open={isBranchActive}>
                    <summary
                        className={cx(
                            // min-h-6 keeps the disclosure row a ≥24px target (WCAG 2.5.8).
                            "flex min-h-6 cursor-pointer list-none items-center justify-between gap-[0.3125rem] rounded-none p-0 text-sm text-primary hover:text-utility-brand-700 [&::-webkit-details-marker]:hidden",
                            FOCUS_RING,
                        )}
                        data-depth={depth}
                    >
                        <SidebarRail />
                        {item.icon ? (
                            <span className="inline-flex size-[1.125rem] shrink-0 [&>svg]:size-full" aria-hidden="true">
                                {item.icon}
                            </span>
                        ) : null}
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {/* Sized the same 18px as the item icons. */}
                        <ChevronDown
                            size={18}
                            className="shrink-0 text-current transition-transform duration-150 ease-in-out in-open:rotate-180 motion-reduce:transition-none"
                        />
                    </summary>
                    <div className="flex items-start gap-[0.3125rem] pl-[0.9375rem]">
                        {/* The connector tints primary when the branch holds the active item. */}
                        <span
                            className={cx(
                                "h-[1.3125rem] w-[0.9375rem] shrink-0 rounded-bl-lg border-b border-l border-secondary",
                                isBranchActive && "border-brand-solid",
                            )}
                            aria-hidden="true"
                        />
                        <ul className="m-0 flex w-fit max-w-full list-none flex-col gap-2.5 p-0 pt-[0.6875rem]">
                            {item.children.map((child) => (
                                <SidebarSubItem key={child.id} item={child} activeId={activeId} />
                            ))}
                        </ul>
                    </div>
                </details>
            </li>
        );
    }

    return (
        <li>
            {item.href ? (
                <a href={item.href} className={itemClasses} data-depth={depth} aria-current={isActive ? "page" : undefined}>
                    <SidebarRail active={isActive} />
                    {item.icon ? (
                        <span className="inline-flex size-[1.125rem] shrink-0 [&>svg]:size-full" aria-hidden="true">
                            {item.icon}
                        </span>
                    ) : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </a>
            ) : (
                <button type="button" onClick={item.onClick} className={itemClasses} data-depth={depth} aria-current={isActive ? "page" : undefined}>
                    <SidebarRail active={isActive} />
                    {item.icon ? (
                        <span className="inline-flex size-[1.125rem] shrink-0 [&>svg]:size-full" aria-hidden="true">
                            {item.icon}
                        </span>
                    ) : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
            )}
        </li>
    );
}

/**
 * Submenu rows (depth 1) are plain text pills with no icon and no rail; the active one gets a
 * tinted pill background instead of the top-level rail treatment. Only one level of nesting is
 * defined in the source design, so this doesn't recurse into further children.
 */
function SidebarSubItem({ item, activeId }: { item: SidebarItemData; activeId?: string }) {
    const isActive = item.id === activeId;
    const subItemClasses = cx(
        // min-h-6 instead of the source design's fixed 22px height: submenu pills are click
        // targets and must be at least 24px tall (WCAG 2.5.8 Target Size Minimum).
        "box-border flex min-h-6 w-full cursor-pointer items-center rounded border-0 bg-transparent px-1 py-0.5 text-sm whitespace-nowrap text-primary no-underline hover:text-utility-brand-700",
        // Same accessible token pairing as the top-level items, plus a weight bump so the
        // current page isn't indicated by color alone (WCAG 1.4.1) — sub-items have no rail.
        "aria-[current=page]:bg-utility-brand-50 aria-[current=page]:font-medium aria-[current=page]:text-utility-brand-700",
        FOCUS_RING,
    );
    const content = <span className="min-w-0 flex-1 truncate">{item.label}</span>;

    return (
        <li>
            {item.href ? (
                <a href={item.href} className={subItemClasses} aria-current={isActive ? "page" : undefined}>
                    {content}
                </a>
            ) : (
                <button type="button" onClick={item.onClick} className={subItemClasses} aria-current={isActive ? "page" : undefined}>
                    {content}
                </button>
            )}
        </li>
    );
}

function hasActiveDescendant(item: SidebarItemData, activeId?: string): boolean {
    if (!activeId || !item.children) return false;
    return item.children.some((child) => child.id === activeId || hasActiveDescendant(child, activeId));
}

/**
 * Sidebar — plain semantic `<nav>`/`<ul>`, no behavior library needed. Nested items use
 * `<details>`/`<summary>` for native keyboard/expanded-state support for free. This is a
 * distinct component from the `app-navigation` sidebar family — it ships the nested-disclosure,
 * `SidebarItemData`-driven nav pattern from the original design as-is.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar({ items, activeId, header, footer, className, style, ...rest }, ref) {
    return (
        <nav ref={ref} className={cx("box-border flex w-[13.5625rem] flex-col gap-[1.3125rem] rounded-xl bg-secondary p-4", className)} style={style} {...rest}>
            {header ? <div>{header}</div> : null}
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {items.map((item) => (
                    <SidebarItem key={item.id} item={item} activeId={activeId} depth={0} />
                ))}
            </ul>
            {footer ? <div className="mt-auto">{footer}</div> : null}
        </nav>
    );
});
