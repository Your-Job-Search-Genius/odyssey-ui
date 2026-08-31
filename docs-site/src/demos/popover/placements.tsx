import { Button, Popover } from "@your-job-search-genius/odyssey-ui";

const placements = ["top", "right", "bottom", "left"] as const;

export default function PopoverPlacements() {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", padding: "1rem 0" }}>
      {placements.map((placement) => (
        <Popover key={placement} placement={placement} trigger={<Button variant="secondary">{placement}</Button>}>
          <p style={{ margin: 0 }}>Placement: {placement}</p>
        </Popover>
      ))}
    </div>
  );
}
