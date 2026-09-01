import { useState } from "react";
import { Button, RangeCalendar } from "@your-job-search-genius/odyssey-ui";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

export default function RangeCalendarControlledFocusedDate() {
  const defaultDate = new CalendarDate(2025, 7, 1);
  const [focusedDate, setFocusedDate] = useState<DateValue>(defaultDate);

  return (
    <div>
      <Button
        variant="secondary"
        size="sm"
        style={{ marginBottom: "1.25rem" }}
        onClick={() => setFocusedDate(today(getLocalTimeZone()))}
      >
        Today
      </Button>
      <RangeCalendar aria-label="Trip dates" focusedValue={focusedDate} onFocusChange={setFocusedDate} />
    </div>
  );
}
