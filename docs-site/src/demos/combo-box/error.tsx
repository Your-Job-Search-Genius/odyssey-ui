import { ComboBox } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio" },
];

export default function ComboBoxError() {
  return (
    <ComboBox
      label="Document type"
      items={items}
      errorMessage="Choose a document type."
      style={{ minWidth: "16rem" }}
    />
  );
}
