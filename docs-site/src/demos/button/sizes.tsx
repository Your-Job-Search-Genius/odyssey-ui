import { Button } from "@your-job-search-genius/odyssey-ui";

export default function ButtonSizes() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
