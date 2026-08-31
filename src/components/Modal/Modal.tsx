import { useRef } from "react";
import type { ReactNode } from "react";
import {
  ModalOverlay as AriaModalOverlay,
  Modal as AriaModal,
  Dialog as AriaDialog,
  Heading,
} from "react-aria-components";
import { Button } from "../Button";
import { CloseGlyph } from "../Icon/glyphs";
import "./Modal.css";

export type ModalSize = "sm" | "md" | "lg";

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
  size?: ModalSize;
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
export function Modal({ isOpen, onOpenChange, title, description, children, footer, size = "md", isDismissable = true }: ModalProps) {
  const lastOpenContent = useRef({ title, description, children, footer, size });
  if (isOpen) {
    lastOpenContent.current = { title, description, children, footer, size };
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
          {({ close }) => (
            <>
              <div className="wsu-Modal__header">
                <div className="wsu-Modal__headerText">
                  <Heading slot="title" className="wsu-Modal__title">
                    {content.title}
                  </Heading>
                  {content.description ? <p className="wsu-Modal__description">{content.description}</p> : null}
                </div>
                <Button
                  variant="text"
                  size="sm"
                  leadingIcon={<CloseGlyph />}
                  aria-label="Close"
                  onClick={close}
                  className="wsu-Modal__close"
                />
              </div>
              <div className="wsu-Modal__body">{content.children}</div>
              {content.footer ? <div className="wsu-Modal__footer">{content.footer}</div> : null}
            </>
          )}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}
