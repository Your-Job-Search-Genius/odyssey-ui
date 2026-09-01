import { useState } from "react";
import {
  Button,
  ToastRegion,
  ToastQueue,
  type ToastContent,
} from "@your-job-search-genius/odyssey-ui";

export default function ToastTitleOnly() {
  const [queue] = useState(() => new ToastQueue<ToastContent>());

  return (
    <div>
      <ToastRegion queue={queue} />
      <Button onClick={() => queue.add({ title: "Changes saved" })}>Save</Button>
    </div>
  );
}
