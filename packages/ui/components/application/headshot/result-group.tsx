import type { ReactNode } from "react";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

export interface ResultGroupProps {
    /** Outfit thumbnail. */
    thumbnail?: { src: string; alt: string };
    /** Eyebrow, e.g. "OUTFIT 1". */
    eyebrow: ReactNode;
    count: number;
    /** Word after the count, e.g. "Photos". */
    countLabel: ReactNode;
    title: ReactNode;
    /** The `ResultTile`s. */
    children: ReactNode;
    className?: string;
}

/** One outfit's results: a header with thumbnail, count and title, then its tiles. */
export const ResultGroup = ({ thumbnail, eyebrow, count, countLabel, title, children, className }: ResultGroupProps) => (
    <section className={cx("flex flex-col gap-[17px]", className)}>
        <header className="flex items-center gap-2.5 pl-[22px]">
            {thumbnail && <img src={thumbnail.src} alt={thumbnail.alt} className="h-10 w-[41px] shrink-0 rounded-lg object-cover" />}
            <div className="flex flex-col gap-1">
                <p className="flex items-center gap-1 text-sm/[1.3] font-medium text-secondary">
                    {eyebrow}
                    <span aria-hidden="true" className="size-1 rounded-full bg-[#A4A7AE]" />
                    {/* Figma's lighter, Medium-weight variant of the count chip. */}
                    <Badge type="count" className="bg-[#E9EAEB] font-medium">
                        {count}
                    </Badge>
                    <span className="text-[13px]/[1.3]">{countLabel}</span>
                </p>
                <h3 className="text-sm/[1.3] font-semibold text-primary">{title}</h3>
            </div>
        </header>
        <div className="flex flex-wrap gap-3">{children}</div>
    </section>
);
