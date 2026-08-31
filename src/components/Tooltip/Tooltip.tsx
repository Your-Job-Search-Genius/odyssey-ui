import type { DOMAttributes, ReactElement, ReactNode } from "react";
import {
  TooltipTrigger as AriaTooltipTrigger,
  Tooltip as AriaTooltip,
  OverlayArrow,
  Focusable,
} from "react-aria-components";
import "./Tooltip.css";

export interface TooltipProps {
  /** Tooltip text. Keep it short — this isn't a place for interactive content. */
  content: ReactNode;
  /**
   * A single trigger element that forwards its ref and spreads extra DOM
   * props (every component in this library qualifies). Wrapped internally
   * in `Focusable` so hover/focus listeners and `aria-describedby` attach
   * to it via `cloneElement`, since it isn't a react-aria-components
   * primitive itself.
   */
  children: ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  /** Hover/focus delay in ms before the tooltip appears. */
  delay?: number;
  isDisabled?: boolean;
}

/**
 * Tooltip — built on `react-aria-components`' `TooltipTrigger`/`Tooltip`.
 * Not present anywhere in the source Figma file at all (it's on the
 * project's "missing components" list) — the show/hide timing, Escape-to-
 * dismiss, and `aria-describedby` wiring below are the WAI-ARIA APG
 * pattern, satisfying WCAG 1.4.13 (hoverable, dismissible, persistent
 * while the trigger has focus). Visual treatment reuses this system's
 * existing dark-surface/shadow/radius language rather than inventing a new
 * look for a component the design file never defined.
 */
export function Tooltip({ content, children, placement = "top", delay = 400, isDisabled }: TooltipProps) {
  return (
    <AriaTooltipTrigger delay={delay} isDisabled={isDisabled}>
      {/* react-aria's `Focusable` types its child as a literal DOM element
          (`<button>`, not a custom component like our `Button`), even
          though `cloneElement` doesn't actually care at runtime — verified
          working (hover/focus/aria-describedby/Escape) in Tooltip.test.tsx. */}
      <Focusable>{children as unknown as ReactElement<DOMAttributes<HTMLElement>, string>}</Focusable>
      <AriaTooltip placement={placement} offset={6} className="wsu-Tooltip">
        <OverlayArrow className="wsu-Tooltip__arrow">
          <svg width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" fill="currentColor" />
          </svg>
        </OverlayArrow>
        {content}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
}
