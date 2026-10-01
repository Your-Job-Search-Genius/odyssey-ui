"use client";

import { type FC, type ReactNode, createContext, useContext } from "react";
import { cx } from "@/utils/cx";

type IconComponent = FC<{ className?: string }>;

export interface SidebarNavChild {
    /** Label text for the sub-item. */
    label: string;
    /** URL the sub-item links to. May include a query string (e.g. `/jobs?tab=tracker`) to tell sibling tabs apart. */
    href: string;
    /** Extra URLs that should also mark this item active (prefix match on the path, exact match on any query params). */
    matchHrefs?: string[];
}

export interface SidebarNavItem {
    /** Label text for the nav item. */
    label: string;
    /** Icon component shown before the label (and alone when the sidebar is collapsed). */
    icon: IconComponent;
    /** URL the item links to. For groups, this is where the mobile bottom bar links (defaults to the first child). */
    href?: string;
    /** Extra URLs that should also mark this item active. */
    matchHrefs?: string[];
    /** Optional badge rendered after the label (e.g. a count). */
    badge?: ReactNode;
    /** Sub-items. When present, the item renders as an expandable group. */
    items?: SidebarNavChild[];
}

export interface SidebarMenuItem {
    /** Unique key for the menu item. */
    id: string;
    /** Label text for the menu item. */
    label: string;
    /** Optional leading icon. */
    icon?: IconComponent;
    /** URL to navigate to. */
    href?: string;
    /** Called when the item is chosen. */
    onAction?: () => void;
    /**
     * Groups consecutive items under a labelled section (e.g. "Theme"). Sections are separated by a
     * divider; items without a section form an unlabelled group.
     */
    section?: string;
    /**
     * Marks this item as the current choice in its section. When any item in a section sets this
     * (true or false), the section becomes a single-choice group: items are announced as
     * `menuitemradio` with `aria-checked`, and the chosen one shows a check. Use it for settings such
     * as Light / Dark / System.
     */
    isSelected?: boolean;
}

/** Splits menu items into consecutive runs that share a `section`. */
export const groupMenuItems = (items: SidebarMenuItem[]) => {
    const groups: { section?: string; items: SidebarMenuItem[]; isChoice: boolean }[] = [];
    for (const item of items) {
        const last = groups.at(-1);
        if (last && last.section === item.section) last.items.push(item);
        else groups.push({ section: item.section, items: [item], isChoice: false });
    }
    for (const group of groups) group.isChoice = group.items.some((item) => item.isSelected !== undefined);
    return groups;
};

export interface SidebarFooterItem {
    /** Label text for the footer row. */
    label: string;
    /** Icon component shown before the label. */
    icon: IconComponent;
    /** URL to navigate to. */
    href?: string;
    /** Called when the row is pressed (ignored when `menu` is set). */
    onAction?: () => void;
    /** Menu items opened from this row (e.g. "Help" and "Accessibility shortcuts"). On mobile they are listed inline in the More sheet. */
    menu?: SidebarMenuItem[];
}

export interface SidebarLanguageOption {
    /** Unique key, e.g. `"en"`. */
    id: string;
    /** Full name shown in the menu, e.g. `"English"`. */
    label: string;
    /** Short code shown in the pill. Defaults to the uppercased `id`. */
    shortLabel?: string;
    /** Flag image URL. */
    flag?: string;
}

export interface SidebarLanguage {
    /** The selected language id. */
    value: string;
    /** The languages to choose from. */
    options: SidebarLanguageOption[];
    /** Called with the chosen language id. */
    onChange: (id: string) => void;
    /** Row label. @default "Language" */
    label?: string;
}

export interface SidebarAccount {
    /** Display name. */
    name: string;
    /** Secondary line shown in the account menu. */
    email?: string;
    /** Initials shown when there is no avatar. Derived from `name` when omitted. */
    initials?: string;
    /** Avatar image URL. */
    avatarUrl?: string;
    /** Items in the account menu (e.g. "Account settings", "Log out"). */
    menuItems?: SidebarMenuItem[];
}

export interface SidebarBrand {
    /** Product or company name. */
    name: string;
    /** Logo image URL or element. Falls back to the name's initials on a brand tile. */
    logo?: string | ReactNode;
}

/* -------------------------------------------------------------------------------------------------
 * Active-route resolution
 * -----------------------------------------------------------------------------------------------*/

const parseUrl = (url: string) => {
    const [path = "", query = ""] = url.split("#")[0].split("?");
    return { path: path.length > 1 ? path.replace(/\/$/, "") : path, params: new URLSearchParams(query) };
};

/**
 * Scores how well `href` matches `activeUrl`: -1 for no match, otherwise higher for more specific
 * matches (query params outweigh path length). Paths match exactly or as a prefix of a nested route;
 * every query param on `href` must be present on `activeUrl` with the same value.
 */
const scoreMatch = (href: string, activeUrl: string) => {
    const target = parseUrl(href);
    const active = parseUrl(activeUrl);
    const pathMatches = target.path === active.path || (target.path !== "/" && active.path.startsWith(target.path + "/"));
    if (!pathMatches) return -1;

    let paramCount = 0;
    for (const [key, value] of target.params) {
        if (active.params.get(key) !== value) return -1;
        paramCount++;
    }
    return paramCount * 10_000 + target.path.length;
};

/** Returns the key (`"2"` for a top-level item, `"2.1"` for a sub-item) of the single best-matching destination. */
export const resolveActiveKey = (items: SidebarNavItem[], activeUrl?: string) => {
    if (!activeUrl) return undefined;

    let best: { key: string; score: number } | undefined;
    const consider = (key: string, hrefs: (string | undefined)[]) => {
        for (const href of hrefs) {
            if (!href) continue;
            const score = scoreMatch(href, activeUrl);
            if (score >= 0 && (!best || score > best.score)) best = { key, score };
        }
    };

    items.forEach((item, index) => {
        if (item.items?.length) {
            item.items.forEach((child, childIndex) => consider(`${index}.${childIndex}`, [child.href, ...(child.matchHrefs ?? [])]));
            // A group's own href/matchHrefs only win when no child matches (e.g. a group landing page).
            consider(`${index}`, [...(item.matchHrefs ?? [])]);
        } else {
            consider(`${index}`, [item.href, ...(item.matchHrefs ?? [])]);
        }
    });

    return best?.key;
};

/** Whether the item at `index` (or one of its sub-items) holds the active destination. */
export const isBranchActive = (activeKey: string | undefined, index: number) =>
    activeKey !== undefined && (activeKey === `${index}` || activeKey.startsWith(`${index}.`));

/** The href a group's collapsed/mobile entry navigates to. */
export const getItemHref = (item: SidebarNavItem) => item.href ?? item.items?.[0]?.href;

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

interface SidebarContextValue {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    activeKey?: string;
}

export const SidebarContext = createContext<SidebarContextValue>({ isCollapsed: false, setIsCollapsed: () => {}, activeKey: undefined });

export const useSidebar = () => useContext(SidebarContext);

/* -------------------------------------------------------------------------------------------------
 * Shared styles and pieces
 * -----------------------------------------------------------------------------------------------*/

export const FOCUS_RING = "outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";

/** Label typography used by every sidebar row. */
export const ROW_TEXT = "min-w-0 truncate text-sm leading-4 font-medium";

/** Fades labels in and out while the sidebar width animates. */
export const FADE = "transition-opacity duration-200 ease-in-out motion-reduce:transition-none";

export const getInitials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

interface SidebarMarkProps {
    /** Image URL or element. */
    image?: string | ReactNode;
    /** Initials fallback. */
    initials: string;
    className?: string;
}

/** The 29x27 square tile used for the brand logo and the account avatar: an image, or initials on a brand tile. */
export const SidebarMark = ({ image, initials, className }: SidebarMarkProps) => {
    const base = "flex h-6.75 w-7.25 shrink-0 items-center justify-center overflow-hidden rounded-md";

    if (typeof image === "string") return <img src={image} alt="" className={cx(base, "object-cover", className)} />;
    if (image) return <span className={cx(base, className)}>{image}</span>;

    return (
        <span aria-hidden="true" className={cx(base, "bg-brand-solid text-sm font-medium text-white uppercase", className)}>
            {initials}
        </span>
    );
};
