"use client";

import type { FC, ReactElement, ReactNode, Ref, RefCallback } from "react";
import { isValidElement, useMemo } from "react";
import { mergeRefs } from "@react-aria/utils";
import type { ButtonProps as AriaButtonProps, LinkProps as AriaLinkProps } from "react-aria-components";
import { Button as AriaButton, Link as AriaLink, ProgressBar as AriaProgressBar } from "react-aria-components";
import { useFocusNextWhenDisabled } from "@/hooks/use-focus-next-when-disabled";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

export const styles = sortCx({
    common: {
        root: [
            "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-3",
            // When button is used within `InputGroup`
            "in-data-input-wrapper:shadow-xs in-data-input-wrapper:focus:!z-50 in-data-input-wrapper:in-data-leading:-mr-px in-data-input-wrapper:in-data-leading:rounded-r-none in-data-input-wrapper:in-data-trailing:-ml-px in-data-input-wrapper:in-data-trailing:rounded-l-none",
            // Disabled styles
            "disabled:cursor-not-allowed disabled:opacity-50 in-data-input-wrapper:disabled:opacity-100",
            // Same as `icon` but for SSR icons that cannot be passed to the client as functions.
            "*:data-icon:pointer-events-none *:data-icon:size-5 *:data-icon:shrink-0 *:data-icon:transition-inherit-all",
        ].join(" "),
        icon: "pointer-events-none size-5 shrink-0 transition-inherit-all",
    },
    // Figma (BetterShot) geometry, values as drawn: Medium 500, xs 28 / sm 32 / md 36 / lg 40 tall, icon gap 4.
    // The splash CTA (36px with 14px text) is `size="sm" className="py-2"`; it is the board's only such button.
    sizes: {
        xs: {
            root: [
                // Figma: 6px padding inside a 1px stroke that takes layout space, so the label sits 7px in.
                "gap-1 rounded-lg px-[7px] py-1 text-sm font-medium data-icon-only:p-1.5",
                "in-data-input-wrapper:px-4 in-data-input-wrapper:py-2.5 in-data-input-wrapper:data-icon-only:p-2.5",
                "*:data-icon:size-4 *:data-icon:stroke-[2.25px]",
            ].join(" "),
            linkRoot: "gap-1 *:data-text:underline-offset-3",
        },
        sm: {
            root: [
                "gap-1 rounded-lg px-3 py-1.5 text-sm font-medium data-icon-only:p-2",
                "in-data-input-wrapper:px-4 in-data-input-wrapper:py-2.5 in-data-input-wrapper:data-icon-only:p-2.5",
                "*:data-icon:size-4",
            ].join(" "),
            linkRoot: "gap-1 *:data-text:underline-offset-3",
        },
        md: {
            root: [
                "gap-1 rounded-[9px] px-3 py-1.5 text-md font-medium data-icon-only:p-[9px]",
                "in-data-input-wrapper:gap-1.5 in-data-input-wrapper:px-4.5 in-data-input-wrapper:text-md in-data-input-wrapper:data-icon-only:p-3",
                "*:data-icon:size-4.5",
            ].join(" "),
            linkRoot: "gap-1 *:data-text:underline-offset-4",
        },
        lg: {
            root: "gap-1.5 rounded-[10px] px-3 py-2 text-md font-medium data-icon-only:p-2.5",
            linkRoot: "gap-1.5 *:data-text:underline-offset-4",
        },
        xl: {
            root: "min-w-37.5 gap-1.5 rounded-xl px-4 py-3 text-md font-medium data-icon-only:min-w-0 data-icon-only:p-3.5",
            linkRoot: "min-w-0 gap-1.5 *:data-text:underline-offset-4",
        },
    },
    colors: {
        primary: {
            root: [
                "bg-brand-solid text-white ring-1 ring-transparent ring-inset hover:bg-brand-solid_hover data-loading:bg-brand-solid_hover",
                // Icon styles
                "*:data-icon:text-current",
            ].join(" "),
        },
        secondary: {
            root: [
                "bg-primary text-primary shadow-xs ring-1 ring-secondary ring-inset hover:bg-quaternary data-loading:bg-quaternary",
                // Icon styles
                "*:data-icon:text-current",
            ].join(" "),
        },
        /** Secondary with brand-colored text (Figma "Edit Details", "Create Headshot →"). */
        "secondary-brand": {
            root: [
                "bg-primary text-utility-brand-600 shadow-xs ring-1 ring-secondary ring-inset hover:bg-quaternary data-loading:bg-quaternary",
                // Icon styles
                "*:data-icon:text-current",
            ].join(" "),
        },
        /** Solid white, no border, for dark surfaces (`bg-inverse`); stays white in dark mode. Figma pads it 7px at every size. */
        white: {
            root: [
                "bg-white px-1.75 text-[#101419] outline-white hover:bg-neutral-100 data-loading:bg-neutral-100",
                // Icon styles
                "*:data-icon:text-current",
            ].join(" "),
        },
        /**
         * Outline info pill (Figma "What makes a good photo ⓘ"): border only, no fill or shadow, fully rounded,
         * 8px padding (34px tall at `size="sm"`), 14px trailing icon. Sets its own padding, so `size` only picks the type size.
         */
        "outline-pill": {
            root: [
                "gap-[5px] rounded-full bg-transparent px-2 py-[7px] text-primary ring-1 ring-secondary ring-inset hover:bg-primary_hover data-icon-only:p-2 data-loading:bg-primary_hover",
                // Icon styles
                "*:data-icon:size-3.5 *:data-icon:text-current",
            ].join(" "),
        },
        tertiary: {
            root: [
                "text-tertiary hover:bg-quaternary data-loading:bg-quaternary",
                // Icon styles
                "*:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary_hover",
            ].join(" "),
        },
        "link-color": {
            root: [
                "justify-normal rounded p-0! text-left whitespace-normal text-brand-secondary hover:text-brand-secondary_hover",
                // Inner text underline
                "*:data-text:underline *:data-text:decoration-transparent hover:*:data-text:decoration-fg-brand-secondary_alt",
                // Icon styles
                "*:data-icon:text-fg-brand-secondary_alt hover:*:data-icon:text-fg-brand-secondary_hover",
            ].join(" "),
        },
        "link-gray": {
            root: [
                "justify-normal rounded p-0! text-left whitespace-normal text-tertiary hover:text-tertiary_hover",
                // Inner text underline
                "*:data-text:underline *:data-text:decoration-transparent hover:*:data-text:decoration-fg-quaternary",
                // Icon styles
                "*:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary_hover",
            ].join(" "),
        },
        "primary-destructive": {
            root: [
                "bg-error-solid text-white ring-1 ring-transparent outline-error ring-inset hover:bg-error-solid_hover data-loading:bg-error-solid_hover",
                // Icon styles
                "*:data-icon:text-white/60 hover:*:data-icon:text-white/70",
            ].join(" "),
        },
        "secondary-destructive": {
            root: [
                "bg-primary text-error-primary ring-1 ring-error_subtle outline-error ring-inset hover:bg-error-primary hover:text-error-primary_hover data-loading:bg-error-primary",
                // Icon styles
                "*:data-icon:text-fg-error-secondary hover:*:data-icon:text-fg-error-primary",
            ].join(" "),
        },
        "tertiary-destructive": {
            root: [
                "text-error-primary outline-error hover:bg-error-primary hover:text-error-primary_hover data-loading:bg-error-primary",
                // Icon styles
                "*:data-icon:text-fg-error-secondary hover:*:data-icon:text-fg-error-primary",
            ].join(" "),
        },
        "link-destructive": {
            root: [
                "justify-normal rounded p-0! text-left whitespace-normal text-error-primary outline-error hover:text-error-primary_hover",
                // Inner text underline
                "*:data-text:underline *:data-text:decoration-transparent *:data-text:underline-offset-2 hover:*:data-text:decoration-current",
                // Icon styles
                "*:data-icon:text-fg-error-secondary hover:*:data-icon:text-fg-error-primary",
            ].join(" "),
        },
    },
});

/**
 * Common props shared between button and anchor variants
 */
export interface CommonProps {
    /** Disables the button and shows a disabled state */
    isDisabled?: boolean;
    /** Shows a loading spinner and disables the button */
    isLoading?: boolean;
    /** The size variant of the button */
    size?: keyof typeof styles.sizes;
    /** The color variant of the button */
    color?: keyof typeof styles.colors;
    /** Icon component or element to show before the text */
    iconLeading?: FC<{ className?: string }> | ReactNode;
    /** Icon component or element to show after the text */
    iconTrailing?: FC<{ className?: string }> | ReactNode;
    /** @deprecated No-op: the text no longer has its own padding (the sizes carry Figma's full padding). */
    noTextPadding?: boolean;
    /** When true, keeps the text visible during loading state */
    showTextWhileLoading?: boolean;

    children?: ReactNode;
    className?: string;
}

/**
 * Props for the button variant (non-link)
 */
export interface ButtonProps extends CommonProps, Omit<AriaButtonProps, "children" | "className"> {}
/**
 * Props for the link variant (anchor tag)
 */
interface LinkProps extends CommonProps, Omit<AriaLinkProps, "children" | "className"> {
    href: NonNullable<AriaLinkProps["href"]>;
}

/** Union type of button and link props */
export type Props = ButtonProps | LinkProps;

export const Button: {
    (props: LinkProps): ReactElement<LinkProps>;
    (props: ButtonProps): ReactElement<ButtonProps>;
} = ({
    size = "sm",
    color = "primary",
    children,
    className,
    noTextPadding: _noTextPadding,
    iconLeading: IconLeading,
    iconTrailing: IconTrailing,
    isDisabled: disabled,
    isLoading: loading,
    showTextWhileLoading,
    ...props
}) => {
    const href = "href" in props ? props.href : undefined;
    // Becoming disabled while focused (e.g. pagination's Previous on page 1) moves focus on instead of dropping it.
    const focusRef = useFocusNextWhenDisabled<HTMLElement>();
    const consumerRef = (props as { ref?: Ref<HTMLElement> }).ref;
    // mergeRefs returns a callback ref; typed as one so it fits both the <button> and <a> variants.
    const ref = useMemo(() => mergeRefs(focusRef, consumerRef) as RefCallback<HTMLElement>, [focusRef, consumerRef]);

    const isIcon = (IconLeading || IconTrailing) && !children;
    const isLinkType = ["link-gray", "link-color", "link-destructive"].includes(color);

    const commonChildren = (
        <>
            {/* Leading icon */}
            {isValidElement(IconLeading) && IconLeading}
            {isReactComponent(IconLeading) && <IconLeading data-icon="leading" className={styles.common.icon} />}

            {/* The progress bar picks up the id React Aria's `isPending` appends to the button's name. */}
            {loading && (
                <AriaProgressBar
                    isIndeterminate
                    aria-label="Loading"
                    data-icon="loading"
                    className={cx(styles.common.icon, !showTextWhileLoading && "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")}
                >
                    <svg fill="none" viewBox="0 0 20 20" className="block size-full">
                        {/* Background circle */}
                        <circle className="stroke-current opacity-30" cx="10" cy="10" r="8" fill="none" strokeWidth="2" />
                        {/* Spinning circle */}
                        <circle
                            className="origin-center animate-spin stroke-current"
                            cx="10"
                            cy="10"
                            r="8"
                            fill="none"
                            strokeWidth="2"
                            strokeDasharray="12.5 50"
                            strokeLinecap="round"
                        />
                    </svg>
                </AriaProgressBar>
            )}

            {children && (
                <span data-text className="transition-inherit-all">
                    {children}
                </span>
            )}

            {/* Trailing icon */}
            {isValidElement(IconTrailing) && IconTrailing}
            {isReactComponent(IconTrailing) && <IconTrailing data-icon="trailing" className={styles.common.icon} />}
        </>
    );

    const commonProps = {
        "data-loading": loading ? true : undefined,
        "data-icon-only": isIcon ? true : undefined,
        ...props,
        ref,
        isDisabled: disabled,
        className: cx(
            styles.common.root,
            styles.sizes[size].root,
            styles.colors[color].root,
            isLinkType && styles.sizes[size].linkRoot,
            (loading || (href && (disabled || loading))) && "pointer-events-none",
            // If in `loading` state, hide everything except the loading icon (and text if `showTextWhileLoading` is true).
            // `opacity-0` (not `invisible`) keeps the text in the accessible name.
            loading && (showTextWhileLoading ? "[&>*:not([data-icon=loading]):not([data-text])]:hidden" : "[&>*:not([data-icon=loading])]:opacity-0"),
            className,
        ),
        children: commonChildren,
    };

    if ("href" in commonProps) {
        return <AriaLink {...commonProps} href={disabled ? undefined : href} />;
    }

    return <AriaButton {...commonProps} type={commonProps.type || "button"} isPending={loading} />;
};
