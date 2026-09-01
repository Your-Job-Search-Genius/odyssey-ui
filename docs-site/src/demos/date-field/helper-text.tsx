import { DateField } from "@your-job-search-genius/odyssey-ui";

export default function DateFieldHelperText() {
  return (
    <DateField
      label="Appointment date"
      helperText="Use MM/DD/YYYY format."
      style={{ maxWidth: "18rem" }}
    />
  );
}
