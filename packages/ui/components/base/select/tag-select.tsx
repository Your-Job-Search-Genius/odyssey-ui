"use client";

import type { FocusEventHandler, KeyboardEvent, MouseEvent, PointerEventHandler, RefAttributes, RefObject } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useControlledState } from "@react-stately/utils";
import { FocusScope, useFilter, useFocusManager } from "react-aria";
import type { ComboBoxProps as AriaComboBoxProps, GroupProps as AriaGroupProps, ListBoxProps as AriaListBoxProps, Key } from "react-aria-components";
import { ComboBox as AriaComboBox, Group as AriaGroup, Input as AriaInput, ListBox as AriaListBox, ComboBoxStateContext } from "react-aria-components";
import type { ListData } from "react-stately";
import { Avatar } from "@/components/base/avatar/avatar";
import type { IconComponentType } from "@/components/base/badges/badge-types";
import { ComboBoxChevron } from "@/components/base/combobox/combobox-chevron";
import { ComboBoxEmptyState } from "@/components/base/combobox/combobox-parts";
import { sheetListBoxProps } from "@/components/base/combobox/combobox-shared";
import { ComboBoxSheetSearch } from "@/components/base/combobox/combobox-sheet-search";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { Popover } from "@/components/base/select/popover";
import { SelectContext, type SelectItemType, sizes } from "@/components/base/select/select-shared";
import { TagCloseX } from "@/components/base/tags/base-components/tag-close-x";
import { SearchLg } from "@/components/foundations/icons";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cx } from "@/utils/cx";
import { SelectItem } from "./select-item";

interface TagSelectValueProps extends AriaGroupProps {
    size: "sm" | "md" | "lg";
    shortcut?: boolean;
    isDisabled?: boolean;
    placeholder?: string;
    shortcutClassName?: string;
    icon?: IconComponentType | null;
    /** Mobile bottom-sheet mode: the trigger only opens the sheet; typing happens in the sheet's search field. */
    isSheet?: boolean;
    ref?: RefObject<HTMLDivElement | null>;
    onFocus?: FocusEventHandler;
    onPointerEnter?: PointerEventHandler;
}

const TagSelectContext = createContext<{
    selectedKeys: Key[];
    selected: SelectItemType[];
    onRemove: (keys: Set<Key>) => void;
    valueFormatter?: (item: SelectItemType) => string;
}>({
    selectedKeys: [],
    selected: [],
    onRemove: () => {},
});

interface TagSelectProps extends Omit<AriaComboBoxProps<SelectItemType>, "children" | "items" | "onSelectionChange">, RefAttributes<HTMLDivElement> {
    hint?: string;
    label?: string;
    tooltip?: string;
    size?: "sm" | "md" | "lg";
    placeholder?: string;
    shortcut?: boolean;
    /** The options. Reactive: replacing the array (e.g. after an async load) updates the menu. */
    items?: SelectItemType[];
    popoverClassName?: string;
    shortcutClassName?: string;
    /**
     * Selection held in a `useListData` list owned by the caller (the original API). Prefer
     * `selectedKeys` / `defaultSelectedKeys` + `onSelectionChange` in new code.
     */
    selectedItems?: ListData<SelectItemType>;
    /** The selected item ids (controlled). Ignored when `selectedItems` is passed. */
    selectedKeys?: Key[];
    /** The initially selected item ids (uncontrolled). */
    defaultSelectedKeys?: Key[];
    /** Called with the full list of selected ids whenever a tag is added or removed. */
    onSelectionChange?: (keys: Key[]) => void;
    /**
     * How options are matched against the typed text. Pass `null` to turn local filtering off when
     * `items` already holds server results for the current input (listen with `onInputChange`).
     * Selected options are always hidden from the menu.
     */
    filter?: ((textValue: string, inputValue: string) => boolean) | null;
    icon?: IconComponentType | null;
    children: AriaListBoxProps<SelectItemType>["children"];
    onItemCleared?: (key: Key) => void;
    onItemInserted?: (key: Key) => void;
    valueFormatter?: (item: SelectItemType) => string;
}

export const TagSelectBase = ({
    items,
    children,
    size = "sm",
    selectedItems,
    selectedKeys: selectedKeysProp,
    defaultSelectedKeys,
    onSelectionChange: onSelectionChangeProp,
    filter: filterProp,
    onItemCleared,
    onItemInserted,
    valueFormatter,
    shortcut,
    placeholder = "Search",
    icon,
    // Omit name to avoid conflicts with the `Select` component
    name: _name,
    className,
    onInputChange: onInputChangeProp,
    ...props
}: TagSelectProps) => {
    const { contains } = useFilter({ sensitivity: "base" });
    const [filterText, setFilterText] = useState("");
    const [keysState, setKeysState] = useControlledState<Key[]>(selectedKeysProp, defaultSelectedKeys ?? [], onSelectionChangeProp);

    // Every option seen so far, so a selected tag keeps its label after `items` is replaced by
    // results that no longer contain it (server-side search).
    const seenItems = useRef(new Map<Key, SelectItemType>());
    for (const item of items ?? []) seenItems.current.set(item.id, item);

    const selected: SelectItemType[] = selectedItems
        ? selectedItems.items
        : keysState.map((key) => seenItems.current.get(key)).filter((item): item is SelectItemType => !!item);
    const selectedKeys = selected.map((item) => item.id);

    const visibleItems = useMemo(() => {
        const matches = filterProp === null ? () => true : (filterProp ?? contains);
        return (items ?? []).filter((item) => !selectedKeys.includes(item.id) && matches(item.label || item.supportingText || "", filterText));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, filterProp, contains, filterText, selectedKeys.join("\u0000")]);

    const onRemove = useCallback(
        (keys: Set<Key>) => {
            const key = keys.values().next().value;

            if (!key) return;

            if (selectedItems) selectedItems.remove(key);
            else setKeysState(keysState.filter((k) => k !== key));
            onItemCleared?.(key);
        },
        [selectedItems, keysState, setKeysState, onItemCleared],
    );

    const handleInputChange = (value: string) => {
        setFilterText(value);
        onInputChangeProp?.(value);
    };

    const onSelectionChange = (id: Key | null) => {
        if (!id) return;

        const item = seenItems.current.get(id);
        if (!item) return;

        if (!selectedKeys.includes(id)) {
            if (selectedItems) selectedItems.append(item);
            else setKeysState([...keysState, id]);
            onItemInserted?.(id);
        }

        handleInputChange("");
    };

    const placeholderRef = useRef<HTMLDivElement>(null);
    const [popoverWidth, setPopoverWidth] = useState("");
    // Below md the menu is a bottom sheet with its own search field (see ComboBoxSheetSearch).
    const isSheet = !useBreakpoint("md");

    // Resize observer for popover width
    const onResize = useCallback(() => {
        if (!placeholderRef.current) return;
        const divRect = placeholderRef.current?.getBoundingClientRect();
        setPopoverWidth(divRect.width + "px");
    }, [placeholderRef, setPopoverWidth]);

    useResizeObserver({
        ref: placeholderRef,
        onResize: onResize,
        box: "border-box",
    });

    return (
        <TagSelectContext.Provider
            value={{
                selectedKeys,
                selected,
                onRemove,
                valueFormatter,
            }}
        >
            <SelectContext.Provider value={{ size }}>
                <AriaComboBox
                    allowsEmptyCollection
                    // Opens on click (handleInputMouseDown), typing or Arrow Down -- not on focus alone.
                    menuTrigger="input"
                    items={visibleItems}
                    onInputChange={handleInputChange}
                    inputValue={filterText}
                    // This keeps the combobox popover open and the input value unchanged when an item is selected.
                    value={null}
                    onChange={onSelectionChange}
                    className={(state) => cx("flex flex-col gap-1.5", typeof className === "function" ? className(state) : className)}
                    {...props}
                >
                    {(state) => (
                        <>
                            {props.label && (
                                <Label isRequired={state.isRequired} tooltip={props.tooltip}>
                                    {props.label}
                                </Label>
                            )}

                            <TagSelectTagsValue
                                size={size}
                                shortcut={shortcut}
                                ref={placeholderRef}
                                placeholder={placeholder}
                                icon={icon}
                                isSheet={isSheet}
                                // This is a workaround to correctly calculating the trigger width
                                // while using ResizeObserver wasn't 100% reliable.
                                onFocus={onResize}
                                onPointerEnter={onResize}
                            />

                            <Popover
                                size={size}
                                triggerRef={placeholderRef}
                                style={{ width: popoverWidth }}
                                className={props?.popoverClassName}
                                // Mobile sheet: modal (backdrop, focus trap, no close when the soft keyboard scrolls the page).
                                isNonModal={isSheet ? false : undefined}
                                aria-label={isSheet ? (typeof props.label === "string" ? props.label : "Options") : undefined}
                            >
                                {isSheet && <ComboBoxSheetSearch size={size} placeholder={placeholder} triggerRef={placeholderRef} />}
                                {/* Escape closes the menu; it must never clear the chosen tags. */}
                                <AriaListBox
                                    {...sheetListBoxProps(isSheet)}
                                    renderEmptyState={isSheet ? () => <ComboBoxEmptyState /> : undefined}
                                    selectionMode="multiple"
                                    escapeKeyBehavior="none"
                                    className="size-full outline-hidden"
                                >
                                    {children}
                                </AriaListBox>
                            </Popover>

                            {props.hint && (
                                <HintText isInvalid={state.isInvalid} className={cx(size === "sm" && "text-xs")}>
                                    {props.hint}
                                </HintText>
                            )}
                        </>
                    )}
                </AriaComboBox>
            </SelectContext.Provider>
        </TagSelectContext.Provider>
    );
};

const InnerTagSelect = ({
    isDisabled,
    isSheet,
    shortcut,
    shortcutClassName,
    placeholder,
    size = "sm",
}: Omit<TagSelectProps, "selectedItems" | "children"> & { isSheet?: boolean }) => {
    const focusManager = useFocusManager();
    const tagSelectContext = useContext(TagSelectContext);
    const comboBoxStateContext = useContext(ComboBoxStateContext);

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const isCaretAtStart = event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd === 0;

        if (!isCaretAtStart && event.currentTarget.value !== "") {
            return;
        }

        switch (event.key) {
            case "Backspace":
            case "ArrowLeft":
                focusManager?.focusPrevious({ wrap: false, tabbable: false });
                break;
            case "ArrowRight":
                focusManager?.focusNext({ wrap: false, tabbable: false });
                break;
        }
    };

    // Ensure dropdown opens on click even if input is already focused
    const handleInputMouseDown = (_event: MouseEvent<HTMLInputElement>) => {
        if (comboBoxStateContext && !comboBoxStateContext.isOpen) {
            comboBoxStateContext.open();
        }
    };

    const handleTagKeyDown = (event: KeyboardEvent<HTMLButtonElement>, value: Key) => {
        // Do nothing when tab is clicked to move focus from the tag to the input element.
        if (event.key === "Tab") {
            return;
        }

        event.preventDefault();

        const isFirstTag = tagSelectContext.selected[0]?.id === value;

        switch (event.key) {
            case " ":
            case "Enter":
            case "Backspace":
                if (isFirstTag) {
                    focusManager?.focusNext({ wrap: false, tabbable: false });
                } else {
                    focusManager?.focusPrevious({ wrap: false, tabbable: false });
                }

                tagSelectContext.onRemove(new Set([value]));
                break;

            case "ArrowLeft":
                focusManager?.focusPrevious({ wrap: false, tabbable: false });
                break;
            case "ArrowRight":
                focusManager?.focusNext({ wrap: false, tabbable: false });
                break;
            case "Escape":
                comboBoxStateContext?.close();
                break;
        }
    };

    const isSelectionEmpty = tagSelectContext.selected.length === 0;

    return (
        <div className="relative flex w-full min-w-0 flex-1 flex-row flex-wrap items-center justify-start gap-1.5">
            {!isSelectionEmpty &&
                tagSelectContext.selected.map((value) => (
                    <span
                        key={value.id}
                        className={cx(
                            "flex min-w-0 items-center rounded-md bg-primary ring-1 ring-primary ring-inset",
                            size === "sm" ? "px-1 py-0.75" : "py-0.5 pr-1 pl-1.25",
                        )}
                    >
                        <Avatar size="xs" alt="" src={value?.avatarUrl} className="size-4" />

                        <p
                            className={cx(
                                "truncate font-medium whitespace-nowrap text-secondary select-none",
                                size === "sm" ? "ml-1 text-xs" : "ml-1.25 text-sm",
                            )}
                        >
                            {tagSelectContext.valueFormatter ? tagSelectContext.valueFormatter(value) : value?.label}
                        </p>

                        <TagCloseX
                            size={size === "sm" ? "sm" : "md"}
                            isDisabled={isDisabled}
                            className="ml-0.75"
                            aria-label={`Remove ${value.label}`}
                            // For workaround, onKeyDown is added to the button
                            onKeyDown={(event) => handleTagKeyDown(event, value.id)}
                            onPress={() => tagSelectContext.onRemove(new Set([value.id]))}
                        />
                    </span>
                ))}

            <div className={cx("relative flex min-w-12 flex-1 flex-row items-center", !isSelectionEmpty && "ml-0.5", shortcut && "min-w-[30%]")}>
                <AriaInput
                    placeholder={placeholder}
                    // Mobile: tapping opens the bottom sheet instead of raising the keyboard here (Backspace still removes tags).
                    readOnly={isSheet || undefined}
                    onKeyDown={handleInputKeyDown}
                    onMouseDown={handleInputMouseDown}
                    className={cx(
                        "w-full flex-[1_0_0] appearance-none bg-transparent text-ellipsis text-primary caret-alpha-black/90 outline-hidden placeholder:text-placeholder focus:outline-hidden disabled:cursor-not-allowed",
                        sizes[size].text,
                    )}
                />

                {shortcut && (
                    <div
                        aria-hidden="true"
                        className={cx(
                            "absolute inset-y-0.5 right-0.5 z-10 hidden items-center rounded-r-[inherit] bg-linear-to-r from-transparent to-bg-primary to-40% pl-8 md:flex",
                            shortcutClassName,
                            sizes[size].shortcut,
                        )}
                    >
                        <span
                            className={cx(
                                "pointer-events-none rounded px-1 py-px text-xs font-medium text-quaternary ring-1 ring-secondary select-none ring-inset",
                                isDisabled && "bg-transparent",
                            )}
                        >
                            ⌘K
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const TagSelectTagsValue = ({
    size = "sm",
    shortcut,
    placeholder,
    shortcutClassName,
    icon: Icon = SearchLg,
    isSheet,
    // Omit this prop to avoid invalid HTML attribute warning
    isDisabled: _isDisabled,
    ...otherProps
}: TagSelectValueProps) => {
    const tagSelectContext = useContext(TagSelectContext);
    const comboBoxState = useContext(ComboBoxStateContext);

    const selectedItemsCount = tagSelectContext.selectedKeys.length;

    return (
        <AriaGroup
            {...otherProps}
            className={({ isFocusWithin, isDisabled }) =>
                cx(
                    "relative flex w-full items-center rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset",
                    isDisabled && "cursor-not-allowed opacity-50",
                    isFocusWithin && "ring-2 ring-brand",

                    // Icon styles
                    "*:data-icon:shrink-0 *:data-icon:text-fg-quaternary",

                    sizes[size].root,

                    // Overwrite vertical padding for small size when there are selected items
                    // to prevent height jump because the tags are taller than the input text.
                    size === "sm" && selectedItemsCount > 0 && "py-1.5",
                )
            }
        >
            {({ isDisabled }) => (
                <>
                    {Icon && <Icon data-icon className="pointer-events-none" />}
                    <FocusScope contain={false} autoFocus={false} restoreFocus={false}>
                        <InnerTagSelect
                            isDisabled={isDisabled}
                            isSheet={isSheet}
                            size={size}
                            shortcut={shortcut}
                            shortcutClassName={shortcutClassName}
                            placeholder={placeholder}
                        />
                    </FocusScope>
                    <ComboBoxChevron size={size} isOpen={comboBoxState?.isOpen} className="ml-2" />
                </>
            )}
        </AriaGroup>
    );
};

const TagSelect = TagSelectBase as typeof TagSelectBase & {
    Item: typeof SelectItem;
};

TagSelect.Item = SelectItem;

export { TagSelect };
