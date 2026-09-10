"use client";

import type { ReactNode } from "react";
import type { ColorFieldProps as AriaColorFieldProps } from "react-aria-components";
import { ColorField as AriaColorField, Input as AriaInput } from "react-aria-components";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { cx, sortCx } from "@/utils/cx";

const sizes = sortCx({
    sm: "px-3 py-2 text-sm",
    md: "px-3 py-2 text-md",
    lg: "px-3.5 py-2.5 text-md",
});

export interface ColorFieldProps extends AriaColorFieldProps {
    /** Label text for the field. */
    label?: string;
    /** Helper text displayed below the field. */
    hint?: ReactNode;
    /** Whether the field is invalid. */
    isInvalid?: boolean;
    /**
     * Field size.
     * @default "md"
     */
    size?: keyof typeof sizes;
    /** Class name applied to the root element. */
    className?: string;
}

/**
 * A color field allows users to edit a hex color, or an individual color
 * channel value when a `channel` prop is provided.
 */
export const ColorField = ({ label, hint, size = "md", className, ...props }: ColorFieldProps) => {
    return (
        <AriaColorField {...props} className={cx("group flex h-max w-full flex-col items-start justify-start gap-1.5", className)}>
            {({ isRequired, isInvalid, isDisabled }) => (
                <>
                    {label && (
                        <Label isRequired={isRequired} isInvalid={isInvalid}>
                            {label}
                        </Label>
                    )}

                    <div
                        className={cx(
                            "relative flex w-full flex-row rounded-lg bg-primary shadow-xs ring-1 ring-primary transition-shadow duration-100 ease-linear ring-inset",
                            "focus-within:ring-2 focus-within:ring-brand",
                            isInvalid && "ring-error_subtle",
                            isInvalid && "focus-within:ring-2 focus-within:ring-error",
                            isDisabled && "cursor-not-allowed opacity-50",
                        )}
                    >
                        <AriaInput
                            className={cx(
                                "m-0 w-full bg-transparent text-primary ring-0 outline-hidden placeholder:text-placeholder disabled:cursor-not-allowed",
                                sizes[size],
                            )}
                        />
                    </div>

                    {hint && <HintText isInvalid={isInvalid}>{hint}</HintText>}
                </>
            )}
        </AriaColorField>
    );
};

ColorField.displayName = "ColorField";
