import { cx } from "@/utils/cx";

// No `outline-hidden` here: it sets `--tw-outline-style: none`, which `focus-visible:outline-2`
// would inherit — silently erasing the ring (WCAG 2.4.7). Matches button.tsx's focus styling.
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/**
 * The rail is a real inline element (the row's first flex child) rather than an
 * absolutely-positioned `::before` hanging outside the item's box. It's always in the DOM,
 * transparent unless active, so hover/active never reflow the row.
 */
export function NavRail({ active, className }: { active?: boolean; className?: string }) {
    return <span aria-hidden="true" className={cx("h-5.5 w-0.5 shrink-0 rounded-[0.3125rem] bg-transparent", active && "bg-brand-solid", className)} />;
}
