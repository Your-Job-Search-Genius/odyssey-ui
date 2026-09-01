import { TabList, TabPanel, Tabs } from "@your-job-search-genius/odyssey-ui";

const items = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "billing", label: "Billing" },
];

export default function TabsManualActivation() {
  return (
    <Tabs defaultSelectedKey="profile" keyboardActivation="manual">
      <TabList aria-label="Settings" items={items} />
      <TabPanel id="profile">Profile settings go here.</TabPanel>
      <TabPanel id="account">Account settings go here.</TabPanel>
      <TabPanel id="billing">Billing settings go here.</TabPanel>
    </Tabs>
  );
}
