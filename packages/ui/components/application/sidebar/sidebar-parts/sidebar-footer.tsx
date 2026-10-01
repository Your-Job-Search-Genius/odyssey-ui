"use client";

import { Fragment, type ReactNode } from "react";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { ChevronDown, ChevronSelectorVertical, Globe01 } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import {
    FADE,
    FOCUS_RING,
    ROW_TEXT,
    type SidebarAccount,
    type SidebarFooterItem,
    type SidebarLanguage,
    SidebarMark,
    type SidebarMenuItem,
    getInitials,
    groupMenuItems,
    useSidebar,
} from "./sidebar-shared";

/** Collapsed, the extra inline padding lines footer icons up with the nav icons on the rail. */
const rowStyles = (isCollapsed: boolean) =>
    cx(
        "flex w-full cursor-pointer items-center gap-1.25 overflow-hidden rounded-lg py-1.25 text-left text-tertiary transition-[padding,background-color] duration-200 ease-in-out hover:bg-quaternary motion-reduce:transition-none",
        isCollapsed ? "px-2.5" : "px-1",
        FOCUS_RING,
    );

/** Menu popover shared by footer rows and the account row; opens to the right of the sidebar. */
const SidebarMenu = ({ items, header, className }: { items: SidebarMenuItem[]; header?: ReactNode; className?: string }) => {
    const groups = groupMenuItems(items);
    const isFlat = groups.length === 1 && !groups[0].section && !groups[0].isChoice;

    return (
        <Dropdown.Popover placement="right bottom" offset={12} className={cx("w-50 rounded-[11px]", className)}>
            {header}
            <Dropdown.Menu onAction={(key) => items.find((item) => item.id === key)?.onAction?.()}>
                {isFlat
                    ? items.map((item) => <Dropdown.Item key={item.id} id={item.id} label={item.label} icon={item.icon} href={item.href} />)
                    : groups.map((group, index) => (
                          <Fragment key={group.items[0].id}>
                              {index > 0 && <Dropdown.Separator />}
                              <Dropdown.Section
                                  aria-label={group.section}
                                  selectionMode={group.isChoice ? "single" : undefined}
                                  selectedKeys={group.isChoice ? group.items.filter((item) => item.isSelected).map((item) => item.id) : undefined}
                              >
                                  {group.section && (
                                      <Dropdown.SectionHeader className="px-4 pt-1.5 pb-1 text-xs font-semibold text-quaternary">
                                          {group.section}
                                      </Dropdown.SectionHeader>
                                  )}
                                  {group.items.map((item) => (
                                      // An icon would replace the check, so choice items show the check only.
                                      <Dropdown.Item
                                          key={item.id}
                                          id={item.id}
                                          label={item.label}
                                          icon={group.isChoice ? undefined : item.icon}
                                          href={item.href}
                                      />
                                  ))}
                              </Dropdown.Section>
                          </Fragment>
                      ))}
            </Dropdown.Menu>
        </Dropdown.Popover>
    );
};

const RowInner = ({ item }: { item: Pick<SidebarFooterItem, "icon" | "label"> }) => {
    const { isCollapsed } = useSidebar();
    const Icon = item.icon;

    return (
        <>
            <span aria-hidden="true" className="h-5.5 w-0.5 shrink-0" />
            <Icon aria-hidden="true" className="size-4.5 shrink-0 text-fg-tertiary" />
            <span className={cx(ROW_TEXT, FADE, isCollapsed && "opacity-0")}>{item.label}</span>
        </>
    );
};

const FooterRow = ({ item }: { item: SidebarFooterItem }) => {
    const { isCollapsed } = useSidebar();
    const className = rowStyles(isCollapsed);

    if (item.menu?.length) {
        return (
            <Dropdown.Root>
                <Tooltip title={item.label} placement="right" isDisabled={!isCollapsed}>
                    <AriaButton className={className}>
                        <RowInner item={item} />
                    </AriaButton>
                </Tooltip>
                <SidebarMenu items={item.menu} />
            </Dropdown.Root>
        );
    }

    return (
        <Tooltip title={item.label} placement="right" isDisabled={!isCollapsed}>
            {item.href ? (
                <AriaLink href={item.href} className={className}>
                    <RowInner item={item} />
                </AriaLink>
            ) : (
                <AriaButton onPress={item.onAction} className={className}>
                    <RowInner item={item} />
                </AriaButton>
            )}
        </Tooltip>
    );
};

/** Flag + short code pill that opens the language menu. Collapsed (or `compact`), it shows the flag alone. */
export const LanguagePill = ({ language, compact }: { language: SidebarLanguage; compact?: boolean }) => {
    const selected = language.options.find((option) => option.id === language.value) ?? language.options[0];
    const shortLabel = selected?.shortLabel ?? selected?.id.toUpperCase();
    const flag = selected?.flag ? (
        <img src={selected.flag} alt="" className="size-5 shrink-0 rounded-full object-cover" />
    ) : (
        <Globe01 aria-hidden="true" className="size-5 shrink-0 text-fg-tertiary" />
    );

    return (
        <Dropdown.Root>
            <AriaButton
                aria-label={`${language.label ?? "Language"}: ${selected?.label ?? ""}`}
                className={cx(
                    "flex shrink-0 cursor-pointer items-center rounded-full transition duration-100 ease-linear hover:bg-quaternary",
                    compact ? "size-6.5 justify-center p-0.5" : "gap-1 border border-secondary px-0.75 py-0.5",
                    FOCUS_RING,
                )}
            >
                {flag}
                {!compact && (
                    <>
                        <span className="text-sm leading-4 font-medium text-primary">{shortLabel}</span>
                        <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 text-fg-primary" />
                    </>
                )}
            </AriaButton>
            <Dropdown.Popover placement="right bottom" offset={12} className="w-45 rounded-[11px]">
                <Dropdown.Menu
                    aria-label={language.label ?? "Language"}
                    selectionMode="single"
                    disallowEmptySelection
                    selectedKeys={[language.value]}
                    onAction={(key) => language.onChange(String(key))}
                >
                    {language.options.map((option) => (
                        <Dropdown.Item key={option.id} id={option.id} label={option.label} avatarUrl={option.flag} selectionIndicator="radio" />
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
};

const AccountRow = ({ account }: { account: SidebarAccount }) => {
    const { isCollapsed } = useSidebar();
    const initials = account.initials ?? getInitials(account.name);

    const trigger = (
        <AriaButton
            aria-label={`Account menu for ${account.name}`}
            className={cx(
                "flex w-full cursor-pointer items-center justify-between gap-1 overflow-hidden rounded-lg py-0.5 text-left transition-[padding,background-color] duration-200 ease-in-out hover:bg-quaternary motion-reduce:transition-none",
                isCollapsed ? "px-3" : "px-2",
                FOCUS_RING,
            )}
        >
            <span className="flex min-w-0 items-center gap-1">
                <SidebarMark image={account.avatarUrl} initials={initials} />
                <span className={cx(ROW_TEXT, "text-primary", FADE, isCollapsed && "opacity-0")}>{account.name}</span>
            </span>
            <ChevronSelectorVertical aria-hidden="true" className={cx("size-4.5 shrink-0 text-fg-secondary", FADE, isCollapsed && "opacity-0")} />
        </AriaButton>
    );

    if (!account.menuItems?.length) return trigger;

    return (
        <Dropdown.Root>
            {trigger}
            <SidebarMenu
                items={account.menuItems}
                className="w-62 rounded-[14px] px-1"
                header={
                    <>
                        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                            <SidebarMark image={account.avatarUrl} initials={initials} className="size-8" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-primary">{account.name}</p>
                                {account.email && <p className="truncate text-xs font-medium text-tertiary">{account.email}</p>}
                            </div>
                        </div>
                        <div role="separator" className="my-1 h-px w-full bg-border-secondary" />
                    </>
                }
            />
        </Dropdown.Root>
    );
};

interface SidebarFooterProps {
    items?: SidebarFooterItem[];
    language?: SidebarLanguage;
    account?: SidebarAccount;
}

export const SidebarFooter = ({ items, language, account }: SidebarFooterProps) => {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex w-full flex-col gap-3">
            {(language || !!items?.length) && (
                <ul className="flex flex-col gap-1">
                    {language && (
                        <li className={cx("flex items-center gap-1.25 px-1 py-1.25 text-tertiary", isCollapsed && "justify-center")}>
                            {!isCollapsed && (
                                <>
                                    <span aria-hidden="true" className="h-5.5 w-0.5 shrink-0" />
                                    <Globe01 aria-hidden="true" className="size-4.5 shrink-0 text-fg-tertiary" />
                                    <span className={ROW_TEXT}>{language.label ?? "Language"}</span>
                                </>
                            )}
                            <LanguagePill language={language} compact={isCollapsed} />
                        </li>
                    )}
                    {items?.map((item) => (
                        <li key={item.label}>
                            <FooterRow item={item} />
                        </li>
                    ))}
                </ul>
            )}

            {account && (
                <>
                    <hr className="w-full border-t border-secondary dark:border-primary" />
                    <AccountRow account={account} />
                </>
            )}
        </div>
    );
};
