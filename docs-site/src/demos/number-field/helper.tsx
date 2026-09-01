import { NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldHelper() {
  return (
    <NumberField
      label="Cookies to buy"
      defaultValue={25}
      helperText="Enter a whole number."
      style={{ minWidth: "16rem" }}
    />
  );
}
