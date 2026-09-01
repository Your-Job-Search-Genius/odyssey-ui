import {
  Button as AriaButton,
  CalendarCell as AriaCalendarCell,
  CalendarGrid,
  CalendarMonthPicker,
  CalendarYearPicker,
  RangeCalendar as AriaRangeCalendar,
} from "react-aria-components";
import type { CalendarCellProps } from "react-aria-components";
import { ArrowLeft01SharpIcon, ArrowRight01SharpIcon } from "@your-job-search-genius/icons";

/**
 * The published package only exports the plain `RangeCalendar` wrapper, not
 * its internal styled `CalendarCell` — so this recreates that one-line
 * wrapper (react-aria-components' `CalendarCell` plus the design system's
 * CSS classes) to keep this custom composition visually consistent.
 */
function CalendarCell(props: CalendarCellProps) {
  return <AriaCalendarCell {...props} className="wsu-CalendarCell wsu-RangeCalendarCell" />;
}

export default function RangeCalendarMonthYearPickers() {
  return (
    <AriaRangeCalendar aria-label="Trip dates" className="wsu-Calendar wsu-RangeCalendar">
      <div className="wsu-Calendar__months">
        <div className="wsu-Calendar__month">
          <div className="wsu-Calendar__header">
            <AriaButton slot="previous" className="wsu-Calendar__nav">
              <ArrowLeft01SharpIcon size="1rem" />
            </AriaButton>
            <CalendarMonthPicker>
              {({ "aria-label": ariaLabel, value, onChange, items }) => (
                <select
                  aria-label={ariaLabel}
                  className="wsu-Calendar__heading"
                  value={String(value)}
                  onChange={(event) => onChange(Number(event.target.value))}
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.formatted}
                    </option>
                  ))}
                </select>
              )}
            </CalendarMonthPicker>
            <CalendarYearPicker>
              {({ "aria-label": ariaLabel, value, onChange, items }) => (
                <select
                  aria-label={ariaLabel}
                  className="wsu-Calendar__heading"
                  value={String(value)}
                  onChange={(event) => onChange(Number(event.target.value))}
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.formatted}
                    </option>
                  ))}
                </select>
              )}
            </CalendarYearPicker>
            <AriaButton slot="next" className="wsu-Calendar__nav">
              <ArrowRight01SharpIcon size="1rem" />
            </AriaButton>
          </div>
          <CalendarGrid className="wsu-CalendarGrid">{(date) => <CalendarCell date={date} />}</CalendarGrid>
        </div>
      </div>
    </AriaRangeCalendar>
  );
}
