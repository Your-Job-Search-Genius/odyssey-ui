import { ColorField } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorFieldHelperText() {
  return (
    <div style={{ width: "16rem" }}>
      <ColorField
        label="Primary color"
        placeholder="Enter a color"
        defaultValue={parseColor("#e73623")}
        helperText="Accepts a 3- or 6-digit hex value."
      />
    </div>
  );
}
