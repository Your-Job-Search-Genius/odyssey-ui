import { useState } from "react";
import { Button, Menu } from "@your-job-search-genius/odyssey-ui";
import type { Selection } from "react-aria-components";

/**
 * Select is single-value only. For a checkable multi-select dropdown
 * (Figma's "Select Menu"), use Menu with selectionMode="multiple".
 */
export default function SelectMultiSelectMenu() {
  const [selected, setSelected] = useState<Selection>(
    new Set(["react", "typescript"]),
  );
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Menu
        trigger={<Button variant="secondary">Skills</Button>}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        items={[
          { id: "react", label: "React" },
          { id: "typescript", label: "TypeScript" },
          { id: "css", label: "CSS" },
          { id: "a11y", label: "Accessibility" },
        ]}
      />
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        Selected: {selected === "all" ? "all" : [...selected].join(", ") || "none"}
      </p>
    </div>
  );
}
