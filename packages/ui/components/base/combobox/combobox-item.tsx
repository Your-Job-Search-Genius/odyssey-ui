"use client";

import { isValidElement, useContext } from "react";
import type { ListBoxItemProps as AriaListBoxItemProps } from "react-aria-components";
import { ListBoxItem as AriaListBoxItem, Text as AriaText } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Check } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";
import { ComboBoxContext, type ComboBoxItemType, itemSizes } from "./combobox-shared";

interface ComboBoxItemProps extends Omit<AriaListBoxItemProps<ComboBoxItemType>, "id">, ComboBoxItemType {
    /** The selection indicator to be displayed when the item is the current value. */
    selectionIndicator?: "checkmark" | "none";
}

export const ComboBoxItem = ({
    label,
    id,
    value,
    avatarUrl,
    supportingText,
    description,
    badgeLabel,
    badgeColor = "gray",
    isDisabled,
    icon: Icon,
    className,
    children,
    selectionIndicator = "checkmark",
    ...props
}: ComboBoxItemProps) => {
    const { size } = useContext(ComboBoxContext);

    const labelOrChildren = label || (typeof children === "string" ? children : "");
    const textValue = [labelOrChildren, description || supportingText].filter(Boolean).join(" ");

    return (
        <AriaListBoxItem
            id={id}
            value={
                value ?? {
                    id,
                    label: labelOrChildren,
                    avatarUrl,
                    supportingText,
                    description,
                    badgeLabel,
                    badgeColor,
                    isDisabled,
                    icon: Icon,
                }
            }
            textValue={textValue}
            isDisabled={isDisabled}
            {...props}
            className={(state) =>
                cx("w-full py-px outline-hidden", size === "sm" ? "px-1" : "px-1.5", typeof className === "function" ? className(state) : className)
            }
        >
            {(state) => (
                <div
                    className={cx(
                        "flex cursor-pointer items-start rounded-md outline-hidden select-none",
                        (state.isFocused || state.isHovered) && "bg-primary_hover",
                        state.isDisabled && "cursor-not-allowed opacity-50",
                        state.isFocusVisible && "ring-2 ring-focus-ring ring-inset",

                        // Icon styles
                        "*:data-icon:mt-0.5 *:data-icon:shrink-0 *:data-icon:text-fg-quaternary",

                        itemSizes[size].root,
                    )}
                >
                    {avatarUrl ? (
                        <Avatar aria-hidden="true" size="xs" src={avatarUrl} alt={label} className={cx("mt-0.5", size === "sm" && "size-5")} />
                    ) : isReactComponent(Icon) ? (
                        <Icon data-icon aria-hidden="true" />
                    ) : isValidElement(Icon) ? (
                        Icon
                    ) : null}

                    <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex w-full items-center gap-1.5">
                            <AriaText slot="label" className={cx("truncate font-medium text-primary", itemSizes[size].text)}>
                                {label || (typeof children === "function" ? children(state) : children)}
                            </AriaText>

                            {supportingText && !description && <span className={cx("truncate text-tertiary", itemSizes[size].text)}>{supportingText}</span>}

                            {badgeLabel && (
                                <Badge size="sm" color={badgeColor} className="ml-auto shrink-0">
                                    {badgeLabel}
                                </Badge>
                            )}

                            {!badgeLabel && state.isSelected && selectionIndicator === "checkmark" && (
                                <Check aria-hidden="true" className={cx("ml-auto shrink-0 text-fg-brand-primary", itemSizes[size].check)} />
                            )}
                        </div>

                        {description && (
                            <AriaText slot="description" className={cx("truncate text-tertiary", itemSizes[size].description)}>
                                {description}
                            </AriaText>
                        )}
                    </div>

                    {badgeLabel && state.isSelected && selectionIndicator === "checkmark" && (
                        <Check aria-hidden="true" className={cx("mt-0.5 ml-1 shrink-0 text-fg-brand-primary", itemSizes[size].check)} />
                    )}
                </div>
            )}
        </AriaListBoxItem>
    );
};
