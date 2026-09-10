"use client";

import { type ComponentPropsWithRef, type ReactNode, type RefAttributes } from "react";
import { motion, useDragControls, useReducedMotion } from "motion/react";
import type {
    DialogProps as AriaDialogProps,
    ModalOverlayProps as AriaModalOverlayProps,
    ModalRenderProps as AriaModalRenderProps,
} from "react-aria-components";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { CloseButton } from "@/components/base/buttons/close-button";
import { cx, sortCx } from "@/utils/cx";

export type BottomSheetSize = "sm" | "md" | "lg" | "xl" | "full";

/** Caps the panel's width once the viewport is wide enough that it no longer spans edge-to-edge. */
const panelMaxWidths = sortCx({
    sm: "sm:max-w-100",
    md: "sm:max-w-120",
    lg: "sm:max-w-150",
    xl: "sm:max-w-180",
    full: "sm:max-w-full",
});

interface BottomSheetOverlayProps extends AriaModalOverlayProps, RefAttributes<HTMLDivElement> {}

export const BottomSheetOverlay = (props: BottomSheetOverlayProps) => (
    <AriaModalOverlay
        {...props}
        className={(state) =>
            cx(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center bg-overlay/70 outline-hidden",
                state.isEntering && "duration-300 ease-out animate-in fade-in",
                state.isExiting && "duration-300 ease-in animate-out fade-out",
                typeof props.className === "function" ? props.className(state) : props.className,
            )
        }
    />
);
BottomSheetOverlay.displayName = "BottomSheetOverlay";

interface BottomSheetPanelProps extends AriaModalOverlayProps, RefAttributes<HTMLDivElement> {
    /** @default "md" */
    size?: BottomSheetSize;
}

export const BottomSheetPanel = ({ size = "md", ...props }: BottomSheetPanelProps) => (
    <AriaModal
        {...props}
        className={(state) =>
            cx(
                "flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-primary shadow-xl outline-hidden",
                panelMaxWidths[size],
                // RAC drives the open/close transform; the drag gesture lives on an inner layer (`DragLayer`)
                // so the two transforms never fight over the same element.
                state.isEntering && "duration-300 ease-out animate-in slide-in-from-bottom",
                state.isExiting && "duration-300 ease-in animate-out slide-out-to-bottom",
                typeof props.className === "function" ? props.className(state) : props.className,
            )
        }
    />
);
BottomSheetPanel.displayName = "BottomSheetPanel";

export const BottomSheetDialog = (props: AriaDialogProps) => (
    <AriaDialog role="dialog" aria-label="Bottom sheet" {...props} className={cx("flex max-h-[inherit] w-full flex-col outline-hidden", props.className)} />
);
BottomSheetDialog.displayName = "BottomSheetDialog";

const DRAG_DISMISS_OFFSET = 120;
const DRAG_DISMISS_VELOCITY = 600;

interface DragLayerProps {
    close: () => void;
    children: ReactNode;
}

/**
 * Owns the drag-to-dismiss gesture. Drag only starts from the handle bar via `dragControls.start`
 * (`dragListener` is off on the root), so touch-scrolling the sheet's content is never hijacked as
 * a swipe. Falls back to close-button/backdrop/Escape-only dismissal when reduced motion is requested.
 */
const DragLayer = ({ close, children }: DragLayerProps) => {
    const shouldReduceMotion = useReducedMotion();
    const dragControls = useDragControls();

    return (
        <motion.div
            drag={shouldReduceMotion ? false : "y"}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
                if (info.offset.y > DRAG_DISMISS_OFFSET || info.velocity.y > DRAG_DISMISS_VELOCITY) close();
            }}
            className="flex max-h-[inherit] w-full flex-col"
        >
            {!shouldReduceMotion && (
                <div
                    aria-hidden="true"
                    className="flex w-full shrink-0 cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
                    onPointerDown={(event) => dragControls.start(event)}
                >
                    <div className="h-1.5 w-9 rounded-full bg-quaternary" />
                </div>
            )}
            {children}
        </motion.div>
    );
};

interface BottomSheetContentProps extends ComponentPropsWithRef<"div"> {}

const Content = ({ role = "main", className, ...props }: BottomSheetContentProps) => (
    <div
        role={role}
        {...props}
        className={cx(
            "flex w-full flex-col gap-6 overflow-y-auto overscroll-contain px-4 pb-(--sheet-safe-b) md:px-6",
            "[--sheet-safe-b:max(env(safe-area-inset-bottom),16px)]",
            className,
        )}
    />
);
Content.displayName = "BottomSheetContent";

interface BottomSheetHeaderProps extends ComponentPropsWithRef<"header"> {
    onClose?: () => void;
    /** @default true */
    showCloseButton?: boolean;
    /**
     * Moves keyboard focus straight to the close button as soon as the sheet mounts, instead of
     * the panel container (React Aria's default). Combined with the panel's built-in focus trap,
     * `Tab`/`Shift+Tab` cycling starts there immediately and never escapes the sheet until it closes.
     * @default true
     */
    autoFocus?: boolean;
}

const Header = ({ className, children, onClose, showCloseButton = true, autoFocus = true, ...props }: BottomSheetHeaderProps) => (
    <header {...props} className={cx("relative z-1 w-full px-4 pb-4 md:px-6", className)}>
        {children}
        {showCloseButton && <CloseButton size="sm" autoFocus={autoFocus} className="absolute top-0 right-3 shrink-0" onClick={onClose} />}
    </header>
);
Header.displayName = "BottomSheetHeader";

const Footer = (props: ComponentPropsWithRef<"footer">) => (
    <footer
        {...props}
        className={cx(
            "w-full p-4 pb-(--sheet-safe-b) shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
            "[--sheet-safe-b:max(env(safe-area-inset-bottom),16px)]",
            props.className,
        )}
    />
);
Footer.displayName = "BottomSheetFooter";

export interface BottomSheetProps extends Omit<AriaModalOverlayProps, "children">, RefAttributes<HTMLDivElement> {
    children: ReactNode | ((props: AriaModalRenderProps & { close: () => void }) => ReactNode);
    /** @default "md" */
    size?: BottomSheetSize;
    dialogClassName?: string;
    panelClassName?: string;
}

const BottomSheetRoot = ({ children, size = "md", dialogClassName, panelClassName, ...props }: BottomSheetProps) => {
    return (
        <BottomSheetOverlay {...props}>
            <BottomSheetPanel size={size} className={panelClassName}>
                {(state) => (
                    <BottomSheetDialog className={dialogClassName}>
                        {({ close }) => <DragLayer close={close}>{typeof children === "function" ? children({ ...state, close }) : children}</DragLayer>}
                    </BottomSheetDialog>
                )}
            </BottomSheetPanel>
        </BottomSheetOverlay>
    );
};
BottomSheetRoot.displayName = "BottomSheet";

export const BottomSheet = BottomSheetRoot as typeof BottomSheetRoot & {
    Trigger: typeof AriaDialogTrigger;
    Content: typeof Content;
    Header: typeof Header;
    Footer: typeof Footer;
};

BottomSheet.Trigger = AriaDialogTrigger;
BottomSheet.Content = Content;
BottomSheet.Header = Header;
BottomSheet.Footer = Footer;
