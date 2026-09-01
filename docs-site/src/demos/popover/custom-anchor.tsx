import { useRef, useState } from "react";
import { Button, Popover } from "@your-job-search-genius/odyssey-ui";

export default function PopoverCustomAnchor() {
  const [isOpen, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Show info
      </Button>
      <span ref={anchorRef} style={{ color: "var(--wsu-color-text-subtle)" }}>
        Popover points at me, not the button
      </span>
      <Popover triggerRef={anchorRef} isOpen={isOpen} onOpenChange={setOpen}>
        <p style={{ margin: 0 }}>Anchored to the label, opened by the button.</p>
      </Popover>
    </div>
  );
}
