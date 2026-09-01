import {
  Badge,
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableContainer,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";
import type { BadgeSeverity } from "@your-job-search-genius/odyssey-ui";

interface Applicant {
  id: string;
  name: string;
  role: string;
  stage: string;
  score: number;
}

const applicants: Applicant[] = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", stage: "Interview", score: 92 },
  { id: "2", name: "Jordan Lee", role: "Product Designer", stage: "Screening", score: 87 },
  { id: "3", name: "Sam Patel", role: "Backend Engineer", stage: "Offer", score: 74 },
];

const scoreSeverity = (score: number): BadgeSeverity => (score >= 90 ? "excellent" : score >= 80 ? "good" : "fair");

export default function TableStackedResponsive() {
  return (
    <div style={{ maxWidth: "22rem" }}>
      {/* Below a 40rem container width, `stacked` collapses each row into a
          labelled card (a container query on TableContainer — no page
          breakpoint). `stackLabel` repeats the column name per cell; screen
          readers keep the real column headers either way. */}
      <TableContainer>
        <Table aria-label="Applicants" stacked>
          <TableHeader>
            <Column id="name" isRowHeader>
              Name
            </Column>
            <Column id="role">Role</Column>
            <Column id="stage">Stage</Column>
            <Column id="score">Score</Column>
          </TableHeader>
          <TableBody items={applicants}>
            {(item) => (
              <Row>
                <Cell stackLabel="Name">{item.name}</Cell>
                <Cell stackLabel="Role">{item.role}</Cell>
                <Cell stackLabel="Stage">{item.stage}</Cell>
                <Cell stackLabel="Score">
                  <Badge severity={scoreSeverity(item.score)}>{item.score}</Badge>
                </Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
