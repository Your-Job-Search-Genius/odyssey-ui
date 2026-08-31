import { DateField } from "@your-job-search-genius/odyssey-ui";
import { parseDate } from "@internationalized/date";

export default function DateFieldBasic() {
  return (
    <DateField
      label="Appointment date"
      defaultValue={parseDate("2026-08-31")}
      helperText="Use the arrow keys to move between segments."
      style={{ maxWidth: "18rem" }}
    />
  );
}
