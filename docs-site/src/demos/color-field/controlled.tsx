import { useState } from "react";
import { ColorField } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

export default function ColorFieldControlled() {
  const [value, setValue] = useState<Color | null>(parseColor("#e73623"));
  return (
    <div style={{ width: "16rem" }}>
      <ColorField label="Primary color" placeholder="Enter a color" value={value} onChange={setValue} />
    </div>
  );
}
