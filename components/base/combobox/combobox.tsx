"use client";

import type { FC, FocusEventHandler, PointerEventHandler, ReactNode, Ref, RefAttributes } from "react";
import { isValidElement, useCallback, useContext, useRef, useState } from "react";
import type { ComboBoxProps as AriaComboBoxProps, GroupProps as AriaGroupProps, ListBoxProps as AriaListBoxProps } from "react-aria-components";
import {
    ComboBox as AriaComboBox,
    Group as AriaGroup,
    Input as AriaInput,
    ListBox as AriaListBox,
    Popover as AriaPopover,
    ComboBoxStateContext,
} from "react-aria-components";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { SearchLg } from "@/components/foundations/icons";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";
import { ComboBoxItem } from "./combobox-item";
import { ComboBoxEmptyState, ComboBoxFooter, ComboBoxLoadingState, ComboBoxSection } from "./combobox-parts";
import { type ComboBoxCommonProps, ComboBoxContext, type ComboBoxItemType, popoverMaxHeights, triggerSizes } from "./combobox-shared";

export { type ComboBoxCommonProps, type ComboBoxItemType } from "./combobox-shared";

interface ComboBoxProps extends Omit<AriaComboBoxProps<ComboBoxItemType>, "children" | "items">, RefAttributes<HTMLDivElement>, ComboBoxCommonProps {
    /** Whether to display the ⌘K shortcut hint inside the trigger. */
    shortcut?: boolean;
    /** The items to render in the menu (for dynamic collections). Omit and pass `ComboBox.Section` / `ComboBox.Item` as static children for grouped menus. */
    items?: ComboBoxItemType[];
    /** Additional class name for the popover. */
    popoverClassName?: string;
    /** Additional class name for the ⌘K shortcut hint. */
    shortcutClassName?: string;
    /** Leading icon component displayed before the input. Replaced by a spinner while `isLoading` is true. */
    icon?: FC | ReactNode;
    /** Shows a loading spinner in the trigger and swaps in the default loading menu state. */
    isLoading?: boolean;
    /** Persistent content rendered below the menu, e.g. a "Create new" action. Use `ComboBox.Footer` for the default layout. */
    footer?: ReactNode;
    /** Custom renderer for when the menu has no items. Defaults to a "No results found" state, or a loading state while `isLoading` is true. */
    renderEmptyState?: () => ReactNode;
    children: AriaListBoxProps<ComboBoxItemType>["children"];
}

interface ComboBoxValueProps extends AriaGroupProps {
    size: "sm" | "md" | "lg";
    shortcut: boolean;
    placeholder?: string;
    shortcutClassName?: string;
    icon?: FC | ReactNode;
    isLoading?: boolean;
    onFocus?: FocusEventHandler;
    onPointerEnter?: PointerEventHandler;
    ref?: Ref<HTMLDivElement>;
}

const ComboBoxValue = ({ size, shortcut, placeholder, shortcutClassName, icon: IconProp, isLoading, ref, ...otherProps }: ComboBoxValueProps) => {
    const state = useContext(ComboBoxStateContext);

    const value = state?.selectedItem?.value || null;
    const inputValue = state?.inputValue || null;
    const secondaryText = value?.description || value?.supportingText;

    const first = inputValue?.split(secondaryText)?.[0] || "";
    const last = inputValue?.split(first)[1];

    return (
        <AriaGroup
            ref={ref}
            {...otherProps}
            className={({ isFocusWithin, isDisabled }) =>
                cx(
                    "relative flex w-full items-center gap-2 rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition-shadow duration-100 ease-linear ring-inset",
                    isDisabled && "cursor-not-allowed opacity-50",
                    isFocusWithin && "ring-2 ring-brand",

                    // Icon styles
                    "*:data-icon:shrink-0 *:data-icon:text-fg-quaternary",

                    triggerSizes[size].root,
                )
            }
        >
            {isLoading ? (
                <svg aria-hidden="true" data-icon fill="none" viewBox="0 0 20 20" className="pointer-events-none animate-spin">
                    <circle className="stroke-current opacity-30" cx="10" cy="10" r="8" fill="none" strokeWidth="2" />
                    <circle className="stroke-current" cx="10" cy="10" r="8" fill="none" strokeWidth="2" strokeDasharray="12.5 50" strokeLinecap="round" />
                </svg>
            ) : isReactComponent(IconProp) ? (
                <IconProp data-icon className="pointer-events-none" aria-hidden="true" />
            ) : isValidElement(IconProp) ? (
                IconProp
            ) : (
                <SearchLg data-icon className="pointer-events-none" aria-hidden="true" />
            )}

            <div className="relative flex w-full items-center">
                {inputValue && (
                    <span
                        className={cx("absolute top-1/2 z-0 inline-flex w-full -translate-y-1/2 truncate", triggerSizes[size].textContainer)}
                        aria-hidden="true"
                    >
                        <p className={cx("font-medium text-primary", triggerSizes[size].text)}>{first}</p>
                        {last && <p className={cx("-ml-0.75 text-tertiary", triggerSizes[size].text)}>{last}</p>}
                    </span>
                )}

                <AriaInput
                    placeholder={placeholder}
                    className={cx(
                        "z-10 w-full appearance-none bg-transparent text-transparent caret-alpha-black/90 placeholder:text-placeholder focus:outline-hidden disabled:cursor-not-allowed",
                        triggerSizes[size].text,
                    )}
                />
            </div>

            {shortcut && (
                <div
                    className={cx(
                        "absolute inset-y-0.5 right-0.5 z-10 hidden items-center rounded-r-[inherit] bg-linear-to-r from-transparent to-bg-primary to-40% pl-8 md:flex",
                        triggerSizes[size].shortcut,
                        shortcutClassName,
                    )}
                >
                    <span
                        className="pointer-events-none rounded px-1 py-px text-xs font-medium text-quaternary ring-1 ring-secondary select-none ring-inset"
                        aria-hidden="true"
                    >
                        ⌘K
                    </span>
                </div>
            )}
        </AriaGroup>
    );
};

const ComboBoxRoot = ({
    placeholder = "Search",
    shortcut = true,
    size = "md",
    children,
    items,
    shortcutClassName,
    icon,
    isLoading,
    footer,
    renderEmptyState,
    hideRequiredIndicator,
    ...otherProps
}: ComboBoxProps) => {
    const placeholderRef = useRef<HTMLDivElement>(null);
    const [popoverWidth, setPopoverWidth] = useState("");

    // Resize observer for popover width
    const onResize = useCallback(() => {
        if (!placeholderRef.current) return;

        const divRect = placeholderRef.current?.getBoundingClientRect();

        setPopoverWidth(divRect.width + "px");
    }, [placeholderRef, setPopoverWidth]);

    useResizeObserver({
        ref: placeholderRef,
        box: "border-box",
        onResize,
    });

    const emptyState = renderEmptyState ?? (() => (isLoading ? <ComboBoxLoadingState /> : <ComboBoxEmptyState />));

    return (
        <ComboBoxContext.Provider value={{ size }}>
            <AriaComboBox menuTrigger="focus" {...otherProps}>
                {(state) => (
                    <div className="flex flex-col gap-1.5">
                        {otherProps.label && (
                            <Label isRequired={hideRequiredIndicator ? false : state.isRequired} tooltip={otherProps.tooltip}>
                                {otherProps.label}
                            </Label>
                        )}

                        <ComboBoxValue
                            ref={placeholderRef}
                            placeholder={placeholder}
                            shortcut={shortcut}
                            shortcutClassName={shortcutClassName}
                            icon={icon}
                            isLoading={isLoading}
                            size={size}
                            // This is a workaround to correctly calculating the trigger width
                            // while using ResizeObserver wasn't 100% reliable.
                            onFocus={onResize}
                            onPointerEnter={onResize}
                        />

                        <AriaPopover
                            triggerRef={placeholderRef}
                            placement="bottom"
                            offset={4}
                            containerPadding={0}
                            style={{ width: popoverWidth || undefined }}
                            className={(popoverState) =>
                                cx(
                                    "w-(--trigger-width) origin-(--trigger-anchor-point) overflow-hidden rounded-lg bg-primary shadow-lg ring-1 ring-secondary_alt outline-hidden will-change-transform",
                                    popoverState.isEntering &&
                                        "duration-150 ease-out animate-in fade-in placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                                    popoverState.isExiting &&
                                        "duration-100 ease-in animate-out fade-out placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                                    otherProps.popoverClassName,
                                )
                            }
                        >
                            <div className={cx("overflow-y-auto py-1 outline-hidden", popoverMaxHeights[size])}>
                                <AriaListBox items={items} renderEmptyState={emptyState} className="size-full outline-hidden">
                                    {children}
                                </AriaListBox>
                            </div>

                            {footer}
                        </AriaPopover>

                        {otherProps.hint && (
                            <HintText isInvalid={state.isInvalid} className={cx(size === "sm" && "text-xs")}>
                                {otherProps.hint}
                            </HintText>
                        )}
                    </div>
                )}
            </AriaComboBox>
        </ComboBoxContext.Provider>
    );
};

const ComboBox = ComboBoxRoot as typeof ComboBoxRoot & {
    Item: typeof ComboBoxItem;
    Section: typeof ComboBoxSection;
    Footer: typeof ComboBoxFooter;
    EmptyState: typeof ComboBoxEmptyState;
    LoadingState: typeof ComboBoxLoadingState;
};

ComboBox.Item = ComboBoxItem;
ComboBox.Section = ComboBoxSection;
ComboBox.Footer = ComboBoxFooter;
ComboBox.EmptyState = ComboBoxEmptyState;
ComboBox.LoadingState = ComboBoxLoadingState;

export { ComboBox };
