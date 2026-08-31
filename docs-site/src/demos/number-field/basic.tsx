import { NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldBasic() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "16rem" }}>
      <NumberField label="Cookies to buy" defaultValue={25} />
      <NumberField
        label="Price"
        defaultValue={45}
        formatOptions={{ style: "currency", currency: "USD" }}
      />
      <NumberField
        label="Volume"
        defaultValue={8}
        minValue={2}
        maxValue={20}
        step={3}
      />
    </div>
  );
}
