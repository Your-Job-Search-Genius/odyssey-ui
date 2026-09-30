"use client";

import { cx } from "@/utils/cx";
import type { NavItemDividerType, NavItemType } from "../config";
import { NavItemBase } from "./nav-item";

interface NavListProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** Additional CSS classes to apply to the list. */
    className?: string;
    /** List of items to display. */
    items: (NavItemType | NavItemDividerType)[];
}

export const NavList = ({ activeUrl, items, className }: NavListProps) => {
    const activeItem = items.find((item) => item.href === activeUrl || item.items?.some((subItem) => subItem.href === activeUrl));

    return (
        <ul className={cx("flex flex-col gap-1 px-4 pt-5", className)}>
            {items.map((item, index) => {
                if (item.divider) {
                    return (
                        <li key={index} className="w-full px-0.5 py-1">
                            <hr className="h-px w-full border-none bg-border-secondary" />
                        </li>
                    );
                }

                if (item.items?.length) {
                    const isBranchActive = item.href === activeUrl || item.items.some((subItem) => subItem.href === activeUrl);

                    return (
                        <details key={item.label} open={activeItem?.href === item.href} className="appearance-none">
                            <NavItemBase href={item.href} badge={item.badge} icon={item.icon} type="collapsible">
                                {item.label}
                            </NavItemBase>

                            <div className="flex items-start gap-[0.3125rem] pl-[0.9375rem]">
                                <span
                                    aria-hidden="true"
                                    className={cx(
                                        "h-[1.3125rem] w-[0.9375rem] shrink-0 rounded-bl-lg border-b border-l border-secondary",
                                        isBranchActive && "border-brand-solid",
                                    )}
                                />
                                <ul className="m-0 flex w-fit max-w-full list-none flex-col gap-1 p-0 pt-[0.6875rem]">
                                    {item.items.map((childItem) => (
                                        <li key={childItem.label}>
                                            <NavItemBase
                                                href={childItem.href}
                                                badge={childItem.badge}
                                                type="collapsible-child"
                                                current={activeUrl === childItem.href}
                                            >
                                                {childItem.label}
                                            </NavItemBase>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </details>
                    );
                }

                return (
                    <li key={item.label}>
                        <NavItemBase type="link" badge={item.badge} icon={item.icon} href={item.href} current={activeUrl === item.href}>
                            {item.label}
                        </NavItemBase>
                    </li>
                );
            })}
        </ul>
    );
};
