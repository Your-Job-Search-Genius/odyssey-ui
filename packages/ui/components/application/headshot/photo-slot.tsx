"use client";

import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import { GlassPill } from "@/components/application/headshot/glass-pill";
import { ImageAdd01Icon, RefreshIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

const focusRing = "cursor-pointer outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
const badge = "absolute left-2.5 flex items-center rounded-full px-2.5 text-sm font-bold uppercase shadow-[inset_0_4px_10px_rgba(255,255,255,0.4)]";

export interface PhotoSlotProps {
    /** `empty` renders the dashed "Add Photo" button; `ok` / `fail` render the photo with its status badge. @default "empty" */
    status?: "empty" | "ok" | "fail";
    src?: string;
    alt?: string;
    onAdd?: () => void;
    onRetake?: () => void;
    onReupload?: () => void;
    /** Top-right control on a failed slot, e.g. `<DialogTrigger><GlassPill>Why?</GlassPill>…</DialogTrigger>`. */
    whyAction?: ReactNode;
    addLabel?: string;
    okLabel?: string;
    failLabel?: string;
    retakeLabel?: string;
    reuploadLabel?: string;
    className?: string;
}

/** One photo in the "Add Photo" grid. Status is always spelled out in the badge, never colour alone. */
export const PhotoSlot = ({
    status = "empty",
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
    className,
}: PhotoSlotProps) => {
    if (status === "empty") {
        return (
            <AriaButton
                onPress={onAdd}
                className={cx(
                    "flex h-[261px] w-[197px] shrink-0 flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-[#5E5E5E] text-sm/[1.3] font-semibold text-white",
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
        <div className={cx("relative h-[261px] w-[197px] shrink-0 overflow-hidden rounded-[21px]", className)}>
            <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />

            {status === "ok" ? (
                <>
                    <span className={cx(badge, "top-[9px] h-[27px] bg-[#19F958] text-[#066C23]")}>{okLabel}</span>
                    {onRetake && (
                        <GlassPill iconLeading={RefreshIcon} onPress={onRetake} className="absolute right-2.5 bottom-2">
                            {retakeLabel}
                        </GlassPill>
                    )}
                </>
            ) : (
                <>
                    <span aria-hidden="true" className="absolute inset-0 bg-[rgba(240,139,139,0.58)]" />
                    {/* Approved contrast fix: #141414 on #F9191D instead of white. */}
                    <span className={cx(badge, "top-2 h-7 bg-[#F9191D] text-[#141414]")}>{failLabel}</span>
                    {whyAction && <div className="absolute top-2 right-[9px]">{whyAction}</div>}
                    {onReupload && (
                        <AriaButton
                            onPress={onReupload}
                            className={cx(
                                "absolute top-[162px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[7px] rounded-lg text-lg leading-[1.6] font-medium whitespace-nowrap text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]",
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
