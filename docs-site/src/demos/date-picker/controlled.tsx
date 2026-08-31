import { useState } from "react";
import { DatePicker } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";
import type { CalendarDate } from "@internationalized/date";

export default function DatePickerControlled() {
  const [date, setDate] = useState<CalendarDate | null>(parseDate("2026-09-15"));

  return (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "18rem" }}>
      <DatePicker label="Follow-up date" value={date} onChange={setDate} />
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        Selected: {date ? date.toString() : "none"}
      </p>
    </div>
  );
}
