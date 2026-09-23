"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";

export interface SubtitleProps extends Omit<ComponentPropsWithRef<"p">, "color"> {
    color?: TypographyColor;
}

/** Secondary heading-adjacent display text (`<p>`), typically paired under a `Title`. Purely visual. */
export const Subtitle = ({ color = "text-primary", className, ...props }: SubtitleProps) => {
    return <p {...props} className={cx("text-lg font-semibold", color, className)} />;
};
