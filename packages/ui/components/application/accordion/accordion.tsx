"use client";

import type { FC, KeyboardEvent, ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import type {
    DisclosureGroupProps as AriaDisclosureGroupProps,
    DisclosurePanelProps as AriaDisclosurePanelProps,
    DisclosureProps as AriaDisclosureProps,
} from "react-aria-components";
import {
    Button as AriaButton,
    Disclosure as AriaDisclosure,
    DisclosureGroup as AriaDisclosureGroup,
    DisclosurePanel as AriaDisclosurePanel,
    Heading as AriaHeading,
} from "react-aria-components";
import { ChevronDown } from "@/components/foundations/icons";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

type AccordionSize = "sm" | "md";

const AccordionSizeContext = createContext<AccordionSize>("md");

const sizes = sortCx({
    sm: {
        trigger: "gap-2 py-3 text-sm",
        panel: "pb-3 text-sm",
    },
    md: {
        trigger: "gap-3 py-4 text-md",
        panel: "pb-4 text-sm",
    },
});

export interface AccordionProps extends Omit<AriaDisclosureGroupProps, "className"> {
    /** @default "md" */
    size?: AccordionSize;
    className?: string;
}

/**
 * Moves focus between accordion trigger buttons with ArrowUp/ArrowDown/Home/End, per the
 * WAI-ARIA accordion pattern. Enter/Space toggling and Tab order come for free from the
 * underlying `<button>` elements, so this only needs to handle roving arrow-key focus.
 */
const useAccordionKeyboardNav = () => {
    const rootRef = useRef<HTMLDivElement>(null);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

        const triggers = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]:not(:disabled)") ?? []);
        const currentIndex = triggers.findIndex((trigger) => trigger === document.activeElement);
        if (currentIndex === -1 || triggers.length === 0) return;

        let nextIndex = currentIndex;
        if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % triggers.length;
        if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = triggers.length - 1;

        event.preventDefault();
        triggers[nextIndex]?.focus();
    };

    return { rootRef, onKeyDown };
};

/**
 * A group of collapsible sections (an accordion). Supports both single-open and multi-open
 * modes via `allowsMultipleExpanded`, and controlled/uncontrolled expansion via
 * `expandedKeys`/`defaultExpandedKeys`/`onExpandedChange`.
 */
const AccordionRoot = ({ size = "md", className, ...props }: AccordionProps) => {
    const { rootRef, onKeyDown } = useAccordionKeyboardNav();

    return (
        <AccordionSizeContext.Provider value={size}>
            <div ref={rootRef} onKeyDown={onKeyDown}>
                <AriaDisclosureGroup {...props} className={cx("flex w-full flex-col", className)} />
            </div>
        </AccordionSizeContext.Provider>
    );
};

export interface AccordionItemProps extends AriaDisclosureProps {}

/** A single collapsible section. Nest another `Accordion` inside its `Accordion.Panel` for a sub-accordion. */
const AccordionItem = ({ className, ...props }: AccordionItemProps) => (
    <AriaDisclosure
        {...props}
        className={(state) =>
            cx(
                "group border-b border-secondary last:border-b-0",
                state.isDisabled && "opacity-50",
                typeof className === "function" ? className(state) : className,
            )
        }
    />
);

export interface AccordionTriggerProps {
    children?: ReactNode;
    /** Icon rendered before the label. */
    icon?: FC<{ className?: string }>;
}

const AccordionTrigger = ({ children, icon: Icon }: AccordionTriggerProps) => {
    const size = useContext(AccordionSizeContext);

    return (
        <AriaHeading className="flex">
            <AriaButton
                slot="trigger"
                data-accordion-trigger
                className={({ isFocusVisible }) =>
                    cx(
                        "flex w-full cursor-pointer items-center justify-between rounded-md text-left font-semibold text-secondary outline-focus-ring transition duration-100 ease-linear hover:text-secondary_hover disabled:cursor-not-allowed",
                        sizes[size].trigger,
                        isFocusVisible && "outline-2 outline-offset-2",
                    )
                }
            >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                    {isReactComponent(Icon) && <Icon aria-hidden="true" data-icon className="size-5 shrink-0 text-fg-quaternary" />}
                    <span className="truncate">{children}</span>
                </span>

                <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 text-fg-quaternary transition-transform duration-200 ease-in-out group-data-expanded:rotate-180"
                />
            </AriaButton>
        </AriaHeading>
    );
};

export interface AccordionPanelProps extends Omit<AriaDisclosurePanelProps, "className"> {
    className?: string;
}

/**
 * The collapsible content. Animates open/closed by transitioning `height` through the
 * `--disclosure-panel-height` variable that React Aria's `useDisclosure` maintains — it pins the
 * height to pixel values around each toggle, forces a reflow so both directions animate, and only
 * applies the `hidden` attribute after the transition finishes. Respects `prefers-reduced-motion`,
 * and expands naturally to fit however much content is passed in — long content simply makes the
 * panel taller rather than scrolling internally (the height settles back to `auto` after opening).
 */
const AccordionPanel = ({ className, children, ...props }: AccordionPanelProps) => {
    const size = useContext(AccordionSizeContext);

    return (
        <AriaDisclosurePanel
            {...props}
            className={cx(
                "h-[var(--disclosure-panel-height)] overflow-hidden opacity-0 transition-[height,opacity] duration-300 ease-in-out group-data-expanded:opacity-100 motion-reduce:transition-none",
                className,
            )}
        >
            <div className={cx("text-tertiary", sizes[size].panel)}>{children}</div>
        </AriaDisclosurePanel>
    );
};

export const Accordion = AccordionRoot as typeof AccordionRoot & {
    Item: typeof AccordionItem;
    Trigger: typeof AccordionTrigger;
    Panel: typeof AccordionPanel;
};
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Panel = AccordionPanel;
