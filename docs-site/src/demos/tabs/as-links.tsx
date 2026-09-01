import { TabList, TabPanel, Tabs } from "@your-job-search-genius/odyssey-ui";

export default function TabsAsLinks() {
  return (
    <Tabs defaultSelectedKey="overview">
      <TabList
        aria-label="Project"
        items={[
          { id: "overview", label: "Overview", href: "#overview" },
          { id: "activity", label: "Activity", href: "#activity" },
          { id: "settings", label: "Settings", href: "#settings" },
        ]}
      />
      <TabPanel id="overview">Overview page content.</TabPanel>
      <TabPanel id="activity">Activity page content.</TabPanel>
      <TabPanel id="settings">Settings page content.</TabPanel>
    </Tabs>
  );
}
