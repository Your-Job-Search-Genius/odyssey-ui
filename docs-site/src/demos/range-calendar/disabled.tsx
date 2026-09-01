import { RangeCalendar } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function RangeCalendarDisabled() {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      isDisabled
      defaultValue={{ start: parseDate("2026-08-15"), end: parseDate("2026-08-22") }}
    />
  );
}
