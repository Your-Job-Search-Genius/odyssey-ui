import { RangeCalendar } from "@your-job-search-genius/odyssey-ui";
import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

export default function RangeCalendarValidation() {
  const now = today(getLocalTimeZone());

  return (
    <RangeCalendar
      aria-label="Trip dates"
      minValue={now}
      maxValue={now.add({ months: 2 })}
      isDateUnavailable={(date: DateValue) => isWeekend(date, "en-US")}
      errorMessage="Weekends and dates outside the next two months aren't available."
    />
  );
}
