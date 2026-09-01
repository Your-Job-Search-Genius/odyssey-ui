import { ToggleButton } from "@your-job-search-genius/odyssey-ui";

export default function ToggleButtonSizes() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <ToggleButton size="sm">Small</ToggleButton>
      <ToggleButton size="md">Medium</ToggleButton>
      <ToggleButton size="lg">Large</ToggleButton>
    </div>
  );
}
