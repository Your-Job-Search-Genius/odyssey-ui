import { ColorSwatchPicker, ColorSwatchPickerItem } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorSwatchPickerBasic() {
  return (
    <ColorSwatchPicker aria-label="Color" defaultValue={parseColor("#A00")}>
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#f80" />
      <ColorSwatchPickerItem color="#080" />
      <ColorSwatchPickerItem color="#08f" />
      <ColorSwatchPickerItem color="#088" />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  );
}
