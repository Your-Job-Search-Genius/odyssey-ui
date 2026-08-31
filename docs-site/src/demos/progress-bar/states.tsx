import { ProgressBar } from "@your-job-search-genius/odyssey-ui";

export default function ProgressBarStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "18rem" }}>
      <ProgressBar label="Uploading" value={40} />
      <ProgressBar label="Storage migrated" value={3.5} minValue={0} maxValue={5} />
      <ProgressBar label="Loading" isIndeterminate />
    </div>
  );
}
