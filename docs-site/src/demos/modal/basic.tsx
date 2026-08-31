import { useState } from "react";
import { Button, Modal } from "@your-job-search-genius/odyssey-ui";

export default function ModalBasic() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete resume</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Delete resume?"
        description="This can't be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        <p>Deleting this resume removes it from every job application draft.</p>
      </Modal>
    </>
  );
}
