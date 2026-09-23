"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";

/** Semantically important inline text (`<strong>`), rendered bold. */
export const Strong = (props: ComponentPropsWithRef<"strong">) => {
    return <strong {...props} className={cx("font-semibold", props.className)} />;
};
