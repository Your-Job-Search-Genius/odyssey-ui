import { TagGroup } from "@your-job-search-genius/odyssey-ui";

const interests = [
  { id: "news", label: "News" },
  { id: "travel", label: "Travel" },
  { id: "gaming", label: "Gaming" },
  { id: "shopping", label: "Shopping" },
  { id: "food", label: "Food" },
  { id: "music", label: "Music" },
  { id: "sports", label: "Sports" },
];

export default function TagGroupSearchable() {
  return (
    <TagGroup
      label="Interests"
      items={interests}
      selectionMode="multiple"
      searchable
      searchLabel="Filter interests"
      defaultSelectedKeys={new Set(["travel", "food"])}
    />
  );
}
