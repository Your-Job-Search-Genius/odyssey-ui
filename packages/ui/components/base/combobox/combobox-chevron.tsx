"use client";

import { Button as AriaButton } from "react-aria-components";
import { ChevronDown } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";

interface ComboBoxChevronProps {
    size: "sm" | "md" | "lg";
    isOpen?: boolean;
    className?: string;
}

/**
 * The open/closed chevron of a combobox, as a real button. Inside a React Aria
 * ComboBox it picks up the toggle behaviour and accessible name ("Show
 * suggestions") from ButtonContext; pressing it opens the list and moves focus
 * to the input (first option highlighted from the keyboard). React Aria keeps
 * this button out of the tab order by default; it is made a tab stop here.
 */
export const ComboBoxChevron = ({ size, isOpen, className }: ComboBoxChevronProps) => (
    <AriaButton
        excludeFromTabOrder={false}
        className={cx(
            "flex shrink-0 cursor-pointer items-center justify-center self-center rounded-sm text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed",
            className,
        )}
    >
        <ChevronDown
            aria-hidden="true"
            className={cx("transition duration-100 ease-linear", size === "lg" ? "size-5" : "size-4 stroke-[2.25px]", isOpen && "rotate-180")}
        />
    </AriaButton>
);
