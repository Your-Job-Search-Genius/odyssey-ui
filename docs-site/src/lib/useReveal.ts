import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll-reveal for anything marked with `data-reveal`.
 *
 * A single shared IntersectionObserver adds `.is-revealed` the first time an
 * element scrolls into view (the `[data-reveal]` / `.is-revealed` rules in
 * site.css do the actual fade/slide). Elements are unobserved once revealed.
 *
 * Runs a scan on every route change, and also watches the content container
 * for DOM mutations so content that appears without navigation — e.g. cards
 * swapped in by the audience filter — still gets revealed and never stays
 * stuck at `opacity: 0`.
 *
 * Under `prefers-reduced-motion` (or when IntersectionObserver is missing)
 * everything is marked revealed immediately and no observer is created.
 *
 * Mount once, high in the tree (Layout).
 */
export function useReveal(): void {
  const location = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canObserve = !reduced && "IntersectionObserver" in window;

    const io = canObserve
      ? new IntersectionObserver(
          (entries, observer) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                observer.unobserve(entry.target);
              }
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
        )
      : null;

    let raf = 0;
    const scan = () => {
      raf = 0;
      const targets = document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not(.is-revealed)",
      );
      if (!io) {
        targets.forEach((el) => el.classList.add("is-revealed"));
        return;
      }
      targets.forEach((el) => io.observe(el));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(scan);
    };

    schedule();

    const root = document.getElementById("docs-content");
    const mo = root ? new MutationObserver(schedule) : null;
    if (root && mo) mo.observe(root, { childList: true, subtree: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
      mo?.disconnect();
    };
  }, [location.pathname]);
}
