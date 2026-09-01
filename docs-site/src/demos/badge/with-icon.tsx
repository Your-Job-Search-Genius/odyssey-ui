import { Badge } from "@your-job-search-genius/odyssey-ui";
import { Tick01Icon } from "@your-job-search-genius/icons";

export default function BadgeWithIcon() {
  return (
    <Badge type="soft" severity="excellent" icon={<Tick01Icon />}>
      Excellent
    </Badge>
  );
}
