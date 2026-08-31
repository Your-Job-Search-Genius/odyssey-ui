import { ColorPicker } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorPickerBasic() {
  return (
    <ColorPicker label="Fill color" defaultValue={parseColor("hsl(280, 70%, 50%)")} />
  );
}
