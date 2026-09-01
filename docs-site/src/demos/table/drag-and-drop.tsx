import { useDragAndDrop, useListData } from "react-aria-components";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableContainer,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";

interface Applicant {
  id: string;
  name: string;
  role: string;
  stage: string;
}

const applicants: Applicant[] = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", stage: "Interview" },
  { id: "2", name: "Jordan Lee", role: "Product Designer", stage: "Screening" },
  { id: "3", name: "Sam Patel", role: "Backend Engineer", stage: "Offer" },
  { id: "4", name: "Riley Novak", role: "Data Analyst", stage: "Applied" },
  { id: "5", name: "Casey Morgan", role: "Engineering Manager", stage: "Interview" },
];

export default function TableDragAndDrop() {
  const list = useListData({ initialItems: applicants });
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": list.getItem(key)?.name ?? String(key) })),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
    },
  });

  return (
    <TableContainer>
      {/* Reorder via mouse/touch, or keyboard + screen reader: focus a drag
          handle, press Enter, move with arrows, Enter to drop. */}
      <Table aria-label="Interview schedule" selectionMode="multiple" dragAndDropHooks={dragAndDropHooks}>
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="role">Role</Column>
          <Column id="stage">Stage</Column>
        </TableHeader>
        <TableBody items={list.items}>
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
  );
}
