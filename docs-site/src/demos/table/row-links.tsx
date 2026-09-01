import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableContainer,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";

export default function TableRowLinks() {
  return (
    <TableContainer>
      <Table aria-label="Saved job boards">
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="url">URL</Column>
        </TableHeader>
        <TableBody>
          <Row id="wellfound" href="https://wellfound.com/" target="_blank" rel="noreferrer">
            <Cell>Wellfound</Cell>
            <Cell>https://wellfound.com/</Cell>
          </Row>
          <Row id="linkedin" href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer">
            <Cell>LinkedIn Jobs</Cell>
            <Cell>https://www.linkedin.com/jobs/</Cell>
          </Row>
          <Row id="otta" href="https://otta.com/" target="_blank" rel="noreferrer">
            <Cell>Otta</Cell>
            <Cell>https://otta.com/</Cell>
          </Row>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
