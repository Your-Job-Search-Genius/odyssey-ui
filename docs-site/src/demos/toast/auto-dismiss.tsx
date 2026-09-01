import { useState } from "react";
import {
  Button,
  ToastRegion,
  ToastQueue,
  type ToastContent,
} from "@your-job-search-genius/odyssey-ui";

export default function ToastAutoDismiss() {
  const [queue] = useState(() => new ToastQueue<ToastContent>());

  return (
    <div>
      <ToastRegion queue={queue} />
      <Button
        onClick={() =>
          queue.add({ title: "File has been saved!" }, { timeout: 5000 })
        }
      >
        Save file
      </Button>
    </div>
  );
}
