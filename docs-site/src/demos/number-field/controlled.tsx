import { useState } from "react";
import { NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldControlled() {
  const [value, setValue] = useState(25);
  return (
    <div style={{ display: "grid", gap: "0.75rem", minWidth: "16rem" }}>
      <NumberField label="Cookies to buy" value={value} onChange={setValue} />
      <p style={{ margin: 0, fontSize: "0.875rem" }}>Current value: {value}</p>
    </div>
  );
}
