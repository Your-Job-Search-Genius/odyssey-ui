"use client";

import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import { ClearCircleIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

export interface SelectionTrayItem {
    id: string;
    src: string;
    alt: string;
}

export interface SelectionTrayProps {
    /** @default "Your Selection" */
    title?: ReactNode;
    items: SelectionTrayItem[];
    /** How many items can be picked; the counter reads `items.length/max`. */
    max: number;
    /** Shows a remove badge on each thumbnail (on hover/focus, always on touch). */
    onRemove?: (id: string) => void;
    /** Accessible name of each remove badge. @default (item) => `Remove ${item.alt}` */
    removeLabel?: (item: SelectionTrayItem) => string;
    /** Trailing slot after the counter, e.g. an info button that opens a popover. */
    info?: ReactNode;
    /** Call to action under the tray, e.g. a full-width primary `Button`. */
    children?: ReactNode;
    className?: string;
}

export interface CounterRingProps {
    /** Ring colour as a text-colour class, e.g. `text-white` on dark surfaces. @default "text-[#DBD8FF]" */
    className?: string;
}

/**
 * The selection counter's ring: three 2px arcs, 24px, decorative (the number carries the meaning).
 * It is absolutely positioned; put it in a `relative flex size-6 items-center justify-center` box
 * together with the count, as `SelectionTray` does.
 */
export const CounterRing = ({ className }: CounterRingProps) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cx("absolute inset-0 size-6 text-[#DBD8FF]", className)}>
        <circle
            cx="12"
            cy="12"
            r="10.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="360"
            strokeDasharray="99 21"
            transform="rotate(51 12 12)"
        />
    </svg>
);

/** "Your Selection n/max" with the picked thumbnails and a CTA. Collapses to a single row when empty. */
export const SelectionTray = ({
    title = "Your Selection",
    items,
    max,
    onRemove,
    removeLabel = (item) => `Remove ${item.alt}`,
    info,
    children,
    className,
}: SelectionTrayProps) => {
    const header = (
        <>
            <span className="text-sm/[normal] font-semibold text-secondary">{title}</span>
            <span className="flex items-center gap-1">
                <span className="flex items-center text-sm/[normal] font-semibold text-primary">
                    <span className="relative flex size-6 items-center justify-center">
                        <CounterRing />
                        {items.length}
                    </span>
                    /{max}
                </span>
                {info}
            </span>
        </>
    );

    return (
        <div className={cx("flex flex-col gap-2", className)}>
            {items.length === 0 ? (
                <div className="flex min-h-10 items-center justify-between gap-2 rounded-[27px] bg-tertiary px-3 py-2">{header}</div>
            ) : (
                <div className="flex flex-col gap-[7px]">
                    <div className="flex items-center gap-1.5">{header}</div>
                    <ul className="flex h-[81px] items-start gap-2.5 overflow-x-auto rounded-[15px] bg-tertiary pt-3 pr-3 pl-3">
                        {items.map((item) => (
                            <li key={item.id} className="group relative shrink-0">
                                <img src={item.src} alt={item.alt} className="h-[58px] w-[43px] rounded-[7px] border-2 border-white object-cover" />
                                {onRemove && (
                                    <AriaButton
                                        aria-label={removeLabel(item)}
                                        onPress={() => onRemove(item.id)}
                                        className="absolute -top-1.5 -right-[7px] cursor-pointer rounded-full text-[#FA1D37] opacity-0 outline-focus-ring transition duration-100 ease-linear group-hover:opacity-100 data-focus-visible:opacity-100 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 pointer-coarse:opacity-100"
                                    >
                                        <ClearCircleIcon aria-hidden="true" className="size-4" />
                                    </AriaButton>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {children}
        </div>
    );
};
