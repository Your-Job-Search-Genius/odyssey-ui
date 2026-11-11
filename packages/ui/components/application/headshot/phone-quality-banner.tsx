"use client";

import type { ReactNode } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { CircleArrowRight01RoundIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

export interface PhoneQualityBannerProps extends Omit<AriaButtonProps, "children" | "className"> {
    title: ReactNode;
    description: ReactNode;
    className?: string;
}

/**
 * Violet "use your phone" banner. Its content sits at the bottom so the top can be tucked
 * behind the camera dialog (pull it up with a negative margin).
 */
export const PhoneQualityBanner = ({ title, description, className, ...props }: PhoneQualityBannerProps) => (
    <AriaButton
        {...props}
        className={cx(
            "flex h-[124px] w-full max-w-[362px] cursor-pointer flex-col justify-end rounded-2xl bg-brand-200 px-[11px] pb-[9px] text-left text-black outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
            className,
        )}
    >
        <span className="flex w-full items-center gap-2.5 text-md/[1.3] font-semibold">
            <span className="flex-1">{title}</span>
            <CircleArrowRight01RoundIcon aria-hidden="true" className="size-4 shrink-0" />
        </span>
        <span className="text-[13px]/[1.3]">{description}</span>
    </AriaButton>
);
