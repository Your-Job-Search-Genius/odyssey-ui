import { useState } from "react";
import { Breadcrumb, Breadcrumbs } from "@your-job-search-genius/odyssey-ui";
import type { Key } from "react-aria-components";

export default function BreadcrumbsDynamic() {
  const [crumbs, setCrumbs] = useState([
    { id: 1, label: "Home" },
    { id: 2, label: "Trendy" },
    { id: 3, label: "March 2022 Assets" },
  ]);

  return (
    <Breadcrumbs
      items={crumbs}
      onAction={(key: Key) => {
        const idx = crumbs.findIndex((c) => c.id === Number(key));
        if (idx >= 0) setCrumbs(crumbs.slice(0, idx + 1));
      }}
    >
      {(item) => <Breadcrumb>{item.label}</Breadcrumb>}
    </Breadcrumbs>
  );
}
