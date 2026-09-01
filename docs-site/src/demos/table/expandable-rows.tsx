import { useState } from "react";
import { Collection } from "react-aria-components";
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

interface FileNode {
  id: string;
  title: string;
  type: string;
  date: string;
  children: FileNode[];
}

const fileTree: FileNode[] = [
  {
    id: "1",
    title: "Application materials",
    type: "Folder",
    date: "Mar 2, 2026",
    children: [
      {
        id: "2",
        title: "Acme Corp",
        type: "Folder",
        date: "Feb 20, 2026",
        children: [
          { id: "3", title: "Tailored resume", type: "PDF", date: "Feb 19, 2026", children: [] },
          { id: "4", title: "Cover letter", type: "Document", date: "Feb 20, 2026", children: [] },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Interview prep",
    type: "Folder",
    date: "Mar 9, 2026",
    children: [
      { id: "6", title: "System design notes", type: "Document", date: "Mar 5, 2026", children: [] },
      { id: "7", title: "Behavioral answers", type: "Document", date: "Mar 9, 2026", children: [] },
    ],
  },
];

export default function TableExpandableRows() {
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(["1"]));

  return (
    <TableContainer>
      {/* `treeColumn` upgrades the grid to a treegrid; the chevron button in
          that column's cells is rendered by `Cell` automatically. */}
      <Table aria-label="Documents" treeColumn="name" expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="type">Type</Column>
          <Column id="date">Modified</Column>
        </TableHeader>
        <TableBody items={fileTree}>
          {function renderItem(item: FileNode) {
            return (
              <Row id={item.id}>
                <Cell>{item.title}</Cell>
                <Cell>{item.type}</Cell>
                <Cell>{item.date}</Cell>
                <Collection items={item.children}>{renderItem}</Collection>
              </Row>
            );
          }}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
