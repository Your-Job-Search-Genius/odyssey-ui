import { DatePicker } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function DatePickerDisabled() {
  return (
    <DatePicker
      label="Appointment date"
      defaultValue={parseDate("2026-08-31")}
      isDisabled
      style={{ maxWidth: "18rem" }}
    />
  );
}
