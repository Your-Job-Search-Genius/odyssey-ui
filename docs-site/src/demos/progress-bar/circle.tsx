import { ProgressCircle } from "@your-job-search-genius/odyssey-ui";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

export default function ProgressBarCircle() {
  return (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      {sizes.map((size) => (
        <ProgressCircle key={size} aria-label={`Progress (${size})`} size={size} value={65} />
      ))}
      <ProgressCircle aria-label="Loading" size="lg" isIndeterminate />
    </div>
  );
}
