import { ColorArea } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorAreaDisabled() {
  return (
    <ColorArea
      aria-label="Color"
      defaultValue={parseColor("hsl(280, 70%, 50%)")}
      xChannel="saturation"
      yChannel="lightness"
      disabled
    />
  );
}
