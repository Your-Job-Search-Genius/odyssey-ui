import { SearchField } from "@your-job-search-genius/odyssey-ui";

export default function SearchFieldError() {
  return (
    <div style={{ width: "20rem" }}>
      <SearchField label="Search" errorMessage="Search query is too short." />
    </div>
  );
}
