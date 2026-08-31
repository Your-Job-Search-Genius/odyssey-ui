import { useState } from "react";
import { ColorPicker } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

export default function ColorPickerControlled() {
  const [value, setValue] = useState<Color>(parseColor("hsl(280, 70%, 50%)"));
  return (
    <div>
      <ColorPicker label="Fill color" value={value} onChange={setValue} />
      <p style={{ marginTop: 12, fontSize: 12 }}>Selected color: {value.toString("hsl")}</p>
    </div>
  );
}
