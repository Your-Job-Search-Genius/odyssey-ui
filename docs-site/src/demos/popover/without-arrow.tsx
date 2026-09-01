import { Button, Popover } from "@your-job-search-genius/odyssey-ui";

export default function PopoverWithoutArrow() {
  return (
    <Popover trigger={<Button variant="secondary">More options</Button>} hideArrow>
      <p style={{ margin: 0 }}>No arrow here.</p>
    </Popover>
  );
}
