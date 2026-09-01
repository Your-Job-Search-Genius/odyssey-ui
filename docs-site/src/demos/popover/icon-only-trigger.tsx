import { Button, Popover } from "@your-job-search-genius/odyssey-ui";
import { More01Icon } from "@your-job-search-genius/icons";

export default function PopoverIconOnlyTrigger() {
  return (
    <Popover trigger={<Button leadingIcon={<More01Icon />} aria-label="More actions" variant="text" />}>
      <p style={{ margin: 0 }}>More actions content.</p>
    </Popover>
  );
}
