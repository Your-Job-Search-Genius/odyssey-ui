"use client";

import type { ComponentPropsWithRef, FC, ReactNode } from "react";
import type { DialogProps as AriaDialogProps, ModalOverlayProps as AriaModalOverlayProps } from "react-aria-components";
import {
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Heading as AriaHeading,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    Text as AriaText,
} from "react-aria-components";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx, sortCx } from "@/utils/cx";

export const DialogTrigger = AriaDialogTrigger;

export const ModalOverlay = (props: AriaModalOverlayProps) => {
    return (
        <AriaModalOverlay
            {...props}
            className={(state) =>
                cx(
                    "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 px-4 outline-hidden backdrop-blur-[6px] sm:items-center sm:justify-center sm:px-8",
                    // Vertical padding
                    "pt-(--modal-pt) pb-(--modal-pb) [--modal-pb:clamp(16px,8vh,64px)] [--modal-pt:16px] sm:[--modal-pb:32px] sm:[--modal-pt:32px]",
                    // Animations
                    state.isEntering && "duration-300 ease-out animate-in fade-in",
                    state.isExiting && "duration-200 ease-in animate-out fade-out",
                    typeof props.className === "function" ? props.className(state) : props.className,
                )
            }
        />
    );
};

const modalSizes = sortCx({
    sm: "sm:max-w-100",
    md: "sm:max-w-120",
    lg: "sm:max-w-150",
    xl: "sm:max-w-180",
});

interface ModalProps extends AriaModalOverlayProps {
    /**
     * Constrains the dialog panel's max width on `sm`+ viewports. On mobile the
     * panel always spans the full available width.
     * @default "md"
     */
    size?: keyof typeof modalSizes;
}

export const Modal = ({ size = "md", ...props }: ModalProps) => (
    <AriaModal
        {...props}
        className={(state) =>
            cx(
                "w-full rounded-xl bg-primary align-middle shadow-xl outline-hidden max-sm:overflow-y-auto sm:rounded-2xl",
                modalSizes[size],
                // Max height based on parent's vertical padding
                "max-h-[calc(var(--visual-viewport-height)-var(--modal-pt)-var(--modal-pb))]",
                // Animations
                state.isEntering && "duration-300 ease-out animate-in zoom-in-95",
                state.isExiting && "duration-200 ease-in animate-out zoom-out-95",
                typeof props.className === "function" ? props.className(state) : props.className,
            )
        }
    />
);

export const Dialog = (props: AriaDialogProps) => (
    <AriaDialog {...props} className={cx("relative flex max-h-[inherit] w-full flex-col overflow-y-auto outline-hidden", props.className)} />
);

interface ModalHeaderProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
    /** Title rendered as the dialog's accessible heading (auto-associated via `aria-labelledby`). */
    title: ReactNode;
    /** Supporting text rendered below the title (auto-associated via `aria-describedby`). */
    description?: ReactNode;
    /** Icon or component shown above the title, wrapped in a `FeaturedIcon`. Omit for a plain text header. */
    icon?: FC<{ className?: string }> | ReactNode;
    /** Color passed through to the `FeaturedIcon`. @default "brand" */
    iconColor?: ComponentPropsWithRef<typeof FeaturedIcon>["color"];
    /** Theme passed through to the `FeaturedIcon`. @default "light" */
    iconTheme?: ComponentPropsWithRef<typeof FeaturedIcon>["theme"];
    /** Shows the top-right dismiss button, which closes the parent Dialog via its `slot="close"` binding. @default true */
    showCloseButton?: boolean;
    /** Called in addition to the default dismiss behavior when the close button is pressed. */
    onClose?: () => void;
    /**
     * Moves keyboard focus straight to the close button as soon as the dialog mounts, instead of
     * the dialog container (React Aria's default). Combined with the dialog's built-in focus trap,
     * this means the very first `Tab` press after opening lands exactly where you'd expect, and
     * `Shift+Tab`/`Tab` cycling never escapes the dialog until it closes.
     * @default true
     */
    autoFocus?: boolean;
}

/** Header for a `Modal`/`Dialog` pair: optional featured icon, title, description, and dismiss button. */
export const ModalHeader = ({
    title,
    description,
    icon: Icon,
    iconColor = "brand",
    iconTheme = "light",
    showCloseButton = true,
    onClose,
    autoFocus = true,
    className,
    children,
    ...props
}: ModalHeaderProps) => {
    return (
        <div {...props} className={cx("relative flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6", className)}>
            {Icon && <FeaturedIcon icon={Icon} color={iconColor} theme={iconTheme} size="lg" />}

            <div className="flex flex-col gap-0.5 pr-8">
                <AriaHeading slot="title" className="text-md font-semibold text-primary">
                    {title}
                </AriaHeading>
                {description && (
                    <AriaText slot="description" className="text-sm text-tertiary">
                        {description}
                    </AriaText>
                )}
            </div>

            {children}

            {showCloseButton && <CloseButton size="sm" autoFocus={autoFocus} className="absolute top-4 right-4 sm:top-5 sm:right-5" onClick={onClose} />}
        </div>
    );
};

/** Scrollable body region for a `Modal`/`Dialog` pair. Sits between `ModalHeader` and `ModalFooter`. */
export const ModalBody = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
    <div {...props} className={cx("flex flex-col gap-4 px-4 py-4 text-sm text-tertiary sm:px-6", className)} />
);

/** Action row for a `Modal`/`Dialog` pair. Stacks full-width on mobile, right-aligned row on `sm`+. */
export const ModalFooter = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
    <div {...props} className={cx("flex flex-col-reverse gap-3 px-4 pt-6 pb-4 sm:flex-row sm:px-6 sm:pb-6 sm:[&>*]:flex-1", className)} />
);
