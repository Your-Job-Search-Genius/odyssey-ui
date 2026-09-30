"use client";

import type { FC, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Link as AriaLink } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { ChevronDown, Share04 } from "@/components/foundations/icons";
import { cx, sortCx } from "@/utils/cx";
import { FOCUS_RING, NavRail } from "./nav-rail";

const styles = sortCx({
    root: cx(
        "group relative box-border flex min-h-9 w-full cursor-pointer items-center gap-[0.3125rem] rounded-[0.4375rem] border-0 bg-transparent py-1.5 pr-2.5 pl-[0.3125rem] text-left text-sm text-primary no-underline transition duration-100 ease-linear select-none hover:text-utility-brand-700 focus-visible:z-10",
        FOCUS_RING,
    ),
    rootCurrent: "bg-utility-brand-50 text-utility-brand-700",
});

interface NavItemBaseProps {
    /** Whether the nav item shows only an icon. */
    iconOnly?: boolean;
    /** Whether the collapsible nav item is open. */
    open?: boolean;
    /** URL to navigate to when the nav item is clicked. */
    href?: string;
    /** Type of the nav item. */
    type: "link" | "collapsible" | "collapsible-child";
    /** Icon component to display. */
    icon?: FC<HTMLAttributes<HTMLOrSVGElement>>;
    /** Badge to display. */
    badge?: ReactNode;
    /** Whether the nav item is currently active. */
    current?: boolean;
    /** Whether to truncate the label text. */
    truncate?: boolean;
    /** Handler for click events. */
    onClick?: MouseEventHandler;
    /** Content to display. */
    children?: ReactNode;
}

export const NavItemBase = ({ current, type, badge, href, icon: Icon, children, truncate = true, onClick }: NavItemBaseProps) => {
    const iconElement = Icon && (
        <Icon
            aria-hidden="true"
            className={cx("size-5 shrink-0 text-fg-quaternary transition-inherit-all group-hover:text-utility-brand-700", current && "text-utility-brand-700")}
        />
    );

    const badgeElement =
        badge && (typeof badge === "string" || typeof badge === "number") ? (
            <Badge color="gray" type="pill-color" size="sm">
                {badge}
            </Badge>
        ) : (
            badge
        );

    const labelElement = <span className={cx("flex-1 text-sm font-semibold transition-inherit-all", truncate && "truncate")}>{children}</span>;

    const isExternal = href && href.startsWith("http");
    const externalIcon = isExternal && <Share04 className="size-4 stroke-[2.5px] text-fg-quaternary" />;

    if (type === "collapsible") {
        return (
            <summary className={cx(styles.root, current && styles.rootCurrent, "list-none [&::-webkit-details-marker]:hidden")} onClick={onClick}>
                <NavRail />

                {iconElement}

                {labelElement}

                {badgeElement}

                <ChevronDown
                    aria-hidden="true"
                    size={18}
                    className="shrink-0 text-current transition-transform duration-150 ease-in-out in-open:rotate-180 motion-reduce:transition-none"
                />
            </summary>
        );
    }

    if (type === "collapsible-child") {
        return (
            <AriaLink
                href={href!}
                target={isExternal ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={cx(styles.root, current && styles.rootCurrent, "rounded px-1 py-0.5")}
                onClick={onClick}
                aria-current={current ? "page" : undefined}
            >
                {labelElement}
                {externalIcon}
                {badgeElement}
            </AriaLink>
        );
    }

    return (
        <AriaLink
            href={href!}
            target={isExternal ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className={cx(styles.root, current && styles.rootCurrent)}
            onClick={onClick}
            aria-current={current ? "page" : undefined}
        >
            <NavRail active={current} />
            {iconElement}
            {labelElement}
            {externalIcon}
            {badgeElement}
        </AriaLink>
    );
};
