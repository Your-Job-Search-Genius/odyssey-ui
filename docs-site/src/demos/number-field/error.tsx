import { NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldError() {
  return (
    <NumberField
      label="Cookies to buy"
      errorMessage="Enter a value between 1 and 100."
      style={{ minWidth: "16rem" }}
    />
  );
}
