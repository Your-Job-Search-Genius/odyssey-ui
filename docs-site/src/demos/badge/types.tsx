import { Badge } from "@your-job-search-genius/odyssey-ui";

const SEVERITIES = ["excellent", "good", "fair", "poor", "bad", "fail"] as const;
const TYPES = ["solid", "soft", "border"] as const;

export default function BadgeTypes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {TYPES.map((type) => (
        <div key={type} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SEVERITIES.map((severity) => (
            <Badge key={severity} type={type} severity={severity}>
              {severity}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  );
}
