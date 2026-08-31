import { SearchField } from "@your-job-search-genius/odyssey-ui";

export default function SearchFieldBasic() {
  return (
    <div style={{ width: "20rem" }}>
      <SearchField
        label="Search"
        helperText="Matches by title or description. Escape or the clear button empties the field."
      />
    </div>
  );
}
