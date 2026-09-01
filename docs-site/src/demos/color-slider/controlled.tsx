import { useState } from "react";
import { ColorSlider } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

export default function ColorSliderControlled() {
  const [value, setValue] = useState<Color>(parseColor("hsl(280, 70%, 50%)"));
  return (
    <div style={{ width: "16rem" }}>
      <ColorSlider label="Hue" value={value} onChange={setValue} channel="hue" />
    </div>
  );
}
