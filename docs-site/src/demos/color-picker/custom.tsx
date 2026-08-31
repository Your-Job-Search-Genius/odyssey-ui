import { ColorArea, ColorField, ColorPicker } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorPickerCustom() {
  return (
    <ColorPicker label="Fill color" defaultValue={parseColor("hsl(280, 70%, 50%)")}>
      <ColorArea
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
        aria-label="Fill color area"
      />
      <ColorField label="Hex" />
      <ColorField label="Alpha" channel="alpha" />
    </ColorPicker>
  );
}
