import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableContainer,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";

const applicants = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", stage: "Interview", applied: "Mar 3, 2026" },
  { id: "2", name: "Jordan Lee", role: "Product Designer", stage: "Screening", applied: "Mar 7, 2026" },
  { id: "3", name: "Sam Patel", role: "Backend Engineer", stage: "Offer", applied: "Feb 24, 2026" },
  { id: "4", name: "Riley Novak", role: "Data Analyst", stage: "Applied", applied: "Mar 11, 2026" },
];

export default function TableBasic() {
  return (
    <TableContainer>
      <Table aria-label="Applicants">
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="role">Role</Column>
          <Column id="stage">Stage</Column>
          <Column id="applied">Applied</Column>
        </TableHeader>
        <TableBody items={applicants}>
          {(item) => (
            <Row>
              <Cell>{item.name}</Cell>
              <Cell>{item.role}</Cell>
              <Cell>{item.stage}</Cell>
              <Cell>{item.applied}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
