"use client";

import type { FC, MouseEventHandler, ReactNode } from "react";
import { Pressable } from "react-aria-components";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { FOCUS_RING, NavRail } from "./nav-rail";

interface NavButtonProps {
    /** Whether the collapsible nav item is open. */
    open?: boolean;
    /** URL to navigate to when the button is clicked. */
    href?: string;
    /** Label text for the button. */
    label?: string;
    /** Icon component to display. */
    icon?: FC<{ className?: string }>;
    /** Whether the button is currently active. */
    current?: boolean;
    /** Handler for click events. */
    onClick?: MouseEventHandler;
    /** Additional CSS classes to apply to the button. */
    className?: string;
    /** Placement of the tooltip. */
    tooltipPlacement?: "top" | "right" | "bottom" | "left";
    /**
     * "header" — the horizontal top-bar pill/icon-button treatment (default).
     * "rail" — the vertical icon-rail treatment (Sidebar's rail indicator + brand active fill).
     */
    variant?: "header" | "rail";
    /** Content to display. */
    children?: ReactNode;
}

export const NavButton = ({
    current,
    label,
    href,
    icon: Icon,
    className,
    tooltipPlacement = "right",
    variant = "header",
    onClick,
    children,
}: NavButtonProps) => {
    const iconOnly = !children;
    const isRail = variant === "rail";

    return (
        <Tooltip isDisabled={!label} title={label} placement={tooltipPlacement}>
            <Pressable>
                <a
                    href={href}
                    aria-label={label}
                    onClick={onClick}
                    className={cx(
                        "group/item relative flex w-full cursor-pointer items-center justify-center gap-1 rounded-md bg-primary transition duration-100 ease-linear select-none",
                        isRail
                            ? cx(FOCUS_RING, "focus-visible:z-10", current && "bg-utility-brand-50 text-utility-brand-700")
                            : cx(
                                  "outline-focus-ring hover:bg-primary_hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2",
                                  current && "bg-secondary hover:bg-secondary_hover",
                              ),
                        iconOnly ? "size-9" : "px-2 py-1.5",
                        className,
                    )}
                >
                    {isRail && <NavRail active={current} className="absolute top-1/2 left-0 -translate-y-1/2" />}

                    {Icon && (
                        <Icon
                            aria-hidden="true"
                            className={cx(
                                "size-5 shrink-0 text-fg-quaternary transition-inherit-all",
                                isRail ? "group-hover/item:text-utility-brand-700" : "group-hover/item:text-fg-quaternary_hover",
                                current && (isRail ? "text-utility-brand-700" : "text-fg-quaternary_hover"),
                            )}
                        />
                    )}

                    {children && (
                        <span
                            className={cx(
                                "px-0.5 text-sm font-semibold transition duration-100 ease-linear",
                                isRail ? "group-hover/item:text-utility-brand-700" : "group-hover/item:text-secondary_hover",
                                current && (isRail ? "text-utility-brand-700" : "text-secondary_hover"),
                            )}
                        >
                            {children}
                        </span>
                    )}
                </a>
            </Pressable>
        </Tooltip>
    );
};
