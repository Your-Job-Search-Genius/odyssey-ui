import { useState } from "react";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableContainer,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";
import type { Key, Selection } from "react-aria-components";

const applicants = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", stage: "Interview" },
  { id: "2", name: "Jordan Lee", role: "Product Designer", stage: "Screening" },
  { id: "3", name: "Sam Patel", role: "Backend Engineer", stage: "Offer" },
  { id: "4", name: "Riley Novak", role: "Data Analyst", stage: "Applied" },
];

export default function TableSelection() {
  const [selected, setSelected] = useState<Selection>(new Set());
  const [lastAction, setLastAction] = useState<Key | null>(null);

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <TableContainer>
        <Table
          aria-label="Applicants"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
          disabledKeys={["3"]}
          onRowAction={setLastAction}
        >
          <TableHeader>
            <Column id="name" isRowHeader>
              Name
            </Column>
            <Column id="role">Role</Column>
            <Column id="stage">Stage</Column>
          </TableHeader>
          <TableBody items={applicants}>
            {(item) => (
              <Row>
                <Cell>{item.name}</Cell>
                <Cell>{item.role}</Cell>
                <Cell>{item.stage}</Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <p role="status" style={{ margin: 0, fontSize: "0.875rem" }}>
        {selected === "all"
          ? "All rows selected"
          : `${selected.size} selected`}
        {lastAction
          ? ` — opened ${applicants.find((a) => a.id === lastAction)?.name}`
          : ""}
      </p>
    </div>
  );
}
