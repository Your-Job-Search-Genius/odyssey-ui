"use client";

import type { FC, Key, ReactNode } from "react";
import { Breadcrumb as AriaBreadcrumb, Breadcrumbs as AriaBreadcrumbs, Button as AriaButton, Link as AriaLink } from "react-aria-components";
import type { BreadcrumbsProps as AriaBreadcrumbsProps } from "react-aria-components";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { ChevronRight, DotsHorizontal } from "@/components/foundations/icons";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

const styles = sortCx({
    root: "flex w-full list-none items-center",
    sizes: {
        sm: "gap-0.5 text-sm",
        md: "gap-1 text-md",
    },
});

export interface BreadcrumbItemData {
    /** Unique id for the item. Required when the trail is built via the `items` prop. */
    id: string;
    /** Label rendered for the item. */
    label: ReactNode;
    /** Destination for the item. Omit for the current page (rendered as non-interactive text). */
    href?: string;
    /** Icon rendered before the label — pass a "home" icon on the first item for a root icon slot. */
    icon?: FC<{ className?: string }>;
    /** Truncates a long label (with an ellipsis) and shows the full text in a tooltip on hover/focus. */
    isTruncated?: boolean;
}

interface BreadcrumbLabelProps {
    icon?: FC<{ className?: string }>;
    label: ReactNode;
    isTruncated?: boolean;
}

const BreadcrumbLabel = ({ icon: Icon, label, isTruncated }: BreadcrumbLabelProps) => (
    <span className="flex min-w-0 items-center gap-1.5">
        {isReactComponent(Icon) && <Icon aria-hidden="true" data-icon className="size-4 shrink-0 text-fg-quaternary" />}
        <span className={cx(isTruncated && "max-w-32 truncate sm:max-w-48")}>{label}</span>
    </span>
);

const linkClassName =
    "min-w-0 rounded-sm text-tertiary outline-focus-ring transition duration-100 ease-linear hover:text-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2";

export interface BreadcrumbItemProps extends Omit<BreadcrumbItemData, "id"> {
    className?: string;
}

/**
 * A single crumb in a `Breadcrumbs` trail. The last item in the trail is automatically detected
 * by React Aria (it has no following sibling) and rendered as non-interactive text with
 * `aria-current="page"`, regardless of whether `href` was passed.
 */
export const BreadcrumbItem = ({ href, label, icon, isTruncated, className }: BreadcrumbItemProps) => {
    return (
        <AriaBreadcrumb className={cx("flex min-w-0 items-center gap-1", className)}>
            {({ isCurrent }) => {
                const content = <BreadcrumbLabel icon={icon} label={label} isTruncated={isTruncated} />;

                return (
                    <>
                        {isCurrent ? (
                            <span
                                aria-current="page"
                                tabIndex={isTruncated ? 0 : undefined}
                                className={cx(
                                    "min-w-0 rounded-sm font-semibold text-primary",
                                    isTruncated && "outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                )}
                            >
                                {content}
                            </span>
                        ) : (
                            <AriaLink href={href} className={linkClassName}>
                                {content}
                            </AriaLink>
                        )}

                        {!isCurrent && <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-fg-quaternary rtl:rotate-180" />}
                    </>
                );
            }}
        </AriaBreadcrumb>
    );
};

interface BreadcrumbEllipsisProps {
    hiddenItems: BreadcrumbItemData[];
}

/** Overflow menu standing in for the collapsed middle items when a trail exceeds `maxItems`. */
const BreadcrumbEllipsis = ({ hiddenItems }: BreadcrumbEllipsisProps) => (
    <AriaBreadcrumb className="flex items-center gap-1">
        <Dropdown.Root>
            <AriaButton
                aria-label={`Show ${hiddenItems.length} hidden breadcrumb${hiddenItems.length === 1 ? "" : "s"}`}
                className={({ isPressed, isFocusVisible, isHovered }) =>
                    cx(
                        "flex cursor-pointer items-center justify-center rounded-md p-1 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear",
                        isHovered && "bg-primary_hover text-fg-quaternary_hover",
                        (isPressed || isFocusVisible) && "outline-2 outline-offset-2",
                    )
                }
            >
                <DotsHorizontal className="size-4" />
            </AriaButton>
            <Dropdown.Popover placement="bottom left" className="w-56">
                <Dropdown.Menu items={hiddenItems} className="flex flex-col gap-1 px-1.5 py-1.5">
                    {(item) => (
                        <Dropdown.Item
                            id={item.id}
                            href={item.href}
                            label={typeof item.label === "string" ? item.label : undefined}
                            icon={item.icon}
                            textValue={typeof item.label === "string" ? item.label : String(item.id)}
                        >
                            {item.label}
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-fg-quaternary rtl:rotate-180" />
    </AriaBreadcrumb>
);

interface BreadcrumbsSizeProps {
    /** @default "sm" */
    size?: keyof typeof styles.sizes;
    /** Accessible label for the `<nav>` landmark wrapping the trail. @default "Breadcrumb" */
    "aria-label"?: string;
    className?: string;
}

interface BreadcrumbsWithItemsProps
    extends BreadcrumbsSizeProps, Omit<AriaBreadcrumbsProps<BreadcrumbItemData>, "children" | "items" | "className" | "aria-label"> {
    /** Data-driven trail. Renders each item via `Breadcrumbs.Item` and enables `maxItems` collapsing. */
    items: BreadcrumbItemData[];
    /**
     * Once the trail has more than this many items, the middle items collapse into an overflow
     * "…" menu. Omit to always render every item (may wrap or overflow on narrow viewports).
     */
    maxItems?: number;
    /** How many leading items stay visible when collapsed. @default 1 */
    itemsBeforeCollapse?: number;
    /** How many trailing items stay visible when collapsed. @default 1 */
    itemsAfterCollapse?: number;
    children?: never;
}

interface BreadcrumbsWithChildrenProps extends BreadcrumbsSizeProps, Omit<AriaBreadcrumbsProps<object>, "children" | "items" | "className" | "aria-label"> {
    items?: undefined;
    /** Compose the trail manually with `Breadcrumbs.Item` children when you need full control. */
    children: ReactNode;
}

export type BreadcrumbsProps = BreadcrumbsWithItemsProps | BreadcrumbsWithChildrenProps;

const BreadcrumbsRoot = ({ size = "sm", className, "aria-label": ariaLabel = "Breadcrumb", ...props }: BreadcrumbsProps) => {
    const sizeClassName = cx(styles.root, styles.sizes[size], className);

    if (!props.items) {
        const { children, ...rest } = props as BreadcrumbsWithChildrenProps;
        return (
            <nav aria-label={ariaLabel}>
                <AriaBreadcrumbs {...rest} className={sizeClassName}>
                    {children}
                </AriaBreadcrumbs>
            </nav>
        );
    }

    const { items, maxItems, itemsBeforeCollapse = 1, itemsAfterCollapse = 1, ...rest } = props;

    // Render nothing for an empty trail rather than an empty, focusable `<nav>` landmark.
    if (items.length === 0) return null;

    const shouldCollapse = typeof maxItems === "number" && items.length > maxItems && items.length > itemsBeforeCollapse + itemsAfterCollapse;

    if (!shouldCollapse) {
        return (
            <nav aria-label={ariaLabel}>
                <AriaBreadcrumbs {...rest} className={sizeClassName}>
                    {items.map((item) => (
                        <BreadcrumbItem key={item.id} {...item} />
                    ))}
                </AriaBreadcrumbs>
            </nav>
        );
    }

    const before = items.slice(0, itemsBeforeCollapse);
    const hidden = items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse);
    const after = items.slice(items.length - itemsAfterCollapse);

    return (
        <nav aria-label={ariaLabel}>
            <AriaBreadcrumbs {...rest} className={sizeClassName}>
                {before.map((item) => (
                    <BreadcrumbItem key={item.id} {...item} />
                ))}
                <BreadcrumbEllipsis key="ellipsis" hiddenItems={hidden} />
                {after.map((item) => (
                    <BreadcrumbItem key={item.id} {...item} />
                ))}
            </AriaBreadcrumbs>
        </nav>
    );
};

export const Breadcrumbs = BreadcrumbsRoot as typeof BreadcrumbsRoot & {
    Item: typeof BreadcrumbItem;
};
Breadcrumbs.Item = BreadcrumbItem;

export type { Key };
