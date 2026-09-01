import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Final value to count up to. */
  to: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Rendered immediately after the number, e.g. "+". */
  suffix?: string;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Counts 0 → `to` with requestAnimationFrame the first time it scrolls into
 * view (eased). Renders the final value instantly when the user prefers
 * reduced motion or IntersectionObserver is unavailable, so the number is
 * always correct even if never animated.
 */
export function CountUp({ to, duration = 1200, suffix = "" }: CountUpProps) {
  const [value, setValue] = useState(() =>
    prefersReducedMotion() ? to : 0,
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setValue(to);
      return;
    }
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
