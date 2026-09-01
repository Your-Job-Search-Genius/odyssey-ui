import { useState } from "react";
import {
  Button,
  ToastRegion,
  ToastQueue,
  type ToastContent,
} from "@your-job-search-genius/odyssey-ui";

export default function ToastStacked() {
  const [queue] = useState(() => new ToastQueue<ToastContent>());
  const [count, setCount] = useState(0);

  return (
    <div>
      <ToastRegion queue={queue} />
      <Button
        onClick={() => {
          const next = count + 1;
          setCount(next);
          queue.add({ title: `Notification ${next}` });
        }}
      >
        Add toast
      </Button>
    </div>
  );
}
