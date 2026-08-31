import { ListBox } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust", disabled: true },
  { id: "go", label: "Go" },
];

export default function ListBoxBasic() {
  return <ListBox aria-label="Languages" items={items} />;
}
