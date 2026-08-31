import { Card } from "@your-job-search-genius/odyssey-ui";
import { AlertCircleIcon } from "@your-job-search-genius/icons";

export default function CardBasic() {
  return (
    <div style={{ width: "24rem" }}>
      <Card
        title="Missing keywords"
        severity="urgent"
        severityLabel="Urgent"
        icon={<AlertCircleIcon />}
      >
        Add "React" and "TypeScript" to your skills section to match this job
        description.
      </Card>
    </div>
  );
}
