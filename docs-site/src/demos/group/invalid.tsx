import { Group, Input } from "@your-job-search-genius/odyssey-ui";

export default function GroupInvalid() {
  return (
    <Group invalid>
      <Input unstyled aria-label="Value" placeholder="Invalid" />
    </Group>
  );
}
