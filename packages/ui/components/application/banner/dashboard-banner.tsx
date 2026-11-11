"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface DashboardBannerProps extends Omit<ComponentPropsWithRef<"section">, "title"> {
    /** The headline, e.g. "Over 3 million are generating headshots with BetterShot. Get Yours in 3 easy steps". */
    title: ReactNode;
    /** Heading level of the title; match the page outline. @default 2 */
    headingLevel?: 2 | 3 | 4;
    /** The call to action under the title, e.g. `<Button color="secondary-brand" size="md">`. */
    action?: ReactNode;
    /** Decorative art for the right side (hidden below `md`, `aria-hidden`), e.g. `FractalGlass` and a product logo. */
    media?: ReactNode;
}

/**
 * A full-width promo banner for a dashboard: a headline and one action on the left, decorative art on the right.
 * Unfilled, with a 1px border, so it sits on the page surface.
 */
export const DashboardBanner = ({ title, headingLevel = 2, action, media, className, ...props }: DashboardBannerProps) => {
    const Heading = `h${headingLevel}` as const;

    return (
        <section {...props} className={cx("relative isolate flex min-h-[130px] overflow-hidden rounded-2xl border border-secondary", className)}>
            {media && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[647px] max-w-[55%] md:block">
                    {media}
                </div>
            )}
            <div className="flex flex-col items-start gap-3.5 p-[13px]">
                <Heading className="max-w-[459px] text-xl leading-[normal] font-semibold text-primary">{title}</Heading>
                {action}
            </div>
        </section>
    );
};
