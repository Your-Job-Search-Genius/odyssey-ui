import { useState } from "react";
import { Button, Modal, type ModalFooterLayout } from "@your-job-search-genius/odyssey-ui";

export default function ModalFooterLayouts() {
  const [layout, setLayout] = useState<ModalFooterLayout | null>(null);
  const close = () => setLayout(null);
  return (
    <>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button variant="secondary" onClick={() => setLayout("horizontal")}>
          Horizontal
        </Button>
        <Button variant="secondary" onClick={() => setLayout("single")}>
          Single CTA
        </Button>
        <Button variant="secondary" onClick={() => setLayout("stacked")}>
          Stacked
        </Button>
      </div>
      <Modal
        isOpen={layout !== null}
        onOpenChange={(open) => !open && close()}
        size="sm"
        title="Save changes?"
        footerLayout={layout ?? "horizontal"}
        footer={
          layout === "single" ? (
            <Button variant="primary" size="sm" onClick={close}>
              Confirm
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={close}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={close}>
                Save
              </Button>
            </>
          )
        }
      >
        <p>Footer layout: {layout}.</p>
      </Modal>
    </>
  );
}
