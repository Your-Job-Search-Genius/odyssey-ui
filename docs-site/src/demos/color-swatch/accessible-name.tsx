import { ColorSwatch } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorSwatchAccessibleName() {
  return <ColorSwatch color={parseColor("#D30D25")} colorName="Fire truck red" aria-label="Background color" />;
}
