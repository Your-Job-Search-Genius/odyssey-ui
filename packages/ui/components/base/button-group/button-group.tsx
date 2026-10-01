"use client";

import { type FC, type PropsWithChildren, type ReactNode, type RefAttributes, createContext, isValidElement, useContext } from "react";
import {
    ToggleButton as AriaToggleButton,
    ToggleButtonGroup as AriaToggleButtonGroup,
    type ToggleButtonGroupProps,
    type ToggleButtonProps,
} from "react-aria-components";
import { Check } from "@/components/foundations/icons";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

export const styles = sortCx({
    common: {
        root: [
            "group/button-group inline-flex h-max cursor-pointer items-center bg-primary font-semibold whitespace-nowrap text-secondary shadow-skeuomorphic ring-1 ring-primary outline-brand transition duration-100 ease-linear ring-inset",
            // Hover and focus styles
            "hover:bg-primary_hover hover:text-secondary_hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2",
            // Disabled styles
            "disabled:cursor-not-allowed disabled:text-secondary/50 disabled:*:opacity-50",
            // Selected styles: a distinct surface and stronger text (hover only lightens the surface).
            // Text items also get a leading check, so selection never relies on color alone.
            "selected:bg-active selected:text-primary",
        ].join(" "),
        icon: "pointer-events-none text-fg-quaternary transition-[inherit] group-hover/button-group:text-fg-quaternary_hover group-selected/button-group:text-fg-secondary",
    },

    sizes: {
        sm: {
            root: "gap-1.5 px-3.5 py-2 text-sm not-last:pr-[calc(calc(var(--spacing)*3.5)+1px)] first:rounded-l-lg last:rounded-r-lg data-icon-leading:pl-3 data-icon-only:px-2.5",
            icon: "size-5",
        },
        md: {
            root: "gap-1.5 px-4 py-2.5 text-sm not-last:pr-[calc(calc(var(--spacing)*4)+1px)] first:rounded-l-lg last:rounded-r-lg data-icon-leading:pl-3.5 data-icon-only:px-3",
            icon: "size-5",
        },
        lg: {
            root: "gap-2 px-4.5 py-2.5 text-md not-last:pr-[calc(calc(var(--spacing)*4.5)+1px)] first:rounded-l-lg last:rounded-r-lg data-icon-leading:pl-4 data-icon-only:px-3.5",
            icon: "size-5",
        },
    },
});

type ButtonSize = keyof typeof styles.sizes;

const ButtonGroupContext = createContext<{ size: ButtonSize; showSelectedIndicator: boolean }>({ size: "md", showSelectedIndicator: true });

interface ButtonGroupItemProps extends ToggleButtonProps, RefAttributes<HTMLButtonElement> {
    iconLeading?: FC<{ className?: string }> | ReactNode;
    iconTrailing?: FC<{ className?: string }> | ReactNode;
    onClick?: () => void;
    className?: string;
}

export const ButtonGroupItem = ({
    iconLeading: IconLeading,
    iconTrailing: IconTrailing,
    children,
    className,
    ...otherProps
}: PropsWithChildren<ButtonGroupItemProps>) => {
    const context = useContext(ButtonGroupContext);

    if (!context) {
        throw new Error("ButtonGroupItem must be used within a ButtonGroup component");
    }

    const { size, showSelectedIndicator } = context;

    const isIcon = (IconLeading || IconTrailing) && !children;
    const canShowCheck = showSelectedIndicator && !IconLeading && !isIcon;

    return (
        <AriaToggleButton
            {...otherProps}
            data-icon-only={isIcon ? true : undefined}
            data-icon-leading={IconLeading ? true : undefined}
            className={cx(styles.common.root, styles.sizes[size].root, className)}
        >
            {(renderProps) => (
                <>
                    {canShowCheck && renderProps.isSelected && (
                        <Check aria-hidden="true" className={cx(styles.common.icon, styles.sizes[size].icon, "-ml-0.5 size-4 stroke-[2.5px]")} />
                    )}
                    {isReactComponent(IconLeading) && <IconLeading className={cx(styles.common.icon, styles.sizes[size].icon)} />}
                    {isValidElement(IconLeading) && IconLeading}

                    {typeof children === "function" ? children(renderProps) : children}

                    {isReactComponent(IconTrailing) && <IconTrailing className={cx(styles.common.icon, styles.sizes[size].icon)} />}
                    {isValidElement(IconTrailing) && IconTrailing}
                </>
            )}
        </AriaToggleButton>
    );
};

interface ButtonGroupProps extends Omit<ToggleButtonGroupProps, "orientation">, RefAttributes<HTMLDivElement> {
    size?: ButtonSize;
    className?: string;
    /**
     * Shows a check before the label of each selected text item (items with their own leading icon,
     * and icon-only items, keep their icon). Turn off only when selection is conveyed another way.
     * @default true
     */
    showSelectedIndicator?: boolean;
}

/**
 * A row of toggle buttons. Single selection by default: items are exposed as `radio`s in a
 * `radiogroup` (query them with `getByRole("radio")` in tests); `selectionMode="multiple"` makes
 * them toggle `button`s with `aria-pressed`. Give the group an `aria-label`.
 */
export const ButtonGroup = ({ children, size = "md", className, showSelectedIndicator = true, ...otherProps }: ButtonGroupProps) => {
    return (
        <ButtonGroupContext.Provider value={{ size, showSelectedIndicator }}>
            <AriaToggleButtonGroup
                selectionMode="single"
                className={cx("relative z-0 inline-flex w-max -space-x-px rounded-lg shadow-xs", className)}
                {...otherProps}
            >
                {children}
            </AriaToggleButtonGroup>
        </ButtonGroupContext.Provider>
    );
};
