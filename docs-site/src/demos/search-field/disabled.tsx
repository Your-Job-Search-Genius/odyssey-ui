import { SearchField } from "@your-job-search-genius/odyssey-ui";

export default function SearchFieldDisabled() {
  return (
    <div style={{ width: "20rem" }}>
      <SearchField label="Search" disabled defaultValue="Read-only query" />
    </div>
  );
}
