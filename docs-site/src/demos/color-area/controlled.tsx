import { useState } from "react";
import { ColorArea } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

export default function ColorAreaControlled() {
  const [value, setValue] = useState<Color>(parseColor("hsl(280, 70%, 50%)"));
  return (
    <ColorArea
      aria-label="Color"
      value={value}
      onChange={setValue}
      xChannel="saturation"
      yChannel="lightness"
    />
  );
}
