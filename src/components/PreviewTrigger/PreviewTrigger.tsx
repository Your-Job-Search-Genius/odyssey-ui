import type { DOMAttributes, ReactElement, ReactNode } from "react";
import { PreviewTrigger as AriaPreviewTrigger, Popover as AriaPopover, OverlayArrow } from "react-aria-components";
import type { PopoverPlacement } from "../Popover/Popover";
import "../Select/popover-menu.css";
import "../Popover/Popover.css";

export interface PreviewTriggerProps {
  /**
   * A single trigger element that forwards its ref and spreads extra DOM
   * props. Any `react-aria-components` primitive (this library's `Link`,
   * `Button`, etc.) picks up the hover/focus/long-press handlers via
   * context automatically; a non-RAC element needs an explicit `<Focusable>`
   * wrapper (imported from `react-aria-components`) plus an ARIA role.
   */
  trigger: ReactElement;
  /** Popover content — unlike a `Tooltip`, this may be interactive. */
  children: ReactNode;
  /** Defaults to `bottom`. */
  placement?: PopoverPlacement;
  /** Gap between the popover and its trigger, in pixels. Defaults to 12 with the arrow shown, 8 without. */
  offset?: number;
  /** Hides the pointer arrow. */
  hideArrow?: boolean;
  /** Hover/focus warmup delay in ms before the preview opens. Defaults to 600. */
  delay?: number;
  /** Delay in ms before the preview closes once the pointer/focus leaves. Defaults to 200. */
  closeDelay?: number;
  isDisabled?: boolean;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * PreviewTrigger — built on `react-aria-components`' `PreviewTrigger`. Not
 * present in the source Figma file (it's on the project's "missing
 * components" list alongside `Tooltip`). Displays a non-modal popover on
 * hover, focus, or long press; reuses the same `.wsu-Popover` chrome
 * `Popover` carries (Select/popover-menu.css + Popover.css) so a preview
 * looks identical to an explicitly-triggered popover.
 *
 * **Use when:** a rich, possibly-interactive preview of something referenced
 * inline (a user profile behind an @mention, an issue behind its number).
 * **Don't use when:** the content is a short line of supplemental text (use
 * `Tooltip`, which is lighter-weight and text-only) or the preview should
 * only ever open on an explicit click (use `Popover`).
 */
export function PreviewTrigger({
  trigger,
  children,
  placement = "bottom",
  offset,
  hideArrow = false,
  delay,
  closeDelay,
  isDisabled,
  isOpen,
  defaultOpen,
  onOpenChange,
  className,
  style,
}: PreviewTriggerProps) {
  const popoverClassName = className ? `wsu-Popover wsu-Popover--content ${className}` : "wsu-Popover wsu-Popover--content";

  return (
    <AriaPreviewTrigger
      delay={delay}
      closeDelay={closeDelay}
      isDisabled={isDisabled}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger as unknown as ReactElement<DOMAttributes<HTMLElement>, string>}
      <AriaPopover placement={placement} offset={offset ?? (hideArrow ? 8 : 12)} className={popoverClassName} style={style}>
        {!hideArrow ? (
          <OverlayArrow className="wsu-Popover__arrow">
            <svg width={12} height={12} viewBox="0 0 12 12">
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          </OverlayArrow>
        ) : null}
        {children}
      </AriaPopover>
    </AriaPreviewTrigger>
  );
}
