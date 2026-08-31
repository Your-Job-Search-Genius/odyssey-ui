import { useState } from "react";
import { ToggleButton } from "@your-job-search-genius/odyssey-ui";
import { Bookmark01Icon, Bookmark01SolidIcon } from "@your-job-search-genius/icons";

export default function ToggleButtonBasic() {
  const [saved, setSaved] = useState(false);
  return (
    <ToggleButton selected={saved} onChange={setSaved}>
      {saved ? <Bookmark01SolidIcon aria-hidden /> : <Bookmark01Icon aria-hidden />}
      {saved ? "Saved" : "Save job"}
    </ToggleButton>
  );
}
