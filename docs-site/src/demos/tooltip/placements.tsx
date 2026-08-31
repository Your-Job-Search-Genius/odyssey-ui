import { Button, Tooltip } from "@your-job-search-genius/odyssey-ui";

const placements = ["top", "right", "bottom", "left"] as const;

export default function TooltipPlacements() {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", padding: "1rem 0" }}>
      {placements.map((placement) => (
        <Tooltip key={placement} content={`Placement: ${placement}`} placement={placement}>
          <Button variant="secondary">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
