import { TableLayout, Virtualizer } from "@your-job-search-genius/odyssey-ui";
import {
  Cell,
  Column,
  Row,
  Table as AriaTable,
  TableBody,
  TableHeader,
} from "react-aria-components";

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

export default function VirtualizerTable() {
  return (
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
  );
}
