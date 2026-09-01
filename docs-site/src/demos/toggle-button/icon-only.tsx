import { ToggleButton } from "@your-job-search-genius/odyssey-ui";
import { TextBoldIcon, TextItalicIcon, StarIcon } from "@your-job-search-genius/icons";

export default function ToggleButtonIconOnly() {
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <ToggleButton aria-label="Bold">
        <TextBoldIcon aria-hidden />
      </ToggleButton>
      <ToggleButton aria-label="Italic">
        <TextItalicIcon aria-hidden />
      </ToggleButton>
      <ToggleButton aria-label="Favorite" defaultSelected>
        <StarIcon aria-hidden />
      </ToggleButton>
    </div>
  );
}
