"use client";

import { type FC, Fragment, type ReactNode } from "react";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { BottomSheet } from "@/components/application/bottom-sheet/bottom-sheet";
import { Check, DotsHorizontal, Globe01 } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import { LanguagePill } from "./sidebar-footer";
import {
    type SidebarAccount,
    type SidebarBrand,
    type SidebarFooterItem,
    type SidebarLanguage,
    SidebarMark,
    type SidebarNavItem,
    getInitials,
    getItemHref,
    groupMenuItems,
    isBranchActive,
    useSidebar,
} from "./sidebar-shared";

const tabStyles = (isActive: boolean) =>
    cx(
        "flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg text-xs leading-3 font-medium outline-focus-ring focus-visible:outline-2 focus-visible:-outline-offset-2",
        isActive ? "text-utility-brand-600" : "text-primary",
    );

interface SheetRowProps {
    icon?: FC<{ className?: string }>;
    label: string;
    href?: string;
    onPress?: () => void;
    isUtility?: boolean;
    isActive?: boolean;
    /** Marks a choice row (e.g. the current theme): shows a check and is announced as pressed. */
    isChecked?: boolean;
    children?: ReactNode;
}

/** A row inside the More sheet. Utility rows (language, help) are tighter and lower-contrast, like the client app. */
const SheetRow = ({ icon: Icon, label, href, onPress, isUtility, isActive, isChecked, children }: SheetRowProps) => {
    const className = cx(
        "flex w-full items-center gap-3 px-4 text-left text-sm font-semibold outline-focus-ring focus-visible:outline-2 focus-visible:-outline-offset-2",
        isUtility ? "py-1 text-tertiary" : "py-3",
        !isUtility && (isActive ? "text-utility-brand-600" : "text-secondary"),
        (href || onPress) && "cursor-pointer",
    );
    const content = (
        <>
            {Icon ? (
                <Icon aria-hidden="true" className={cx("size-6 shrink-0", isUtility ? "text-fg-quaternary" : "text-current")} />
            ) : (
                <span aria-hidden="true" className="size-6 shrink-0" />
            )}
            <span className="truncate">{label}</span>
            {children}
            {isChecked && <Check aria-hidden="true" className="ml-auto size-5 shrink-0 text-fg-brand-primary" />}
        </>
    );

    if (href)
        return (
            <AriaLink href={href} onPress={onPress} aria-current={isActive ? "page" : undefined} className={className}>
                {content}
            </AriaLink>
        );
    if (onPress)
        return (
            <AriaButton onPress={onPress} aria-pressed={isChecked} className={className}>
                {content}
            </AriaButton>
        );
    return <div className={className}>{content}</div>;
};

interface SidebarMobileNavProps {
    items: SidebarNavItem[];
    primaryCount: number;
    isHidden: boolean;
    brand: SidebarBrand;
    footerItems?: SidebarFooterItem[];
    language?: SidebarLanguage;
    account?: SidebarAccount;
    moreLabel: string;
}

/**
 * Mobile navigation (below `md`): a fixed bottom tab bar with the first `primaryCount` destinations plus a
 * "More" tab that opens a bottom sheet with the remaining destinations, account links, language and help.
 */
export const SidebarMobileNav = ({ items, primaryCount, isHidden, brand, footerItems, language, account, moreLabel }: SidebarMobileNavProps) => {
    const { activeKey } = useSidebar();
    const overflowStart = Math.min(primaryCount, items.length);
    const overflow = items.slice(overflowStart);
    const isOverflowActive = overflow.some((_, offset) => isBranchActive(activeKey, overflowStart + offset));

    return (
        <nav
            aria-label="Main"
            className={cx(
                "fixed inset-x-0 bottom-0 z-20 flex h-[calc(4rem+env(safe-area-inset-bottom))] bg-secondary px-2 pb-[env(safe-area-inset-bottom)] transition-transform duration-250 ease-[ease] motion-reduce:transition-none md:hidden",
                isHidden && "translate-y-full",
            )}
        >
            {items.slice(0, overflowStart).map((item, index) => {
                const isActive = isBranchActive(activeKey, index);
                const Icon = item.icon;
                return (
                    <AriaLink key={item.label} href={getItemHref(item)} aria-current={isActive ? "page" : undefined} className={tabStyles(isActive)}>
                        <Icon aria-hidden="true" className="size-6 shrink-0" />
                        <span className="max-w-full truncate">{item.label}</span>
                    </AriaLink>
                );
            })}

            {overflowStart < items.length || footerItems?.length || language || account ? (
                <BottomSheet.Trigger>
                    <AriaButton className={tabStyles(isOverflowActive)}>
                        <DotsHorizontal aria-hidden="true" className="size-6 shrink-0" />
                        <span>{moreLabel}</span>
                    </AriaButton>
                    <BottomSheet size="sm" isDismissable>
                        {({ close }) => (
                            <BottomSheet.Content role="none" className="gap-0 px-0 md:px-0">
                                <div className="mx-4 flex items-center gap-2 border-b border-secondary pb-3">
                                    <SidebarMark image={brand.logo} initials={getInitials(brand.name)} />
                                    <span className="truncate text-sm font-medium text-primary">{brand.name}</span>
                                </div>

                                <ul>
                                    {overflow.map((item, offset) => {
                                        const index = overflowStart + offset;
                                        return (
                                            <li key={item.label}>
                                                <SheetRow
                                                    icon={item.icon}
                                                    label={item.label}
                                                    href={getItemHref(item)}
                                                    onPress={close}
                                                    isActive={isBranchActive(activeKey, index)}
                                                />
                                                {item.items && item.items.length > 1 && (
                                                    <ul>
                                                        {item.items.map((child, childIndex) => (
                                                            <li key={child.href + child.label}>
                                                                <SheetRow
                                                                    label={child.label}
                                                                    href={child.href}
                                                                    onPress={close}
                                                                    isActive={activeKey === `${index}.${childIndex}`}
                                                                />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                    {account?.menuItems &&
                                        groupMenuItems(account.menuItems).map((group) => (
                                            <Fragment key={group.items[0].id}>
                                                {group.section && (
                                                    <li role="presentation" className="px-4 pt-2 text-xs font-semibold text-quaternary">
                                                        {group.section}
                                                    </li>
                                                )}
                                                {group.items.map((menuItem) => (
                                                    <li key={menuItem.id}>
                                                        <SheetRow
                                                            icon={group.isChoice ? undefined : menuItem.icon}
                                                            label={menuItem.label}
                                                            href={menuItem.href}
                                                            isChecked={group.isChoice ? !!menuItem.isSelected : undefined}
                                                            onPress={() => {
                                                                close();
                                                                menuItem.onAction?.();
                                                            }}
                                                        />
                                                    </li>
                                                ))}
                                            </Fragment>
                                        ))}
                                </ul>

                                <ul className="mt-4 flex flex-col gap-4">
                                    {language && (
                                        <li>
                                            <SheetRow isUtility icon={Globe01} label={language.label ?? "Language"}>
                                                <LanguagePill language={language} />
                                            </SheetRow>
                                        </li>
                                    )}
                                    {footerItems?.flatMap((item) =>
                                        (item.menu?.length ? item.menu : [{ id: item.label, ...item }]).map((entry) => (
                                            <li key={entry.id}>
                                                <SheetRow
                                                    isUtility
                                                    icon={entry.icon ?? item.icon}
                                                    label={entry.label}
                                                    href={entry.href}
                                                    onPress={() => {
                                                        close();
                                                        entry.onAction?.();
                                                    }}
                                                />
                                            </li>
                                        )),
                                    )}
                                </ul>
                            </BottomSheet.Content>
                        )}
                    </BottomSheet>
                </BottomSheet.Trigger>
            ) : null}
        </nav>
    );
};
