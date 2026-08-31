import { ListBox } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "swift", label: "Swift" },
  { id: "kotlin", label: "Kotlin" },
];

export default function ListBoxSearchable() {
  return (
    <ListBox
      aria-label="Languages"
      items={items}
      selectionMode="multiple"
      searchable
      searchLabel="Search languages"
    />
  );
}
