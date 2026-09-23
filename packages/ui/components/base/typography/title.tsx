"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";

export interface TitleProps extends Omit<ComponentPropsWithRef<"p">, "color"> {
    color?: TypographyColor;
}

/**
 * Large heading-adjacent display text (`<p>`). Purely visual — unlike `Heading`, it does not
 * participate in the document outline. Use `Heading` when the text is structurally a heading.
 */
export const Title = ({ color = "text-primary", className, ...props }: TitleProps) => {
    return <p {...props} className={cx("text-display-xs font-semibold", color, className)} />;
};
