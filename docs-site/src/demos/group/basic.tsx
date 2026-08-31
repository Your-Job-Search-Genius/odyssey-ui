import { Group, Input } from "@your-job-search-genius/odyssey-ui";

export default function GroupBasic() {
  return (
    <Group>
      <Input
        unstyled
        style={{ width: "3ch", boxSizing: "content-box" }}
        maxLength={3}
        label="First 3 digits"
        placeholder="000"
      />
      –
      <Input
        unstyled
        style={{ width: "2ch", boxSizing: "content-box" }}
        maxLength={2}
        label="Middle 2 digits"
        placeholder="00"
      />
      –
      <Input
        unstyled
        style={{ width: "4ch", boxSizing: "content-box" }}
        maxLength={4}
        label="Last 4 digits"
        placeholder="0000"
      />
    </Group>
  );
}
