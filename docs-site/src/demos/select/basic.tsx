import { Select } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio" },
];

export default function SelectBasic() {
  return (
    <Select
      label="Document type"
      items={items}
      defaultSelectedKey="resume"
      style={{ minWidth: "16rem" }}
    />
  );
}
