import { useState } from "react";
import { Badge, Button, Modal } from "@your-job-search-genius/odyssey-ui";
import { PresentationBarChart02Icon, StarCircleSolidIcon } from "@your-job-search-genius/icons";

type Header = "icon" | "badge" | "centered";

export default function ModalHeaderExtras() {
  const [header, setHeader] = useState<Header | null>(null);
  const close = () => setHeader(null);
  const footer = (
    <>
      <Button variant="secondary" size="sm" onClick={close}>
        Cancel
      </Button>
      <Button variant="primary" size="sm" onClick={close}>
        Confirm
      </Button>
    </>
  );
  return (
    <>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={() => setHeader("icon")}>
          Icon + description
        </Button>
        <Button variant="secondary" onClick={() => setHeader("badge")}>
          With badge
        </Button>
        <Button variant="secondary" onClick={() => setHeader("centered")}>
          Centered title
        </Button>
      </div>
      <Modal
        isOpen={header === "icon"}
        onOpenChange={(open) => !open && close()}
        size="sm"
        title="Resume analytics"
        description="How this resume performed over the last 30 days."
        icon={<PresentationBarChart02Icon />}
        footer={footer}
      >
        <p>Modal body content.</p>
      </Modal>
      <Modal
        isOpen={header === "badge"}
        onOpenChange={(open) => !open && close()}
        size="sm"
        title="Choose a template"
        badge={
          <Badge type="border" trailingIcon={<StarCircleSolidIcon />}>
            Neo-Classic
          </Badge>
        }
        footer={footer}
      >
        <p>Modal body content.</p>
      </Modal>
      <Modal
        isOpen={header === "centered"}
        onOpenChange={(open) => !open && close()}
        size="sm"
        title="Welcome aboard"
        titleSize="lg"
        align="center"
        showCloseButton={false}
        footer={footer}
      >
        <p>Escape and outside-click still close this modal, so hiding the close button never traps anyone.</p>
      </Modal>
    </>
  );
}
