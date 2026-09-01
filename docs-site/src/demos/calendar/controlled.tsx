import { useState } from "react";
import { Calendar } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";
import type { CalendarDate } from "@internationalized/date";

export default function CalendarControlled() {
  const [date, setDate] = useState<CalendarDate>(parseDate("2026-08-31"));

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Calendar aria-label="Appointment date" value={date} onChange={setDate} />
      <p style={{ margin: 0, font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)" }}>
        Selected: {date.toString()}
      </p>
    </div>
  );
}
