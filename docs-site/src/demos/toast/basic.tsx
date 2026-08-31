import { Button, ToastRegion, toastQueue } from "@your-job-search-genius/odyssey-ui";

export default function ToastBasic() {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <ToastRegion />
      <Button
        variant="secondary"
        onClick={() =>
          toastQueue.add({
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
          toastQueue.add({
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
          toastQueue.add({
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
          toastQueue.add({
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
