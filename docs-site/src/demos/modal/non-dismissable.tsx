import { useState } from "react";
import { Button, Modal } from "@your-job-search-genius/odyssey-ui";

export default function ModalNonDismissable() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Start critical process</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Processing..."
        isDismissable={false}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <p>Escape and outside-click are disabled here — only the button below closes it.</p>
      </Modal>
    </>
  );
}
