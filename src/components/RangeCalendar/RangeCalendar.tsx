import {
  RangeCalendar as AriaRangeCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell as AriaCalendarCell,
  CalendarHeading,
  Button as AriaButton,
  Text,
} from "react-aria-components";
import type { RangeCalendarProps as AriaRangeCalendarProps, CalendarCellProps, DateValue } from "react-aria-components";
import { ArrowLeft01SharpIcon, ArrowRight01SharpIcon } from "@your-job-search-genius/icons";
import "./RangeCalendar.css";

/**
 * Styled day cell, exported (alongside the re-exported `CalendarGrid`) so a
 * consumer can build a custom grid composition — e.g. slotting in
 * `CalendarMonthPicker`/`CalendarYearPicker` — around the raw
 * `react-aria-components` `RangeCalendar` while still getting this system's
 * cell visuals, the same way the internal grid below is built.
 */
export function CalendarCell(props: CalendarCellProps) {
  return <AriaCalendarCell {...props} className="wsu-CalendarCell wsu-RangeCalendarCell" />;
}

export { CalendarGrid };

export interface RangeCalendarProps<T extends DateValue> extends Omit<AriaRangeCalendarProps<T>, "aria-label" | "className" | "style"> {
  /** Accessible name for the calendar (WCAG 4.1.2 — the grid needs a name distinguishing it from any other date grid on the page). */
  "aria-label": string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RangeCalendar — built on `react-aria-components`' `RangeCalendar`/`CalendarGrid`:
 * the WAI-ARIA APG "grid" keyboard model plus range-anchoring (click/Enter a
 * start date, arrow keys extend a live preview, click/Enter again commits the
 * end date; Escape/Shift+arrow behavior all follow the spec) is handled
 * entirely by the behavior layer (WCAG doc §6). Not present in the source
 * Figma file (design-inventory.md §2.14) — reuses `Calendar`'s grid/cell/nav
 * classes and tokens; the only new visual language is the flat, square-edged
 * bar connecting the days between the start/end pills, since adjacent day
 * cells sit flush against each other in the fixed-width grid (no gap to
 * bridge). **Use when:** picking a start/end range inline. **Don't use
 * when:** only a single date is needed (use `Calendar`).
 */
export function RangeCalendar<T extends DateValue>({
  errorMessage,
  className,
  style,
  isInvalid,
  ...props
}: RangeCalendarProps<T>) {
  const months = props.visibleDuration?.months ?? 1;
  const invalid = isInvalid ?? Boolean(errorMessage);

  return (
    <AriaRangeCalendar
      {...props}
      isInvalid={invalid}
      className={className ? `wsu-Calendar wsu-RangeCalendar ${className}` : "wsu-Calendar wsu-RangeCalendar"}
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
              <CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
            </CalendarGrid>
          </div>
        ))}
      </div>
      {errorMessage ? (
        <Text slot="errorMessage" className="wsu-Calendar__message wsu-Calendar__message--error">
          {errorMessage}
        </Text>
      ) : null}
    </AriaRangeCalendar>
  );
}
