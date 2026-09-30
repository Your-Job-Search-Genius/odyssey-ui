"use client";

import { type ReactNode, useId, useMemo, useRef, useState } from "react";
import type { Key } from "react-aria-components";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { LayoutLeft } from "@/components/foundations/icons";
import { useControllableState } from "@/hooks/use-controllable-state";
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
import { cx } from "@/utils/cx";
import { SidebarFooter } from "./sidebar-parts/sidebar-footer";
import { SidebarMobileNav } from "./sidebar-parts/sidebar-mobile";
import { SidebarNav } from "./sidebar-parts/sidebar-nav";
import {
    FADE,
    FOCUS_RING,
    type SidebarAccount,
    type SidebarBrand,
    SidebarContext,
    type SidebarFooterItem,
    type SidebarLanguage,
    SidebarMark,
    type SidebarNavItem,
    getInitials,
    resolveActiveKey,
} from "./sidebar-parts/sidebar-shared";

export type {
    SidebarAccount,
    SidebarBrand,
    SidebarFooterItem,
    SidebarLanguage,
    SidebarLanguageOption,
    SidebarMenuItem,
    SidebarNavChild,
    SidebarNavItem,
} from "./sidebar-parts/sidebar-shared";

export interface SidebarLayoutProps {
    /** Product name and logo shown at the top of the sidebar and the mobile More sheet. */
    brand: SidebarBrand;
    /** Primary destinations. Items with `items` render as expandable groups. The first `mobilePrimaryCount` become bottom tabs on mobile. */
    items: SidebarNavItem[];
    /** The current URL (path + optional query), used to highlight the best-matching destination. */
    activeUrl?: string;
    /** Secondary rows above the account row (e.g. "Help and shortcuts"). */
    footerItems?: SidebarFooterItem[];
    /** Optional language switcher shown at the top of the footer. */
    language?: SidebarLanguage;
    /** Signed-in user shown at the bottom of the sidebar, with an optional menu. */
    account?: SidebarAccount;
    /** Whether the desktop sidebar is collapsed to icons (controlled). */
    isCollapsed?: boolean;
    /** Initial collapsed state (uncontrolled). @default false */
    defaultCollapsed?: boolean;
    /** Called when the user collapses or expands the sidebar. */
    onCollapsedChange?: (isCollapsed: boolean) => void;
    /** How many destinations get their own tab in the mobile bottom bar; the rest go in the More sheet. @default 4 */
    mobilePrimaryCount?: number;
    /** Label of the mobile More tab. @default "More" */
    moreLabel?: string;
    /** Page content, rendered inside the scrollable main card. */
    children?: ReactNode;
    /** Classes for the root element (defaults to a full-viewport `h-dvh` shell). */
    className?: string;
    /** Classes for the `<main>` content card, e.g. `p-0` for full-bleed pages. The card is a CSS container, so page content can use `@md:`/`@3xl:` container-query variants to respond to the space the sidebar leaves. */
    contentClassName?: string;
}

/**
 * The application shell: a collapsible sidebar on a gray card beside a scrollable, rounded content card
 * on desktop (`md` and up); a bottom tab bar with a More sheet on mobile. The only sidebar navigation
 * component in the library -- compose pages inside it rather than building navigation by hand.
 */
export const SidebarLayout = ({
    brand,
    items,
    activeUrl,
    footerItems,
    language,
    account,
    isCollapsed: isCollapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    mobilePrimaryCount = 4,
    moreLabel = "More",
    children,
    className,
    contentClassName,
}: SidebarLayoutProps) => {
    const asideId = useId();
    const mainRef = useRef<HTMLElement>(null);
    const isBottomNavHidden = useHideOnScroll(mainRef);

    const [isCollapsed, setIsCollapsed] = useControllableState({ value: isCollapsedProp, defaultValue: defaultCollapsed, onChange: onCollapsedChange });
    const activeKey = useMemo(() => resolveActiveKey(items, activeUrl), [items, activeUrl]);
    const activeGroupKey = activeKey?.includes(".") ? activeKey.split(".")[0] : undefined;

    // Open the group holding the active page, including after client-side navigation into a different group.
    const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(() => new Set(activeGroupKey ? [activeGroupKey] : []));
    const [lastActiveGroupKey, setLastActiveGroupKey] = useState(activeGroupKey);
    if (activeGroupKey !== lastActiveGroupKey) {
        setLastActiveGroupKey(activeGroupKey);
        if (activeGroupKey) setExpandedKeys(new Set([...expandedKeys, activeGroupKey]));
    }

    const context = useMemo(() => ({ isCollapsed, setIsCollapsed, activeKey }), [isCollapsed, setIsCollapsed, activeKey]);
    const toggleLabel = isCollapsed ? "Expand sidebar" : "Collapse sidebar";

    return (
        <SidebarContext.Provider value={context}>
            <div className={cx("relative flex h-dvh w-full overflow-hidden bg-primary", className)}>
                <AriaLink
                    href="#main-content"
                    className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary shadow-lg outline-focus-ring focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:outline-2"
                >
                    Skip to main content
                </AriaLink>

                <aside
                    id={asideId}
                    aria-label="Sidebar"
                    className={cx(
                        "relative z-10 hidden h-full shrink-0 p-2 transition-[width,padding] duration-200 ease-in-out motion-reduce:transition-none md:flex",
                        isCollapsed ? "w-22.5 pr-2.5" : "w-58.25",
                    )}
                >
                    <div className="flex size-full flex-col gap-3 rounded-xl bg-tertiary px-2.5 py-4">
                        {/* Collapsed, the extra padding centres the logo over the nav icons on the rail. */}
                        <div
                            className={cx(
                                "relative flex items-center py-2 transition-[padding] duration-200 ease-in-out motion-reduce:transition-none",
                                isCollapsed ? "px-3" : "px-1.5",
                            )}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <SidebarMark image={brand.logo} initials={getInitials(brand.name)} />
                                <span className={cx("max-w-24.5 min-w-0 truncate text-sm font-medium text-primary", FADE, isCollapsed && "opacity-0")}>
                                    {brand.name}
                                </span>
                            </div>

                            <Tooltip title={toggleLabel} placement="right" isDisabled={!isCollapsed}>
                                <AriaButton
                                    aria-label={toggleLabel}
                                    aria-expanded={!isCollapsed}
                                    aria-controls={asideId}
                                    onPress={() => setIsCollapsed(!isCollapsed)}
                                    className={cx(
                                        // Expanded it sits flush at the end of the header row (right 0). Collapsed it slides onto the rail's right edge, level
                                        // with the logo: the header row ends 10px (the card's px-2.5) inside that edge, so right -18px
                                        // centres the 16px button exactly on it, clear of the content card.
                                        "absolute top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border bg-primary text-fg-primary transition-[right,width,height,border-color,box-shadow,background-color] duration-200 ease-in-out hover:bg-primary_hover motion-reduce:transition-none",
                                        isCollapsed ? "-right-4.5 size-4 border-secondary shadow-md" : "right-0 size-5.5 border-transparent",
                                        FOCUS_RING,
                                    )}
                                >
                                    <LayoutLeft aria-hidden="true" className={isCollapsed ? "size-3" : "size-5"} />
                                </AriaButton>
                            </Tooltip>
                        </div>

                        <nav
                            aria-label="Main"
                            className="min-h-0 flex-1 [scrollbar-width:thin] overflow-x-hidden overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-quaternary"
                        >
                            <SidebarNav items={items} expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys} />
                        </nav>

                        <SidebarFooter items={footerItems} language={language} account={account} />
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col md:py-2 md:pr-2.75">
                    <main
                        ref={mainRef}
                        id="main-content"
                        tabIndex={-1}
                        className={cx(
                            "@container h-full [scrollbar-width:none] overflow-y-auto bg-primary p-5 pb-20 outline-hidden md:rounded-[17px] md:border-[0.5px] md:border-secondary md:pb-5 md:shadow-xs [&::-webkit-scrollbar]:hidden",
                            contentClassName,
                        )}
                    >
                        {children}
                    </main>
                </div>

                <SidebarMobileNav
                    items={items}
                    primaryCount={mobilePrimaryCount}
                    isHidden={isBottomNavHidden}
                    brand={brand}
                    footerItems={footerItems}
                    language={language}
                    account={account}
                    moreLabel={moreLabel}
                />
            </div>
        </SidebarContext.Provider>
    );
};
