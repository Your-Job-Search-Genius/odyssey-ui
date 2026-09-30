import { type RefObject, useEffect, useState } from "react";

const SCROLL_THRESHOLD = 6;
const NEAR_TOP_OFFSET = 24;
const SCROLL_STOP_DELAY_MS = 150;

/**
 * Scroll-driven visibility for a mobile toolbar (e.g. a bottom tab bar) attached to a scroll container:
 * - hides while the user scrolls down past a small top offset
 * - shows immediately while scrolling up, and again once scrolling stops
 * - ignores scrolls the user didn't gesture for (Tab focus `scrollIntoView`, programmatic scrolls)
 *
 * Returns `true` when the toolbar should be hidden.
 */
export const useHideOnScroll = (ref: RefObject<HTMLElement | null>, enabled = true) => {
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || !enabled) {
            setIsHidden(false);
            return;
        }

        let lastTop = element.scrollTop;
        let isUserGesture = false;
        let stopTimer: ReturnType<typeof setTimeout> | undefined;

        const markGesture = () => {
            isUserGesture = true;
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Tab") return;
            isUserGesture = false;
            setIsHidden(false);
        };
        const onScroll = () => {
            const top = element.scrollTop;
            const delta = top - lastTop;
            lastTop = top;
            if (!isUserGesture) return;

            if (Math.abs(delta) >= SCROLL_THRESHOLD) {
                if (delta > 0 && top > NEAR_TOP_OFFSET) setIsHidden(true);
                else if (delta < 0) setIsHidden(false);
            }

            clearTimeout(stopTimer);
            stopTimer = setTimeout(() => setIsHidden(false), SCROLL_STOP_DELAY_MS);
        };

        element.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("wheel", markGesture, { capture: true, passive: true });
        window.addEventListener("touchmove", markGesture, { capture: true, passive: true });
        document.addEventListener("keydown", onKeyDown, true);

        return () => {
            clearTimeout(stopTimer);
            element.removeEventListener("scroll", onScroll);
            window.removeEventListener("wheel", markGesture, true);
            window.removeEventListener("touchmove", markGesture, true);
            document.removeEventListener("keydown", onKeyDown, true);
        };
    }, [ref, enabled]);

    return isHidden;
};
