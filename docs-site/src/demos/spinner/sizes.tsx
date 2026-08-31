import { Spinner } from "@your-job-search-genius/odyssey-ui";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

export default function SpinnerSizes() {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {sizes.map((size) => (
        <Spinner key={size} size={size} label={`Loading (${size})`} />
      ))}
    </div>
  );
}
