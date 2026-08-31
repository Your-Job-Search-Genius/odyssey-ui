import { useState } from "react";
import { DateRangePicker } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";
import type { CalendarDate } from "@internationalized/date";

export default function DateRangePickerControlled() {
  const [value, setValue] = useState<{ start: CalendarDate; end: CalendarDate }>({
    start: parseDate("2026-08-15"),
    end: parseDate("2026-08-22"),
  });
  return (
    <DateRangePicker
      label="Trip dates"
      value={value}
      onChange={(range) => range && setValue(range as typeof value)}
      style={{ maxWidth: "22rem" }}
    />
  );
}
