import { useState } from "react";
import { ComboBox } from "@your-job-search-genius/odyssey-ui";
import type { Key } from "react-aria-components";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio" },
  { id: "transcript", label: "Transcript" },
];

export default function ComboBoxControlled() {
  const [key, setKey] = useState<Key | null>("resume");
  return (
    <div style={{ display: "grid", gap: "0.75rem", minWidth: "16rem" }}>
      <ComboBox
        label="Document type"
        items={items}
        selectedKey={key}
        onSelectionChange={setKey}
      />
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        Selected key: {key == null ? "none" : String(key)}
      </p>
    </div>
  );
}
