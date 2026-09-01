import { useState } from "react";
import type { Key, Selection, SortDescriptor } from "react-aria-components";
import {
  Badge,
  Button,
  Cell,
  Checkbox,
  CheckboxGroup,
  Column,
  Row,
  SearchField,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";
import type { BadgeSeverity } from "@your-job-search-genius/odyssey-ui";

interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: string;
  score: number;
  applied: string;
  location: string;
  salary: number;
}

const candidates: Candidate[] = [
  { id: "s1", name: "Alex Chen", role: "Frontend Engineer", stage: "Interview", score: 92, applied: "Mar 3, 2026", location: "Lahore", salary: 145000 },
  { id: "s2", name: "Jordan Lee", role: "Product Designer", stage: "Screening", score: 87, applied: "Mar 7, 2026", location: "Remote", salary: 120000 },
  { id: "s3", name: "Sam Patel", role: "Backend Engineer", stage: "Offer", score: 74, applied: "Feb 24, 2026", location: "Karachi", salary: 138000 },
  { id: "s4", name: "Riley Novak", role: "Data Analyst", stage: "Applied", score: 81, applied: "Mar 11, 2026", location: "Remote", salary: 98000 },
  { id: "s5", name: "Casey Morgan", role: "Engineering Manager", stage: "Interview", score: 95, applied: "Feb 18, 2026", location: "Islamabad", salary: 185000 },
  { id: "s6", name: "Devon Brooks", role: "QA Engineer", stage: "Screening", score: 78, applied: "Mar 1, 2026", location: "Lahore", salary: 88000 },
  { id: "s7", name: "Morgan Reyes", role: "DevOps Engineer", stage: "Interview", score: 90, applied: "Feb 27, 2026", location: "Remote", salary: 152000 },
  { id: "s8", name: "Taylor Kim", role: "Frontend Engineer", stage: "Applied", score: 69, applied: "Mar 14, 2026", location: "Karachi", salary: 105000 },
  { id: "s9", name: "Jamie Fox", role: "Product Designer", stage: "Offer", score: 88, applied: "Feb 21, 2026", location: "Lahore", salary: 125000 },
  { id: "s10", name: "Robin Shah", role: "Backend Engineer", stage: "Screening", score: 83, applied: "Mar 9, 2026", location: "Remote", salary: 132000 },
];

const columns = [
  { id: "name", name: "Candidate", always: true },
  { id: "role", name: "Role" },
  { id: "location", name: "Location" },
  { id: "stage", name: "Stage" },
  { id: "score", name: "Match" },
  { id: "salary", name: "Expected salary" },
];

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const scoreSeverity = (score: number): BadgeSeverity => (score >= 90 ? "excellent" : score >= 80 ? "good" : "fair");

export default function TableAdvancedShowcase() {
  const [rows, setRows] = useState(candidates);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(columns.map((c) => c.id));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "score", direction: "descending" });
  const [selected, setSelected] = useState<Selection>(new Set());

  const visibleColumns = columns.filter((c) => visible.includes(c.id));
  const q = query.trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) => [r.name, r.role, r.location, r.stage].some((v) => v.toLowerCase().includes(q)))
    : rows;
  const sorted = [...filtered].sort((a, b) => {
    const first = a[sortDescriptor.column as keyof Candidate];
    const second = b[sortDescriptor.column as keyof Candidate];
    const cmp = first < second ? -1 : first > second ? 1 : 0;
    return sortDescriptor.direction === "descending" ? -cmp : cmp;
  });

  const selectedCount = selected === "all" ? filtered.length : selected.size;
  const removeSelected = () => {
    setRows((prev) =>
      prev.filter((r) => (selected === "all" ? !filtered.some((f) => f.id === r.id) : !(selected as Set<Key>).has(r.id))),
    );
    setSelected(new Set());
  };

  const cellFor = (column: (typeof columns)[number], item: Candidate) => {
    switch (column.id) {
      case "stage":
        return (
          <Cell stackLabel="Stage">
            <Badge
              type="soft"
              severity={item.stage === "Offer" ? "excellent" : item.stage === "Interview" ? "good" : item.stage === "Screening" ? "fair" : "poor"}
            >
              {item.stage}
            </Badge>
          </Cell>
        );
      case "score":
        return (
          <Cell stackLabel="Match" align="end" textValue={String(item.score)}>
            <Badge severity={scoreSeverity(item.score)}>{item.score}</Badge>
          </Cell>
        );
      case "salary":
        return (
          <Cell stackLabel="Expected salary" align="end">
            {usd(item.salary)}
          </Cell>
        );
      default:
        return <Cell stackLabel={column.name}>{String(item[column.id as keyof Candidate])}</Cell>;
    }
  };

  return (
    <div style={{ display: "grid", gap: "var(--wsu-space-3)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--wsu-space-3)", alignItems: "end", justifyContent: "space-between" }}>
        <SearchField
          label="Search candidates"
          hideLabel
          placeholder="Search candidates"
          value={query}
          onChange={setQuery}
          style={{ minWidth: "16rem" }}
        />
        <CheckboxGroup
          label="Columns"
          value={visible}
          onChange={(next) => setVisible(["name", ...next.filter((v) => v !== "name")])}
          orientation="horizontal"
        >
          {columns
            .filter((c) => !c.always)
            .map((c) => (
              <Checkbox key={c.id} label={c.name} value={c.id} />
            ))}
        </CheckboxGroup>
      </div>

      {selectedCount > 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--wsu-space-3)",
            padding: "var(--wsu-space-2) var(--wsu-space-3)",
            background: "var(--wsu-color-surface-accent)",
            borderRadius: "var(--wsu-radius-md)",
            font: "var(--wsu-font-body-sm)",
          }}
        >
          <strong>{selectedCount} selected</strong>
          <Button size="sm" variant="secondary" onClick={removeSelected}>
            Remove
          </Button>
          <Button size="sm" variant="text" onClick={() => setSelected(new Set())}>
            Clear selection
          </Button>
        </div>
      ) : null}

      <TableContainer maxHeight="22rem">
        <Table
          aria-label="Candidate pipeline"
          striped
          stacked
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={visibleColumns} dependencies={[visibleColumns]}>
            {(column) => (
              <Column
                id={column.id}
                isRowHeader={column.id === "name"}
                allowsSorting
                align={column.id === "score" || column.id === "salary" ? "end" : "start"}
              >
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody
            items={sorted}
            dependencies={[visibleColumns]}
            renderEmptyState={() => (
              <span style={{ display: "block", padding: "var(--wsu-space-8)" }}>No candidates match “{query}”.</span>
            )}
          >
            {(item) => <Row columns={visibleColumns}>{(column) => cellFor(column, item)}</Row>}
          </TableBody>
          <TableFooter>
            <Row>
              <Cell colSpan={visibleColumns.length}>
                {sorted.length} of {rows.length} candidates
              </Cell>
            </Row>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Live result count so filtering is announced without moving focus (WCAG 4.1.3). */}
      <p role="status" style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-meta)", margin: 0 }}>
        Showing {sorted.length} of {rows.length} candidates
      </p>
    </div>
  );
}
