"use client";

import { type ComponentPropsWithRef, type FC, type ReactNode, isValidElement, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CloseButton } from "@/components/base/buttons/close-button";
import { AlertCircle, AlertTriangle, CheckCircle, InfoCircle } from "@/components/foundations/icons";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

const styles = sortCx({
    common: {
        root: "relative flex w-full items-start rounded-xl border border-secondary shadow-xs",
        icon: "shrink-0",
        title: "text-primary",
        description: "text-tertiary",
    },
    sizes: {
        sm: { root: "gap-2 p-3", icon: "mt-0.5 size-4", title: "text-sm font-medium", description: "text-sm" },
        md: { root: "gap-3 p-4", icon: "mt-0.5 size-5", title: "text-sm font-semibold", description: "text-sm" },
    },
    colors: {
        info: { root: "bg-brand-secondary", icon: "text-fg-brand-primary" },
        success: { root: "bg-success-secondary", icon: "text-fg-success-primary" },
        warning: { root: "bg-warning-secondary", icon: "text-fg-warning-primary" },
        error: { root: "bg-error-secondary", icon: "text-fg-error-primary" },
    },
});

const defaultIcons = {
    info: InfoCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
};

export interface AlertProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
    /** Semantic color/intent of the alert. Also determines the default icon and ARIA role. @default "info" */
    color?: keyof typeof styles.colors;
    /** @default "md" */
    size?: keyof typeof styles.sizes;
    title?: ReactNode;
    description?: ReactNode;
    /** Overrides the default icon for `color`. Pass a component reference or an element (with `data-icon`). */
    icon?: FC<{ className?: string }> | ReactNode;
    /** Hides the leading icon entirely. */
    hideIcon?: boolean;
    /** Extra content rendered below the description, e.g. action buttons or links. */
    actions?: ReactNode;
    /** Shows a dismiss button in the top-right corner and is called when it's pressed. */
    onDismiss?: () => void;
    /**
     * When `onDismiss` is set, moves keyboard focus to the dismiss button as soon as the alert
     * mounts. Set to `false` for banners that are present on initial page load (so focus isn't
     * yanked away from wherever the user actually started), and keep it on for alerts that appear
     * in response to something the user just did.
     * @default true
     */
    autoFocus?: boolean;
}

/**
 * A static, inline banner for surfacing page- or section-level status messages.
 * For transient, self-dismissing notifications use `toast()` + `<Toaster />` instead.
 */
export const Alert = ({
    color = "info",
    size = "md",
    title,
    description,
    icon: Icon = defaultIcons[color],
    hideIcon,
    actions,
    onDismiss,
    autoFocus = true,
    className,
    children,
    ...props
}: AlertProps) => {
    const isUrgent = color === "error" || color === "warning";

    return (
        <div
            {...props}
            role={isUrgent ? "alert" : "status"}
            aria-live={isUrgent ? "assertive" : "polite"}
            aria-atomic="true"
            className={cx(styles.common.root, styles.sizes[size].root, styles.colors[color].root, onDismiss && "pr-11", className)}
        >
            {!hideIcon && Icon && (
                <>
                    {isReactComponent(Icon) && (
                        <Icon aria-hidden="true" className={cx(styles.common.icon, styles.sizes[size].icon, styles.colors[color].icon)} />
                    )}
                    {isValidElement(Icon) && <div className={cx(styles.common.icon, styles.sizes[size].icon, styles.colors[color].icon)}>{Icon}</div>}
                </>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                {title && <p className={cx(styles.common.title, styles.sizes[size].title)}>{title}</p>}
                {description && <p className={cx(styles.common.description, styles.sizes[size].description)}>{description}</p>}
                {children}
                {actions && <div className="mt-1 flex flex-wrap items-center gap-3">{actions}</div>}
            </div>

            {onDismiss && (
                <CloseButton size="sm" slot={null} label="Dismiss" autoFocus={autoFocus} className="absolute top-2.5 right-2.5" onClick={onDismiss} />
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------------------------------
 * Toast: an imperative, portal-rendered notification system (`toast()` + `<Toaster />`) built for
 * transient alerts. State lives in a module-level store so `toast()` can be called from anywhere
 * (event handlers, async callbacks) without needing a hook or context provider around the caller.
 * ---------------------------------------------------------------------------------------------- */

export type ToastColor = keyof typeof styles.colors;

export interface ToastOptions {
    id?: string;
    color?: ToastColor;
    title?: ReactNode;
    description?: ReactNode;
    icon?: FC<{ className?: string }> | ReactNode;
    actions?: ReactNode;
    /**
     * Time in milliseconds before the toast auto-dismisses. Pass `Infinity` to require manual dismissal.
     * @default 5000
     */
    duration?: number;
    /**
     * Moves keyboard focus to the toast's dismiss button as soon as it mounts. Set to `false` for
     * toasts triggered by background events (e.g. a websocket push) that shouldn't interrupt
     * whatever the user is currently doing.
     * @default true
     */
    autoFocus?: boolean;
}

interface ToastItem extends ToastOptions {
    id: string;
    color: ToastColor;
    duration: number;
}

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
let idCounter = 0;

const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
const getSnapshot = () => toasts;
const getServerSnapshot = (): ToastItem[] => [];

const dismissToast = (id: string) => {
    if (!toasts.some((item) => item.id === id)) return;
    toasts = toasts.filter((item) => item.id !== id);
    emit();
};

const pushToast = (color: ToastColor, title: ReactNode, options: Omit<ToastOptions, "title" | "color"> = {}): string => {
    idCounter += 1;
    const id = options.id ?? `toast-${idCounter}`;
    const duration = options.duration ?? 5000;
    const autoFocus = options.autoFocus ?? true;
    // Replace rather than duplicate if an explicit id is reused (e.g. a "loading" -> "success" transition).
    toasts = [...toasts.filter((item) => item.id !== id), { ...options, id, color, title, duration, autoFocus }];
    emit();
    return id;
};

export const toast = Object.assign((title: ReactNode, options?: Omit<ToastOptions, "title" | "color">) => pushToast("info", title, options), {
    info: (title: ReactNode, options?: Omit<ToastOptions, "title" | "color">) => pushToast("info", title, options),
    success: (title: ReactNode, options?: Omit<ToastOptions, "title" | "color">) => pushToast("success", title, options),
    warning: (title: ReactNode, options?: Omit<ToastOptions, "title" | "color">) => pushToast("warning", title, options),
    error: (title: ReactNode, options?: Omit<ToastOptions, "title" | "color">) => pushToast("error", title, options),
    dismiss: (id?: string) => {
        if (id) return dismissToast(id);
        toasts = [];
        emit();
    },
});

const ToastCard = ({ item }: { item: ToastItem }) => {
    const shouldReduceMotion = useReducedMotion();
    const [isPaused, setIsPaused] = useState(false);
    const remainingRef = useRef(item.duration);
    const startedAtRef = useRef<number | null>(null);

    useEffect(() => {
        if (!Number.isFinite(item.duration) || isPaused) return;

        startedAtRef.current = performance.now();
        const timer = window.setTimeout(() => dismissToast(item.id), remainingRef.current);

        return () => {
            window.clearTimeout(timer);
            if (startedAtRef.current !== null) {
                remainingRef.current = Math.max(0, remainingRef.current - (performance.now() - startedAtRef.current));
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPaused, item.id]);

    const Icon = item.icon ?? defaultIcons[item.color];

    return (
        <motion.div
            layout
            role={item.color === "error" || item.color === "warning" ? "alert" : "status"}
            drag={shouldReduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 1 }}
            onDragEnd={(_, info) => {
                if (info.offset.x > 120 || info.velocity.x > 600) dismissToast(item.id);
            }}
            onHoverStart={() => setIsPaused(true)}
            onHoverEnd={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 100, scale: 0.95 }}
            transition={shouldReduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 500, damping: 40 }}
            className={cx(
                "pointer-events-auto flex w-full items-start gap-3 rounded-xl bg-primary p-4 pr-11 shadow-lg ring-1 ring-secondary_alt",
                !shouldReduceMotion && "cursor-grab active:cursor-grabbing",
            )}
        >
            {Icon && (
                <>
                    {isReactComponent(Icon) && <Icon aria-hidden="true" className={cx("mt-0.5 size-5 shrink-0", styles.colors[item.color].icon)} />}
                    {isValidElement(Icon) && <div className={cx("mt-0.5 size-5 shrink-0", styles.colors[item.color].icon)}>{Icon}</div>}
                </>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                {item.title && <p className="text-sm font-semibold text-primary">{item.title}</p>}
                {item.description && <p className="text-sm text-tertiary">{item.description}</p>}
                {item.actions && <div className="mt-1 flex flex-wrap items-center gap-3">{item.actions}</div>}
            </div>

            <CloseButton
                size="sm"
                slot={null}
                label="Dismiss"
                autoFocus={item.autoFocus}
                className="absolute top-2.5 right-2.5"
                onClick={() => dismissToast(item.id)}
            />
        </motion.div>
    );
};

const positions = sortCx({
    "top-left": "top-0 left-0 items-start",
    "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
    "top-right": "top-0 right-0 items-end",
    "bottom-left": "bottom-0 left-0 items-start",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
    "bottom-right": "right-0 bottom-0 items-end",
});

interface ToasterProps {
    /** Screen corner the toast stack anchors to. @default "bottom-right" */
    position?: keyof typeof positions;
}

/** Mount once near the root of the app. Renders whatever toasts are pushed via `toast()`. */
export const Toaster = ({ position = "bottom-right" }: ToasterProps) => {
    const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return (
        <div
            className={cx("pointer-events-none fixed z-[100] flex max-h-dvh w-full max-w-sm flex-col gap-3 overflow-hidden p-4 sm:p-6", positions[position])}
            aria-live="polite"
            aria-atomic="false"
        >
            <AnimatePresence mode="popLayout">
                {items.map((item) => (
                    <ToastCard key={item.id} item={item} />
                ))}
            </AnimatePresence>
        </div>
    );
};
