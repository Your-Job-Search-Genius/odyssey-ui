import { TabList, TabPanel, Tabs } from "@your-job-search-genius/odyssey-ui";
import {
  Folder01Icon,
  Home01Icon,
  Search02Icon,
  Setting01Icon,
} from "@your-job-search-genius/icons";

const iconLabel = (Icon: typeof Home01Icon, text: string) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
    <Icon size="1rem" aria-hidden />
    {text}
  </span>
);

export default function TabsWithIcons() {
  return (
    <Tabs defaultSelectedKey="home">
      <TabList
        aria-label="Sections"
        items={[
          { id: "home", label: iconLabel(Home01Icon, "Home") },
          { id: "files", label: iconLabel(Folder01Icon, "Files") },
          { id: "search", label: iconLabel(Search02Icon, "Search") },
          { id: "settings", label: iconLabel(Setting01Icon, "Settings") },
        ]}
      />
      <TabPanel id="home">Home content.</TabPanel>
      <TabPanel id="files">Files content.</TabPanel>
      <TabPanel id="search">Search content.</TabPanel>
      <TabPanel id="settings">Settings content.</TabPanel>
    </Tabs>
  );
}
