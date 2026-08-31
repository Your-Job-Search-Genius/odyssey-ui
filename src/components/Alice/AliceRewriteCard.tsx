import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { AliceIcon } from "./AliceIcon";
import "./Alice.css";
import { CheckmarkCircle02Icon, MultiplicationSignIcon, ArrowUp01SharpIcon, ArrowDown01SharpIcon } from "@your-job-search-genius/icons";

export interface AliceRewriteCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Header label — "Rewrite" for a single suggestion, "Contributions Rewrite" for a run. */
  title?: ReactNode;
  /**
   * The proposed text. Mark the diff up with `<del>` and `<ins>` — the card
   * styles them red/green, and the markup means the change is announced
   * rather than signalled by color alone.
   */
  children: ReactNode;
  /**
   * Renders the up/down stepper and stacks a preview of the next rewrite
   * behind this one — Figma's `Type=Multiple Rewrite`.
   */
  count?: { current: number; total: number };
  /** Preview text for the stacked card behind. Only shown when `count` is set. */
  nextPreview?: ReactNode;
  /** The file pairs a single rewrite with "Improve" and a run with "Dismiss". */
  secondaryAction?: "improve" | "dismiss";
  onAccept?: () => void;
  onImprove?: () => void;
  onDismiss?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** When given, renders the "Accept all changes" footer beneath the card. */
  onAcceptAll?: () => void;
  acceptAllLabel?: ReactNode;
}

/**
 * A proposed resume rewrite — Figma node 464:99, `Type=Rewrite` and
 * `Type=Multiple Rewrite`. The two are one component here because they
 * share the whole card body and differ only in the header stepper, the
 * stacked preview behind, and which secondary action sits beside Accept.
 */
export const AliceRewriteCard = forwardRef<HTMLElement, AliceRewriteCardProps>(function AliceRewriteCard(
  {
    title = "Rewrite",
    children,
    count,
    nextPreview,
    secondaryAction = "improve",
    onAccept,
    onImprove,
    onDismiss,
    onPrev,
    onNext,
    onAcceptAll,
    acceptAllLabel = "Accept all changes",
    className,
    ...rest
  },
  ref,
) {
  const card = (
    <section
      className={["wsu-AliceCard", onAcceptAll ? "" : className ?? ""].filter(Boolean).join(" ")}
      aria-label={typeof title === "string" ? title : "Rewrite"}
      {...(onAcceptAll ? {} : rest)}
      ref={onAcceptAll ? undefined : ref}
    >
      <div className="wsu-AliceCard__header">
        <p className="wsu-AliceCard__title">{title}</p>
        {count ? (
          <div className="wsu-AliceCard__stepper">
            <button type="button" className="wsu-AliceCard__stepperButton" onClick={onPrev} aria-label="Previous rewrite" disabled={count.current <= 1}>
              <ArrowUp01SharpIcon size="0.5625rem" />
            </button>
            <span className="wsu-AliceCard__stepperCount">
              {count.current}/{count.total}
            </span>
            <button type="button" className="wsu-AliceCard__stepperButton" onClick={onNext} aria-label="Next rewrite" disabled={count.current >= count.total}>
              <ArrowDown01SharpIcon size="0.5625rem" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="wsu-AliceCard__body">
        {count && nextPreview ? (
          <div className="wsu-AliceCard__stack">
            <p className="wsu-AliceCard__rewriteText">{children}</p>
            <p className="wsu-AliceCard__ghostCard" aria-hidden="true">
              {nextPreview}
            </p>
          </div>
        ) : (
          <p className="wsu-AliceCard__rewriteText">{children}</p>
        )}

        <div className="wsu-AliceCard__actions">
          <button type="button" className="wsu-AliceButton" onClick={onAccept}>
            <CheckmarkCircle02Icon size="1rem" className="wsu-AliceButton__accept" />
            Accept
          </button>
          {secondaryAction === "dismiss" ? (
            <button
              type="button"
              className="wsu-AliceCard__ghostAction wsu-AliceCard__ghostAction--dismiss"
              onClick={onDismiss}
            >
              <MultiplicationSignIcon size="1rem" className="wsu-AliceCard__dismissIcon" />
              Dismiss
            </button>
          ) : (
            <button type="button" className="wsu-AliceCard__ghostAction" onClick={onImprove}>
              Improve
            </button>
          )}
        </div>
      </div>
    </section>
  );

  if (!onAcceptAll) return card;

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={["wsu-AliceRewriteGroup", className ?? ""].filter(Boolean).join(" ")}
      {...rest}
    >
      {card}
      <button type="button" className="wsu-AliceAcceptAll" onClick={onAcceptAll}>
        <AliceIcon state="action" size="0.9526rem" />
        {acceptAllLabel}
      </button>
    </div>
  );
});
