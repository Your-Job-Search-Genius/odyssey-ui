import { TabList, TabPanel, Tabs } from "@your-job-search-genius/odyssey-ui";

export default function TabsDisabled() {
  return (
    <Tabs defaultSelectedKey="profile">
      <TabList
        aria-label="Settings"
        items={[
          { id: "profile", label: "Profile" },
          { id: "account", label: "Account" },
          { id: "billing", label: "Billing", disabled: true },
        ]}
      />
      <TabPanel id="profile">Profile settings go here.</TabPanel>
      <TabPanel id="account">Account settings go here.</TabPanel>
      <TabPanel id="billing">Billing is currently unavailable.</TabPanel>
    </Tabs>
  );
}
