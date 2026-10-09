import { cx } from "@/utils/cx";

/**
 * Re-skins a React Aria `Popover` as a bottom sheet below the `md` breakpoint
 * (phones, and desktop browsers at high zoom -- 400% on a 1920px screen is a
 * 480px viewport). Every class is `max-md:`-scoped, so desktop is untouched.
 *
 * The popover stays a RAC Popover on purpose: Select/ComboBox render their
 * collection through it, and it keeps dialog naming, focus trap/restore,
 * close-on-select and submenu wiring. Append this after the popover's own
 * classes. `!` beats the inline position/max-height `useOverlayPosition` sets.
 */
export const SHEET_POPOVER = cx(
    "max-md:fixed! max-md:inset-x-0! max-md:top-auto! max-md:bottom-0! max-md:max-h-[85dvh]! max-md:w-full! max-md:max-w-none",
    // Narrow tablets: keep the sheet a readable width, centered (matches BottomSheet size "md").
    "max-md:sm:mx-auto max-md:sm:max-w-120!",
    "max-md:flex max-md:flex-col max-md:overflow-y-auto max-md:overscroll-contain max-md:rounded-t-2xl max-md:rounded-b-none max-md:bg-primary",
    "max-md:pb-[max(env(safe-area-inset-bottom),8px)] max-md:will-change-auto",
    // Dim the page: RAC's underlay (which catches the outside tap) has no styling hook, so a huge shadow does the dimming.
    "max-md:shadow-[0_0_0_100vmax_color-mix(in_srgb,var(--color-bg-overlay)_70%,transparent)]",
    "max-md:data-entering:duration-300 max-md:data-entering:slide-in-from-bottom! max-md:data-exiting:duration-200 max-md:data-exiting:slide-out-to-bottom!",
    // A submenu opens as a second sheet on top; keep it shorter so the parent sheet stays visible behind it,
    // and lift it with a soft shadow instead of dimming again (stacked dims would black out the parent).
    "max-md:data-[trigger=SubmenuTrigger]:max-h-[70dvh]! max-md:data-[trigger=SubmenuTrigger]:shadow-[0_-8px_24px_rgb(0_0_0/0.18)]",
);
