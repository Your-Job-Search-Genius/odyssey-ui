import { ListLayout, Virtualizer } from "@your-job-search-genius/odyssey-ui";
import { ListBox as AriaListBox, ListBoxItem } from "react-aria-components";

const listItems = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
}));

export default function VirtualizerList() {
  return (
    <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 44, gap: 4, padding: 8 }}>
      <AriaListBox
        aria-label="Virtualized list"
        items={listItems}
        style={{
          height: 320,
          overflow: "auto",
          boxSizing: "border-box",
          border: "0.75px solid var(--wsu-color-border-default)",
          borderRadius: "var(--wsu-radius-md)",
          boxShadow: "var(--wsu-shadow-sm)",
          outline: "none",
        }}
      >
        {(item) => (
          <ListBoxItem id={item.id} className="wsu-ListBoxItem" style={{ height: "100%", minHeight: 0 }}>
            {item.name}
          </ListBoxItem>
        )}
      </AriaListBox>
    </Virtualizer>
  );
}
