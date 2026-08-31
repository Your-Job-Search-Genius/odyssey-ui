import { Select } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio" },
  { id: "transcript", label: "Transcript" },
  { id: "recommendation", label: "Recommendation letter" },
];

export default function SelectSearchable() {
  return (
    <Select
      label="Document type"
      items={items}
      searchable
      searchLabel="Search document types"
      style={{ minWidth: "16rem" }}
    />
  );
}
