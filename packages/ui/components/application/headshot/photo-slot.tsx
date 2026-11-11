"use client";

import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import { GlassPill } from "@/components/application/headshot/glass-pill";
import { ImageAdd01Icon, RefreshIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

const focusRing = "cursor-pointer outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
const badge = "absolute flex items-center rounded-full font-bold uppercase";
// Dark surfaces only: the brand focus ring is too faint there, so it is white.
const whiteRing = "[--color-focus-ring:var(--color-white)]";

// `md`: the desktop 197×261 tile. `sm`: Figma's phone tile (14846:189273), fluid width at 183/242 with slightly
// smaller OK badge and Re-Take pill. `responsive` spells both out per breakpoint so Tailwind sees every class.
const sizes = {
    md: {
        box: "h-[261px] w-[197px]",
        empty: "rounded-[20px]",
        photo: "rounded-[21px]",
        ok: "top-[9px] left-2.5 h-[27px] px-2.5 text-sm shadow-[inset_0_4px_10px_rgba(255,255,255,0.4)]",
        retake: "right-2.5 bottom-2",
        fail: "top-2 left-2.5",
        why: "top-2 right-[9px]",
    },
    sm: {
        box: "aspect-[183/242] w-full",
        empty: "rounded-[20px]",
        photo: "rounded-[20px]",
        ok: "top-2 left-[9px] h-[25px] px-[9px] text-[13px] shadow-[inset_0_4px_9px_rgba(255,255,255,0.4)]",
        retake: "right-2 bottom-[7px] h-[26px] pr-[9px] text-[13px] [&>svg]:size-[19px]",
        fail: "top-1.5 left-[7px]",
        why: "top-1.5 right-[7px]",
    },
    responsive: {
        box: "aspect-[183/242] w-full md:aspect-auto md:h-[261px] md:w-[197px]",
        empty: "rounded-[20px]",
        photo: "rounded-[20px] md:rounded-[21px]",
        ok: "top-2 left-[9px] h-[25px] px-[9px] text-[13px] shadow-[inset_0_4px_9px_rgba(255,255,255,0.4)] md:top-[9px] md:left-2.5 md:h-[27px] md:px-2.5 md:text-sm md:shadow-[inset_0_4px_10px_rgba(255,255,255,0.4)]",
        retake: "right-2 bottom-[7px] h-[26px] pr-[9px] text-[13px] [&>svg]:size-[19px] md:right-2.5 md:bottom-2 md:h-7 md:pr-2.5 md:text-sm md:[&>svg]:size-5",
        fail: "top-1.5 left-[7px] md:top-2 md:left-2.5",
        why: "top-1.5 right-[7px] md:top-2 md:right-[9px]",
    },
};

export interface PhotoSlotProps {
    /**
     * `empty` renders the dashed "Add Photo" button; `ok` / `fail` render the photo with its status badge;
     * `pending` dims the photo under `pendingLabel` while it is being checked. @default "empty"
     */
    status?: "empty" | "ok" | "fail" | "pending";
    /** `md`: 197×261 (desktop). `sm`: fluid width at the phone tile's 183/242 ratio. `responsive`: `sm` below the `md` breakpoint. @default "md" */
    size?: "md" | "sm" | "responsive";
    /** Names the slot, e.g. "Photo 2": a group label for a filled slot, appended to the Add button's name for an empty one. */
    label?: string;
    src?: string;
    alt?: string;
    onAdd?: () => void;
    onRetake?: () => void;
    onReupload?: () => void;
    /** Top-right control on a failed slot, e.g. `<DialogTrigger><GlassPill>Why?</GlassPill>…</DialogTrigger>`. */
    whyAction?: ReactNode;
    /** @default "Add Photo" */
    addLabel?: string;
    /** @default "OK" */
    okLabel?: string;
    /** @default "Fail" */
    failLabel?: string;
    /** @default "Re-Take" */
    retakeLabel?: string;
    /** @default "Re-Upload" */
    reuploadLabel?: string;
    /** Shown (and announced politely) over a `pending` slot. @default "Checking photo…" */
    pendingLabel?: string;
    className?: string;
}

/** One photo in the "Add Photo" grid. Status is always spelled out in the badge, never colour alone. */
export const PhotoSlot = ({
    status = "empty",
    size = "md",
    label,
    src,
    alt = "",
    onAdd,
    onRetake,
    onReupload,
    whyAction,
    addLabel = "Add Photo",
    okLabel = "OK",
    failLabel = "Fail",
    retakeLabel = "Re-Take",
    reuploadLabel = "Re-Upload",
    pendingLabel = "Checking photo…",
    className,
}: PhotoSlotProps) => {
    const s = sizes[size];

    if (status === "empty") {
        return (
            <AriaButton
                onPress={onAdd}
                // Visible text first, so the name still starts with what sighted users read.
                aria-label={label ? `${addLabel}, ${label}` : undefined}
                className={cx(
                    "flex shrink-0 flex-col items-center justify-center gap-3 border-2 border-dashed border-[#5E5E5E] text-sm/[1.3] font-semibold text-white",
                    s.box,
                    s.empty,
                    whiteRing,
                    focusRing,
                    className,
                )}
            >
                <ImageAdd01Icon aria-hidden="true" className="size-[50px] opacity-30" />
                {addLabel}
            </AriaButton>
        );
    }

    return (
        <div
            role={label ? "group" : undefined}
            aria-label={label}
            className={cx("relative shrink-0 overflow-hidden", s.box, s.photo, whiteRing, status === "pending" && "bg-black", className)}
        >
            <img src={src} alt={alt} className={cx("absolute inset-0 size-full object-cover", status === "pending" && "opacity-50")} />

            {status === "pending" ? (
                <span
                    role="status"
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-2 text-center text-sm font-medium text-white motion-safe:animate-pulse"
                >
                    {pendingLabel}
                </span>
            ) : status === "ok" ? (
                <>
                    <span className={cx(badge, s.ok, "bg-[#19F958] text-[#066C23]")}>{okLabel}</span>
                    {onRetake && (
                        <GlassPill iconLeading={RefreshIcon} onPress={onRetake} className={cx("absolute", s.retake)}>
                            {retakeLabel}
                        </GlassPill>
                    )}
                </>
            ) : (
                <>
                    <span aria-hidden="true" className="absolute inset-0 bg-[rgba(240,139,139,0.58)]" />
                    {/* Approved contrast fix: #141414 on #F9191D instead of white. */}
                    <span className={cx(badge, s.fail, "h-7 bg-[#F9191D] px-2.5 text-sm text-[#141414] shadow-[inset_0_4px_10px_rgba(255,255,255,0.4)]")}>
                        {failLabel}
                    </span>
                    {whyAction && <div className={cx("absolute", s.why)}>{whyAction}</div>}
                    {onReupload && (
                        <AriaButton
                            onPress={onReupload}
                            className={cx(
                                // Figma 14613:144571 / 14846:189273: the block's top sits 88px down on both tiles.
                                "absolute top-[88px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[7px] rounded-lg text-lg leading-[1.6] font-medium whitespace-nowrap text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]",
                                focusRing,
                            )}
                        >
                            <RefreshIcon aria-hidden="true" className="size-[50px]" />
                            {reuploadLabel}
                        </AriaButton>
                    )}
                </>
            )}
        </div>
    );
};
