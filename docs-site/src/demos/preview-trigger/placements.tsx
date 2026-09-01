import { Link, PreviewTrigger } from "@your-job-search-genius/odyssey-ui";

const placements = ["top", "right", "bottom", "left"] as const;

export default function PreviewTriggerPlacements() {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", padding: "3rem 0" }}>
      {placements.map((placement) => (
        <PreviewTrigger key={placement} placement={placement} trigger={<Link href="#">{placement}</Link>}>
          <p style={{ margin: 0 }}>Placement: {placement}</p>
        </PreviewTrigger>
      ))}
    </div>
  );
}
