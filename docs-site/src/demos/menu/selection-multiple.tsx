import { useState } from "react";
import { Button, Menu } from "@your-job-search-genius/odyssey-ui";
import type { Selection } from "react-aria-components";

export default function MenuSelectionMultiple() {
  const [selected, setSelected] = useState<Selection>(new Set(["option-2"]));
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Menu
        trigger={<Button variant="secondary">Options</Button>}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        items={[
          { id: "option-1", label: "Option 1" },
          { id: "option-2", label: "Option 2" },
          { id: "option-3", label: "Option 3" },
          { id: "option-4", label: "Option 4", disabled: true },
        ]}
      />
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        Selected:{" "}
        {selected === "all"
          ? "all"
          : [...selected].join(", ") || "none"}
      </p>
    </div>
  );
}
