import { RangeCalendar } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "react-aria-components";

export default function RangeCalendarInternationalCalendar() {
  return (
    <I18nProvider locale="en-US-u-ca-hebrew">
      <RangeCalendar
        aria-label="Trip dates"
        defaultValue={{ start: parseDate("2025-02-03"), end: parseDate("2025-02-12") }}
      />
    </I18nProvider>
  );
}
