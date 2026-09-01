import { useState } from "react";
import type { Key } from "react-aria-components";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableContainer,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";
import type { ColumnSize } from "@your-job-search-genius/odyssey-ui";

const WIDTHS_STORAGE_KEY = "wsu-table-demo-widths";

const resizeColumns = [
  { id: "file", name: "File name" },
  { id: "size", name: "Size" },
  { id: "date", name: "Date modified" },
];

const resizeRows = [
  { id: 1, name: "2026 job search strategy and target company research (long file name)", date: "Feb 27, 2026 at 4:56 PM", size: "214 KB" },
  { id: 2, name: "Salary benchmarks", date: "Jan 27, 2026 at 1:56 AM", size: "14 MB" },
  { id: 3, name: "Referral email template", date: "Feb 24, 2026 at 2:48 PM", size: "20 KB" },
  { id: 4, name: "Offer comparison", date: "Mar 30, 2026", size: "139 KB" },
];

// Drag the divider between headers, or focus a resizer and use the arrow
// keys; widths are written to localStorage so they survive a reload.
export default function TableColumnResizing() {
  const [widths, setWidths] = useState<Map<Key, ColumnSize>>(() => {
    try {
      const raw = localStorage.getItem(WIDTHS_STORAGE_KEY);
      if (raw) return new Map(JSON.parse(raw));
    } catch {
      /* corrupted storage — fall back to defaults */
    }
    return new Map<Key, ColumnSize>([
      ["file", "2fr"],
      ["size", 90],
      ["date", "1fr"],
    ]);
  });

  return (
    <TableContainer
      resizable
      onResize={(next) => setWidths(new Map(next))}
      onResizeEnd={(next) => localStorage.setItem(WIDTHS_STORAGE_KEY, JSON.stringify([...next]))}
    >
      <Table aria-label="Files with resizable columns">
        <TableHeader columns={resizeColumns} dependencies={[widths]}>
          {(column) => (
            <Column id={column.id} isRowHeader={column.id === "file"} allowsResizing width={widths.get(column.id)}>
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={resizeRows}>
          {(item) => (
            <Row>
              <Cell>{item.name}</Cell>
              <Cell>{item.size}</Cell>
              <Cell>{item.date}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
