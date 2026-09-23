"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";

const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
};

export interface TextProps extends Omit<ComponentPropsWithRef<"span">, "color"> {
    /** Font-size override. Omit to inherit the ambient size from surrounding text. */
    size?: keyof typeof sizes;
    color?: TypographyColor;
}

/** Generic inline text (`<span>`) for styling a run of text without changing its semantics. */
export const Text = ({ size, color = "text-primary", className, ...props }: TextProps) => {
    return <span {...props} className={cx(size && sizes[size], color, className)} />;
};
