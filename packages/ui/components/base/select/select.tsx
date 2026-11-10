"use client";

import type { FC, ReactNode, Ref, RefAttributes } from "react";
import { isValidElement } from "react";
import type { SelectProps as AriaSelectProps } from "react-aria-components";
import { Button as AriaButton, ListBox as AriaListBox, Select as AriaSelect, SelectValue as AriaSelectValue } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { ArrowDown01SharpIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";
import { ComboBox } from "./combobox";
import { Popover } from "./popover";
import { SelectItem } from "./select-item";
import { type CommonProps, SelectContext, type SelectItemType, sizes } from "./select-shared";

export { SelectContext, sizes, type CommonProps, type SelectItemType } from "./select-shared";

export interface SelectProps extends Omit<AriaSelectProps<SelectItemType>, "children" | "items">, RefAttributes<HTMLDivElement>, CommonProps {
    items?: SelectItemType[];
    popoverClassName?: string;
    icon?: FC | ReactNode;
    /**
     * `"field"` is the form-field trigger. `"button"` is a compact 32px trigger styled like a secondary
     * button, with a divider before the chevron, sized to its content (e.g. a version picker in a toolbar).
     * `"button"` always uses the sm text and icon sizes; `size` then only sets the list's max height.
     * @default "field"
     */
    variant?: "field" | "button";
    children: ReactNode | ((item: SelectItemType) => ReactNode);
}

interface SelectValueProps {
    isOpen: boolean;
    size: "sm" | "md" | "lg";
    isFocused: boolean;
    isInvalid?: boolean;
    isDisabled: boolean;
    placeholder?: string;
    ref?: Ref<HTMLButtonElement>;
    icon?: FC | ReactNode;
    variant?: "field" | "button";
}

const SelectValue = ({ isOpen, isFocused, isInvalid, isDisabled, size, placeholder, icon, variant = "field", ref }: SelectValueProps) => {
    const isButton = variant === "button";

    return (
        <AriaButton
            ref={ref}
            className={cx(
                "relative flex w-full cursor-pointer items-center rounded-[10px] bg-primary ring-1 ring-secondary outline-hidden transition duration-100 ease-linear ring-inset",
                isButton && "rounded-lg shadow-xs",
                (isFocused || isOpen) && "ring-2 ring-brand",
                isInvalid && "ring-error_subtle",
                isInvalid && (isFocused || isOpen) && "ring-2 ring-error",
                isDisabled && "cursor-not-allowed opacity-50",
            )}
        >
            <AriaSelectValue<SelectItemType>
                className={(state) =>
                    cx(
                        "flex h-max w-full items-center justify-start truncate text-left align-middle",

                        sizes[size].root,

                        // With icon
                        (state.selectedItems[0]?.icon || icon) && sizes[size].withIcon,

                        // Icon styles
                        "*:data-icon:shrink-0 *:data-icon:text-fg-quaternary",

                        isButton && "gap-1 px-2 py-1.5 *:data-icon:text-primary",
                    )
                }
            >
                {(state) => {
                    const selectedItem = state.selectedItems[0];
                    const Icon = selectedItem?.icon || icon;

                    return (
                        <>
                            {selectedItem?.avatarUrl ? (
                                <Avatar size="xs" src={selectedItem.avatarUrl} alt="" className={cx(size === "sm" && "size-5")} />
                            ) : isReactComponent(Icon) ? (
                                <Icon data-icon aria-hidden="true" />
                            ) : isValidElement(Icon) ? (
                                Icon
                            ) : null}

                            {selectedItem ? (
                                <section className={cx("flex w-full truncate", sizes[size].textContainer)}>
                                    <p className={cx("truncate font-medium text-primary", sizes[size].text)}>{selectedItem?.label}</p>
                                    {selectedItem?.supportingText && <p className={cx("text-tertiary", sizes[size].text)}>{selectedItem?.supportingText}</p>}
                                </section>
                            ) : (
                                <p className={cx("text-placeholder", sizes[size].text)}>{placeholder}</p>
                            )}

                            {isButton && <span aria-hidden="true" className="ml-auto h-5 w-px shrink-0 bg-border-secondary" />}

                            <ArrowDown01SharpIcon
                                aria-hidden="true"
                                className={cx(
                                    "shrink-0 text-primary transition duration-100 ease-linear in-aria-expanded:rotate-180 motion-reduce:transition-none",
                                    !isButton && "ml-auto",
                                    size === "lg" ? "size-5" : "size-4",
                                )}
                            />
                        </>
                    );
                }}
            </AriaSelectValue>
        </AriaButton>
    );
};

const Select = ({
    placeholder = "Select",
    icon,
    variant = "field",
    size = "md",
    children,
    items,
    label,
    hint,
    tooltip,
    hideRequiredIndicator,
    className,
    ...rest
}: SelectProps) => {
    return (
        <SelectContext.Provider value={{ size }}>
            <AriaSelect
                {...rest}
                className={(state) =>
                    cx("flex flex-col gap-1.5", variant === "button" && "w-fit", typeof className === "function" ? className(state) : className)
                }
            >
                {(state) => (
                    <>
                        {label && (
                            <Label isRequired={hideRequiredIndicator ? false : state.isRequired} tooltip={tooltip}>
                                {label}
                            </Label>
                        )}

                        <SelectValue {...state} {...{ placeholder, variant }} size={variant === "button" ? "sm" : size} icon={icon} />

                        <Popover size={size} className={rest.popoverClassName}>
                            <AriaListBox items={items} className="size-full outline-hidden">
                                {children}
                            </AriaListBox>
                        </Popover>

                        {hint && (
                            <HintText isInvalid={state.isInvalid} className={cx(size === "sm" && "text-xs")}>
                                {hint}
                            </HintText>
                        )}
                    </>
                )}
            </AriaSelect>
        </SelectContext.Provider>
    );
};

const _Select = Select as typeof Select & {
    ComboBox: typeof ComboBox;
    Item: typeof SelectItem;
};
_Select.ComboBox = ComboBox;
_Select.Item = SelectItem;

export { _Select as Select };
