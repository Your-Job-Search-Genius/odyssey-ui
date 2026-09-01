import { useState } from "react";
import {
  Button,
  ToastRegion,
  ToastQueue,
  type ToastContent,
} from "@your-job-search-genius/odyssey-ui";

export default function ToastBasic() {
  const [queue] = useState(() => new ToastQueue<ToastContent>());

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <ToastRegion queue={queue} />
      <Button
        variant="secondary"
        onClick={() =>
          queue.add({
            title: "Files uploaded",
            description: "3 files uploaded successfully.",
          })
        }
      >
        Neutral
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          queue.add({
            variant: "success",
            title: "Application submitted",
            description: "Your application was sent to the employer.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          queue.add({
            variant: "warning",
            title: "Resume nearly full",
            description: "You're close to the one-page limit.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          queue.add({
            variant: "error",
            title: "Upload failed",
            description: "That file is larger than 10MB.",
          })
        }
      >
        Error
      </Button>
    </div>
  );
}
