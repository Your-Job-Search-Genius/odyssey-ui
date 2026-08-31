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

export function AcceptGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className="wsu-AliceButton__accept">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth={1.4} />
      <path d="m5.2 8.2 1.9 1.9 3.7-4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DismissGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className="wsu-AliceCard__dismissIcon">
      <path d="m4.6 4.6 6.8 6.8M11.4 4.6l-6.8 6.8" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

export function CaretGlyph({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      viewBox="0 0 9 4.5"
      fill="none"
      aria-hidden="true"
      focusable="false"
      width="9"
      height="4.5"
      style={direction === "up" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M0.6 0.6 4.5 3.9 8.4 0.6" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" width="20" height="20">
      <path d="M6 8.5 10 12.5 14 8.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
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
