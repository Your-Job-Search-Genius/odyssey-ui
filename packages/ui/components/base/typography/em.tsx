"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";

/** Stress-emphasized inline text (`<em>`), rendered italic. */
export const Em = (props: ComponentPropsWithRef<"em">) => {
    return <em {...props} className={cx("italic", props.className)} />;
};
