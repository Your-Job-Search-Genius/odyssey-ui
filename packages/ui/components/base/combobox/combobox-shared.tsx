"use client";

import type { FC, ReactNode } from "react";
import { createContext } from "react";
import type { BadgeColors } from "@/components/base/badges/badge-types";

export type ComboBoxItemType = {
    /** Unique identifier for the item. */
    id: string | number;
    /** The primary display text. */
    label?: string;
    /** Avatar image URL, rendered instead of `icon` when provided. */
    avatarUrl?: string;
    /** Whether the item is disabled. */
    isDisabled?: boolean;
    /** Secondary text displayed inline next to the label (used when `description` is not set). */
    supportingText?: string;
    /** Longer secondary text rendered on its own line below the label. */
    description?: string;
    /** Leading icon component or element. */
    icon?: FC | ReactNode;
    /** Trailing badge text, e.g. a status or role. */
    badgeLabel?: string;
    /** Color of the trailing badge. */
    badgeColor?: BadgeColors;
};

export interface ComboBoxCommonProps {
    /** Helper text displayed below the input. */
    hint?: string;
    /** Field label displayed above the input. */
    label?: string;
    /** Tooltip text for the help icon next to the label. */
    tooltip?: string;
    /**
     * The size of the component.
     * @default "md"
     */
    size?: "sm" | "md" | "lg";
    /** Placeholder text when no value is selected. */
    placeholder?: string;
    /** Whether to hide the required indicator from the label. */
    hideRequiredIndicator?: boolean;
}

export const triggerSizes = {
    sm: { root: "py-2 pl-3 pr-2.5 gap-2 *:data-icon:size-4 *:data-icon:stroke-[2.25px]", text: "text-sm", textContainer: "gap-x-1.5", shortcut: "pr-2.5" },
    md: { root: "py-2 px-3 gap-2 *:data-icon:size-5", text: "text-md", textContainer: "gap-x-1.5", shortcut: "pr-2.5" },
    lg: { root: "py-2.5 px-3.5 gap-2 *:data-icon:size-5", text: "text-md", textContainer: "gap-x-1.5", shortcut: "pr-3" },
};

export const itemSizes = {
    sm: {
        root: "gap-2 p-2 pr-2.5 *:data-icon:size-4 *:data-icon:stroke-[2.25px]",
        text: "text-sm",
        description: "text-xs",
        check: "size-4 stroke-[2.25px]",
    },
    md: { root: "gap-2 p-2 pr-2.5 *:data-icon:size-5", text: "text-md", description: "text-sm", check: "size-5" },
    lg: { root: "gap-2 p-2.5 pl-2 *:data-icon:size-5", text: "text-md", description: "text-sm", check: "size-5" },
};

export const popoverMaxHeights = {
    sm: "max-h-68",
    md: "max-h-76",
    lg: "max-h-92",
};

export const ComboBoxContext = createContext<{ size: "sm" | "md" | "lg" }>({ size: "md" });

/** The list fills the mobile bottom sheet between the pinned search field and footer, instead of a fixed max height. */
export const SHEET_LIST = "max-md:max-h-none! max-md:min-h-0 max-md:flex-1";

/**
 * ListBox props for a combobox's mobile bottom sheet. The combobox normally drives the list with virtual
 * focus from its trigger input; in the sheet that input is behind the modal, so the list uses real focus
 * (Arrow Down from the sheet's search field moves into it). Empty on desktop, so nothing changes there.
 */
export const sheetListBoxProps = (isSheet: boolean) =>
    isSheet
        ? // `shouldUseVirtualFocus` is accepted by the ListBox (forwarded to useListBox) but missing from its public type.
          ({ shouldUseVirtualFocus: false, shouldFocusOnHover: false, autoFocus: false, escapeKeyBehavior: "none" } as Record<string, unknown>)
        : {};
