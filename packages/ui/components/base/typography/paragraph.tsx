"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";

export interface ParagraphProps extends Omit<ComponentPropsWithRef<"p">, "color"> {
    color?: TypographyColor;
}

/** Primary reading copy (`<p>`). For secondary/supporting body text, use `Body1`/`Body2` instead. */
export const Paragraph = ({ color = "text-primary", className, ...props }: ParagraphProps) => {
    return <p {...props} className={cx("text-md", color, className)} />;
};
