"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";

/**
 * Mobile bottom action bar: a row of actions pinned to the bottom of the viewport over a soft white fade, clear
 * of the home indicator (`safe-area-inset-bottom`). Hidden from `md` up (pass `md:block` to keep it). Leave room
 * for it at the end of the page (about 6rem) so it never covers the last content.
 */
export const BottomBar = ({ className, children, ...props }: ComponentPropsWithRef<"div">) => (
    <div {...props} className={cx("pointer-events-none fixed inset-x-0 bottom-0 z-30 md:hidden", className)}>
        <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[134px] bg-linear-to-t from-bg-primary/50 to-transparent to-73% backdrop-blur-[0.5px]"
        />
        <div className="pointer-events-auto relative flex items-center justify-center gap-1.5 px-4 pb-[calc(34px+env(safe-area-inset-bottom))]">{children}</div>
    </div>
);

/** The dark glass pill for a status in the bar, e.g. "Your Selection 1/1" with an info button. */
export const BottomBarPill = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
    <div
        {...props}
        className={cx(
            "flex h-9 items-center gap-1.5 rounded-[9px] bg-[rgba(8,8,8,0.73)] px-1.5 py-1 text-sm font-semibold whitespace-nowrap text-white backdrop-blur-[10.5px]",
            className,
        )}
    />
);
