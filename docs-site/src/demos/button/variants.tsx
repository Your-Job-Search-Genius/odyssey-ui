import { Button } from "@your-job-search-genius/odyssey-ui";

export default function ButtonVariants() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="text">Text</Button>
    </div>
  );
}
