"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";
import type { TypographyColor } from "@/utils/typography-styles";

export interface Subtitle2Props extends Omit<ComponentPropsWithRef<"p">, "color"> {
    color?: TypographyColor;
}

/** A smaller, lighter step down from `Subtitle` (`<p>`). Purely visual. */
export const Subtitle2 = ({ color = "text-secondary", className, ...props }: Subtitle2Props) => {
    return <p {...props} className={cx("text-md font-medium", color, className)} />;
};
