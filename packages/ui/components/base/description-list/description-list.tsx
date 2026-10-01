"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { createContext, useContext } from "react";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    layouts: {
        stacked: { item: "flex min-w-0 flex-col gap-1", term: "", details: "" },
        inline: { item: "flex min-w-0 flex-col gap-1 sm:flex-row sm:gap-4", term: "sm:w-40 sm:shrink-0", details: "min-w-0 sm:flex-1" },
    },
    columns: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    },
});

type Layout = keyof typeof styles.layouts;

const DescriptionListContext = createContext<{ layout: Layout }>({ layout: "stacked" });

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
}

/**
 * Label/value metadata (record details, settings summaries) rendered as a real `<dl>`, so
 * assistive tech announces each value with its term. Use it instead of a div grid of
 * label/value pairs.
 */
const DescriptionListRoot = ({ layout = "stacked", columns = 1, isDivided = false, className, children, ...props }: DescriptionListProps) => (
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
