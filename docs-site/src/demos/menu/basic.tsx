import { Button, Menu } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "rename", label: "Rename" },
  { id: "duplicate", label: "Duplicate" },
  { id: "share", label: "Share" },
  { id: "delete", label: "Delete", danger: true },
];

export default function MenuBasic() {
  return <Menu trigger={<Button variant="secondary">Document actions</Button>} items={items} />;
}
