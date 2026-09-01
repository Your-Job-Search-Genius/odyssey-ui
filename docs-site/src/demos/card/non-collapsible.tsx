import { Card } from "@your-job-search-genius/odyssey-ui";
import { AlertCircleIcon } from "@your-job-search-genius/icons";

export default function CardNonCollapsible() {
  return (
    <div style={{ width: "24rem" }}>
      <Card
        title="Missing keywords"
        severity="urgent"
        severityLabel="Urgent"
        icon={<AlertCircleIcon />}
        collapsible={false}
      >
        Add "React" and "TypeScript" to your skills section to match this job
        description.
      </Card>
    </div>
  );
}
