import { DateRangePicker } from "@your-job-search-genius/odyssey-ui";

export default function DateRangePickerBasic() {
  return (
    <DateRangePicker
      label="Trip dates"
      helperText="Minimum 3-night stay."
      style={{ maxWidth: "22rem" }}
    />
  );
}
