import { Calendar } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function CalendarDisabled() {
  return (
    <Calendar aria-label="Appointment date" defaultValue={parseDate("2026-08-31")} isDisabled />
  );
}
