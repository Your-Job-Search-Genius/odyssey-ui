import { DateField } from "@your-job-search-genius/odyssey-ui";
import { getLocalTimeZone, today } from "@internationalized/date";

export default function DateFieldRequired() {
  return (
    <DateField
      label="Appointment date"
      isRequired
      minValue={today(getLocalTimeZone())}
      style={{ maxWidth: "18rem" }}
    />
  );
}
