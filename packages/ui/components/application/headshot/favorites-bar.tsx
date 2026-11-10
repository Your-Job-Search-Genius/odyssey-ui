"use client";

import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RepeatIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

const focusRing = "cursor-pointer outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
// Figma's lighter, Medium 14px variant of the count chip.
const countChip = "min-w-[21px] bg-[#E9EAEB] text-sm/[19px] font-medium";

export interface FavoritesBarProps {
    count: number;
    /** Up to two favourite thumbnails, stacked on the tab. */
    thumbnails?: string[];
    onFavoritesPress?: () => void;
    /** @default "Favorites" */
    favoritesLabel?: string;
    /** Feedback prompt shown once there are favourites, e.g. "Get Feedback from Friends on your Favourites". */
    feedbackTitle?: ReactNode;
    onShare?: () => void;
    shareLabel?: string;
    className?: string;
}

/**
 * Bottom-centre favourites control. With no favourites it is a translucent pill; with favourites it becomes
 * a dark tab tucked behind the share-for-feedback bar.
 */
export const FavoritesBar = ({
    count,
    thumbnails = [],
    onFavoritesPress,
    favoritesLabel = "Favorites",
    feedbackTitle,
    onShare,
    shareLabel = "Share Link",
    className,
}: FavoritesBarProps) => {
    if (count === 0) {
        return (
            <AriaButton
                onPress={onFavoritesPress}
                className={cx(
                    focusRing,
                    "inline-flex items-center gap-1.5 rounded-xl bg-[rgba(16,20,25,0.25)] px-1.5 py-1 text-md leading-[1.6] font-medium text-black",
                    className,
                )}
            >
                <Badge type="count" className={countChip}>
                    0
                </Badge>
                {favoritesLabel}
            </AriaButton>
        );
    }

    return (
        <div className={cx("inline-flex w-[496px] max-w-full flex-col", className)}>
            <AriaButton
                onPress={onFavoritesPress}
                className={cx(
                    focusRing,
                    "ml-[9px] flex h-[68px] w-[141px] items-start gap-2.5 rounded-xl bg-[#101419] px-1.5 pt-1 text-md leading-[1.6] font-medium text-[#7E7E7E]",
                )}
            >
                <span className="flex h-7 items-center gap-1.5">
                    <Badge type="count" className={countChip}>
                        {count}
                    </Badge>
                    {favoritesLabel}
                </span>
                <span aria-hidden="true" className="relative mt-0.5 h-6 w-[23px]">
                    {thumbnails.slice(0, 2).map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt=""
                            className={cx(
                                "absolute top-0 left-0 h-6 w-[18px] rounded-[3px] border border-white object-cover",
                                index === 1 && "left-[3px] rotate-[14.79deg]",
                            )}
                        />
                    ))}
                </span>
            </AriaButton>
            <div className="relative -mt-[31px] flex items-center gap-2 rounded-xl border border-secondary bg-primary px-2 py-[5px]">
                <p className="flex-1 text-md leading-[1.3] font-semibold text-primary">{feedbackTitle}</p>
                {onShare && (
                    <Button
                        color="secondary"
                        size="xs"
                        noTextPadding
                        onPress={onShare}
                        // Not `data-icon`, so it keeps Figma's brand colour instead of the text colour.
                        iconLeading={<RepeatIcon aria-hidden="true" className="size-4 shrink-0 text-fg-brand-primary" />}
                        // xs is 28h with a 2px gap; Figma's Share Link is 30h with a 4px gap (r7 vs xs r8 kept).
                        className="gap-1 py-[5px]"
                    >
                        {shareLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};
