import {
  Column,
  Table,
  TableBody,
  TableContainer,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";

export default function TableEmptyState() {
  return (
    <TableContainer>
      <Table aria-label="Search results">
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="role">Role</Column>
        </TableHeader>
        <TableBody
          renderEmptyState={() => (
            <span style={{ display: "block", padding: "var(--wsu-space-8)" }}>
              No results found.
            </span>
          )}
        >
          {[]}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
