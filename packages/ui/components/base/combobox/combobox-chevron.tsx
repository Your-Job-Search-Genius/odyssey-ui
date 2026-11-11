"use client";

import { Button as AriaButton } from "react-aria-components";
import { ArrowDown01SharpIcon } from "@/components/foundations/hugeicons";
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
            "flex shrink-0 cursor-pointer items-center justify-center self-center rounded-sm text-primary outline-focus-ring transition duration-100 ease-linear hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed",
            className,
        )}
    >
        <ArrowDown01SharpIcon
            aria-hidden="true"
            className={cx("transition duration-100 ease-linear motion-reduce:transition-none", size === "lg" ? "size-5" : "size-4", isOpen && "rotate-180")}
        />
    </AriaButton>
);
