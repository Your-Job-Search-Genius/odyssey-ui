"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { createContext, useContext } from "react";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    layouts: {
        stacked: { item: "flex min-w-0 flex-col gap-1", term: "", details: "" },
        inline: { item: "flex min-w-0 flex-col gap-1 sm:flex-row sm:gap-4", term: "sm:w-40 sm:shrink-0", details: "min-w-0 sm:flex-1" },
        // Used by variant="summary": key left, value right, on every screen size.
        summary: {
            item: "flex min-w-0 items-center justify-between gap-4",
            term: "text-[13px] leading-5 tracking-[0.13px] uppercase",
            details: "text-right leading-5 font-semibold tracking-[0.14px]",
        },
    },
    columns: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    },
});

type Layout = Exclude<keyof typeof styles.layouts, "summary">;

const DescriptionListContext = createContext<{ layout: Layout | "summary" }>({ layout: "stacked" });

export interface DescriptionListProps extends ComponentPropsWithRef<"dl"> {
    /**
     * `stacked` puts each term above its value; `inline` puts them side by side from `sm` up
     * (term column 160px wide), stacked on phones.
     * @default "stacked"
     */
    layout?: Layout;
    /** Columns of term/value pairs from `sm` (2) and `lg` (3) up; one column on phones. @default 1 */
    columns?: keyof typeof styles.columns;
    /** Draws a divider between rows. Best with `layout="inline"` and one column. @default false */
    isDivided?: boolean;
    /**
     * `summary` is the compact receipt look (e.g. a booking summary): a white card of uppercase keys and
     * right-aligned values on a gray tray, with an optional `footer` line under it. It ignores `layout`,
     * `columns` and `isDivided`.
     * @default "default"
     */
    variant?: "default" | "summary";
    /** Note shown on the tray under a `summary` list, e.g. an icon + "100% money-back on eligible packages". */
    footer?: ReactNode;
}

/**
 * Label/value metadata (record details, settings summaries) rendered as a real `<dl>`, so
 * assistive tech announces each value with its term. Use it instead of a div grid of
 * label/value pairs.
 */
const DescriptionListRoot = ({
    layout = "stacked",
    columns = 1,
    isDivided = false,
    variant = "default",
    footer,
    className,
    children,
    ...props
}: DescriptionListProps) =>
    variant === "summary" ? (
        <DescriptionListContext.Provider value={{ layout: "summary" }}>
            <div className={cx("flex flex-col gap-1.25 rounded-[10px] bg-[#F7F7F7] px-0.5 pt-0.5 pb-1.25 dark:bg-secondary", className)}>
                <dl {...props} className="flex flex-col gap-3 rounded-lg bg-primary px-1.5 py-1">
                    {children}
                </dl>
                {footer && <div className="flex items-center gap-1 px-1.5 text-sm text-tertiary *:data-icon:size-3.5 *:data-icon:shrink-0">{footer}</div>}
            </div>
        </DescriptionListContext.Provider>
    ) : (
        <DescriptionListContext.Provider value={{ layout }}>
            <dl
                {...props}
                className={cx(
                    "grid",
                    styles.columns[columns],
                    isDivided ? "divide-y divide-border-secondary *:py-3 *:first:pt-0 *:last:pb-0" : "gap-x-6 gap-y-4",
                    className,
                )}
            >
                {children}
            </dl>
        </DescriptionListContext.Provider>
    );

export interface DescriptionListItemProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
    /** The label, e.g. "Sender". */
    term: ReactNode;
    /** The value. Text, a Badge, a link Button -- anything inline. Empty values show "—". */
    children?: ReactNode;
}

const DescriptionListItem = ({ term, children, className, ...props }: DescriptionListItemProps) => {
    const { layout } = useContext(DescriptionListContext);
    const isEmpty = children === undefined || children === null || children === "";

    return (
        <div {...props} className={cx(styles.layouts[layout].item, className)}>
            <dt className={cx("text-sm font-medium text-tertiary", styles.layouts[layout].term)}>{term}</dt>
            <dd className={cx("m-0 text-sm break-words text-primary", styles.layouts[layout].details)}>{isEmpty ? "—" : children}</dd>
        </div>
    );
};

export const DescriptionList = DescriptionListRoot as typeof DescriptionListRoot & {
    Item: typeof DescriptionListItem;
};
DescriptionList.Item = DescriptionListItem;
