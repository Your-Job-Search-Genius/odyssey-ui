import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import {
  ListBox as AriaListBox,
  ListBoxItem,
  GridList as AriaGridList,
  GridListItem,
  Table as AriaTable,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
} from "react-aria-components";
import { Size } from "react-aria-components/Virtualizer";
import { Virtualizer, ListLayout, GridLayout, TableLayout } from "./Virtualizer";
import "../Select/popover-menu.css";

const meta: Meta<typeof Virtualizer> = {
  title: "Custom Components/Virtualizer",
  component: Virtualizer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' `Virtualizer` — a behavior-only wrapper, no visual style or DOM chrome of its own, that windows a large collection to only the rows currently scrolled into view. **Use when:** a `ListBox`, `GridList`, or `Table` needs to hold thousands of rows without the DOM growing with them. **Don't use when:** the collection is small (tens of rows) — the windowing overhead isn't worth it below roughly a hundred items. The rows below are styled with this library's existing `.wsu-ListBoxItem`/row tokens for visual consistency, but compose raw `react-aria-components` collection primitives rather than this package's `ListBox`/`GridList`/`Table` wrappers: those wrappers own their scrollable root's CSS (padding, gap, a fixed `max-height`), and `Virtualizer` positions every item with a transform computed by its `Layout` object — authored CSS padding on that same element would desync from that math (a plain inline `style.padding` gets reset for exactly this reason; a class-based one can't be). Spacing is passed as `layoutOptions.gap`/`padding` instead.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Virtualizer>;

const listItems = Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `Item ${i + 1}` }));

export const VirtualizedList: Story = {
  name: "List layout (5,000 rows)",
  render: () => (
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
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Only the rows scrolled into view exist in the DOM — never all 5,000.
    expect(canvas.getAllByRole("option").length).toBeLessThan(50);
  },
};

const gridItems = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Card ${i + 1}`,
  hue: (i * 47) % 360,
}));

export const VirtualizedGrid: Story = {
  name: "Grid layout (1,000 cards)",
  render: () => (
    <Virtualizer layout={GridLayout} layoutOptions={{ minItemSize: new Size(140, 140), minSpace: new Size(12, 12) }}>
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
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("row").length).toBeLessThan(100);
  },
};

interface TableRow {
  id: number;
  foo: string;
  bar: string;
  baz: string;
}
const tableRows: TableRow[] = Array.from({ length: 2000 }, (_, i) => ({
  id: i,
  foo: `Foo ${i + 1}`,
  bar: `Bar ${i + 1}`,
  baz: `Baz ${i + 1}`,
}));

export const VirtualizedTable: Story = {
  name: "Table layout (2,000 rows)",
  render: () => (
    <Virtualizer layout={TableLayout} layoutOptions={{ rowHeight: 40 }}>
      <AriaTable
        aria-label="Virtualized table"
        style={{
          width: "100%",
          height: 320,
          overflow: "auto",
          boxSizing: "border-box",
          border: "0.75px solid var(--wsu-color-border-default)",
          borderRadius: "var(--wsu-radius-md)",
          boxShadow: "var(--wsu-shadow-sm)",
          outline: "none",
          scrollPaddingTop: 40,
        }}
      >
        <TableHeader
          style={{
            height: "100%",
            background: "var(--wsu-color-surface-subtle)",
            font: "var(--wsu-font-body-sm-semibold)",
            color: "var(--wsu-color-text-heading)",
          }}
        >
          <Column isRowHeader style={{ padding: 8 }}>
            Foo
          </Column>
          <Column style={{ padding: 8 }}>Bar</Column>
          <Column style={{ padding: 8 }}>Baz</Column>
        </TableHeader>
        <TableBody items={tableRows}>
          {(row) => (
            <Row style={{ width: "inherit", height: "100%" }}>
              <Cell style={{ padding: 8 }}>{row.foo}</Cell>
              <Cell style={{ padding: 8 }}>{row.bar}</Cell>
              <Cell style={{ padding: 8 }}>{row.baz}</Cell>
            </Row>
          )}
        </TableBody>
      </AriaTable>
    </Virtualizer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("row").length).toBeLessThan(50);
  },
};
