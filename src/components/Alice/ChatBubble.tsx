import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { AliceIcon } from "./AliceIcon";
import "./ChatBubble.css";

export interface ChatBubbleProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Who sent it. `user` is a right-aligned grey pill; `alice` is the sparkle-prefixed message. */
  from: "user" | "alice";
  children: ReactNode;
  /**
   * User bubbles only — the resume text being quoted, rendered above the
   * message with the message overlapping its lower edge (Figma's
   * `Type=User, State=Quote`). Passing this is what switches the bubble
   * into the quote layout.
   */
  quote?: ReactNode;
}

/**
 * A single message in the Alice conversation — Figma node 464:81
 * (`Chat Bubble`), variants `Type=User/State=Default`,
 * `Type=User/State=Quote` and `Type=Alice/State=Default`.
 *
 * The quote layout's bullet list, clamped to two lines with an ellipsis, is
 * the file's own treatment: the quoted resume line is a preview, not the
 * full text.
 */
export const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(function ChatBubble(
  { from, children, quote, className, ...rest },
  ref,
) {
  const classes = ["wsu-ChatBubble", `wsu-ChatBubble--${from}`, quote ? "wsu-ChatBubble--quote" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  if (from === "alice") {
    return (
      <div ref={ref} className={classes} {...rest}>
        <AliceIcon state="idle" className="wsu-ChatBubble__mark" />
        <div className="wsu-ChatBubble__message">{children}</div>
      </div>
    );
  }

  if (quote) {
    return (
      <div ref={ref} className={classes} {...rest}>
        <blockquote className="wsu-ChatBubble__quote">
          <ul>
            {/* The clamp lives on an inner span: putting `display: -webkit-box`
                on the <li> itself overrides `display: list-item` and silently
                drops the bullet the file shows. */}
            <li>
              <span className="wsu-ChatBubble__quoteText">{quote}</span>
            </li>
          </ul>
        </blockquote>
        <div className="wsu-ChatBubble__pill wsu-ChatBubble__pill--overlap">{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
});
