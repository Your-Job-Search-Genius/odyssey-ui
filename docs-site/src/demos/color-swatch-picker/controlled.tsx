import { useState } from "react";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

export default function ColorSwatchPickerControlled() {
  const [value, setValue] = useState<Color>(parseColor("#A00"));
  return (
    <div>
      <ColorSwatchPicker aria-label="Color" value={value} onChange={setValue}>
        <ColorSwatchPickerItem color="#A00" />
        <ColorSwatchPickerItem color="#080" />
        <ColorSwatchPickerItem color="#008" />
      </ColorSwatchPicker>
      <p style={{ fontSize: 12 }}>Selected color: {value.toString("hex")}</p>
    </div>
  );
}
