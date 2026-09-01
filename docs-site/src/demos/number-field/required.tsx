import { NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldRequired() {
  return (
    <NumberField
      label="Cookies to buy"
      defaultValue={25}
      required
      style={{ minWidth: "16rem" }}
    />
  );
}
