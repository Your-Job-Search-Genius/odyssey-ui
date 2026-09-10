"use client";

import { useEffect, useState } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { X as CloseIcon } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";

const sizes = {
    xs: { root: "size-7", icon: "size-4" },
    sm: { root: "size-9", icon: "size-5" },
    md: { root: "size-10", icon: "size-5" },
    lg: { root: "size-11", icon: "size-6" },
};

const themes = {
    light: "text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 outline-focus-ring",
    dark: "text-fg-white/70 hover:text-fg-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 outline-focus-ring",
};

// `:focus-visible` (and React Aria's own equivalent) is keyed to the last interaction *modality*,
// which stays "pointer" after the user clicks a trigger with the mouse — so a subsequent
// programmatic `autoFocus` (e.g. this button being auto-focused when a Modal/Drawer/Alert opens)
// does not reliably render a visible ring in either system, even though the focus move is
// intentional and should be visible. `data-force-focus-ring` sidesteps that heuristic: it's on
// the instant this button is auto-focused, and clears the moment the user does something (moves
// focus away, or clicks/taps anywhere) that should reasonably take over.
//
// `outline-solid!` is load-bearing: `focus:outline-hidden` sets `--tw-outline-style: none` while
// the button has focus, and every outline-width utility (incl. `outline-2!`) emits
// `outline-style: var(--tw-outline-style)` — so without an explicit solid override the "forced"
// ring resolves to `outline-style: none` and nothing renders.
const forceRingClasses =
    "data-force-focus-ring:outline-2! data-force-focus-ring:outline-solid! data-force-focus-ring:outline-offset-2! data-force-focus-ring:outline-focus-ring!";

interface CloseButtonProps extends AriaButtonProps {
    theme?: "light" | "dark";
    size?: "xs" | "sm" | "md" | "lg";
    label?: string;
    /**
     * The React Aria slot the button fills. Defaults to `"close"` so it
     * automatically closes a parent `Dialog`/`Modal` without an explicit handler.
     * Pass `null` to opt out (e.g. when used as a `SearchField` clear button it
     * is picked up regardless of slot).
     * @default "close"
     */
    slot?: string | null;
}

export const CloseButton = ({ label, className, size = "sm", theme = "light", slot = "close", autoFocus, onBlur, ...otherProps }: CloseButtonProps) => {
    const [forceRing, setForceRing] = useState(!!autoFocus);

    useEffect(() => {
        if (!forceRing) return;

        const clear = () => setForceRing(false);
        window.addEventListener("pointerdown", clear, true);
        return () => window.removeEventListener("pointerdown", clear, true);
    }, [forceRing]);

    return (
        <AriaButton
            {...otherProps}
            autoFocus={autoFocus}
            slot={slot}
            aria-label={label || "Close"}
            data-force-focus-ring={forceRing || undefined}
            onBlur={(e) => {
                setForceRing(false);
                onBlur?.(e);
            }}
            className={(state) =>
                cx(
                    // `focus-visible:outline-solid` restores the keyboard ring that `focus:outline-hidden`
                    // otherwise poisons (it sets `--tw-outline-style: none`, which `outline-2` resolves).
                    "flex cursor-pointer items-center justify-center rounded-lg p-2 transition duration-100 ease-linear focus:outline-hidden focus-visible:outline-solid",
                    forceRingClasses,
                    sizes[size].root,
                    themes[theme],
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            <CloseIcon aria-hidden="true" className={cx("shrink-0 transition-inherit-all", sizes[size].icon)} />
        </AriaButton>
    );
};
