import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@your-job-search-genius/odyssey-ui";
import { GridViewIcon, ListViewIcon } from "@your-job-search-genius/icons";

export default function ToggleButtonViewSwitcher() {
  const [selected, setSelected] = useState<Set<string | number>>(new Set(["grid"]));
  return (
    <ToggleButtonGroup
      aria-label="Layout"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <ToggleButton id="grid">
        <GridViewIcon aria-hidden />
        Grid
      </ToggleButton>
      <ToggleButton id="list">
        <ListViewIcon aria-hidden />
        List
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
