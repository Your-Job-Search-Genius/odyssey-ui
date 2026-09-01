import { Group, Input } from "@your-job-search-genius/odyssey-ui";

export default function GroupDisabled() {
  return (
    <Group disabled>
      <Input unstyled aria-label="Value" placeholder="Disabled" disabled />
    </Group>
  );
}
