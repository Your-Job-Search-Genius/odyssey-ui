import { Button, Group, Input } from "@your-job-search-genius/odyssey-ui";

export default function GroupWithInlineButton() {
  return (
    <Group style={{ width: 280 }}>
      <Input
        unstyled
        style={{ flex: 1, minWidth: 0 }}
        label="Promo code"
        placeholder="Promo code"
      />
      <Button size="sm" variant="text">
        Apply
      </Button>
    </Group>
  );
}
