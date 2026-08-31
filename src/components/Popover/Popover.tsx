import type { DOMAttributes, ReactElement, ReactNode, RefObject } from "react";
import { DialogTrigger, Popover as AriaPopover, OverlayArrow, Pressable } from "react-aria-components";
import "../Select/popover-menu.css";
import "./Popover.css";

/**
 * The axis placements `Popover.css`'s `[data-placement]` arrow rules cover.
 * react-aria's own `Placement` union is wider (`"bottom left"`, `"start"`,
 * …) but, as with `Menu`'s `placement` prop, this only exposes the subset
 * a consumer has actually needed so far.
 */
export type PopoverPlacement =
  | "top"
  | "top start"
  | "top end"
  | "bottom"
  | "bottom start"
  | "bottom end"
  | "left"
  | "left top"
  | "left bottom"
  | "right"
  | "right top"
  | "right bottom";

interface PopoverCommonProps {
  /** Arbitrary popover content — unlike `Menu`/`Select`, not restricted to a list. */
  children: ReactNode;
  /** Defaults to `bottom`. */
  placement?: PopoverPlacement;
  /** Gap between the popover and its anchor, in pixels. Defaults to 12 with the arrow shown, 8 without — the arrow itself draws into part of that gap. */
  offset?: number;
  /** Hides the pointer arrow — e.g. when anchoring to a wide region rather than a single point. */
  hideArrow?: boolean;
  /** Lets focus and pointer interaction reach elements outside the popover while it's open. Most popovers should leave this false; only a component like a combobox that pairs the popover with an always-interactive field should set it. */
  isNonModal?: boolean;
  /** Disables closing on Escape. An alternative keyboard dismissal must be provided when true. */
  isKeyboardDismissDisabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface PopoverTriggerProps extends PopoverCommonProps {
  /**
   * A single trigger element (icon button, button, etc.) that forwards its
   * ref and spreads extra DOM props — every component in this library
   * qualifies. Wrapped internally in `Pressable`, exactly as `Menu`'s
   * `trigger` prop is (see Menu.tsx): `DialogTrigger` needs the full press
   * + aria-expanded/aria-haspopup contract that `Pressable` supplies, which
   * a plain hover/focus wrapper (`Focusable`, `Tooltip`'s choice) doesn't.
   */
  trigger: ReactElement;
  triggerRef?: undefined;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

interface PopoverAnchorProps extends PopoverCommonProps {
  trigger?: undefined;
  /**
   * Positions the popover against an element other than its own open/close
   * control — e.g. a toolbar button opens the popover, but it should point
   * at a table row instead of the button. Required (with `isOpen`) when
   * `trigger` is omitted: without a `DialogTrigger` in the tree there's
   * nothing else to derive an anchor or open state from, so this mode is
   * always controlled.
   */
  triggerRef: RefObject<Element | null>;
  isOpen: boolean;
  defaultOpen?: undefined;
  onOpenChange?: (isOpen: boolean) => void;
}

export type PopoverProps = PopoverTriggerProps | PopoverAnchorProps;

/**
 * Popover — built on `react-aria-components`' `DialogTrigger`/`Popover`,
 * which supplies every accessibility guarantee this component needs:
 * dismiss on Escape and outside interaction, focus trapped while open,
 * focus restored to the trigger on close, renders through a portal (WCAG
 * doc §6). Not present as its own component in the source Figma file —
 * design-inventory.md §5 only documents its chrome as the shared primitive
 * behind Select/ComboBox/Menu's popovers. This component reuses that same
 * chrome (`.wsu-Popover` in `Select/popover-menu.css`) for arbitrary
 * content instead of a list, adding padding and an optional pointer arrow.
 *
 * **Use when:** interactive or richer content anchored to a trigger (a
 * settings panel, an inline form). **Don't use when:** the content is a
 * single line of supplemental text (use `Tooltip`) or a list of actions or
 * options (use `Menu`/`Select`, which already carry this same chrome).
 */
export function Popover(props: PopoverProps) {
  const { children, placement = "bottom", offset, hideArrow = false, isNonModal, isKeyboardDismissDisabled, className, style } = props;

  const popoverClassName = className ? `wsu-Popover wsu-Popover--content ${className}` : "wsu-Popover wsu-Popover--content";

  const overlayProps = props.trigger ? undefined : { triggerRef: props.triggerRef, isOpen: props.isOpen, onOpenChange: props.onOpenChange };

  const popover = (
    <AriaPopover
      {...overlayProps}
      placement={placement}
      offset={offset ?? (hideArrow ? 8 : 12)}
      isNonModal={isNonModal}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={popoverClassName}
      style={style}
    >
      {!hideArrow ? (
        <OverlayArrow className="wsu-Popover__arrow">
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
      ) : null}
      {children}
    </AriaPopover>
  );

  if (props.trigger) {
    return (
      <DialogTrigger isOpen={props.isOpen} defaultOpen={props.defaultOpen} onOpenChange={props.onOpenChange}>
        <Pressable>{props.trigger as unknown as ReactElement<DOMAttributes<HTMLElement>, string>}</Pressable>
        {popover}
      </DialogTrigger>
    );
  }

  return popover;
}
