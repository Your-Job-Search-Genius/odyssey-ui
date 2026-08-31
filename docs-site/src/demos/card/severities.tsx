import { Card } from "@your-job-search-genius/odyssey-ui";
import { AlertCircleIcon } from "@your-job-search-genius/icons";

const SEVERITIES = ["urgent", "critical", "optional", "general", "neutral"] as const;

export default function CardSeverities() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "24rem" }}>
      {SEVERITIES.map((severity) => (
        <Card
          key={severity}
          title={`${severity} finding`}
          severity={severity}
          severityLabel={severity !== "neutral" ? severity : undefined}
          icon={<AlertCircleIcon />}
        >
          Add "React" and "TypeScript" to your skills section.
        </Card>
      ))}
    </div>
  );
}
