"use client";

import type { FC, ReactNode, SVGProps } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";

export const styles = sortCx({
    common: {
        root: "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 text-sm whitespace-nowrap text-white outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        icon: "size-5 shrink-0",
    },
    variants: {
        // "Why?" / "Re-Take" over a photo: rgba(0,0,0,.51) + blur 12.5, solid where backdrop-filter is unsupported.
        dark: "h-7 rounded-[26px] bg-neutral-800 px-2.5 py-1 leading-[1.6] font-medium supports-[backdrop-filter:blur(0)]:bg-black/51 supports-[backdrop-filter:blur(0)]:backdrop-blur-[12.5px]",
        // Crop modal segments ("Re-Upload", "Skip this photo"): rgba(255,255,255,.12) + 1px rgba(255,255,255,.09).
        light: "rounded-[30px] border border-white/9 bg-white/12 px-3 leading-5 font-semibold",
    },
});

export interface GlassPillProps extends Omit<AriaButtonProps, "children"> {
    /** `dark` sits on photos, `light` on the dark crop overlay. @default "dark" */
    variant?: keyof typeof styles.variants;
    iconLeading?: FC<SVGProps<SVGSVGElement>>;
    children: ReactNode;
}

/** Translucent pill button used on top of photos and in the crop modal. */
export const GlassPill = ({ variant = "dark", iconLeading: Icon, children, className, ...props }: GlassPillProps) => (
    <AriaButton
        {...props}
        className={(state) => cx(styles.common.root, styles.variants[variant], Icon && "pl-1", typeof className === "function" ? className(state) : className)}
    >
        {Icon && <Icon aria-hidden="true" className={styles.common.icon} />}
        {children}
    </AriaButton>
);
