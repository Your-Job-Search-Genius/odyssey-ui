"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/application/cards/card";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

export interface ShootCardProps {
    /** Shoot name, shown as an uppercase tag in the top-left corner. */
    tag: ReactNode;
    /** Cover photo. */
    src: string;
    alt: string;
    /** Number of portraits, shown in a count chip. */
    count: ReactNode;
    /** Label after the count, e.g. "Portraits". */
    countLabel: ReactNode;
    /** Pre-formatted date, e.g. "Dec 2026". */
    date: ReactNode;
    /** Pass `href` or `onPress` to make the whole card a link or a button. */
    href?: string;
    onPress?: () => void;
    className?: string;
}

/** A past shoot in the Activity Library: cover photo with a soft glow, count and date. */
export const ShootCard = ({ tag, src, alt, count, countLabel, date, href, onPress, className }: ShootCardProps) => (
    <Card {...(href ? { href } : onPress ? { onPress } : {})} variant="subtle" size="sm" className={cx("gap-0 p-3.5", className)}>
        <Badge type="shoot" className="-mx-0.5 self-start">
            {tag}
        </Badge>

        <span className="relative mx-auto mt-[37px] mb-[29px] aspect-[211/285] w-[211px] max-w-full">
            {/* Photo glow: a blurred, half-opacity copy peeking out below the photo. */}
            <img
                src={src}
                alt=""
                aria-hidden="true"
                className="absolute -bottom-3.5 left-1/2 h-[83%] w-[83%] -translate-x-1/2 rounded-[9px] object-cover opacity-50 blur-[14px]"
            />
            <img src={src} alt={alt} className="relative size-full rounded-[11px] object-cover" />
        </span>

        <span className="flex items-center justify-between gap-2 text-md/[1.6] font-medium text-secondary">
            <span className="flex items-center gap-[5px]">
                <Badge type="count">{count}</Badge>
                {countLabel}
            </span>
            <span>{date}</span>
        </span>
    </Card>
);
