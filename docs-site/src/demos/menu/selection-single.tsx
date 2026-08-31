import { useState } from "react";
import { Button, Menu } from "@your-job-search-genius/odyssey-ui";
import { SearchList01Icon } from "@your-job-search-genius/icons";
import type { Selection } from "react-aria-components";

export default function MenuSelectionSingle() {
  const [selected, setSelected] = useState<Selection>(new Set(["card-2"]));
  return (
    <Menu
      trigger={<Button variant="secondary">Choose an action</Button>}
      variant="card"
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={setSelected}
      items={[
        {
          id: "card-1",
          label: "Rewrite section",
          description: "Ask Alice to polish this bullet",
          icon: <SearchList01Icon />,
        },
        {
          id: "card-2",
          label: "Expand section",
          description: "Add more detail and metrics",
          icon: <SearchList01Icon />,
        },
        {
          id: "card-3",
          label: "Remove section",
          description: "Drop this block from the resume",
          icon: <SearchList01Icon />,
        },
      ]}
    />
  );
}
