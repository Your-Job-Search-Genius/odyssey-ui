import { NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldPercent() {
  return (
    <NumberField
      label="Sales tax"
      defaultValue={0.05}
      formatOptions={{ style: "percent" }}
      style={{ minWidth: "16rem" }}
    />
  );
}
