"use client";

import type { ComponentPropsWithRef, FC, ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface AnchorNavItem {
    /** Section key, compared with `currentId`. */
    id: string;
    /** Usually `#<section id>`. */
    href: string;
    label: ReactNode;
    /** Decorative 28px icon before the label; faded until the item is current. */
    icon?: FC<{ className?: string }>;
}

export interface AnchorNavProps extends Omit<ComponentPropsWithRef<"nav">, "children"> {
    items: AnchorNavItem[];
    /** The section in view; its link gets `aria-current` and the active look. */
    currentId?: string;
    /** Called when a link is clicked (the browser still follows the `#` link). */
    onNavigate?: (id: string) => void;
}

/**
 * In-page section links (Figma persona "Basic Details / Facial Features"): plain `<a href="#…">` links in a `nav`,
 * not tabs, so every section stays on the page. The current one is marked with `aria-current` and shown by
 * weight, colour and a full-strength icon. Tracking which section is in view is the caller's job.
 */
export const AnchorNav = ({ items, currentId, onNavigate, className, "aria-label": ariaLabel = "Sections", ...props }: AnchorNavProps) => (
    <nav {...props} aria-label={ariaLabel} className={cx("flex flex-col items-start gap-3", className)}>
        {items.map(({ id, href, label, icon: Icon }) => (
            <a
                key={id}
                href={href}
                aria-current={id === currentId ? "true" : undefined}
                onClick={() => onNavigate?.(id)}
                className="group flex items-center gap-1 rounded-md text-sm leading-[normal] font-medium text-tertiary outline-focus-ring transition duration-100 ease-linear hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current]:font-semibold aria-[current]:text-secondary"
            >
                {Icon && (
                    <Icon
                        aria-hidden="true"
                        className="size-7 shrink-0 text-fg-primary opacity-20 group-aria-[current]:text-fg-brand-primary group-aria-[current]:opacity-100"
                    />
                )}
                {label}
            </a>
        ))}
    </nav>
);
