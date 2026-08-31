import type { ReactNode } from "react";

/**
 * The segmented progress ring around the question number. Figma draws it as
 * three rotated arc ellipses; a dashed circle is the same picture with far
 * less markup, and scales cleanly to any step count.
 */
export function CountRing({ current, total }: { current: number; total: number }) {
  const radius = 8.7;
  const circumference = 2 * Math.PI * radius;
  const gap = 3.2;
  const segments = Math.max(total, 1);
  const segment = circumference / segments - gap;

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r={radius} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.2} />
      <circle
        cx="10"
        cy="10"
        r={radius}
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeDasharray={`${segment} ${gap}`}
        strokeDashoffset={circumference - (circumference / segments) * Math.min(current, total)}
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
}

export function renderCount(current: ReactNode, total: ReactNode) {
  return (
    <>
      {current}
      {total}
    </>
  );
}
