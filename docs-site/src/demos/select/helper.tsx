import { Select } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio", disabled: true },
];

export default function SelectHelper() {
  return (
    <Select
      label="Document type"
      items={items}
      helperText="Used for the export filename."
      style={{ minWidth: "16rem" }}
    />
  );
}
