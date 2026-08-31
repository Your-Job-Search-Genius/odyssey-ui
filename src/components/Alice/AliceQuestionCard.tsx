import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { useControllableState } from "../../utils/useControllableState";
import { AliceIcon } from "./AliceIcon";
import { CountRing, ChevronGlyph } from "./internals";
import "./Alice.css";

export interface AliceQuestionCardProps extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "title"> {
  /** The prompt Alice is asking. */
  question: ReactNode;
  /** 1-based position in the run of questions. */
  current: number;
  total: number;
  /**
   * Collapses the card to its header with an "Answered" affordance —
   * Figma's `Type=Questions Answered`.
   */
  answered?: boolean;
  /** Answer text. Controlled when provided, uncontrolled via `defaultValue` otherwise. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  onPrev?: () => void;
  onNext?: () => void;
  onDone?: () => void;
  /** Fired by the answered card's disclosure control. */
  onToggle?: () => void;
  title?: ReactNode;
}

/**
 * Alice's resume question card — Figma node 464:99, `Type=Questions` and
 * `Type=Questions Answered`.
 *
 * The Done button follows the file in being visually muted until there's an
 * answer, and is genuinely `disabled` at that point rather than only looking
 * it, so keyboard and screen-reader users get the same affordance.
 */
export const AliceQuestionCard = forwardRef<HTMLElement, AliceQuestionCardProps>(function AliceQuestionCard(
  {
    question,
    current,
    total,
    answered = false,
    value,
    defaultValue = "",
    onValueChange,
    placeholder = "Type answer here",
    onPrev,
    onNext,
    onDone,
    onToggle,
    title = "Question",
    className,
    ...rest
  },
  ref,
) {
  const [answer, setAnswer] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const answerId = useId();
  const promptId = useId();

  const classes = ["wsu-AliceCard", answered ? "wsu-AliceCard--answered" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={ref} className={classes} aria-label={typeof title === "string" ? title : "Question"} {...rest}>
      <div className="wsu-AliceCard__header">
        <div className="wsu-AliceCard__titleGroup">
          <p className="wsu-AliceCard__title">{title}</p>
          <span className="wsu-AliceCount">
            <span className="wsu-AliceCount__ring">
              <CountRing current={answered ? total : current} total={total} />
              <span className="wsu-AliceCount__value">{answered ? total : current}</span>
            </span>
            {answered ? null : <span className="wsu-AliceCount__total">/{total}</span>}
          </span>
        </div>

        {answered ? (
          <button type="button" className="wsu-AliceCard__state" onClick={onToggle}>
            Answered
            <ChevronGlyph />
          </button>
        ) : (
          <div className="wsu-AliceCard__nav">
            <button type="button" className="wsu-AliceCard__navButton" onClick={onPrev} disabled={current <= 1}>
              Prev
            </button>
            <button type="button" className="wsu-AliceCard__navButton" onClick={onNext} disabled={current >= total}>
              Next
            </button>
          </div>
        )}
      </div>

      {answered ? null : (
        <div className="wsu-AliceCard__body">
          <div className="wsu-AliceCard__fields">
            <p className="wsu-AliceCard__prompt" id={promptId}>
              {question}
            </p>
            <textarea
              id={answerId}
              className="wsu-AliceCard__answer"
              placeholder={placeholder}
              aria-labelledby={promptId}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </div>
          <div
            className={`wsu-AliceCard__footer${answer.trim() ? "" : " wsu-AliceCard__footer--disabled"}`}
          >
            <button type="button" className="wsu-AliceButton" onClick={onDone} disabled={!answer.trim()}>
              <AliceIcon state="action" size="0.9526rem" />
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
});
