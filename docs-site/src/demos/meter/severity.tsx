import { Meter } from "@your-job-search-genius/odyssey-ui";

export default function MeterSeverity() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "18rem" }}>
      <Meter label="Disk usage" value={45} />
      <Meter label="Monthly quota" value={80} />
      <Meter label="Inbox storage" value={95} />
    </div>
  );
}
