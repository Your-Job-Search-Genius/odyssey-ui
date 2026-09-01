import { ColorSlider } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorSliderAlphaChannel() {
  return (
    <div style={{ width: "16rem" }}>
      <ColorSlider label="Alpha" defaultValue={parseColor("hsla(280, 70%, 50%, 0.5)")} channel="alpha" />
    </div>
  );
}
