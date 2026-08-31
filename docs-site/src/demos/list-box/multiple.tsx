import { ListBox } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust", disabled: true },
  { id: "go", label: "Go" },
];

export default function ListBoxMultiple() {
  return (
    <ListBox
      aria-label="Languages"
      items={items}
      selectionMode="multiple"
      defaultSelectedKeys={new Set(["typescript", "go"])}
    />
  );
}
