import { Button, Menu } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "rename", label: "Rename" },
  { id: "duplicate", label: "Duplicate" },
  { id: "share", label: "Share" },
  { id: "delete", label: "Delete", danger: true },
];

const placements = ["bottom start", "bottom end", "top start", "top end"] as const;

export default function MenuPlacements() {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", padding: "3rem 0" }}>
      {placements.map((placement) => (
        <Menu key={placement} trigger={<Button variant="secondary">{placement}</Button>} items={items} placement={placement} />
      ))}
    </div>
  );
}
