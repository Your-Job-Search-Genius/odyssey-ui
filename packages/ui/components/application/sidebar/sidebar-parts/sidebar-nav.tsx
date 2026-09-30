"use client";

import type { ReactNode } from "react";
import type { Key } from "react-aria-components";
import {
    Button as AriaButton,
    Disclosure as AriaDisclosure,
    DisclosureGroup as AriaDisclosureGroup,
    DisclosurePanel as AriaDisclosurePanel,
    Link as AriaLink,
} from "react-aria-components";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { ChevronDown } from "@/components/foundations/icons";
import { cx, sortCx } from "@/utils/cx";
import { FADE, FOCUS_RING, ROW_TEXT, type SidebarNavItem, isBranchActive, useSidebar } from "./sidebar-shared";

const styles = sortCx({
    row: {
        base: cx(
            "flex w-full cursor-pointer items-center justify-between gap-1 rounded-md px-1.25 py-1.5 text-left transition duration-100 ease-linear",
            FOCUS_RING,
        ),
        idle: "text-primary hover:bg-quaternary",
        active: "bg-utility-brand-50 text-utility-brand-600",
    },
    rail: "h-5.5 w-0.5 shrink-0 rounded-[5px]",
    icon: "size-4.5 shrink-0",
    child: {
        base: cx("ml-1 inline-block max-w-37 truncate rounded px-1 py-0.5 align-middle text-sm font-medium transition duration-100 ease-linear", FOCUS_RING),
        idle: "text-primary hover:bg-quaternary",
        active: "bg-utility-brand-50 text-utility-brand-600",
    },
    connector: "pointer-events-none absolute -top-[35%] -left-3.75 h-5.25 w-3.75 rounded-bl-lg border-b border-l",
});

interface RowContentProps {
    item: SidebarNavItem;
    isActive: boolean;
    trailing?: ReactNode;
}

/**
 * Rail + icon + label. The rail is always rendered (transparent when idle) so icons never shift. Label and
 * trailing content stay mounted and fade out while the sidebar width animates, so collapsing never jumps;
 * the faded label still names the row for assistive tech.
 */
const RowContent = ({ item, isActive, trailing }: RowContentProps) => {
    const { isCollapsed } = useSidebar();
    const Icon = item.icon;

    return (
        <>
            <span className="flex min-w-0 items-center gap-1">
                <span aria-hidden="true" className={cx(styles.rail, isActive && "bg-utility-brand-600")} />
                <span className="flex min-w-0 items-center gap-1.5">
                    <Icon aria-hidden="true" className={cx(styles.icon, isActive ? "text-utility-brand-600" : "text-fg-primary")} />
                    <span className={cx(ROW_TEXT, "max-w-31", FADE, isCollapsed && "opacity-0")}>{item.label}</span>
                </span>
            </span>
            {trailing && <span className={cx("flex shrink-0", FADE, isCollapsed && "opacity-0")}>{trailing}</span>}
        </>
    );
};

const NavLinkRow = ({ item, index }: { item: SidebarNavItem; index: number }) => {
    const { isCollapsed, activeKey } = useSidebar();
    const isActive = activeKey === `${index}`;

    return (
        <Tooltip title={item.label} placement="right" isDisabled={!isCollapsed}>
            <AriaLink
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cx(styles.row.base, isActive ? styles.row.active : styles.row.idle)}
            >
                <RowContent item={item} isActive={isActive} trailing={item.badge} />
            </AriaLink>
        </Tooltip>
    );
};

/**
 * An expandable group. While the sidebar is collapsed its panel is forced shut (see SidebarNav) and the
 * trigger shows the active style when the current page is inside the group -- the only cue left on the rail.
 */
const NavGroup = ({ item, index }: { item: SidebarNavItem; index: number }) => {
    const { isCollapsed, activeKey } = useSidebar();
    const isActive = isCollapsed && isBranchActive(activeKey, index);

    return (
        <AriaDisclosure id={String(index)} className="group/nav-group">
            <Tooltip title={item.label} placement="right" isDisabled={!isCollapsed}>
                <AriaButton slot="trigger" className={cx(styles.row.base, isActive ? styles.row.active : styles.row.idle)}>
                    <RowContent
                        item={item}
                        isActive={isActive}
                        trailing={
                            <ChevronDown
                                aria-hidden="true"
                                className="size-4 shrink-0 text-fg-primary transition-transform duration-200 ease-in-out group-data-expanded/nav-group:rotate-180 motion-reduce:transition-none"
                            />
                        }
                    />
                </AriaButton>
            </Tooltip>
            <AriaDisclosurePanel className="h-(--disclosure-panel-height) overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none">
                <ul className="flex flex-col gap-2 py-1.25">
                    {item.items?.map((child, childIndex) => {
                        const isActive = activeKey === `${index}.${childIndex}`;
                        return (
                            <li key={child.href + child.label} className="pl-8">
                                <span className="relative inline-block">
                                    <span
                                        aria-hidden="true"
                                        className={cx(styles.connector, isActive ? "border-utility-brand-600" : "border-secondary dark:border-primary")}
                                    />
                                    <AriaLink
                                        href={child.href}
                                        aria-current={isActive ? "page" : undefined}
                                        className={cx(styles.child.base, isActive ? styles.child.active : styles.child.idle)}
                                    >
                                        {child.label}
                                    </AriaLink>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </AriaDisclosurePanel>
        </AriaDisclosure>
    );
};

interface SidebarNavProps {
    items: SidebarNavItem[];
    expandedKeys: Set<Key>;
    onExpandedChange: (keys: Set<Key>) => void;
}

export const SidebarNav = ({ items, expandedKeys, onExpandedChange }: SidebarNavProps) => {
    const { isCollapsed, setIsCollapsed } = useSidebar();

    return (
        <AriaDisclosureGroup
            allowsMultipleExpanded
            // Groups fold shut while collapsed (animating with the width) and reopen as they were on expand.
            expandedKeys={isCollapsed ? new Set<Key>() : expandedKeys}
            onExpandedChange={(keys) => {
                if (!isCollapsed) return onExpandedChange(keys);
                // Pressing a group on the icon rail re-expands the sidebar with that group open.
                setIsCollapsed(false);
                onExpandedChange(new Set([...expandedKeys, ...keys]));
            }}
        >
            <ul className="flex flex-col gap-2 px-1.5">
                {items.map((item, index) => (
                    <li key={item.label}>{item.items?.length ? <NavGroup item={item} index={index} /> : <NavLinkRow item={item} index={index} />}</li>
                ))}
            </ul>
        </AriaDisclosureGroup>
    );
};
