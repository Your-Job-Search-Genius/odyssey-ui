import { DateField } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function DateFieldError() {
  return (
    <DateField
      label="Appointment date"
      defaultValue={parseDate("2026-08-31")}
      isInvalid
      errorMessage="That date isn't available."
      style={{ maxWidth: "18rem" }}
    />
  );
}
