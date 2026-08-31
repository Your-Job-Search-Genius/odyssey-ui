import { RangeCalendar } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function RangeCalendarBasic() {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      defaultValue={{
        start: parseDate("2026-08-15"),
        end: parseDate("2026-08-22"),
      }}
    />
  );
}
