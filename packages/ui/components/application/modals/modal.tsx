"use client";

import { type ComponentPropsWithRef, type FC, type ReactNode, createContext, useContext } from "react";
import type {
    DialogProps as AriaDialogProps,
    ListBoxItemProps as AriaListBoxItemProps,
    ListBoxProps as AriaListBoxProps,
    ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import {
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Heading as AriaHeading,
    ListBox as AriaListBox,
    ListBoxItem as AriaListBoxItem,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    OverlayTriggerStateContext as AriaOverlayTriggerStateContext,
    Text as AriaText,
} from "react-aria-components";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CheckmarkCircle02Icon } from "@/components/foundations/hugeicons";
import { cx, sortCx } from "@/utils/cx";

export const DialogTrigger = AriaDialogTrigger;

const backdrops = sortCx({
    /** Frosted white: dialogs over the page (purpose dialog, camera). */
    light: "bg-white/29 backdrop-blur-[15px]",
    /** Frosted black: dark photo dialogs (add photo, pickers). */
    dark: "bg-black/29 backdrop-blur-[15px]",
    /** Heavier black blur behind a splash/licence modal. */
    splash: "bg-black/37 backdrop-blur-[25px]",
    /** Near-opaque black for a full-bleed image viewer. */
    lightbox: "bg-black/80 backdrop-blur-[40px]",
});

const mobileLayouts = sortCx({
    /** Phones dock the dialog at the bottom, inset 16px; `sm`+ centres it. */
    sheet: "items-end px-4 [--modal-pb:16px] [--modal-pt:16px] sm:items-center sm:px-8 sm:[--modal-pb:32px] sm:[--modal-pt:32px]",
    /** Below `md` the dialog fills the screen edge to edge; `md`+ centres it. */
    fullscreen: "items-stretch px-0 [--modal-pb:0px] [--modal-pt:0px] md:items-center md:px-8 md:[--modal-pb:32px] md:[--modal-pt:32px]",
    /** Phones dock the dialog edge to edge, flush with the bottom and at most 17px from the top (square bottom corners); `sm`+ centres it. */
    bottom: "items-end px-0 [--modal-pb:0px] [--modal-pt:17px] sm:items-center sm:px-8 sm:[--modal-pb:32px] sm:[--modal-pt:32px]",
});

type MobileLayout = keyof typeof mobileLayouts;

/** Lets `Modal`, `ModalHeader` and `ModalFooter` follow the overlay's `mobileLayout`. */
const ModalLayoutContext = createContext<MobileLayout>("sheet");

interface ModalOverlayProps extends AriaModalOverlayProps {
    /** Scrim behind the dialog. @default "light" */
    backdrop?: keyof typeof backdrops;
    /**
     * Layout on small screens. `sheet` docks the dialog at the bottom, inset 16px. `bottom` docks it edge to edge,
     * flush with the bottom of the screen, with square bottom corners (splash, selection dialogs). `fullscreen` (camera
     * and crop flows) removes the overlay padding and panel radius below `md`, fills the dynamic viewport, and pads
     * `ModalHeader`/`ModalFooter` by the safe-area insets.
     * @default "sheet"
     */
    mobileLayout?: MobileLayout;
}

export const ModalOverlay = ({ backdrop = "light", mobileLayout = "sheet", children, ...props }: ModalOverlayProps) => {
    return (
        <AriaModalOverlay
            {...props}
            className={(state) =>
                cx(
                    "fixed inset-0 z-50 flex min-h-dvh w-full justify-center outline-hidden",
                    backdrops[backdrop],
                    mobileLayouts[mobileLayout],
                    // Vertical padding
                    "pt-(--modal-pt) pb-(--modal-pb)",
                    // Animations
                    state.isEntering && "duration-300 ease-out animate-in fade-in",
                    state.isExiting && "duration-200 ease-in animate-out fade-out",
                    typeof props.className === "function" ? props.className(state) : props.className,
                )
            }
        >
            {(values) => (
                <ModalLayoutContext.Provider value={mobileLayout}>{typeof children === "function" ? children(values) : children}</ModalLayoutContext.Provider>
            )}
        </AriaModalOverlay>
    );
};

const modalSizes = sortCx({
    sm: "sm:max-w-100",
    md: "sm:max-w-114",
    lg: "sm:max-w-150",
    xl: "sm:max-w-180",
    /** 960px: previews, side-by-side comparisons. */
    "2xl": "sm:max-w-240",
    /** Fills the overlay (minus its padding) on every viewport. */
    full: "sm:max-w-none",
});

// The brand focus ring is 1.41:1 on #444, so dark surfaces draw focus in white (the white inset body resets it).
const modalVariants = sortCx({
    /** White panel. */
    default: "rounded-[28px] bg-primary",
    /** Dark `#444` panel with white text: camera, guidance, photo and model/background pickers. */
    dark: "rounded-[28px] bg-inverse text-white [--color-focus-ring:var(--color-white)]",
    /** Dark `#444` frame around a white inset `ModalBody` card: selection dialogs. */
    "dark-inset": "rounded-[17px] bg-inverse text-white [--color-focus-ring:var(--color-white)]",
    /** Light `#F6F6F6` frame around an outlined white inset `ModalBody` card: the light selection dialogs. */
    "light-inset": "rounded-[17px] bg-tertiary text-primary",
    /** Translucent black panel that lets the page show through: crop. */
    translucent: "rounded-3xl bg-black/59 text-white [--color-focus-ring:var(--color-white)]",
});

type ModalVariant = keyof typeof modalVariants;

/** Lets `ModalHeader`/`ModalBody`/`ModalFooter` match the surface of the `Modal` they sit in. */
const ModalVariantContext = createContext<ModalVariant>("default");

interface ModalProps extends AriaModalOverlayProps {
    /**
     * Constrains the dialog panel's max width on `sm`+ viewports (sm 400, md 456, lg 600, xl 720,
     * 2xl 960px, full = the whole overlay). On mobile the panel always spans the full available width.
     * @default "md"
     */
    size?: keyof typeof modalSizes;
    /**
     * Panel surface. `dark` is the `#444` photo-flow shell; `dark-inset` frames a white `ModalBody` card
     * (selection dialogs) and `light-inset` is its light `#F6F6F6` counterpart; `translucent` is the see-through crop surface.
     * Dark surfaces (`dark`, `dark-inset`, `translucent`) draw focus rings in white.
     * @default "default"
     */
    variant?: ModalVariant;
    /**
     * Clips the content to the panel and casts its shadow. Set `false` to let content overflow the panel without a
     * shadow, e.g. a banner tucked under the camera shell (give it `-z-10`); round the `Dialog` yourself
     * (`rounded-[inherit]`) if its content must still follow the corners.
     * @default true
     */
    clip?: boolean;
}

export const Modal = ({ size = "md", variant = "default", clip = true, children, ...props }: ModalProps) => {
    const mobileLayout = useContext(ModalLayoutContext);

    return (
        <AriaModal
            {...props}
            className={(state) =>
                cx(
                    "w-full align-middle outline-hidden",
                    clip && "overflow-hidden shadow-lg",
                    modalVariants[variant],
                    modalSizes[size],
                    // Max height based on parent's vertical padding
                    "max-h-[calc(var(--visual-viewport-height)-var(--modal-pt)-var(--modal-pb))]",
                    // Animations
                    state.isEntering && "duration-300 ease-out animate-in zoom-in-95",
                    state.isExiting && "duration-200 ease-in animate-out zoom-out-95",
                    typeof props.className === "function" ? props.className(state) : props.className,
                    // Last and `!`, so a consumer's `sm:max-w-*`/radius can't keep the panel inset below `md`.
                    mobileLayout === "fullscreen" && "max-md:h-dvh max-md:max-w-none! max-md:rounded-none!",
                    mobileLayout === "bottom" && "max-sm:max-w-none! max-sm:rounded-b-none!",
                )
            }
        >
            {(values) => (
                <ModalVariantContext.Provider value={variant}>{typeof children === "function" ? children(values) : children}</ModalVariantContext.Provider>
            )}
        </AriaModal>
    );
};

export const Dialog = (props: AriaDialogProps) => {
    const mobileLayout = useContext(ModalLayoutContext);

    return (
        <AriaDialog
            {...props}
            className={cx(
                "relative flex max-h-[inherit] w-full flex-col overflow-y-auto outline-hidden",
                // Fill the full-screen panel so a footer pinned to the bottom (`absolute bottom-0` or `mt-auto`) reaches the screen edge.
                mobileLayout === "fullscreen" && "max-md:h-full",
                props.className,
            )}
        />
    );
};

const headerStyles = sortCx({
    default: { root: "px-4 pt-4", title: "text-xl/[normal] text-primary", description: "text-sm text-tertiary" },
    dark: { root: "px-4 pt-4", title: "text-xl/[normal] text-white", description: "text-sm/[normal] font-medium text-inverse-secondary" },
    "dark-inset": { root: "px-3.5 pt-3", title: "text-lg/[normal] text-white", description: "text-sm/[normal] font-medium text-inverse-secondary" },
    "light-inset": { root: "px-3.5 pt-3", title: "text-lg/[normal] text-primary", description: "text-sm/[normal] font-medium text-tertiary" },
    translucent: { root: "px-3.5 pt-3.5 pb-3", title: "text-lg/[1.6] text-white", description: "text-sm/[normal] font-medium text-inverse-secondary" },
});

interface ModalHeaderProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
    /** Title rendered as the dialog's accessible heading (auto-associated via `aria-labelledby`). */
    title: ReactNode;
    /** Supporting text rendered below the title (auto-associated via `aria-describedby`). */
    description?: ReactNode;
    /** Content on the right of the title row, e.g. the primary action ("Continue 1/5"). */
    actions?: ReactNode;
    /** Icon or component shown above the title, wrapped in a `FeaturedIcon`. Omit for a plain text header. */
    icon?: FC<{ className?: string }> | ReactNode;
    /** Color passed through to the `FeaturedIcon`. @default "brand" */
    iconColor?: ComponentPropsWithRef<typeof FeaturedIcon>["color"];
    /** Theme passed through to the `FeaturedIcon`. @default "light" */
    iconTheme?: ComponentPropsWithRef<typeof FeaturedIcon>["theme"];
    /**
     * Shows the top-right dismiss button, which closes the parent Dialog via its `slot="close"` binding.
     * It is only rendered when pressing it can actually do something: inside an open `Modal`/`DialogTrigger`
     * (which supplies the overlay state), or when `onClose` is passed.
     * @default true
     */
    showCloseButton?: boolean;
    /** Called in addition to the default dismiss behavior when the close button is pressed. Required for the button to appear outside a `Modal`/`DialogTrigger`. */
    onClose?: () => void;
    /** Accessible name of the close button; localize it. @default "Close" */
    closeLabel?: string;
    /**
     * Moves keyboard focus straight to the close button as soon as the dialog mounts, instead of
     * the dialog container (React Aria's default). Combined with the dialog's built-in focus trap,
     * this means the very first `Tab` press after opening lands exactly where you'd expect, and
     * `Shift+Tab`/`Tab` cycling never escapes the dialog until it closes.
     * @default true
     */
    autoFocus?: boolean;
}

/** Header for a `Modal`/`Dialog` pair: optional featured icon, title, description, title-row actions and dismiss button. */
export const ModalHeader = ({
    title,
    description,
    actions,
    icon: Icon,
    iconColor = "brand",
    iconTheme = "light",
    showCloseButton = true,
    onClose,
    closeLabel,
    autoFocus = true,
    className,
    children,
    ...props
}: ModalHeaderProps) => {
    const variant = useContext(ModalVariantContext);
    const mobileLayout = useContext(ModalLayoutContext);
    // The close button's `slot="close"` only resolves to `state.close()` when an overlay state is in
    // context. Without one (and without `onClose`) it would render as a dead control, so hide it.
    const overlayState = useContext(AriaOverlayTriggerStateContext);
    const canClose = overlayState != null || onClose != null;
    const hasClose = showCloseButton && canClose;

    return (
        <div
            {...props}
            className={cx(
                "relative flex flex-col gap-4",
                headerStyles[variant].root,
                mobileLayout === "fullscreen" && "max-md:pt-[max(1rem,env(safe-area-inset-top))]",
                className,
            )}
        >
            {Icon && <FeaturedIcon icon={Icon} color={iconColor} theme={iconTheme} size="lg" />}

            <div className={cx("flex items-center gap-3", hasClose && "pr-8")}>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <AriaHeading slot="title" className={cx("font-semibold", headerStyles[variant].title)}>
                        {title}
                    </AriaHeading>
                    {description && (
                        <AriaText slot="description" className={headerStyles[variant].description}>
                            {description}
                        </AriaText>
                    )}
                </div>
                {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
            </div>

            {/* Before `children` in the DOM: it sits top-right, above anything passed in (e.g. tabs), so Tab must reach it first. */}
            {hasClose && <CloseButton theme="white" label={closeLabel} autoFocus={autoFocus} className="absolute top-3.5 right-3.5" onClick={onClose} />}

            {children}
        </div>
    );
};

const bodyStyles = sortCx({
    default: "px-4 py-4 text-tertiary",
    dark: "px-4 py-4 text-inverse-secondary",
    // The white inset card: 2px from the frame, 10px below the title; it is light, so focus goes back to brand.
    "dark-inset": "mx-0.5 mt-2.5 gap-0 rounded-[14px] bg-primary p-[5px] text-tertiary [--color-focus-ring:var(--color-brand-600)]",
    // Same card on the light frame, outlined: 0.5px border-secondary and a 1px drop shadow.
    "light-inset": "mx-0.5 mt-2.5 gap-0 rounded-[14px] bg-primary p-[5px] text-tertiary shadow-[0_1px_1px_rgba(0,0,0,0.05)] ring-[0.5px] ring-secondary",
    translucent: "px-4 py-4 text-inverse-secondary",
});

/**
 * Scrollable body region for a `Modal`/`Dialog` pair. Sits between `ModalHeader` and `ModalFooter`.
 * On short viewports (under 32rem, e.g. 200% zoom on a laptop) the header and footer leave the body almost no
 * height, so it stops scrolling on its own and the whole `Dialog` scrolls instead: one scroller, fields reachable.
 */
export const ModalBody = ({ className, ...props }: ComponentPropsWithRef<"div">) => {
    const variant = useContext(ModalVariantContext);

    return (
        <div
            {...props}
            className={cx(
                "flex min-h-0 flex-col gap-4 overflow-y-auto text-sm",
                bodyStyles[variant],
                "[@media(max-height:32rem)]:shrink-0 [@media(max-height:32rem)]:overflow-y-visible",
                className,
            )}
        />
    );
};

const footerStyles = sortCx({
    default: "justify-end px-4 pt-4 pb-4",
    dark: "justify-end px-4 pt-4 pb-4",
    // Cancel left, primary right, as in the selection dialogs.
    "dark-inset": "justify-between px-3.5 pt-2.5 pb-3",
    "light-inset": "justify-between px-3.5 pt-2.5 pb-3",
    translucent: "justify-end px-3.5 pt-3 pb-3.5",
});

/** Action row for a `Modal`/`Dialog` pair. Content-width buttons (right-aligned; split left/right in `dark-inset`/`light-inset`); wraps when they don't fit. */
export const ModalFooter = ({ className, ...props }: ComponentPropsWithRef<"div">) => {
    const variant = useContext(ModalVariantContext);
    const mobileLayout = useContext(ModalLayoutContext);

    return (
        <div
            {...props}
            className={cx(
                "flex flex-wrap gap-3",
                footerStyles[variant],
                mobileLayout === "fullscreen" && "max-md:pb-[max(1rem,env(safe-area-inset-bottom))]",
                className,
            )}
        />
    );
};

/**
 * Selectable icon rows ("List Default") for a `dark-inset`/`light-inset` dialog body: icon, title and description, with
 * dividers between rows. A React Aria `ListBox`, so arrow keys move between rows and selection is announced.
 * Needs an `aria-label` (or `aria-labelledby`).
 */
export const ModalOptionList = <T extends object>({ className, selectionMode = "single", ...props }: AriaListBoxProps<T>) => (
    <AriaListBox
        {...props}
        selectionMode={selectionMode}
        className={(state) => cx("flex flex-col outline-hidden", typeof className === "function" ? className(state) : className)}
    />
);

interface ModalOptionProps extends Omit<AriaListBoxItemProps, "children" | "textValue"> {
    title: string;
    description?: ReactNode;
    /** 32px leading icon, e.g. a Hugeicon. */
    icon?: FC<{ className?: string }>;
}

export const ModalOption = ({ title, description, icon: Icon, className, ...props }: ModalOptionProps) => (
    <AriaListBoxItem
        {...props}
        textValue={title}
        className={(state) =>
            cx(
                "relative flex min-h-[97px] cursor-pointer flex-col justify-center rounded-xl px-[9px] py-3.5 outline-hidden transition duration-100 ease-linear",
                // 1px divider above every row but the first, spanning the card.
                "not-first:before:absolute not-first:before:inset-x-0 not-first:before:top-0 not-first:before:border-t not-first:before:border-tertiary",
                state.isHovered && "bg-primary_hover",
                state.isSelected && "bg-brand-primary",
                state.isFocusVisible && "outline-2 -outline-offset-2 outline-focus-ring",
                state.isDisabled && "cursor-not-allowed opacity-50",
                typeof className === "function" ? className(state) : className,
            )
        }
    >
        {({ isSelected }) => (
            <div className="flex items-start gap-3.5">
                {Icon && <Icon aria-hidden="true" className="size-8 shrink-0 text-fg-primary" />}
                <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                    <AriaText slot="label" className="text-md font-semibold text-primary">
                        {title}
                    </AriaText>
                    {description && (
                        <AriaText slot="description" className="max-w-66 text-sm font-medium text-subtle">
                            {description}
                        </AriaText>
                    )}
                </div>
                {/* Not color alone: a check marks the selected row. */}
                {isSelected && <CheckmarkCircle02Icon aria-hidden="true" className="size-6 shrink-0 self-center text-fg-brand-primary" />}
            </div>
        )}
    </AriaListBoxItem>
);
