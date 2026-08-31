import { Calendar } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function CalendarBasic() {
  return (
    <Calendar aria-label="Appointment date" defaultValue={parseDate("2026-08-31")} />
  );
}
