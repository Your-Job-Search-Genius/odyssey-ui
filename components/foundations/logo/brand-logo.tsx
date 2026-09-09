"use client";

import type { HTMLAttributes } from "react";
import { cx } from "@/utils/cx";
import { BrandLogoMinimal } from "./brand-logo-minimal";

export const BrandLogo = (props: HTMLAttributes<HTMLOrSVGElement>) => {
    return (
        <div {...props} className={cx("flex h-8 w-max items-center justify-start gap-2 overflow-visible", props.className)}>
            {/* Minimal logo */}
            <BrandLogoMinimal className="aspect-square h-full w-auto shrink-0" />

            {/* Wordmark */}
            <span className="truncate text-lg leading-none font-semibold tracking-tight whitespace-nowrap text-primary">Writesea Odyssey</span>
        </div>
    );
};
