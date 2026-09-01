import { useState } from "react";
import {
  Button,
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "@your-job-search-genius/odyssey-ui";

export default function DisclosureControlled() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 320 }}>
      <Button variant="secondary" size="sm" onClick={() => setExpanded((v) => !v)}>
        Toggle from outside
      </Button>
      <Disclosure expanded={expanded} onExpandedChange={setExpanded}>
        <DisclosureHeader>Download, Install, and Set Up</DisclosureHeader>
        <DisclosurePanel>Instructions on how to download, install, and set up.</DisclosurePanel>
      </Disclosure>
    </div>
  );
}
