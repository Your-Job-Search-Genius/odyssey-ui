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
import type { SortDescriptor } from "react-aria-components";

interface Applicant {
  id: string;
  name: string;
  role: string;
  score: number;
}

const applicants: Applicant[] = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", score: 92 },
  { id: "2", name: "Jordan Lee", role: "Product Designer", score: 87 },
  { id: "3", name: "Sam Patel", role: "Backend Engineer", score: 74 },
  { id: "4", name: "Riley Novak", role: "Data Analyst", score: 81 },
];

export default function TableSorting() {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "score",
    direction: "descending",
  });
  const sorted = [...applicants].sort((a, b) => {
    const first = a[sortDescriptor.column as keyof Applicant];
    const second = b[sortDescriptor.column as keyof Applicant];
    const cmp = first < second ? -1 : first > second ? 1 : 0;
    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });

  return (
    <TableContainer>
      <Table
        aria-label="Applicants"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <Column id="name" isRowHeader allowsSorting>
            Name
          </Column>
          <Column id="role" allowsSorting>
            Role
          </Column>
          <Column id="score" align="end" allowsSorting>
            Score
          </Column>
        </TableHeader>
        <TableBody items={sorted}>
          {(item) => (
            <Row>
              <Cell>{item.name}</Cell>
              <Cell>{item.role}</Cell>
              <Cell align="end">{item.score}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
