import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { AliceIcon } from "./AliceIcon";
import "./Alice.css";

export interface AliceSuggestionProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
}

/**
 * An inline coaching note from Alice — Figma node 469:1138,
 * `Type=Suggested Improvement`. The oversized sparkle bleeding off the
 * top-left corner is decorative at 10% opacity and is hidden from
 * assistive tech; the tint alone never carries meaning, the text does.
 */
export const AliceSuggestion = forwardRef<HTMLDivElement, AliceSuggestionProps>(function AliceSuggestion(
  { children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={["wsu-AliceSuggestion", className ?? ""].filter(Boolean).join(" ")} {...rest}>
      <AliceIcon state="action" size="3.625rem" className="wsu-AliceSuggestion__watermark" />
      <p className="wsu-AliceSuggestion__text">{children}</p>
    </div>
  );
});
