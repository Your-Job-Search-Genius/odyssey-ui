import { Badge } from "@your-job-search-genius/odyssey-ui";

const MODES = ["generic", "client", "admin"] as const;

export default function BadgeDesignModes() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      {MODES.map((designMode) => (
        <Badge key={designMode} designMode={designMode}>
          {designMode}
        </Badge>
      ))}
    </div>
  );
}
