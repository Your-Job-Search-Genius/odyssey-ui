import { useState } from "react";
import { RangeCalendar } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function RangeCalendarControlled() {
  const [value, setValue] = useState({
    start: parseDate("2026-08-15"),
    end: parseDate("2026-08-22"),
  });

  return (
    <RangeCalendar
      aria-label="Trip dates"
      value={value}
      onChange={(range) => range && setValue(range as typeof value)}
    />
  );
}
