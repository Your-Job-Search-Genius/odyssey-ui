import { TagGroup } from "@your-job-search-genius/odyssey-ui";

const interests = [
  { id: "news", label: "News" },
  { id: "travel", label: "Travel" },
  { id: "gaming", label: "Gaming" },
  { id: "shopping", label: "Shopping" },
  { id: "food", label: "Food" },
];

export default function TagGroupBasic() {
  return (
    <TagGroup label="Interests" items={interests} selectionMode="multiple" />
  );
}
