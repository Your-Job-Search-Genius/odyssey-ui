import { DateField } from "@your-job-search-genius/odyssey-ui";
import { parseZonedDateTime } from "@internationalized/date";

export default function DateFieldWithTime() {
  return (
    <DateField
      label="Appointment date"
      defaultValue={parseZonedDateTime("2026-08-31T08:45:00[America/Los_Angeles]")}
      style={{ maxWidth: "22rem" }}
    />
  );
}
