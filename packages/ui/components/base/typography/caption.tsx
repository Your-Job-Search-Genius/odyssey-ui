"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";

export interface CaptionProps extends Omit<ComponentPropsWithRef<"span">, "color"> {
    color?: TypographyColor;
}

/** Smallest supporting text (`<span>`) — figure captions, timestamps, helper labels. */
export const Caption = ({ color = "text-quaternary", className, ...props }: CaptionProps) => {
    return <span {...props} className={cx("text-xs", color, className)} />;
};
