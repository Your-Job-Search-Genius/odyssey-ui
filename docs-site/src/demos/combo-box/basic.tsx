import { ComboBox } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio", disabled: true },
];

export default function ComboBoxBasic() {
  return (
    <ComboBox
      label="Document type"
      items={items}
      helperText="Start typing to filter."
      style={{ minWidth: "16rem" }}
    />
  );
}
