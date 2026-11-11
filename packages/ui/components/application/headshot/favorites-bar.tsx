"use client";

import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RepeatIcon } from "@/components/foundations/hugeicons";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cx, sortCx } from "@/utils/cx";

const focusRing = "cursor-pointer outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
// Figma's lighter, Medium variant of the count chip.
const countChip = "bg-[#E9EAEB] font-medium";

// md: the desktop bar (Figma 14773:125623). sm: the phone bar (Figma 14853:261150), a frosted tab over a full-width bar.
const styles = sortCx({
    md: {
        root: "w-[496px] max-w-full",
        tab: "ml-[9px] h-[68px] w-[141px] gap-2.5 rounded-xl bg-[#101419] px-1.5 pt-1 text-md leading-[1.6] text-[#7E7E7E]",
        label: "h-7 gap-1.5",
        chip: "min-w-[21px] text-sm/[19px]",
        thumbs: "mt-0.5 h-6 w-[23px]",
        thumb: "h-6 w-[18px] rounded-[3px]",
        tiltedThumb: "left-[3px] rotate-[14.79deg]",
        bar: "-mt-[31px] rounded-xl px-2 py-[5px]",
        title: "text-md leading-[1.3]",
        // xs is 28h with a 2px gap; Figma's Share Link is 30h with a 4px gap (r7 vs xs r8 kept).
        share: "gap-1 py-[5px]",
    },
    sm: {
        root: "w-full",
        tab: "ml-2.5 h-[50px] min-w-[115px] gap-[7px] rounded-[9px] bg-black/58 px-1 pt-[3px] text-sm leading-[1.6] text-white backdrop-blur-[15.5px]",
        label: "h-[22px] gap-1",
        chip: "h-3.5 min-w-4 rounded-[4px] px-[3px] text-sm/[15px]",
        thumbs: "mt-px h-[21px] w-[17px]",
        thumb: "h-[18px] w-[13px] rounded-[2px]",
        tiltedThumb: "left-[2px] rotate-15",
        bar: "-mt-[21px] rounded-[9px] p-1.5",
        title: "text-sm leading-[17.5px]",
        // Figma's phone Share is a borderless grey 28px button.
        share: "gap-1 bg-tertiary px-1.5 shadow-none ring-0",
    },
});

export interface FavoritesBarProps {
    count: number;
    /** Up to two favourite thumbnails, stacked on the tab. */
    thumbnails?: string[];
    onFavoritesPress?: () => void;
    /**
     * Whether the results are filtered to favourites. Set it when pressing the tab toggles that filter, so the
     * tab is announced as a toggle (`aria-pressed`); leave it undefined for a plain button.
     */
    isFavoritesActive?: boolean;
    /** @default "Favorites" */
    favoritesLabel?: string;
    /**
     * Feedback prompt shown once there are favourites, e.g. "Get Feedback from Friends on your Favourites".
     * Without it and without `onShare` the bar is left out and only the tab shows.
     */
    feedbackTitle?: ReactNode;
    onShare?: () => void;
    /** @default "Share Link" */
    shareLabel?: string;
    /** `md` is the desktop bar, `sm` the phone bar, `responsive` switches to `sm` below the `md` breakpoint. @default "md" */
    size?: "md" | "sm" | "responsive";
    className?: string;
}

/**
 * Bottom-centre favourites control. With no favourites it is a translucent pill; with favourites it becomes
 * a dark tab tucked behind the share-for-feedback bar (or the tab alone when there is nothing to share).
 */
export const FavoritesBar = ({
    count,
    thumbnails = [],
    onFavoritesPress,
    isFavoritesActive,
    favoritesLabel = "Favorites",
    feedbackTitle,
    onShare,
    shareLabel = "Share Link",
    size = "md",
    className,
}: FavoritesBarProps) => {
    const isDesktop = useBreakpoint("md");
    const s = styles[size === "responsive" ? (isDesktop ? "md" : "sm") : size];

    if (count === 0) {
        return (
            <AriaButton
                onPress={onFavoritesPress}
                aria-pressed={isFavoritesActive}
                className={cx(
                    focusRing,
                    "inline-flex items-center gap-1.5 rounded-xl bg-[rgba(16,20,25,0.25)] px-1.5 py-1 text-md leading-[1.6] font-medium text-black",
                    className,
                )}
            >
                <Badge type="count" className={cx(countChip, styles.md.chip)}>
                    0
                </Badge>
                {favoritesLabel}
            </AriaButton>
        );
    }

    const hasBar = feedbackTitle != null || !!onShare;

    return (
        <div className={cx("inline-flex flex-col", hasBar && s.root, className)}>
            <AriaButton
                onPress={onFavoritesPress}
                aria-pressed={isFavoritesActive}
                className={cx(focusRing, "flex items-start self-start font-medium", s.tab, !hasBar && "ml-0 h-auto pb-1")}
            >
                <span className={cx("flex items-center", s.label)}>
                    <Badge type="count" className={cx(countChip, s.chip)}>
                        {count}
                    </Badge>
                    {favoritesLabel}
                </span>
                <span aria-hidden="true" className={cx("relative", s.thumbs)}>
                    {thumbnails.slice(0, 2).map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt=""
                            className={cx("absolute top-0 left-0 border border-white object-cover", s.thumb, index === 1 && s.tiltedThumb)}
                        />
                    ))}
                </span>
            </AriaButton>
            {hasBar && (
                <div className={cx("relative flex items-center gap-2 border border-secondary bg-primary", s.bar)}>
                    <p className={cx("flex-1 font-semibold text-primary", s.title)}>{feedbackTitle}</p>
                    {onShare && (
                        <Button
                            color="secondary"
                            size="xs"
                            onPress={onShare}
                            // Not `data-icon`, so it keeps Figma's brand colour instead of the text colour.
                            iconLeading={<RepeatIcon aria-hidden="true" className="size-4 shrink-0 text-fg-brand-primary" />}
                            className={s.share}
                        >
                            {shareLabel}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
