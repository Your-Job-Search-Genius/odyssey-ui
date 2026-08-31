import { DatePicker } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function DatePickerBasic() {
  return (
    <DatePicker
      label="Interview date"
      defaultValue={parseDate("2026-09-15")}
      helperText="Business hours only."
      style={{ maxWidth: "18rem" }}
    />
  );
}
