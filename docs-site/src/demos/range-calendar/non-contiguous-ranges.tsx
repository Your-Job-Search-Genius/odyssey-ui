import { useState } from "react";
import { RangeCalendar } from "@your-job-search-genius/odyssey-ui";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

export default function RangeCalendarNonContiguousRanges() {
  const now = today(getLocalTimeZone());
  const [range, setRange] = useState({ start: now.add({ days: 6 }), end: now.add({ days: 14 }) });
  const disabledRanges: [DateValue, DateValue][] = [
    [now, now.add({ days: 5 })],
    [now.add({ days: 15 }), now.add({ days: 17 })],
    [now.add({ days: 23 }), now.add({ days: 24 })],
  ];
  const isInvalid = range.end.compare(range.start) > 7;

  return (
    <RangeCalendar
      aria-label="Trip dates"
      value={range}
      onChange={(value) => value && setRange(value as typeof range)}
      allowsNonContiguousRanges
      minValue={now}
      isDateUnavailable={(date, anchorDate) =>
        Boolean(anchorDate && Math.abs(date.compare(anchorDate)) > 7) ||
        disabledRanges.some((interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0)
      }
      isInvalid={isInvalid}
      errorMessage={isInvalid ? "Maximum stay duration is 1 week" : undefined}
    />
  );
}
