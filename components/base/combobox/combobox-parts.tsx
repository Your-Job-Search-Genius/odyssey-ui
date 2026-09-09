"use client";

import type { ReactNode } from "react";
import type { Key } from "react-aria-components";
import { Header as AriaHeader, ListBoxSection as AriaListBoxSection } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { SearchLg } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";

interface ComboBoxSectionProps {
    /** Unique identifier for the section, required only when built from dynamic `items`. */
    id?: Key;
    /** The section heading. */
    label: string;
    /** The `ComboBox.Item`s that belong to this section. */
    children: ReactNode;
    /** Additional class name. */
    className?: string;
}

export const ComboBoxSection = ({ id, label, children, className }: ComboBoxSectionProps) => (
    <AriaListBoxSection id={id} className={cx("mb-1 last:mb-0", className)}>
        <AriaHeader className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-quaternary uppercase select-none">{label}</AriaHeader>
        {children}
    </AriaListBoxSection>
);

interface ComboBoxFooterProps {
    /** The content of the footer, e.g. a "Create new" button. */
    children: ReactNode;
    /** Additional class name. */
    className?: string;
}

export const ComboBoxFooter = ({ children, className }: ComboBoxFooterProps) => (
    <div className={cx("flex items-center border-t border-secondary p-3", className)}>{children}</div>
);

interface ComboBoxEmptyStateProps {
    /**
     * The title to display.
     * @default "No results found"
     */
    title?: string;
    /**
     * The description to display.
     * @default "Please try a different search term."
     */
    description?: string;
    /** Handler that is called when the clear search button is clicked. */
    onClearSearch?: () => void;
    /** Additional class name. */
    className?: string;
}

export const ComboBoxEmptyState = ({
    title = "No results found",
    description = "Please try a different search term.",
    onClearSearch,
    className,
}: ComboBoxEmptyStateProps) => (
    <div className={cx("flex flex-col items-center gap-3 px-4 py-4", className)}>
        <div className="flex flex-col items-center gap-3">
            <FeaturedIcon icon={SearchLg} size="sm" color="gray" theme="modern" />
            <div className="flex flex-col items-center gap-0.5 text-center text-sm">
                <p className="font-semibold text-primary">{title}</p>
                <p className="text-tertiary">{description}</p>
            </div>
        </div>
        {onClearSearch && (
            <Button size="sm" color="link-color" onClick={onClearSearch}>
                Clear search
            </Button>
        )}
    </div>
);

interface ComboBoxLoadingStateProps {
    /**
     * The text to display alongside the spinner.
     * @default "Loading…"
     */
    label?: string;
    /** Additional class name. */
    className?: string;
}

export const ComboBoxLoadingState = ({ label = "Loading…", className }: ComboBoxLoadingStateProps) => (
    <div className={cx("flex flex-col items-center gap-2 px-4 py-6", className)}>
        <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" className="size-5 text-fg-quaternary">
            <circle className="stroke-current opacity-30" cx="10" cy="10" r="8" fill="none" strokeWidth="2" />
            <circle
                className="origin-center animate-spin stroke-current"
                cx="10"
                cy="10"
                r="8"
                fill="none"
                strokeWidth="2"
                strokeDasharray="12.5 50"
                strokeLinecap="round"
            />
        </svg>
        <p className="text-sm text-tertiary">{label}</p>
    </div>
);
