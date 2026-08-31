import { Badge, DataTable } from "@your-job-search-genius/odyssey-ui";
import type { BadgeSeverity, TableColumn } from "@your-job-search-genius/odyssey-ui";

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

const scoreSeverity = (score: number): BadgeSeverity =>
  score >= 90 ? "excellent" : score >= 80 ? "good" : "fair";

const columns: TableColumn<Applicant>[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  {
    key: "score",
    label: "Match score",
    sortable: true,
    align: "end",
    render: (row) => <Badge severity={scoreSeverity(row.score)}>{row.score}</Badge>,
  },
];

export default function TableDataTable() {
  return (
    <DataTable
      aria-label="Applicants"
      columns={columns}
      rows={applicants}
      searchable
      searchLabel="Search applicants"
      renderEmptyState={() => "No results found."}
    />
  );
}
