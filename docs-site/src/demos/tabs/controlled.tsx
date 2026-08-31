import { useState } from "react";
import { TabList, TabPanel, Tabs } from "@your-job-search-genius/odyssey-ui";
import type { Key } from "react-aria-components";

export default function TabsControlled() {
  const [selected, setSelected] = useState<Key>("profile");
  return (
    <div style={{ display: "grid", gap: "0.75rem", width: "24rem" }}>
      <Tabs selectedKey={selected} onSelectionChange={setSelected}>
        <TabList
          aria-label="Settings"
          items={[
            { id: "profile", label: "Profile" },
            { id: "account", label: "Account" },
            { id: "billing", label: "Billing" },
          ]}
        />
        <TabPanel id="profile">Profile settings go here.</TabPanel>
        <TabPanel id="account">Account settings go here.</TabPanel>
        <TabPanel id="billing">Billing settings go here.</TabPanel>
      </Tabs>
      <p style={{ margin: 0, fontSize: "0.875rem" }}>Selected tab: {String(selected)}</p>
    </div>
  );
}
