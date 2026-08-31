import { forwardRef } from "react";
import type { ReactNode, Ref } from "react";
import { ChevronDownGlyph } from "../Icon/glyphs";
import "./Card.css";

/**
 * The Cards page's own vocabulary (Figma node 433:7931) — deliberately not
 * Badge's grading scale. Those two scales are unrelated: the Cards page
 * never uses Excellent/Good/Fair/Poor/Bad/Fail, and an earlier pass had
 * mapped this component onto them by mistake.
 */
export type CardSeverity = "urgent" | "critical" | "optional" | "general" | "neutral";

export interface CardProps {
  /** Tints the card and, when collapsible, is announced via visible text on expand/collapse — never color alone (WCAG 1.4.1). Defaults to `neutral` (no tint). */
  severity?: CardSeverity;
  title: ReactNode;
  /** Leading icon next to the title — decorative, hidden from assistive tech (the severity is separately conveyed by the visible `severityLabel`, if given). */
  icon?: ReactNode;
  /** Visible text naming the severity (e.g. "Urgent") — required whenever `severity` isn't `neutral`, so color is never the only cue. */
  severityLabel?: ReactNode;
  children?: ReactNode;
  /** Collapsible (default) renders a native `<details>`/`<summary>` disclosure — full keyboard/AT support for free, no ARIA needed. */
  collapsible?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Card — the "Issues" family from Figma's Cards page (node 433:7931): a
 * severity-tinted, expandable summary row. Plain semantic HTML
 * (`<details>`/`<summary>`), no behavior library needed — the native
 * element already handles keyboard toggling, the accessible
 * expanded/collapsed state, and focus correctly.
 *
 * Tints come from the Cards page's own scale, not Badge's. An earlier pass
 * consolidated this onto the shared grading tokens on the theory that the
 * page's values were "slightly different" duplicates; they aren't — the
 * page has a different vocabulary entirely (Urgent/Critical/Optional/
 * General/Neutral) and different values (#FFF0F0/#FFF1E6/#E6F0FF).
 *
 * The file's "General" carries the same #FFF0F0 as "Urgent"; each keeps
 * its own token here so they can diverge later, and the duplication is
 * recorded in semantic.ts rather than smoothed over. "Neutral" is not a
 * tint at all in the file — it is a white card with a hairline border and
 * a slightly larger radius.
 *
 * The Review and Inline Review sub-families on the same page are
 * downstream compositions of this primitive and are not implemented yet.
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    severity = "neutral",
    title,
    icon,
    severityLabel,
    children,
    collapsible = true,
    expanded,
    defaultExpanded = false,
    onExpandedChange,
    className,
    style,
  },
  ref,
) {
  const classes = ["wsu-Card", `wsu-Card--${severity}`, className ?? ""].filter(Boolean).join(" ");

  const header = (
    <>
      {icon ? (
        <span className="wsu-Card__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="wsu-Card__title">{title}</span>
      {severityLabel ? <span className="wsu-Card__severityLabel">{severityLabel}</span> : null}
    </>
  );

  if (!collapsible) {
    return (
      <div ref={ref as Ref<HTMLDivElement>} className={classes} style={style}>
        <div className="wsu-Card__summary wsu-Card__summary--static">{header}</div>
        {children ? <div className="wsu-Card__body">{children}</div> : null}
      </div>
    );
  }

  // React has no special-cased `defaultOpen` for <details> (unlike
  // defaultChecked/defaultValue — confirmed by a React DOM warning when
  // this used that name). Passing the plain `open` attribute still gives
  // correct uncontrolled behavior: as long as `defaultExpanded` doesn't
  // change across re-renders, React only touches the DOM when the *prop
  // value* changes from the previous render, so a user's native toggle
  // (which mutates the DOM directly) is never fought.
  const toggleProps = expanded === undefined ? { open: defaultExpanded } : { open: expanded };

  return (
    <details
      ref={ref as Ref<HTMLDetailsElement>}
      className={classes}
      style={style}
      {...toggleProps}
      onToggle={(e) => onExpandedChange?.((e.target as HTMLDetailsElement).open)}
    >
      <summary className="wsu-Card__summary">
        {header}
        <ChevronDownGlyph size="sm" className="wsu-Card__chevron" />
      </summary>
      <div className="wsu-Card__body">{children}</div>
    </details>
  );
});
