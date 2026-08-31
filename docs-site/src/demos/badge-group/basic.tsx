import { BadgeGroup } from "@your-job-search-genius/odyssey-ui";
import { Tick01Icon } from "@your-job-search-genius/icons";

export default function BadgeGroupBasic() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <BadgeGroup label="New" icon={<Tick01Icon />}>
        “I’m just a guy who loves tech 🚀”
      </BadgeGroup>
      <BadgeGroup label="Beta" layout="stacked" badgePosition="leading">
        Early access to Odyssey components
      </BadgeGroup>
    </div>
  );
}
