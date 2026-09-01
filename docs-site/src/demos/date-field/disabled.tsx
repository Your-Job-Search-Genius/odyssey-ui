import { DateField } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function DateFieldDisabled() {
  return (
    <DateField
      label="Appointment date"
      defaultValue={parseDate("2026-08-31")}
      isDisabled
      style={{ maxWidth: "18rem" }}
    />
  );
}
