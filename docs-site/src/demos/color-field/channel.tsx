import { ColorField } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorFieldChannel() {
  return (
    <div style={{ width: "16rem" }}>
      <ColorField
        label="Hue"
        defaultValue={parseColor("hsl(280, 70%, 50%)")}
        colorSpace="hsl"
        channel="hue"
      />
    </div>
  );
}
