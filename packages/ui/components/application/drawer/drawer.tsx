"use client";

import { type ComponentPropsWithRef, type ReactNode, type RefAttributes } from "react";
import type {
    DialogProps as AriaDialogProps,
    ModalOverlayProps as AriaModalOverlayProps,
    ModalRenderProps as AriaModalRenderProps,
} from "react-aria-components";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { CloseButton } from "@/components/base/buttons/close-button";
import { cx, sortCx } from "@/utils/cx";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

const isHorizontal = (placement: DrawerPlacement) => placement === "left" || placement === "right";

const overlayPlacements = sortCx({
    left: "items-stretch justify-start pr-6 md:pr-10",
    right: "items-stretch justify-end pl-6 md:pl-10",
    top: "items-start justify-stretch pb-6 md:pb-10",
    bottom: "items-end justify-stretch pt-6 md:pt-10",
});

const panelSizes = sortCx({
    left: { sm: "max-w-80", md: "max-w-100", lg: "max-w-120", xl: "max-w-160", full: "max-w-full" },
    right: { sm: "max-w-80", md: "max-w-100", lg: "max-w-120", xl: "max-w-160", full: "max-w-full" },
    top: { sm: "max-h-72", md: "max-h-100", lg: "max-h-130", xl: "max-h-160", full: "max-h-full" },
    bottom: { sm: "max-h-72", md: "max-h-100", lg: "max-h-130", xl: "max-h-160", full: "max-h-full" },
});

const enterAnimations = sortCx({
    left: "slide-in-from-left",
    right: "slide-in-from-right",
    top: "slide-in-from-top",
    bottom: "slide-in-from-bottom",
});

const exitAnimations = sortCx({
    left: "slide-out-to-left",
    right: "slide-out-to-right",
    top: "slide-out-to-top",
    bottom: "slide-out-to-bottom",
});

const panelRounding = sortCx({
    left: "rounded-r-2xl",
    right: "rounded-l-2xl",
    top: "rounded-b-2xl",
    bottom: "rounded-t-2xl",
});

interface DrawerOverlayProps extends AriaModalOverlayProps, RefAttributes<HTMLDivElement> {
    placement?: DrawerPlacement;
}

export const DrawerOverlay = ({ placement = "right", ...props }: DrawerOverlayProps) => {
    return (
        <AriaModalOverlay
            {...props}
            className={(state) =>
                cx(
                    "fixed inset-0 z-50 flex min-h-dvh w-full bg-overlay/70 outline-hidden",
                    overlayPlacements[placement],
                    state.isEntering && "duration-300 ease-out animate-in fade-in",
                    state.isExiting && "duration-300 ease-in animate-out fade-out",
                    typeof props.className === "function" ? props.className(state) : props.className,
                )
            }
        />
    );
};
DrawerOverlay.displayName = "DrawerOverlay";

interface DrawerPanelProps extends AriaModalOverlayProps, RefAttributes<HTMLDivElement> {
    placement?: DrawerPlacement;
    /** @default "md" */
    size?: DrawerSize;
}

export const DrawerPanel = ({ placement = "right", size = "md", ...props }: DrawerPanelProps) => (
    <AriaModal
        {...props}
        className={(state) =>
            cx(
                "flex w-full shadow-xl outline-hidden transition-none",
                isHorizontal(placement) ? "h-full" : "max-h-dvh",
                panelSizes[placement][size],
                state.isEntering && cx("duration-300 ease-out animate-in", enterAnimations[placement]),
                state.isExiting && cx("duration-300 ease-in animate-out", exitAnimations[placement]),
                typeof props.className === "function" ? props.className(state) : props.className,
            )
        }
    />
);
DrawerPanel.displayName = "DrawerPanel";

interface DrawerDialogProps extends AriaDialogProps, RefAttributes<HTMLElement> {
    placement?: DrawerPlacement;
}

export const DrawerDialog = ({ placement = "right", className, ...props }: DrawerDialogProps) => (
    <AriaDialog
        role="dialog"
        aria-label="Drawer"
        {...props}
        className={cx(
            "relative flex size-full flex-col overflow-y-auto bg-primary ring-1 ring-secondary_alt outline-hidden",
            // Round only the edge that floats away from the viewport border; the anchored edge stays square.
            panelRounding[placement],
            className,
        )}
    />
);
DrawerDialog.displayName = "DrawerDialog";

interface DrawerContentProps extends ComponentPropsWithRef<"div"> {}

const Content = ({ role = "main", className, ...props }: DrawerContentProps) => (
    <div role={role} {...props} className={cx("flex size-full flex-col gap-6 overflow-y-auto overscroll-contain px-4 md:px-6", className)} />
);
Content.displayName = "DrawerContent";

interface DrawerHeaderProps extends ComponentPropsWithRef<"header"> {
    onClose?: () => void;
    showCloseButton?: boolean;
    /**
     * Moves keyboard focus straight to the close button as soon as the drawer mounts, instead of
     * the panel container (React Aria's default). Combined with the panel's built-in focus trap,
     * `Tab`/`Shift+Tab` cycling starts there immediately and never escapes the drawer until it closes.
     * @default true
     */
    autoFocus?: boolean;
}

const Header = ({ className, children, onClose, showCloseButton = true, autoFocus = true, ...props }: DrawerHeaderProps) => (
    <header {...props} className={cx("relative z-1 w-full px-4 pt-6 md:px-6", className)}>
        {children}
        {showCloseButton && <CloseButton size="sm" autoFocus={autoFocus} className="absolute top-3 right-3 shrink-0" onClick={onClose} />}
    </header>
);
Header.displayName = "DrawerHeader";

const Footer = (props: ComponentPropsWithRef<"footer">) => (
    <footer {...props} className={cx("w-full p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6", props.className)} />
);
Footer.displayName = "DrawerFooter";

export interface DrawerProps extends Omit<AriaModalOverlayProps, "children">, RefAttributes<HTMLDivElement> {
    children: ReactNode | ((props: AriaModalRenderProps & { close: () => void }) => ReactNode);
    /** Edge of the viewport the panel slides in from. @default "right" */
    placement?: DrawerPlacement;
    /** Width (for `left`/`right`) or height (for `top`/`bottom`) of the panel. @default "md" */
    size?: DrawerSize;
    dialogClassName?: string;
    panelClassName?: string;
}

const DrawerRoot = ({ children, placement = "right", size = "md", dialogClassName, panelClassName, ...props }: DrawerProps) => {
    return (
        <DrawerOverlay placement={placement} {...props}>
            <DrawerPanel placement={placement} size={size} className={panelClassName}>
                {(state) => (
                    <DrawerDialog placement={placement} className={dialogClassName}>
                        {({ close }) => (typeof children === "function" ? children({ ...state, close }) : children)}
                    </DrawerDialog>
                )}
            </DrawerPanel>
        </DrawerOverlay>
    );
};
DrawerRoot.displayName = "Drawer";

export const Drawer = DrawerRoot as typeof DrawerRoot & {
    Trigger: typeof AriaDialogTrigger;
    Content: typeof Content;
    Header: typeof Header;
    Footer: typeof Footer;
};

Drawer.Trigger = AriaDialogTrigger;
Drawer.Content = Content;
Drawer.Header = Header;
Drawer.Footer = Footer;
