import { GridLayout, Virtualizer } from "@your-job-search-genius/odyssey-ui";
import { GridList as AriaGridList, GridListItem } from "react-aria-components";
import { Size } from "react-aria-components/Virtualizer";

const gridItems = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Card ${i + 1}`,
  hue: (i * 47) % 360,
}));

export default function VirtualizerGrid() {
  return (
    <Virtualizer
      layout={GridLayout}
      layoutOptions={{ minItemSize: new Size(140, 140), minSpace: new Size(12, 12) }}
    >
      <AriaGridList
        layout="grid"
        aria-label="Virtualized grid"
        items={gridItems}
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
          <GridListItem
            textValue={item.title}
            style={{
              height: "100%",
              minHeight: 0,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "flex-end",
              padding: 8,
              borderRadius: "var(--wsu-radius-sm)",
              background: `hsl(${item.hue} 70% 92%)`,
              font: "var(--wsu-font-body-sm-semibold)",
              color: "var(--wsu-color-text-heading)",
            }}
          >
            {item.title}
          </GridListItem>
        )}
      </AriaGridList>
    </Virtualizer>
  );
}
