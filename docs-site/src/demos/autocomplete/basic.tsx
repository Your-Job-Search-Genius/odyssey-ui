import { Autocomplete } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
];

export default function AutocompleteBasic() {
  return (
    <Autocomplete
      label="Skill"
      items={items}
      placeholder="e.g. React"
      helperText="Suggestions appear as you type; any value is accepted."
      style={{ minWidth: "16rem" }}
    />
  );
}
