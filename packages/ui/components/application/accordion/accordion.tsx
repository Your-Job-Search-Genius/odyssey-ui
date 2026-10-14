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
    DisclosureStateContext as AriaDisclosureStateContext,
    Heading as AriaHeading,
} from "react-aria-components";
import { ChevronDown, Minus, Plus } from "@/components/foundations/icons";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

type AccordionSize = "sm" | "md";
type AccordionVariant = "divider" | "card" | "filled" | "badge" | "issue" | "suggestion";

const AccordionContext = createContext<{ size: AccordionSize; variant: AccordionVariant }>({ size: "md", variant: "divider" });

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

const variants = sortCx({
    divider: {
        root: "",
        item: "border-b border-secondary last:border-b-0",
        trigger: "rounded-md text-secondary hover:text-secondary_hover",
        panel: "",
    },
    /** Separate bordered cards, e.g. repeatable form sections. */
    card: {
        root: "gap-4",
        item: "rounded-lg border border-secondary bg-primary",
        trigger: "rounded-lg border-secondary p-3 text-secondary hover:bg-secondary aria-expanded:rounded-b-none aria-expanded:border-b",
        panel: "p-4",
    },
    /** Rounded cards with a tinted brand header bar. */
    filled: {
        root: "gap-6",
        item: "overflow-hidden rounded-2xl border border-secondary bg-primary",
        trigger: "border-secondary bg-brand-primary px-4 py-3 text-md/7 text-primary -outline-offset-2 hover:opacity-80 aria-expanded:border-b",
        panel: "p-4",
    },
    /** Rounded sections whose header is an icon + uppercase label pill (cover letter review panel). */
    badge: {
        root: "gap-5",
        item: "rounded-[20px] border border-secondary bg-primary p-2",
        trigger: "h-8 rounded-md py-0 pr-2 text-sm font-medium",
        panel: "flex flex-col gap-1.5 pt-1.5 pb-0",
    },
    /** Tinted error cards with a +/- toggle, nested inside a `badge` section. Pair with `Accordion.Item isActive`. */
    issue: {
        root: "gap-1.5",
        item: "overflow-hidden rounded-lg border-2 border-transparent bg-error-primary transition-[border-color] duration-150",
        trigger: "items-start px-3 py-2.5 text-sm font-medium text-primary -outline-offset-4",
        panel: "rounded-[10px] bg-primary p-2.5 text-primary",
    },
    /** Compact brand-tinted block, e.g. a suggested rewrite inside an `issue` card. */
    suggestion: {
        root: "gap-2",
        item: "rounded-[10px] bg-brand-primary px-2.25 py-1.75",
        trigger: "py-0.5 text-sm font-semibold text-primary",
        panel: "px-1 pt-2 pb-1 text-sm font-medium text-primary",
    },
});

const badgeColors = sortCx({
    gray: { pill: "bg-tertiary", icon: "text-fg-quaternary" },
    brand: { pill: "bg-brand-primary", icon: "text-fg-brand-primary" },
    error: { pill: "bg-tertiary", icon: "text-fg-error-primary" },
});

export interface AccordionProps extends Omit<AriaDisclosureGroupProps, "className"> {
    /** @default "md" */
    size?: AccordionSize;
    /** `divider`: rows split by hairlines. `card`: each item is its own bordered card. `filled`: rounded cards with a tinted header. `badge`: rounded sections with an icon + label pill header. `issue`: tinted error cards with a +/- toggle. `suggestion`: compact brand-tinted block. @default "divider" */
    variant?: AccordionVariant;
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
const AccordionRoot = ({ size = "md", variant = "divider", className, ...props }: AccordionProps) => {
    const { rootRef, onKeyDown } = useAccordionKeyboardNav();

    return (
        <AccordionContext.Provider value={{ size, variant }}>
            {/* `className` sits on this outer element so width utilities (e.g. `max-w-md`) size the whole accordion. */}
            <div ref={rootRef} onKeyDown={onKeyDown} className={cx("w-full", className)}>
                <AriaDisclosureGroup {...props} className={cx("flex w-full flex-col", variants[variant].root)} />
            </div>
        </AccordionContext.Provider>
    );
};

export interface AccordionItemProps extends AriaDisclosureProps {
    /** Highlights the item as the current selection (`issue` variant: red border). */
    isActive?: boolean;
}

/** A single collapsible section. Nest another `Accordion` inside its `Accordion.Panel` for a sub-accordion. */
const AccordionItem = ({ className, isActive, ...props }: AccordionItemProps) => {
    const { variant } = useContext(AccordionContext);

    return (
        <AriaDisclosure
            {...props}
            className={(state) =>
                cx(
                    "group",
                    variants[variant].item,
                    isActive && "border-error",
                    state.isDisabled && "opacity-50",
                    typeof className === "function" ? className(state) : className,
                )
            }
        />
    );
};

export interface AccordionTriggerProps {
    children?: ReactNode;
    /** Icon rendered before the label. */
    icon?: FC<{ className?: string }>;
    /** Pill and icon tint for `variant="badge"`; ignored by other variants. @default "gray" */
    badgeColor?: keyof typeof badgeColors;
}

const AccordionTrigger = ({ children, icon: Icon, badgeColor = "gray" }: AccordionTriggerProps) => {
    const { size, variant } = useContext(AccordionContext);
    const isBadge = variant === "badge";

    return (
        <AriaHeading className="flex">
            <AriaButton
                slot="trigger"
                data-accordion-trigger
                className={({ isFocusVisible }) =>
                    cx(
                        "group/trigger flex w-full cursor-pointer items-center justify-between text-left font-semibold outline-focus-ring transition duration-100 ease-linear disabled:cursor-not-allowed",
                        sizes[size].trigger,
                        isFocusVisible && "outline-2 outline-offset-2",
                        variants[variant].trigger,
                    )
                }
            >
                {isBadge ? (
                    <span className={cx("flex min-w-0 items-center gap-1 rounded-full py-1.5 pr-2.25 pl-1.5", badgeColors[badgeColor].pill)}>
                        {isReactComponent(Icon) && <Icon aria-hidden="true" data-icon className={cx("size-4.5 shrink-0", badgeColors[badgeColor].icon)} />}
                        <span className="truncate tracking-[0.98px] text-primary uppercase">{children}</span>
                    </span>
                ) : (
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                        {isReactComponent(Icon) && <Icon aria-hidden="true" data-icon className="size-5 shrink-0 text-fg-quaternary" />}
                        <span className={cx(variant !== "issue" && "truncate")}>{children}</span>
                    </span>
                )}

                {variant === "issue" ? (
                    <>
                        <Plus aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-primary group-aria-expanded/trigger:hidden" />
                        <Minus aria-hidden="true" className="mt-0.5 hidden size-4 shrink-0 text-fg-primary group-aria-expanded/trigger:block" />
                    </>
                ) : (
                    <ChevronDown
                        aria-hidden="true"
                        className={cx(
                            "shrink-0 text-fg-quaternary transition-transform duration-200 ease-in-out group-aria-expanded/trigger:rotate-180",
                            isBadge ? "size-4.5" : "size-5",
                            variant === "suggestion" && "size-4 text-fg-primary",
                        )}
                    />
                )}
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
    const { size, variant } = useContext(AccordionContext);
    // This item's own state; a `group-*` variant would also match an expanded ancestor item when nested.
    const isExpanded = useContext(AriaDisclosureStateContext)?.isExpanded;

    return (
        <AriaDisclosurePanel
            {...props}
            className={cx(
                "h-[var(--disclosure-panel-height)] overflow-hidden opacity-0 transition-[height,opacity] duration-300 ease-in-out motion-reduce:transition-none",
                isExpanded && "opacity-100",
                className,
            )}
        >
            <div className={cx("text-tertiary", sizes[size].panel, variants[variant].panel)}>{children}</div>
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
