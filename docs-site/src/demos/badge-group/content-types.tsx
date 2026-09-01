import { BadgeGroup } from "@your-job-search-genius/odyssey-ui";
import { Tick01Icon } from "@your-job-search-genius/icons";

export default function BadgeGroupContentTypes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
      <BadgeGroup label="Voice" icon={<Tick01Icon />}>
        “I’m just a guy who loves tech 🚀”
      </BadgeGroup>
      <BadgeGroup label="4.8" icon={<Tick01Icon />}>
        Rating
      </BadgeGroup>
      <BadgeGroup label="New" badgePosition="leading">
        Section header
      </BadgeGroup>
    </div>
  );
}
