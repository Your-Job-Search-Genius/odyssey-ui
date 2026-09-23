"use client";

import type { ComponentPropsWithRef, ElementType } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";
import { headingSizes } from "@/utils/typography-styles";

export interface HeadingProps extends Omit<ComponentPropsWithRef<"h1">, "color"> {
    /** Semantic heading level. Controls the rendered tag (`h1`-`h6`) and, by default, the visual size. */
    level: 1 | 2 | 3 | 4 | 5 | 6;
    /** Visual size override, independent of `level`. Defaults to `level`. */
    size?: 1 | 2 | 3 | 4 | 5 | 6;
    color?: TypographyColor;
}

/**
 * Semantic heading (`h1`-`h6`). `level` determines both the rendered tag and, by default, the
 * visual size — pass `size` separately when a heading needs to look larger or smaller than its
 * place in the document outline without misrepresenting that outline to assistive tech.
 */
export const Heading = ({ level, size, color = "text-primary", className, ...props }: HeadingProps) => {
    const Tag = `h${level}` as ElementType;

    return <Tag {...props} className={cx(headingSizes[size ?? level], color, className)} />;
};
