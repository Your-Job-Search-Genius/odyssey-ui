import { ColorSlider } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorSliderDisabled() {
  return (
    <div style={{ width: "16rem" }}>
      <ColorSlider label="Hue" defaultValue={parseColor("hsl(280, 70%, 50%)")} channel="hue" disabled />
    </div>
  );
}
