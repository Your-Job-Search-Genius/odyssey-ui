import { ColorSwatchPicker, ColorSwatchPickerItem } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorSwatchPickerWithDisabledSwatch() {
  return (
    <ColorSwatchPicker aria-label="Color" defaultValue={parseColor("#A00")}>
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#080" disabled />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  );
}
