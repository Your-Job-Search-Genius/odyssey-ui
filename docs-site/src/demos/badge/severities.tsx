import { Badge } from "@your-job-search-genius/odyssey-ui";

const SEVERITIES = ["excellent", "good", "fair", "poor", "bad", "fail"] as const;

export default function BadgeSeverities() {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {SEVERITIES.map((severity) => (
        <Badge key={severity} severity={severity}>
          {severity}
        </Badge>
      ))}
    </div>
  );
}
