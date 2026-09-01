import { Calendar } from "@your-job-search-genius/odyssey-ui";

export default function CalendarMultiMonth() {
  return <Calendar aria-label="Appointment date" visibleDuration={{ months: 2 }} />;
}
