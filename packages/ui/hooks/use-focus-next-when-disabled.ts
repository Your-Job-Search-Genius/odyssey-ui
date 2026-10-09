"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]";

function isTabbable(el: HTMLElement): boolean {
    return el.tabIndex >= 0 && !el.matches(":disabled") && !el.closest("[inert], [hidden], [aria-hidden='true']") && el.getClientRects().length > 0;
}

/** The next tabbable element after `from` in document order, else the previous one, so focus never falls to <body>. */
function adjacentTabbable(from: HTMLElement): HTMLElement | null {
    const all = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !from.contains(el) && isTabbable(el));
    const next = all.find((el) => from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
    return next ?? all.filter((el) => from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING).at(-1) ?? null;
}

/**
 * When a focused control becomes disabled (e.g. pagination's Previous on page
 * 1), browsers silently drop focus to <body>, so keyboard and screen-reader
 * users lose their place. This moves focus to the next focusable element.
 *
 * Attach the returned ref to the control's own DOM element (the <button> or
 * <input>). It watches the element's `disabled` attribute, so it works however
 * the disabled state is set (prop, React Aria context, form state).
 */
export function useFocusNextWhenDisabled<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let hadFocus = el.contains(document.activeElement);

        const onFocusIn = () => {
            hadFocus = true;
        };
        // A blur caused by becoming disabled keeps the flag; a real move elsewhere clears it.
        const onFocusOut = () => {
            if (!el.matches(":disabled")) hadFocus = false;
        };
        const observer = new MutationObserver(() => {
            if (!hadFocus || !el.matches(":disabled")) return;
            hadFocus = false;
            const active = document.activeElement;
            // Only rescue focus that was actually lost; never steal it from somewhere the user moved to.
            if (active && active !== document.body && !el.contains(active)) return;
            adjacentTabbable(el)?.focus();
        });

        el.addEventListener("focusin", onFocusIn);
        el.addEventListener("focusout", onFocusOut);
        observer.observe(el, { attributes: true, attributeFilter: ["disabled"] });
        return () => {
            el.removeEventListener("focusin", onFocusIn);
            el.removeEventListener("focusout", onFocusOut);
            observer.disconnect();
        };
    }, []);

    return ref;
}
