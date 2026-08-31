import { useState } from "react";
import { TagGroup } from "@your-job-search-genius/odyssey-ui";
import type { Key } from "react-aria-components";

const initial = [
  { id: "news", label: "News" },
  { id: "travel", label: "Travel" },
  { id: "gaming", label: "Gaming" },
  { id: "shopping", label: "Shopping" },
  { id: "food", label: "Food" },
];

export default function TagGroupRemovable() {
  const [items, setItems] = useState(initial);
  return (
    <TagGroup
      label="Interests"
      items={items}
      onRemove={(keys: Set<Key>) => {
        setItems((current) => current.filter((item) => !keys.has(item.id)));
      }}
    />
  );
}
