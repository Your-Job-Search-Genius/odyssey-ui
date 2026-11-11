"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { Card } from "@/components/application/cards/card";
import { Badge } from "@/components/base/badges/badges";
import { CircleArrowRight01RoundIcon, LockedIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

export interface CaptureMethodCardProps {
    /** `featured`: the tall grey card with an icon on top. `compact`: the short brand-tinted row. @default "featured" */
    layout?: "featured" | "compact";
    /**
     * `featured` layout only. `md`: icon on top of the text (desktop). `sm`: icon left of the text (phone).
     * `responsive`: `sm` below the `md` breakpoint, `md` from it. @default "md"
     */
    size?: "md" | "sm" | "responsive";
    title: ReactNode;
    description?: ReactNode;
    /** Large icon at the top of a `featured` card (46px in the design). Decorative. */
    icon?: ReactNode;
    /** Tab glued above the card, e.g. "Recommended". Announced as the card's description. */
    tab?: ReactNode;
    /** Pass exactly one of `onPress` or `href`. */
    onPress?: () => void;
    href?: string;
    isDisabled?: boolean;
    className?: string;
}

/** One way to add photos (webcam, phone, …). The whole card is a single button or link. */
// The phone tab is wider with 13px type; its gradient centre moves with it (Figma 14866:363350).
const phoneTab =
    "min-w-[115px] pt-[7px] pb-0 text-[13px] leading-[14px] bg-[radial-gradient(ellipse_77px_60px_at_53px_31px,#5215FF_0%,#5E2CFF_12.5%,#6B43FF_25%,#8571FF_50%,#9F9FFF_75%,#B9CDFF_100%)]";

const featuredSizes = {
    md: { card: "min-h-[178px] justify-between gap-4", text: "", tab: "min-w-[89px]" },
    sm: { card: "flex-row items-start gap-3", text: "min-w-0 flex-1", tab: phoneTab },
    responsive: {
        card: "flex-row items-start gap-3 md:min-h-[178px] md:flex-col md:items-stretch md:justify-between md:gap-4",
        text: "min-w-0 flex-1 md:flex-none",
        // Spelled out so Tailwind sees every class.
        tab: "min-w-[115px] max-md:pt-[7px] max-md:pb-0 max-md:text-[13px] max-md:leading-[14px] max-md:bg-[radial-gradient(ellipse_77px_60px_at_53px_31px,#5215FF_0%,#5E2CFF_12.5%,#6B43FF_25%,#8571FF_50%,#9F9FFF_75%,#B9CDFF_100%)] md:min-w-[89px]",
    },
};

export const CaptureMethodCard = ({
    layout = "featured",
    size = "md",
    title,
    description,
    icon,
    tab,
    onPress,
    href,
    isDisabled,
    className,
}: CaptureMethodCardProps) => {
    const tabId = useId();
    const action = href ? { href } : { onPress };
    const arrow = <CircleArrowRight01RoundIcon aria-hidden="true" className="size-4 shrink-0 text-fg-primary" />;

    const card =
        layout === "compact" ? (
            <Card
                {...action}
                isDisabled={isDisabled}
                variant="subtle"
                size="sm"
                className={cx("min-h-[70px] justify-start gap-0 rounded-[14px] bg-brand-primary px-3 pt-[15px] pb-3", !tab && className)}
            >
                <span className="flex items-center gap-2.5">
                    <span className="min-w-0 flex-1 text-md/[normal] font-semibold text-primary">{title}</span>
                    {arrow}
                </span>
                {description && <span className="text-[13px]/[normal] text-primary">{description}</span>}
            </Card>
        ) : (
            <Card
                {...action}
                isDisabled={isDisabled}
                variant="subtle"
                size="sm"
                aria-describedby={tab ? tabId : undefined}
                className={cx(featuredSizes[size].card, "bg-tertiary px-[11px] py-4", !tab && className)}
            >
                {icon}
                <span className={cx("flex items-end gap-px", featuredSizes[size].text)}>
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                        <span className="text-md font-semibold text-primary">{title}</span>
                        {description && <span className="text-sm/[normal] font-medium text-secondary">{description}</span>}
                    </span>
                    {arrow}
                </span>
            </Card>
        );

    if (!tab) return card;

    return (
        <div className={cx("flex flex-col", className)}>
            <span id={tabId} aria-hidden="true" className="ml-3.5 self-start">
                <Badge type="recommended" className={cx("justify-center", layout === "featured" ? featuredSizes[size].tab : "min-w-[89px]")}>
                    {tab}
                </Badge>
            </span>
            {card}
        </div>
    );
};

/** The lock + reassurance line under the capture options. */
export const CapturePrivacyNote = ({ children, className }: { children: ReactNode; className?: string }) => (
    <p className={cx("flex items-center gap-2 text-sm/[normal] font-medium text-secondary", className)}>
        <LockedIcon aria-hidden="true" className="size-4.5 shrink-0 text-fg-primary" />
        {children}
    </p>
);
