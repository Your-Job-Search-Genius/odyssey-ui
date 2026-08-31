import { useRef } from "react";
import type { ReactNode } from "react";
import {
  ModalOverlay as AriaModalOverlay,
  Modal as AriaModal,
  Dialog as AriaDialog,
  Heading,
} from "react-aria-components";
import { MultiplicationSignSquareSolidIcon } from "@your-job-search-genius/icons";
import "./Modal.css";

export type ModalSize = "sm" | "md" | "lg";

/** The file's three Modal Header title styles (node 433:9554). */
export type ModalTitleSize = "sm" | "md" | "lg";

/**
 * The file's Modal Footer arrangements (node 433:9582). "Stacked Inverted"
 * is not a fourth layout — it is `stacked` with the buttons in the other
 * order, so it is expressed by the order the children are passed rather
 * than by a `column-reverse` that would put the visual order out of step
 * with the DOM order (WCAG 1.3.2).
 */
export type ModalFooterLayout = "single" | "horizontal" | "stacked";

export interface ModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** Rendered as the dialog's accessible name (via a `Heading slot="title"`) and visually in the header. */
  title: ReactNode;
  /** Optional supporting text under the title. */
  description?: ReactNode;
  children: ReactNode;
  /** Rendered in the footer row — typically one or more Buttons. */
  footer?: ReactNode;
  /** How the footer arranges its children. Defaults to the file's "Horizontal". */
  footerLayout?: ModalFooterLayout;
  size?: ModalSize;
  /**
   * A 20px glyph before the title — the file's "With Icon" and
   * "With Description" headers.
   */
  icon?: ReactNode;
  /** Content after the title — the file's "With Badge" header puts a `Badge` here. */
  badge?: ReactNode;
  /**
   * Trailing header content before the close button — the file's "With Tabs"
   * header puts a grouped `Tabs` here.
   */
  headerAction?: ReactNode;
  /**
   * `md` (default) is Body/Base-Medium, the file's usual header. `lg` is
   * Heading/Large, its centered "Variant5". `sm` is Body/Small-Semibold,
   * its "With Tabs" header.
   */
  titleSize?: ModalTitleSize;
  /** Centers the header, as the file's "Variant5" does. */
  align?: "start" | "center";
  /**
   * Defaults to true. The file's "Variant5" and "With Tabs" headers have no
   * close control; `isDismissable` still leaves Escape and outside-click
   * available, so hiding it never traps the user (WCAG 2.1.2).
   */
  showCloseButton?: boolean;
  /**
   * Wraps the header, body and footer in one element — for a control that
   * spans them, such as the file's "With Tabs" header, whose `TabList` sits
   * beside the title while its panels are the body. Those two have to be
   * one `Tabs` subtree, and `Tabs` cannot go *around* this component:
   * react-aria renders a collection's children a second time to build the
   * collection, and the dialog's portal escapes that pass, so the whole
   * dialog mounts twice (verified — two elements with `role="dialog"`).
   * Wrapping from in here puts the provider inside the portal instead.
   */
  contentWrapper?: (content: ReactNode) => ReactNode;
  /** Escape and outside-click close the modal. Defaults to true; set false for a flow that must be explicitly confirmed or canceled. */
  isDismissable?: boolean;
}

/**
 * Modal — built on `react-aria-components`' `ModalOverlay`/`Modal`/`Dialog`,
 * which is what actually supplies every accessibility guarantee this
 * component needs: focus trapped inside while open, focus restored to the
 * trigger on close, closes on Escape, locks body scroll, and renders
 * through a portal (WCAG doc §6 — this is exactly the kind of overlay
 * React Aria exists for). The scrim is sourced: Figma node 433:9608 puts
 * modals on `rgba(78,78,78,0.76)` with an 8px backdrop blur (an earlier
 * pass had recorded that the file defined no backdrop, which was wrong).
 * Only the z-index (`--wsu-z-overlay`/`-modal`) and the modal's own drop
 * shadow remain this library's choice — the file gives its modals none.
 *
 * `Modal.css` gives the dialog a fade/scale-out `[data-exiting]` animation,
 * so react-aria-components keeps it mounted for that transition's duration
 * after `isOpen` goes false. A consumer that clears the data backing
 * `title`/`children`/`footer` in the same handler that closes the modal —
 * a very natural thing to do — would otherwise see that blank/cleared
 * content flash for the remainder of the exit transition. To prevent that,
 * the last props seen while `isOpen` was true are cached and kept on
 * screen for as long as the dialog stays mounted while closing.
 */
export function Modal({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  footerLayout = "horizontal",
  size = "md",
  isDismissable = true,
  icon,
  badge,
  headerAction,
  titleSize = "md",
  align = "start",
  showCloseButton = true,
  contentWrapper,
}: ModalProps) {
  const lastOpenContent = useRef({
    title,
    description,
    children,
    footer,
    size,
    icon,
    badge,
    headerAction,
  });
  if (isOpen) {
    lastOpenContent.current = {
      title,
      description,
      children,
      footer,
      size,
      icon,
      badge,
      headerAction,
    };
  }
  const content = lastOpenContent.current;

  return (
    <AriaModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      className="wsu-Modal__overlay"
    >
      <AriaModal className={`wsu-Modal wsu-Modal--${content.size}`}>
        <AriaDialog className="wsu-Modal__dialog">
          {({ close }) => {
            const dialogContent = (
              <>
                <div
                  className="wsu-Modal__header"
                  data-align={align}
                  data-has-description={content.description ? "" : undefined}
                >
                  <div className="wsu-Modal__headerText">
                    <div className="wsu-Modal__headerRow">
                      {content.icon ? (
                        <span className="wsu-Modal__icon" aria-hidden="true">
                          {content.icon}
                        </span>
                      ) : null}
                      <Heading
                        slot="title"
                        className="wsu-Modal__title"
                        data-size={titleSize}
                      >
                        {content.title}
                      </Heading>
                      {content.badge}
                    </div>
                    {content.description ? (
                      <p className="wsu-Modal__description">
                        {content.description}
                      </p>
                    ) : null}
                  </div>
                  {content.headerAction}
                  {showCloseButton ? (
                    <button
                      type="button"
                      className="wsu-Modal__close"
                      aria-label="Close"
                      onClick={close}
                    >
                      <MultiplicationSignSquareSolidIcon size="1.25rem" />
                    </button>
                  ) : null}
                </div>
                <div className="wsu-Modal__body">{content.children}</div>
                {content.footer ? (
                  <div className="wsu-Modal__footer" data-layout={footerLayout}>
                    {content.footer}
                  </div>
                ) : null}
              </>
            );
            return contentWrapper
              ? contentWrapper(dialogContent)
              : dialogContent;
          }}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}
