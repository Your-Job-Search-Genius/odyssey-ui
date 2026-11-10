"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

export interface ModelChipProps {
    /** Leading caption, rendered uppercase. @default "Model" */
    label?: ReactNode;
    /** Current model, e.g. "Malik", or a summary such as "Showing Mix". */
    name: ReactNode;
    /** Model avatar; omit for the text-only "Showing Mix" state. Decorative: the name labels it. */
    avatarSrc?: string;
    /** @default "Change" */
    changeLabel?: ReactNode;
    /** Opens the model picker. */
    onPressChange?: () => void;
    className?: string;
}

/** "MODEL | avatar Name | Change": shows the model outfits are tried on, with a button to swap it. */
export const ModelChip = ({ label = "Model", name, avatarSrc, changeLabel = "Change", onPressChange, className }: ModelChipProps) => {
    const id = useId();

    return (
        <div className={cx("inline-flex items-center rounded-[10px] bg-tertiary p-0.5", className)}>
            <div id={id} className="flex h-9 min-w-[198px] items-center justify-between gap-3 rounded-lg bg-primary px-1 py-0.5">
                <span className="text-sm font-medium text-subtle uppercase">{label}</span>
                <span className="flex items-center gap-[5px] text-sm font-medium text-primary">
                    {avatarSrc && <img src={avatarSrc} alt="" className="size-8 shrink-0 rounded-[7px] bg-(--color-border-primary) object-cover object-top" />}
                    {name}
                </span>
            </div>
            {/* Described by the chip so screen readers hear "Change, Model Malik" rather than a bare "Change". */}
            <Button size="xs" color="tertiary" aria-describedby={id} onPress={onPressChange} className="h-[37px]">
                {changeLabel}
            </Button>
        </div>
    );
};
