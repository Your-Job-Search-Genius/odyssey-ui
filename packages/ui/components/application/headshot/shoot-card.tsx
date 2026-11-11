"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/application/cards/card";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

export interface ShootCardProps {
    /** Shoot name, shown in a white chip in the top-left corner after its initial. */
    tag: ReactNode;
    /** Letter in the chip's avatar square. @default the first letter of `tag` (when it is a string) */
    initial?: ReactNode;
    /** Cover photo. Omit it while the shoot has none (e.g. still generating) and pass `placeholder`. */
    src?: string;
    alt: string;
    /** Shown in the photo's place when there is no `src`, e.g. "Generating…". */
    placeholder?: ReactNode;
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

/** A past shoot in the Activity Library: cover photo with a soft glow, count and date. Phone sizes below `md`. */
export const ShootCard = ({ tag, initial, src, alt, placeholder, count, countLabel, date, href, onPress, className }: ShootCardProps) => {
    const letter = initial ?? (typeof tag === "string" ? tag.trim().charAt(0).toUpperCase() : null);

    return (
        <Card
            {...(href ? { href } : onPress ? { onPress } : {})}
            variant="subtle"
            size="sm"
            className={cx("gap-0 rounded-[21px] bg-[#F8F8F8] p-3.5", className)}
        >
            <span className="flex items-center gap-1 self-start rounded-[7px] bg-white py-0.5 pr-2 pl-1 text-md font-semibold text-black md:pl-0.5 md:text-sm">
                {letter && (
                    <span
                        aria-hidden="true"
                        className="flex size-5 items-center justify-center rounded-[5px] bg-[#E2E9FF] text-[12.5px] font-semibold text-[#022AFD]"
                    >
                        {letter}
                    </span>
                )}
                {tag}
            </span>

            <span className="relative mx-auto mt-[18px] mb-[21px] h-[293px] w-[222px] max-w-full md:mt-[31px] md:mb-[29px] md:h-[285px] md:w-[211px]">
                {src ? (
                    <>
                        {/* Photo glow: a blurred, half-opacity copy peeking out below the photo. */}
                        <img
                            src={src}
                            alt=""
                            aria-hidden="true"
                            className="absolute -bottom-1.5 left-1/2 h-[232px] w-[172px] -translate-x-1/2 rounded-[9px] object-cover opacity-50 blur-[26px] md:-bottom-[13px] md:h-[237px] md:w-[176px]"
                        />
                        <img src={src} alt={alt} className="relative size-full rounded-[14px] object-cover md:rounded-[11px]" />
                    </>
                ) : (
                    <span className="flex size-full items-center justify-center rounded-[14px] bg-tertiary px-4 text-center text-sm font-medium text-tertiary md:rounded-[11px]">
                        {placeholder}
                    </span>
                )}
            </span>

            <span className="mt-auto flex items-center justify-between gap-2 text-md/[1.6] font-medium text-secondary">
                <span className="flex items-center gap-[5px]">
                    <Badge type="count">{count}</Badge>
                    {countLabel}
                </span>
                <span>{date}</span>
            </span>
        </Card>
    );
};
