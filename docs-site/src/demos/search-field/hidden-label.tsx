import { SearchField } from "@your-job-search-genius/odyssey-ui";

export default function SearchFieldHiddenLabel() {
  return (
    <div style={{ width: "20rem" }}>
      <SearchField label="Search" hideLabel placeholder="Search commands..." />
    </div>
  );
}
