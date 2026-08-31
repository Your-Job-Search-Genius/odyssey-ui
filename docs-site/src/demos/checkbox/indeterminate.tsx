import { useState } from "react";
import { Checkbox } from "@your-job-search-genius/odyssey-ui";

export default function CheckboxIndeterminate() {
  const [items, setItems] = useState([false, true, false]);
  const allChecked = items.every(Boolean);
  const noneChecked = items.every((v) => !v);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Checkbox
        label="Select all"
        checked={allChecked}
        indeterminate={!allChecked && !noneChecked}
        onChange={(checked) => setItems(items.map(() => checked))}
      />
      <div style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((checked, i) => (
          <Checkbox
            key={i}
            label={`Item ${i + 1}`}
            checked={checked}
            onChange={(next) => setItems(items.map((v, idx) => (idx === i ? next : v)))}
          />
        ))}
      </div>
    </div>
  );
}
