"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";

export interface Body1Props extends Omit<ComponentPropsWithRef<"p">, "color"> {
    color?: TypographyColor;
}

/** Secondary/supporting body copy (`<p>`) at the larger of the two body sizes. */
export const Body1 = ({ color = "text-tertiary", className, ...props }: Body1Props) => {
    return <p {...props} className={cx("text-md", color, className)} />;
};
