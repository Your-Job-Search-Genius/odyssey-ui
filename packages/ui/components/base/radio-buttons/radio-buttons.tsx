"use client";

import { type ReactNode, type Ref, createContext, useContext, useId } from "react";
import {
    Radio as AriaRadio,
    RadioGroup as AriaRadioGroup,
    type RadioGroupProps as AriaRadioGroupProps,
    type RadioProps as AriaRadioProps,
} from "react-aria-components";
import { cx } from "@/utils/cx";

export interface RadioGroupContextType {
    size?: "sm" | "md";
    /**
     * Surface the radios sit on. `"inverse"` is for dark surfaces (e.g. the `bg-inverse` dialog shell):
     * labels turn white, hints `text-inverse-secondary`, and the focus outline turns white. The circle
     * itself is unchanged; it already reads on dark.
     * @default "default"
     */
    tone?: "default" | "inverse";
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export interface RadioButtonBaseProps {
    size?: "sm" | "md";
    tone?: "default" | "inverse";
    className?: string;
    isFocusVisible?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
}

export const RadioButtonBase = ({ className, isFocusVisible, isSelected, isDisabled, size = "sm", tone = "default" }: RadioButtonBaseProps) => {
    return (
        <div
            className={cx(
                "flex size-4 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full bg-primary ring-1 ring-primary ring-inset",
                size === "md" && "size-5",
                isSelected && "bg-brand-primary ring-brand-solid",
                isDisabled && "cursor-not-allowed opacity-50",
                isDisabled && !isSelected && "bg-tertiary",
                isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                isFocusVisible && tone === "inverse" && "outline-white",
                className,
            )}
        >
            <div
                className={cx("size-1.5 rounded-full bg-brand-solid opacity-0 transition-inherit-all", size === "md" && "size-2", isSelected && "opacity-100")}
            />
        </div>
    );
};
RadioButtonBase.displayName = "RadioButtonBase";

interface RadioButtonProps extends AriaRadioProps {
    size?: "sm" | "md";
    /** See `RadioGroup`'s `tone`; the group's value wins when both are set. */
    tone?: "default" | "inverse";
    label?: ReactNode;
    hint?: ReactNode;
    ref?: Ref<HTMLLabelElement>;
}

export const RadioButton = ({ label, hint, className, size = "sm", tone = "default", ...ariaRadioProps }: RadioButtonProps) => {
    const context = useContext(RadioGroupContext);

    size = context?.size ?? size;
    tone = context?.tone ?? tone;
    // The <label> wraps both texts; point name at the label and description at the hint so the hint isn't read as part of the name.
    const labelId = useId();
    const hintId = useId();

    const sizes = {
        sm: {
            root: "gap-2",
            textWrapper: "",
            label: "text-sm font-medium",
            hint: "text-sm",
        },
        md: {
            root: "gap-3",
            textWrapper: "gap-0.5",
            label: "text-md font-semibold",
            hint: "text-md",
        },
    };

    return (
        <AriaRadio
            aria-labelledby={label && hint ? labelId : undefined}
            aria-describedby={hint ? hintId : undefined}
            {...ariaRadioProps}
            className={(state) =>
                cx(
                    "relative flex items-start",
                    state.isDisabled && "cursor-not-allowed",
                    sizes[size].root,
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {({ isSelected, isDisabled, isFocusVisible }) => (
                <>
                    <RadioButtonBase
                        size={size}
                        tone={tone}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        isFocusVisible={isFocusVisible}
                        className={label || hint ? "mt-0.5" : ""}
                    />
                    {(label || hint) && (
                        <div className={cx("inline-flex flex-col", sizes[size].textWrapper)}>
                            {label && (
                                <p id={labelId} className={cx("text-primary select-none", tone === "inverse" && "text-white", sizes[size].label)}>
                                    {label}
                                </p>
                            )}
                            {hint && (
                                <span
                                    id={hintId}
                                    className={cx("text-tertiary", tone === "inverse" && "text-inverse-secondary", sizes[size].hint)}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {hint}
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}
        </AriaRadio>
    );
};
RadioButton.displayName = "RadioButton";

interface RadioGroupProps extends RadioGroupContextType, AriaRadioGroupProps {
    children: ReactNode;
    className?: string;
    /**
     * Layout and arrow-key axis. `"horizontal"` lays the radios out in a row that wraps on narrow
     * widths, sets `aria-orientation="horizontal"`, and makes Left/Right follow the reading
     * direction (flipped in RTL). Up/Down move next/previous in both orientations.
     * @default "vertical"
     */
    orientation?: "vertical" | "horizontal";
}

export const RadioGroup = ({ children, className, size = "sm", tone = "default", orientation = "vertical", ...props }: RadioGroupProps) => {
    return (
        <RadioGroupContext.Provider value={{ size, tone }}>
            <AriaRadioGroup
                {...props}
                orientation={orientation}
                className={cx("flex gap-4", orientation === "horizontal" ? "flex-row flex-wrap gap-x-6" : "flex-col", className)}
            >
                {children}
            </AriaRadioGroup>
        </RadioGroupContext.Provider>
    );
};
RadioGroup.displayName = "RadioGroup";
