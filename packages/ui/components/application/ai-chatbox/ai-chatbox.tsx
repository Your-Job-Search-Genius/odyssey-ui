"use client";

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, FocusEvent, FormEvent, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
import { useControllableState } from "@/hooks/use-controllable-state";
import { cx } from "@/utils/cx";

export type ChatRole = "user" | "assistant";
export type ChatArtifactKind = "message" | "pdf" | "video" | "image" | "link";

export interface ChatArtifact {
    /** Category — sets the default icon and which fields are required. */
    kind: ChatArtifactKind;
    /** Card label. Required for every kind. */
    text: string;
    /** Secondary line (e.g. "PDF · 2.4 MB"). */
    meta?: string;
    /**
     * Destination. Required for `pdf | video | image | link` (opens in a new
     * tab). Ignored for `message`, which inserts `text` into the composer.
     */
    href?: string;
    /** Overrides the default per-kind icon. */
    icon?: ReactNode;
    /** Stable key; falls back to the index. */
    id?: string;
}

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: ReactNode;
    /** Artifact link cards the assistant attaches inside this message. */
    artifacts?: ChatArtifact[];
}

export interface AIChatboxProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onChange"> {
    /** The conversation, oldest first. */
    messages: ChatMessage[];
    /** Called with the trimmed text when the user sends a message. */
    onSend?: (text: string) => void;
    /** Shows the assistant typing indicator. */
    isTyping?: boolean;
    /** Header title. Defaults to "Assistant". */
    title?: ReactNode;
    /** Header status line under the title. Defaults to "Online". */
    status?: ReactNode;
    /** Header avatar. Defaults to a violet "A" tile. */
    avatar?: ReactNode;
    /** Composer placeholder. */
    placeholder?: string;
    /** Shown when there are no messages. */
    emptyState?: ReactNode;
    /** Resource links surfaced from the composer. Hidden entirely when empty. */
    artifacts?: ChatArtifact[];
    /** How artifacts are surfaced. `"popover"` (default) or a pinned `"chips"` strip. */
    artifactsLayout?: "popover" | "chips";
    /**
     * What the box collapses to when minimized. `"icon"` (default) shows an
     * icon-only launcher bubble that reopens on click; `"bar"` keeps the header
     * bar visible.
     */
    collapsedAs?: "icon" | "bar";
    /**
     * Where the widget sits. A corner makes it a **sticky floating widget**
     * (`position: fixed`, launcher + panel anchored to that corner);
     * `"inline"` renders it in normal flow. Defaults to `"bottom-right"`.
     */
    launcherPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "inline";
    /** Custom icon for the collapsed launcher bubble. Defaults to a chat glyph. */
    launcherIcon?: ReactNode;
    /** Controlled expanded/collapsed state. */
    open?: boolean;
    /** Uncontrolled initial expanded state. Defaults to `true`. */
    defaultOpen?: boolean;
    /** Called when the user minimizes/expands. */
    onOpenChange?: (open: boolean) => void;
    /** Overrides the focus ring color for this subtree. */
    focusRingColor?: string;
    /** Overrides the focus ring offset (number → px). */
    focusRingOffset?: string | number;
}

/* ── default per-kind icons — kept as local inline SVGs (no external icon
   package dependency in the source design, and no clean 1:1 match in this
   repo's foundations icon set for several of these glyphs) ─────────────── */
const strokeProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};
const ICONS: Record<ChatArtifactKind, ReactNode> = {
    message: (
        <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
            <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
        </svg>
    ),
    pdf: (
        <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M8.5 13h7M8.5 17h5" />
        </svg>
    ),
    video: (
        <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M10 8.5v7l6-3.5z" fill="currentColor" stroke="none" />
        </svg>
    ),
    image: (
        <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" stroke="none" />
            <path d="m21 15-5-5L5 21" />
        </svg>
    ),
    link: (
        <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
    ),
};

const SendIcon = () => (
    <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
);
const ClipIcon = () => (
    <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
        <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95L9.4 17.05a1.5 1.5 0 0 1-2.12-2.12l8.49-8.49" />
    </svg>
);
const ChevronIcon = () => (
    <svg viewBox="0 0 24 24" {...strokeProps} strokeWidth={2.4} aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);
const ExternalIcon = () => (
    <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" />
    </svg>
);
const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" />
    </svg>
);
const LauncherIcon = () => (
    <svg viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
);

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';
const getFocusable = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));

/** The single spring every micro-interaction (launcher/surface/menu enter, message rise) uses. */
const glassSpring: Transition = { type: "spring", stiffness: 400, damping: 30, mass: 0.6 };

/**
 * A configurable focus ring shared by every interactive control in the box. `focusRingColor`/
 * `focusRingOffset` are applied as CSS custom properties on the root (they inherit down the tree),
 * so any descendant can read them with a fallback to the default brand outline.
 */
const FOCUS_RING =
    "outline-hidden focus-visible:[outline:var(--chatbox-focus-ring-width,2px)_solid_var(--chatbox-focus-ring-color,var(--color-border-brand))] focus-visible:[outline-offset:var(--chatbox-focus-ring-offset,2px)]";
const FOCUS_WITHIN_RING =
    "focus-within:[outline:var(--chatbox-focus-ring-width,2px)_solid_var(--chatbox-focus-ring-color,var(--color-border-brand))] focus-within:[outline-offset:var(--chatbox-focus-ring-offset,2px)]";

const CORNER_POSITION: Record<"bottom-right" | "bottom-left" | "top-right" | "top-left", string> = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
};
const CORNER_ALIGN: Record<"bottom-right" | "bottom-left" | "top-right" | "top-left", string> = {
    "bottom-right": "items-end",
    "bottom-left": "items-start",
    "top-right": "items-end",
    "top-left": "items-start",
};

/**
 * AIChatbox — a self-contained, glassmorphism chat surface (the "Frosted
 * Minimal" design). Presentational + controllable: you own `messages` and
 * `onSend`; the box renders the frosted conversation, a disabled-until-typed
 * composer, an assistant typing indicator, minimize/expand, and optional
 * resource "artifacts" reachable from the composer (a focus-trapped popover, or
 * a pinned chip strip). All motion runs through `motion/react` and honors
 * `prefers-reduced-motion`.
 *
 * The frosted look (`backdrop-blur` + translucent surface + specular top-edge
 * highlight) is a close visual approximation of the original design's glass
 * effect — worth a side-by-side eyeball check against the source design if
 * pixel-exact blur/glow values matter for your use case.
 */
export const AIChatbox = forwardRef<HTMLDivElement, AIChatboxProps>(function AIChatbox(
    {
        messages,
        onSend,
        isTyping = false,
        title = "Assistant",
        status = "Online",
        avatar,
        placeholder = "Message the assistant…",
        emptyState,
        artifacts = [],
        artifactsLayout = "popover",
        collapsedAs = "icon",
        launcherPosition = "bottom-right",
        launcherIcon,
        open: openProp,
        defaultOpen = true,
        onOpenChange,
        focusRingColor,
        focusRingOffset,
        className,
        style,
        ...rest
    },
    ref,
) {
    const [open, setOpen] = useControllableState<boolean>({
        value: openProp,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    });
    const [draft, setDraft] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuViaKeyboard, setMenuViaKeyboard] = useState(false);

    const reduced = useReducedMotion() ?? false;
    const logId = useId();
    const menuId = useId();
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);
    const attachRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const logRef = useRef<HTMLDivElement>(null);
    const surfaceRef = useRef<HTMLDivElement>(null);
    const minRef = useRef<HTMLButtonElement>(null);
    const launcherRef = useRef<HTMLButtonElement>(null);
    // Marks an open/close that the user drove via our launcher/minimize buttons,
    // so we only move focus on those (not on a controlled `open` prop change).
    const userToggled = useRef(false);

    const hasArtifacts = artifacts.length > 0;
    const canSend = draft.trim().length > 0;
    const isCollapsed = !open;
    const showLauncher = isCollapsed && collapsedAs === "icon";
    const isFloating = launcherPosition !== "inline";
    const isMobileSheet = isMobile && isFloating && !isCollapsed;

    // Keep the log pinned to the latest message as it grows.
    useEffect(() => {
        const el = logRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, isTyping]);

    const closeMenu = useCallback((restoreFocus: boolean) => {
        setMenuOpen(false);
        if (restoreFocus) attachRef.current?.focus();
    }, []);

    // Move focus to the first artifact when the menu opens.
    useEffect(() => {
        if (!menuOpen) return;
        const first = menuRef.current?.querySelector<HTMLElement>("[data-artifact]");
        first?.focus();
    }, [menuOpen]);

    // Close the menu on an outside pointer press (no focus restore — pointer user).
    useEffect(() => {
        if (!menuOpen) return;
        const onDown = (e: globalThis.MouseEvent) => {
            const target = e.target as Node;
            if (menuRef.current?.contains(target) || attachRef.current?.contains(target)) return;
            setMenuOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [menuOpen]);

    // Hand focus between the launcher icon and the minimize button on open/close
    // (icon mode only), so keyboard users move into and out of the panel cleanly.
    useEffect(() => {
        if (!userToggled.current) return;
        userToggled.current = false;
        if (collapsedAs !== "icon") return;
        if (open) minRef.current?.focus();
        else launcherRef.current?.focus();
    }, [open, collapsedAs]);

    // While the icon widget is open it behaves like a modal: Tab/Shift+Tab loop
    // inside the panel, and Escape collapses it back to the launcher. (The
    // artifacts menu, when open, runs its own inner trap — defer to it.)
    const onSurfaceKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        // Only a fixed floating widget behaves modally; an inline embed must let
        // focus flow to the rest of the page.
        if (launcherPosition === "inline" || menuOpen) return;
        if (e.key === "Escape") {
            userToggled.current = true;
            setOpen(false);
            return;
        }
        if (e.key !== "Tab" || !surfaceRef.current) return;
        const items = getFocusable(surfaceRef.current);
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text) return;
        onSend?.(text);
        setDraft("");
    };

    const activateArtifact = (artifact: ChatArtifact) => {
        if (artifact.kind === "message") {
            setDraft(artifact.text);
            inputRef.current?.focus();
        }
        setMenuOpen(false);
    };

    // Focus trap for the artifacts menu: Tab/Shift+Tab loop inside it; Esc closes.
    const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            e.stopPropagation();
            closeMenu(true);
            return;
        }
        if (e.key !== "Tab" || !menuRef.current) return;
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    };

    // Keep a newly-focused control in view — e.g. a chip clipped in the
    // horizontally-scrollable strip, or an item in the scrollable menu.
    const onRootFocus = (e: FocusEvent<HTMLDivElement>) => {
        const target = e.target;
        if (target !== e.currentTarget && typeof target.scrollIntoView === "function") {
            target.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
    };

    const toggleMenu = (e: MouseEvent) => {
        // detail === 0 ⇒ activated by keyboard (Enter/Space), not a pointer.
        const viaKeyboard = e.detail === 0;
        setMenuViaKeyboard(viaKeyboard);
        setMenuOpen((v) => !v);
    };

    const rootStyle: CSSProperties = {
        ...style,
        ...(focusRingColor ? { ["--chatbox-focus-ring-color" as string]: focusRingColor } : null),
        ...(focusRingOffset != null
            ? {
                  ["--chatbox-focus-ring-offset" as string]: typeof focusRingOffset === "number" ? `${focusRingOffset}px` : focusRingOffset,
              }
            : null),
    };

    const renderArtifact = (artifact: ChatArtifact, index: number, variant: "card" | "chip") => {
        const key = artifact.id ?? `${artifact.kind}-${index}`;
        const icon = artifact.icon ?? ICONS[artifact.kind];
        const isMessage = artifact.kind === "message";
        let trailing: ReactNode = null;
        if (variant === "card") trailing = isMessage ? <ArrowIcon /> : <ExternalIcon />;

        const cardClasses = cx(
            "font-inherit flex w-full items-center gap-2.5 rounded-lg border border-transparent bg-transparent px-2 py-[0.42rem] text-left text-primary no-underline",
            "hover:border-brand/20 hover:bg-brand-secondary",
            FOCUS_RING,
        );
        const chipClasses = cx(
            "inline-flex shrink-0 items-center gap-[0.35rem] rounded-full border border-secondary bg-primary px-2.5 py-[0.32rem] text-sm whitespace-nowrap text-primary no-underline",
            "hover:border-brand/40",
            FOCUS_RING,
        );

        const inner =
            variant === "card" ? (
                <>
                    <span className="flex size-[1.9rem] shrink-0 items-center justify-center rounded-md bg-brand-secondary text-fg-brand-primary [&>svg]:size-4">
                        {icon}
                    </span>
                    <span className="flex min-w-0 flex-col leading-[1.25]">
                        <b className="truncate text-sm font-semibold">{artifact.text}</b>
                        <span className="text-[0.65rem] font-semibold tracking-wide text-tertiary uppercase">{artifact.meta ?? artifact.kind}</span>
                    </span>
                    <span className="ml-auto inline-flex shrink-0 text-tertiary [&>svg]:size-[0.9rem]">{trailing}</span>
                </>
            ) : (
                <>
                    <span className="inline-flex text-fg-brand-primary [&>svg]:size-[0.9rem]">{icon}</span>
                    {artifact.text}
                </>
            );

        if (isMessage) {
            return (
                <button
                    key={key}
                    type="button"
                    className={variant === "card" ? cardClasses : chipClasses}
                    data-artifact
                    onClick={() => activateArtifact(artifact)}
                >
                    {inner}
                </button>
            );
        }
        return (
            <a
                key={key}
                className={variant === "card" ? cardClasses : chipClasses}
                data-artifact
                href={artifact.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => activateArtifact(artifact)}
            >
                {inner}
            </a>
        );
    };

    const rise = reduced
        ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
        : { initial: { opacity: 0, y: 8, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 } };

    // On mobile the floating widget opens as a bottom-sheet drawer (slide up);
    // elsewhere it scales in.
    const asSheet = isMobile && launcherPosition !== "inline";
    const surfaceInitial = reduced ? { opacity: 0 } : asSheet ? { y: "100%" } : { opacity: 0, scale: 0.94 };
    const surfaceAnimate = reduced ? { opacity: 1 } : asSheet ? { y: 0 } : { opacity: 1, scale: 1 };

    const sizeClasses = showLauncher
        ? "h-auto w-auto"
        : isCollapsed && collapsedAs === "bar"
          ? "h-13"
          : isMobileSheet
            ? "h-[min(var(--chatbox-height,32rem),85dvh)] w-full max-w-none"
            : isFloating
              ? "max-h-[calc(100vh-3rem)] w-[min(var(--chatbox-width,23rem),calc(100vw-2rem))]"
              : "h-[var(--chatbox-height,32rem)]";

    const positionClasses = !isFloating
        ? ""
        : isMobileSheet
          ? "inset-x-0 bottom-0"
          : cx(CORNER_POSITION[launcherPosition as keyof typeof CORNER_POSITION], !showLauncher && CORNER_ALIGN[launcherPosition as keyof typeof CORNER_ALIGN]);

    return (
        <div
            ref={ref}
            className={cx(
                "flex w-full flex-col text-primary transition-[height] duration-300 ease-out",
                sizeClasses,
                isFloating && "fixed z-40",
                positionClasses,
                className,
            )}
            data-collapsed={isCollapsed || undefined}
            data-collapsed-as={collapsedAs}
            data-position={launcherPosition}
            style={rootStyle}
            {...rest}
            onFocus={onRootFocus}
        >
            {showLauncher ? (
                <motion.button
                    key="launcher"
                    ref={launcherRef}
                    type="button"
                    className={cx(
                        "grid size-14 shrink-0 cursor-pointer place-items-center rounded-full border border-secondary_alt bg-brand-solid text-white shadow-lg hover:bg-brand-solid_hover [&>svg]:size-6",
                        FOCUS_RING,
                    )}
                    aria-label="Open chat"
                    aria-expanded={false}
                    onClick={() => {
                        userToggled.current = true;
                        setOpen(true);
                    }}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                    animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                    transition={reduced ? { duration: 0 } : glassSpring}
                    whileTap={reduced ? undefined : { scale: 0.92 }}
                >
                    {launcherIcon ?? <LauncherIcon />}
                </motion.button>
            ) : (
                <motion.div
                    key="surface"
                    ref={surfaceRef}
                    className={cx(
                        "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden border border-secondary_alt bg-primary/80 shadow-lg backdrop-blur-md",
                        isMobileSheet ? "rounded-t-2xl" : "rounded-xl",
                    )}
                    onKeyDown={onSurfaceKeyDown}
                    initial={surfaceInitial}
                    animate={surfaceAnimate}
                    transition={reduced ? { duration: 0 } : glassSpring}
                >
                    {/* Specular top-edge highlight — the frosted shell's one purely decorative touch. */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-[14%] top-0 z-2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />

                    <header
                        className={cx(
                            "relative flex h-13 shrink-0 items-center gap-[0.65rem] border-b border-secondary_alt px-[0.9rem] py-[0.7rem]",
                            isMobileSheet && "h-auto pt-4",
                        )}
                    >
                        {isMobileSheet && (
                            <span aria-hidden="true" className="absolute top-[0.4rem] left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-border-secondary" />
                        )}
                        {avatar ?? (
                            <span
                                className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-solid text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                                aria-hidden="true"
                            >
                                A
                            </span>
                        )}
                        <span className="flex min-w-0 flex-col leading-tight">
                            <b className="text-sm font-semibold text-primary">{title}</b>
                            <span className="inline-flex items-center gap-[0.35rem] text-[0.68rem] text-tertiary">
                                <i className="size-1.5 shrink-0 rounded-full bg-fg-success-secondary" aria-hidden="true" />
                                {isTyping ? "typing…" : status}
                            </span>
                        </span>
                        <span className="flex-1" />
                        <button
                            ref={minRef}
                            type="button"
                            className={cx(
                                "grid size-[1.85rem] shrink-0 place-items-center rounded-md border border-secondary_alt bg-transparent text-tertiary hover:text-primary [&>svg]:size-[0.9rem] [&>svg]:transition-transform [&>svg]:duration-200",
                                isCollapsed && "[&>svg]:rotate-180",
                                FOCUS_RING,
                            )}
                            aria-expanded={open}
                            aria-label={open ? "Minimize chat" : "Expand chat"}
                            onClick={() => {
                                userToggled.current = true;
                                setOpen(!open);
                            }}
                        >
                            <ChevronIcon />
                        </button>
                    </header>

                    <div className={cx("flex min-h-0 flex-1 flex-col", isCollapsed && collapsedAs === "bar" && "invisible")}>
                        <div
                            ref={logRef}
                            id={logId}
                            className="flex min-h-0 flex-1 flex-col gap-[0.55rem] overflow-y-auto p-[0.9rem]"
                            role="log"
                            aria-live="polite"
                            aria-label="Conversation"
                        >
                            {messages.length === 0 && emptyState ? <div className="m-auto text-center text-sm text-tertiary">{emptyState}</div> : null}
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    className={cx(
                                        "flex max-w-[84%] flex-col gap-[0.4rem]",
                                        m.role === "user" ? "items-end self-end" : "items-start self-start",
                                    )}
                                    {...rise}
                                    transition={reduced ? { duration: 0 } : glassSpring}
                                >
                                    <div
                                        className={cx(
                                            "max-w-full rounded-xl px-[0.78rem] py-[0.55rem] text-sm",
                                            m.role === "assistant" && "rounded-bl-[0.35rem] border border-secondary bg-primary text-primary shadow-xs",
                                            m.role === "user" &&
                                                "rounded-br-[0.35rem] bg-brand-solid text-white shadow-[0_2px_8px_rgba(86,59,219,0.25),inset_0_1px_0_rgba(255,255,255,0.22)]",
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                    {m.artifacts && m.artifacts.length > 0 && (
                                        <div className="flex w-[min(20rem,100%)] flex-col gap-[0.35rem]" aria-label="Attached resources">
                                            {m.artifacts.map((a, i) => renderArtifact(a, i, "card"))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    className="flex shrink-0 items-center gap-[0.28rem] self-start rounded-xl rounded-bl-[0.35rem] border border-secondary bg-primary px-[0.75rem] py-[0.62rem]"
                                    {...rise}
                                    transition={reduced ? { duration: 0 } : glassSpring}
                                    aria-label="Assistant is typing"
                                    role="status"
                                >
                                    {[0, 1, 2].map((i) => (
                                        <motion.i
                                            key={i}
                                            className="size-[0.4rem] rounded-full bg-tertiary"
                                            animate={reduced ? { opacity: 0.65 } : { opacity: [0.35, 0.95, 0.35], y: [0, -3, 0] }}
                                            transition={reduced ? undefined : { duration: 1.25, repeat: Infinity, delay: i * 0.18 }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {hasArtifacts && artifactsLayout === "chips" && (
                            <div
                                className="flex shrink-0 [scrollbar-width:none] gap-[0.4rem] overflow-x-auto border-t border-secondary_alt px-[0.8rem] py-2 [&::-webkit-scrollbar]:hidden"
                                aria-label="Resources"
                            >
                                {artifacts.map((a, i) => renderArtifact(a, i, "chip"))}
                            </div>
                        )}

                        <form
                            className="relative mt-auto flex shrink-0 items-center gap-2 border-t border-secondary bg-primary px-[0.8rem] py-[0.7rem]"
                            onSubmit={submit}
                        >
                            {hasArtifacts && artifactsLayout === "popover" && (
                                <div className="relative flex shrink-0">
                                    <AnimatePresence>
                                        {menuOpen && (
                                            <motion.div
                                                key="menu"
                                                ref={menuRef}
                                                id={menuId}
                                                className="absolute bottom-[calc(100%+0.5rem)] left-0 z-20 flex max-h-64 w-[min(17rem,72vw)] origin-bottom-left flex-col gap-[0.2rem] overflow-y-auto rounded-xl border border-secondary bg-primary p-[0.4rem] shadow-lg"
                                                role="dialog"
                                                aria-label="Resources"
                                                onKeyDown={onMenuKeyDown}
                                                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
                                                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                                                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
                                                transition={reduced ? { duration: 0 } : glassSpring}
                                            >
                                                <div className="flex items-center justify-between px-[0.35rem] pt-[0.15rem] pb-[0.1rem]">
                                                    <span className="text-[0.62rem] font-bold tracking-[0.1em] text-tertiary uppercase">Resources</span>
                                                    {menuViaKeyboard && (
                                                        <button
                                                            type="button"
                                                            className={cx(
                                                                "grid size-6 shrink-0 place-items-center rounded-md border border-secondary_alt bg-transparent text-tertiary hover:text-primary [&>svg]:size-[0.8rem]",
                                                                FOCUS_RING,
                                                            )}
                                                            aria-label="Close resources"
                                                            onClick={() => closeMenu(true)}
                                                        >
                                                            <CloseIcon />
                                                        </button>
                                                    )}
                                                </div>
                                                {artifacts.map((a, i) => renderArtifact(a, i, "card"))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button
                                        ref={attachRef}
                                        type="button"
                                        className={cx(
                                            "grid size-[2.15rem] shrink-0 place-items-center rounded-lg border border-secondary bg-primary text-tertiary [&>svg]:size-[1.05rem]",
                                            "hover:border-brand/40 hover:text-fg-brand-primary aria-expanded:border-brand/40 aria-expanded:text-fg-brand-primary",
                                            FOCUS_RING,
                                        )}
                                        aria-haspopup="dialog"
                                        aria-expanded={menuOpen}
                                        aria-controls={menuOpen ? menuId : undefined}
                                        aria-label="Resources"
                                        onClick={toggleMenu}
                                    >
                                        <ClipIcon />
                                    </button>
                                </div>
                            )}

                            <label
                                className={cx(
                                    "flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-secondary bg-primary px-[0.8rem] py-[0.55rem]",
                                    FOCUS_WITHIN_RING,
                                )}
                            >
                                <span className="sr-only">Message</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-sm text-primary outline-none placeholder:text-placeholder"
                                    value={draft}
                                    placeholder={placeholder}
                                    onChange={(e) => setDraft(e.target.value)}
                                    aria-controls={logId}
                                />
                            </label>

                            <motion.button
                                type="submit"
                                className={cx(
                                    "grid size-[2.15rem] shrink-0 place-items-center rounded-lg bg-brand-solid text-white shadow-[0_2px_8px_rgba(86,59,219,0.32),inset_0_1px_0_rgba(255,255,255,0.28)] transition-colors duration-150 [&>svg]:size-[1.02rem]",
                                    "hover:bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
                                    FOCUS_RING,
                                )}
                                disabled={!canSend}
                                aria-label="Send message"
                                whileTap={reduced || !canSend ? undefined : { scale: 0.92 }}
                                transition={glassSpring}
                            >
                                <SendIcon />
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            )}
        </div>
    );
});
