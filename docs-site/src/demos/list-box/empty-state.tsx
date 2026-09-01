import { ListBox } from "@your-job-search-genius/odyssey-ui";

export default function ListBoxEmptyState() {
  return (
    <ListBox
      aria-label="Languages"
      items={[]}
      searchable
      searchLabel="Search languages"
    />
  );
}
