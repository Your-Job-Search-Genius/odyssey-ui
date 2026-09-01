import { ColorSlider } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorSliderVertical() {
  return (
    <ColorSlider label="Hue" defaultValue={parseColor("hsl(280, 70%, 50%)")} channel="hue" orientation="vertical" />
  );
}
