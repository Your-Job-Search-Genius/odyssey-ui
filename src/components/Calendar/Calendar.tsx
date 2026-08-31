import {
  Calendar as AriaCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell,
  CalendarHeading,
  Button as AriaButton,
  Text,
} from "react-aria-components";
import type { CalendarProps as AriaCalendarProps, DateValue } from "react-aria-components";
import { ArrowLeft01SharpIcon, ArrowRight01SharpIcon } from "@your-job-search-genius/icons";
import "./Calendar.css";

export interface CalendarProps<T extends DateValue> extends Omit<AriaCalendarProps<T>, "aria-label" | "className" | "style"> {
  /** Accessible name for the calendar (WCAG 4.1.2 — the grid needs a name distinguishing it from any other date grid on the page). */
  "aria-label": string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Calendar — built on `react-aria-components`' `Calendar`/`CalendarGrid`:
 * a date grid's keyboard model (arrow keys move by day, Page Up/Down page
 * by month, Home/End jump to the start/end of the row) is the WAI-ARIA APG
 * "grid" pattern, which the behavior layer already implements correctly —
 * hand-rolling it risks getting that keyboard map wrong (WCAG doc §6).
 * Not present in the source Figma file (design-inventory.md §2.14) —
 * spacing/radius/color/focus-ring reuse this system's existing tokens
 * rather than inventing a new visual language.
 */
export function Calendar<T extends DateValue>({
  errorMessage,
  className,
  style,
  isInvalid,
  ...props
}: CalendarProps<T>) {
  const months = props.visibleDuration?.months ?? 1;
  const invalid = isInvalid ?? Boolean(errorMessage);

  return (
    <AriaCalendar
      {...props}
      isInvalid={invalid}
      className={className ? `wsu-Calendar ${className}` : "wsu-Calendar"}
      style={style}
    >
      <div className="wsu-Calendar__months">
        {Array.from({ length: months }, (_, i) => (
          <div key={i} className="wsu-Calendar__month">
            {/* A plain div, not a <header>: this repeats once per visible month and
                isn't page-level banner content, so a semantic <header> here trips
                axe's landmark-banner-is-top-level rule (a banner nested inside the
                calendar's own application landmark). */}
            <div className="wsu-Calendar__header">
              {i === 0 ? (
                <AriaButton slot="previous" className="wsu-Calendar__nav">
                  <ArrowLeft01SharpIcon size="1rem" />
                </AriaButton>
              ) : (
                <span className="wsu-Calendar__navPlaceholder" aria-hidden="true" />
              )}
              <CalendarHeading offset={{ months: i }} className="wsu-Calendar__heading" />
              {i === months - 1 ? (
                <AriaButton slot="next" className="wsu-Calendar__nav">
                  <ArrowRight01SharpIcon size="1rem" />
                </AriaButton>
              ) : (
                <span className="wsu-Calendar__navPlaceholder" aria-hidden="true" />
              )}
            </div>
            <CalendarGrid offset={{ months: i }} className="wsu-CalendarGrid">
              <CalendarGridHeader>{(day) => <CalendarHeaderCell className="wsu-CalendarHeaderCell">{day}</CalendarHeaderCell>}</CalendarGridHeader>
              <CalendarGridBody>{(date) => <CalendarCell date={date} className="wsu-CalendarCell" />}</CalendarGridBody>
            </CalendarGrid>
          </div>
        ))}
      </div>
      {errorMessage ? (
        <Text slot="errorMessage" className="wsu-Calendar__message wsu-Calendar__message--error">
          {errorMessage}
        </Text>
      ) : null}
    </AriaCalendar>
  );
}
