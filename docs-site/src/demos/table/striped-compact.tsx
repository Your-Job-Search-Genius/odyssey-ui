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
  score: number;
}

const applicants: Applicant[] = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", score: 92 },
  { id: "2", name: "Jordan Lee", role: "Product Designer", score: 87 },
  { id: "3", name: "Sam Patel", role: "Backend Engineer", score: 74 },
  { id: "4", name: "Riley Novak", role: "Data Analyst", score: 81 },
];

export default function TableStripedCompact() {
  return (
    <TableContainer>
      <Table aria-label="Applicants" striped density="compact">
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="role">Role</Column>
          <Column id="score" align="end">
            Score
          </Column>
        </TableHeader>
        <TableBody items={applicants}>
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
