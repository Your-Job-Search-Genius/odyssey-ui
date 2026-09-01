import { NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldDisabled() {
  return (
    <NumberField
      label="Cookies to buy"
      defaultValue={25}
      disabled
      style={{ minWidth: "16rem" }}
    />
  );
}
