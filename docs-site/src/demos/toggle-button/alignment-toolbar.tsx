import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@your-job-search-genius/odyssey-ui";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyLeftIcon,
} from "@your-job-search-genius/icons";

export default function ToggleButtonAlignmentToolbar() {
  const [selected, setSelected] = useState<Set<string | number>>(new Set(["left"]));
  return (
    <ToggleButtonGroup
      aria-label="Text alignment"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <ToggleButton id="left" aria-label="Align left">
        <TextAlignLeftIcon aria-hidden />
      </ToggleButton>
      <ToggleButton id="center" aria-label="Align center">
        <TextAlignCenterIcon aria-hidden />
      </ToggleButton>
      <ToggleButton id="right" aria-label="Align right">
        <TextAlignRightIcon aria-hidden />
      </ToggleButton>
      <ToggleButton id="justify" aria-label="Justify">
        <TextAlignJustifyLeftIcon aria-hidden />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
