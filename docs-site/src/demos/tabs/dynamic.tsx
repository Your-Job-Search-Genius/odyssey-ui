import { useState } from "react";
import { Button, TabList, TabPanel, Tabs } from "@your-job-search-genius/odyssey-ui";
import { Add01Icon, MinusSignIcon } from "@your-job-search-genius/icons";

export default function TabsDynamic() {
  const [tabs, setTabs] = useState([
    { id: 1, title: "Tab 1", content: "Tab body 1" },
    { id: 2, title: "Tab 2", content: "Tab body 2" },
    { id: 3, title: "Tab 3", content: "Tab body 3" },
  ]);
  const [nextId, setNextId] = useState(4);

  const addTab = () => {
    setTabs((tabs) => [...tabs, { id: nextId, title: `Tab ${nextId}`, content: `Tab body ${nextId}` }]);
    setNextId((id) => id + 1);
  };
  const removeTab = () => {
    setTabs((tabs) => (tabs.length > 1 ? tabs.slice(0, -1) : tabs));
  };

  return (
    <Tabs defaultSelectedKey={1} style={{ width: "24rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <TabList aria-label="Dynamic tabs" items={tabs.map((tab) => ({ id: tab.id, label: tab.title }))} />
        <Button size="sm" variant="secondary" leadingIcon={<Add01Icon />} aria-label="Add tab" onClick={addTab} />
        <Button
          size="sm"
          variant="secondary"
          leadingIcon={<MinusSignIcon />}
          aria-label="Remove tab"
          onClick={removeTab}
        />
      </div>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id}>
          {tab.content}
        </TabPanel>
      ))}
    </Tabs>
  );
}
