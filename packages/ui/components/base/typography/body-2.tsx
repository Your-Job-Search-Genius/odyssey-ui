"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";

export interface Body2Props extends Omit<ComponentPropsWithRef<"p">, "color"> {
    color?: TypographyColor;
}

/** Secondary/supporting body copy (`<p>`) at the smaller of the two body sizes. */
export const Body2 = ({ color = "text-tertiary", className, ...props }: Body2Props) => {
    return <p {...props} className={cx("text-sm", color, className)} />;
};
