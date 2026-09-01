import { useState } from "react";
import { ToggleButton } from "@your-job-search-genius/odyssey-ui";

export default function ToggleButtonControlledSelection() {
  const [selected, setSelected] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <ToggleButton selected={selected} onChange={setSelected}>
        Bold
      </ToggleButton>
      <p style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)", margin: 0 }}>
        {selected ? "On" : "Off"}
      </p>
    </div>
  );
}
