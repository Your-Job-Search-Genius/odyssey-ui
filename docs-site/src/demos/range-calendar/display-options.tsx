import { RangeCalendar } from "@your-job-search-genius/odyssey-ui";

export default function RangeCalendarDisplayOptions() {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      visibleDuration={{ months: 2 }}
      pageBehavior="single"
      firstDayOfWeek="mon"
    />
  );
}
