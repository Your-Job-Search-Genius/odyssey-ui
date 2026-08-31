import { ColorSwatch } from "@your-job-search-genius/odyssey-ui";
import { parseColor } from "react-aria-components";

export default function ColorSwatchBasic() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <ColorSwatch color={parseColor("#6941C6")} colorName="Odyssey purple" />
      <ColorSwatch color={parseColor("#D30D25")} aria-label="Background color" />
      <ColorSwatch color={parseColor("#ffffff00")} />
    </div>
  );
}
