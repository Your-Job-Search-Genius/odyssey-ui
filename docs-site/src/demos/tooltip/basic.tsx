import { Button, Tooltip } from "@your-job-search-genius/odyssey-ui";
import { Delete02Icon } from "@your-job-search-genius/icons";

export default function TooltipBasic() {
  return (
    <Tooltip content="Delete this resume">
      <Button leadingIcon={<Delete02Icon />} aria-label="Delete this resume" variant="secondary" />
    </Tooltip>
  );
}
