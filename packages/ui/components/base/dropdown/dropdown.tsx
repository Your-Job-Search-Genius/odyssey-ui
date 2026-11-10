"use client";

import { type FC, type ReactNode, type RefAttributes, useCallback, useContext } from "react";
import type {
    ButtonProps as AriaButtonProps,
    MenuItemProps as AriaMenuItemProps,
    MenuProps as AriaMenuProps,
    PopoverProps as AriaPopoverProps,
    SeparatorProps as AriaSeparatorProps,
    SubmenuTriggerProps as AriaSubmenuTriggerProps,
    MenuItemRenderProps,
} from "react-aria-components";
import {
    Button as AriaButton,
    Header as AriaHeader,
    Menu as AriaMenu,
    MenuItem as AriaMenuItem,
    MenuSection as AriaMenuSection,
    MenuTrigger as AriaMenuTrigger,
    OverlayTriggerStateContext as AriaOverlayTriggerStateContext,
    Popover as AriaPopover,
    PopoverContext as AriaPopoverContext,
    Separator as AriaSeparator,
    SubmenuTrigger as AriaSubmenuTrigger,
    useSlottedContext,
} from "react-aria-components";
import { Check, ChevronLeft, ChevronRight, DotsVertical } from "@/components/foundations/icons";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cx } from "@/utils/cx";
import { SHEET_POPOVER } from "@/utils/sheet-popover";
import { Avatar } from "../avatar/avatar";
import { CheckboxBase } from "../checkbox/checkbox";
import { RadioButtonBase } from "../radio-buttons/radio-buttons";
import { ToggleBase } from "../toggle/toggle";

interface DropdownItemProps extends AriaMenuItemProps {
    /** The label of the item to be displayed. */
    label?: string;
    /** An addon to be displayed on the right side of the item. */
    addon?: string;
    /** A count shown in a small chip right after the label, e.g. `32` for "All 32". */
    count?: ReactNode;
    /** If true, the item will not have any styles. */
    unstyled?: boolean;
    /** An icon to be displayed on the left side of the item. */
    icon?: FC<{ className?: string }>;
    /** Avatar URL to be displayed on the left side of the item. */
    avatarUrl?: string;
    /** The selection indicator to be displayed on the item. */
    selectionIndicator?: "checkmark" | "checkbox" | "radio" | "toggle" | "none";
    /**
     * `destructive` colors the label, icon and highlight with the error tokens, for actions such as
     * Delete or Remove. Still confirm irreversible actions with a dialog; color alone is not a warning.
     * @default "default"
     */
    variant?: "default" | "destructive";
}

const DropdownItem = ({
    label,
    children,
    addon,
    count,
    icon: Icon,
    avatarUrl,
    unstyled,
    selectionIndicator = "checkmark",
    variant = "default",
    ...props
}: DropdownItemProps) => {
    const isDestructive = variant === "destructive";

    const SelectionIndicator = useCallback(
        (state: MenuItemRenderProps & { className?: string }) => {
            if (selectionIndicator === "checkmark") {
                return (
                    <Check
                        aria-hidden="true"
                        className={cx("size-4 shrink-0 stroke-[2.25px] text-fg-brand-primary", !state.isSelected && "invisible", state.className)}
                    />
                );
            }
            if (selectionIndicator === "checkbox") {
                return (
                    <CheckboxBase
                        isSelected={state.isSelected && !state.hasSubmenu}
                        isIndeterminate={state.isSelected && state.hasSubmenu}
                        size="sm"
                        className={cx("shrink-0", state.className)}
                    />
                );
            }
            if (selectionIndicator === "radio") {
                return <RadioButtonBase isSelected={state.isSelected} className={cx("shrink-0", state.className)} />;
            }
            if (selectionIndicator === "toggle") {
                return <ToggleBase slim size="sm" isSelected={state.isSelected} className={cx("shrink-0", state.className)} />;
            }
            return null;
        },
        [selectionIndicator],
    );

    if (unstyled) {
        return <AriaMenuItem id={label} textValue={label} {...props} />;
    }

    return (
        <AriaMenuItem
            {...props}
            className={(state) =>
                cx(
                    "group block cursor-pointer outline-hidden",
                    state.isDisabled && "cursor-not-allowed opacity-50",
                    typeof props.className === "function" ? props.className(state) : props.className,
                )
            }
        >
            {(state) => (
                <div
                    className={cx(
                        "relative flex items-center rounded-md p-2 outline-focus-ring transition duration-100 ease-linear",
                        !state.isDisabled && (isDestructive ? "group-hover:bg-error-primary" : "group-hover:bg-primary_hover"),
                        state.isFocused && (isDestructive ? "bg-error-primary" : "bg-primary_hover"),
                        state.isFocusVisible && "outline-2 -outline-offset-2",
                        state.hasSubmenu && "pr-1.5",
                    )}
                >
                    {state.selectionMode !== "none" && !avatarUrl && !Icon && <SelectionIndicator {...state} className="mr-2" />}

                    {avatarUrl && (
                        <div className="mr-2 flex size-4 items-center justify-center">
                            <Avatar aria-hidden="true" size="xs" src={avatarUrl} alt="" className="size-5" />
                        </div>
                    )}

                    {Icon && (
                        <Icon
                            aria-hidden="true"
                            className={cx("mr-2 size-4 shrink-0 stroke-[2.25px]", isDestructive ? "text-fg-error-secondary" : "text-fg-quaternary")}
                        />
                    )}

                    <span
                        className={cx(
                            "truncate text-[15px] leading-5 font-medium",
                            count === undefined && "grow",
                            isDestructive ? "text-error-primary" : "text-primary",
                        )}
                    >
                        {label || (typeof children === "function" ? children(state) : children)}
                    </span>

                    {count !== undefined && (
                        <span className="mr-auto ml-2 flex h-[19px] min-w-[23px] shrink-0 items-center justify-center rounded-[5px] bg-border-secondary px-1 text-[13px] leading-5 font-medium text-primary">
                            {count}
                        </span>
                    )}

                    {addon && <span className="ml-1 shrink-0 pr-1 text-xs font-medium text-quaternary">{addon}</span>}

                    {state.selectionMode !== "none" && (avatarUrl || Icon) && <SelectionIndicator {...state} className="ml-1" />}

                    {state.hasSubmenu && <ChevronRight aria-hidden="true" className="ml-auto size-4 shrink-0 stroke-[2.25px] text-fg-quaternary" />}
                </div>
            )}
        </AriaMenuItem>
    );
};

interface DropdownMenuProps<T extends object> extends AriaMenuProps<T> {}

const DropdownMenu = <T extends object>(props: DropdownMenuProps<T>) => {
    return (
        <AriaMenu
            {...props}
            className={(state) =>
                cx("h-min overflow-y-auto p-0.5 outline-hidden select-none", typeof props.className === "function" ? props.className(state) : props.className)
            }
        />
    );
};

interface DropdownPopoverProps extends AriaPopoverProps {}

const DropdownPopover = (props: DropdownPopoverProps) => {
    const isDesktop = useBreakpoint("md");
    // Inside a SubmenuTrigger, these are the submenu's own popover settings and open state.
    const popoverContext = useSlottedContext(AriaPopoverContext);
    const submenuState = useContext(AriaOverlayTriggerStateContext);
    // A submenu opens as a stacked sheet below md; touch has no Escape, so it needs its own way back one level.
    const showBack = !isDesktop && popoverContext?.trigger === "SubmenuTrigger";

    return (
        <AriaPopover
            placement="bottom right"
            {...props}
            className={(state) =>
                cx(
                    "w-62 origin-(--trigger-anchor-point) overflow-auto rounded-xl bg-primary shadow-[0_30px_30px_rgba(0,0,0,0.05)] ring-1 ring-secondary will-change-transform ring-inset",
                    state.isEntering &&
                        "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                    state.isExiting &&
                        "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                    typeof props.className === "function" ? props.className(state) : props.className,

                    // Bottom sheet below md (submenus stack as a second sheet); after the consumer's width so it wins.
                    SHEET_POPOVER,
                )
            }
        >
            {(renderProps) => (
                <>
                    {showBack && (
                        <button
                            type="button"
                            onClick={() => submenuState?.close()}
                            className="sticky top-0 z-10 flex w-full shrink-0 cursor-pointer items-center gap-2 border-b border-secondary bg-primary px-4 py-2.5 text-sm font-semibold text-secondary outline-focus-ring focus-visible:outline-2 focus-visible:-outline-offset-2"
                        >
                            <ChevronLeft aria-hidden="true" className="size-4 text-fg-quaternary" />
                            Back
                        </button>
                    )}
                    {typeof props.children === "function" ? props.children(renderProps) : props.children}
                </>
            )}
        </AriaPopover>
    );
};

/** Longest timer browsers allow (~24.8 days): the submenu hover delay never elapses. */
const NEVER = 2 ** 31 - 1;

/**
 * Submenus open on tap below md, as a sheet stacked over the parent menu sheet. Hover-to-open (a mouse at
 * high zoom) would cover the parent sheet; useSubmenuTrigger has no hover opt-out, so its delay never elapses.
 */
const DropdownSubmenuTrigger = (props: AriaSubmenuTriggerProps) => {
    const isDesktop = useBreakpoint("md");
    return <AriaSubmenuTrigger delay={isDesktop ? undefined : NEVER} {...props} />;
};

const DropdownSeparator = (props: AriaSeparatorProps) => {
    // Inset to the item text (2px menu + 8px item padding); -mb-px makes the line take no height, so the rows either side keep 8px of air each, as drawn.
    return <AriaSeparator {...props} className={cx("mx-2 -mb-px h-px bg-border-secondary", props.className)} />;
};

const DropdownDotsButton = (props: AriaButtonProps & RefAttributes<HTMLButtonElement>) => {
    return (
        <AriaButton
            // Default name only: placed before the spread so callers can give the menu a specific one ("Actions for Acme").
            aria-label="Open menu"
            {...props}
            className={(state) =>
                cx(
                    "cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear",
                    (state.isPressed || state.isHovered) && "text-fg-quaternary_hover",
                    (state.isPressed || state.isFocusVisible) && "outline-2 outline-offset-2",
                    typeof props.className === "function" ? props.className(state) : props.className,
                )
            }
        >
            <DotsVertical className="size-5 transition-inherit-all" />
        </AriaButton>
    );
};

export const Dropdown = {
    Root: AriaMenuTrigger,
    Popover: DropdownPopover,
    SubmenuTrigger: DropdownSubmenuTrigger,
    Menu: DropdownMenu,
    Section: AriaMenuSection,
    SectionHeader: AriaHeader,
    Item: DropdownItem,
    Separator: DropdownSeparator,
    DotsButton: DropdownDotsButton,
};
