import { useState } from "react";
import {
  Button,
  ToastRegion,
  ToastQueue,
  type ToastContent,
} from "@your-job-search-genius/odyssey-ui";

export default function ToastProgrammaticDismissal() {
  const [queue] = useState(() => new ToastQueue<ToastContent>());
  const [toastKey, setToastKey] = useState<string | null>(null);

  return (
    <div>
      <ToastRegion queue={queue} />
      <Button
        onClick={() => {
          if (!toastKey) {
            setToastKey(
              queue.add({ title: "Processing..." }, { onClose: () => setToastKey(null) }),
            );
          } else {
            queue.close(toastKey);
          }
        }}
      >
        {toastKey ? "Cancel" : "Process"}
      </Button>
    </div>
  );
}
