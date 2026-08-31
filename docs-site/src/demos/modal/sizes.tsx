import { useState } from "react";
import { Button, Modal, type ModalSize } from "@your-job-search-genius/odyssey-ui";

export default function ModalSizes() {
  const [size, setSize] = useState<ModalSize | null>(null);
  return (
    <>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button variant="secondary" onClick={() => setSize("sm")}>
          Small
        </Button>
        <Button variant="secondary" onClick={() => setSize("md")}>
          Medium
        </Button>
        <Button variant="secondary" onClick={() => setSize("lg")}>
          Large
        </Button>
      </div>
      <Modal
        isOpen={size !== null}
        onOpenChange={(open) => !open && setSize(null)}
        size={size ?? "md"}
        title={`Size: ${size ?? "md"}`}
      >
        <p>The panel width comes from the size prop; the content is unchanged.</p>
      </Modal>
    </>
  );
}
