import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useEffect, useRef, useState } from "react";
import { Collection, useDragAndDrop, useListData } from "react-aria-components";
import type { Key, Selection, SortDescriptor } from "react-aria-components";
import type { ColumnSize } from "./Table";
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  TableLoadMoreItem,
  Column,
  Row,
  Cell,
  DataTable,
} from "./Table";
import type { TableColumn } from "./Table";
import { Badge } from "../Badge";
import type { BadgeSeverity } from "../Badge";
import { Button } from "../Button";
import { Checkbox, CheckboxGroup } from "../Checkbox";
import { Input } from "../Input";
import { SearchField } from "../SearchField";
import { Spinner } from "../Spinner";

/* ------------------------------------------------------------------ data */

interface Applicant {
  id: string;
  name: string;
  role: string;
  stage: string;
  score: number;
  applied: string;
}

const applicants: Applicant[] = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", stage: "Interview", score: 92, applied: "Mar 3, 2026" },
  { id: "2", name: "Jordan Lee", role: "Product Designer", stage: "Screening", score: 87, applied: "Mar 7, 2026" },
  { id: "3", name: "Sam Patel", role: "Backend Engineer", stage: "Offer", score: 74, applied: "Feb 24, 2026" },
  { id: "4", name: "Riley Novak", role: "Data Analyst", stage: "Applied", score: 81, applied: "Mar 11, 2026" },
  { id: "5", name: "Casey Morgan", role: "Engineering Manager", stage: "Interview", score: 95, applied: "Feb 18, 2026" },
];

const scoreSeverity = (score: number): BadgeSeverity => (score >= 90 ? "excellent" : score >= 80 ? "good" : "fair");

/* ------------------------------------------------------------------ meta */

const meta: Meta<typeof Table> = {
  title: "Custom Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' Table — an ARIA `grid` (or `treegrid` with expandable rows) with arrow-key cell navigation, `aria-sort` on sortable columns, accessible selection checkboxes, keyboard-operable column resizing and drag-and-drop. Composable parts (`TableContainer`, `Table`, `TableHeader`, `Column`, `TableBody`, `Row`, `Cell`, `TableFooter`, `TableLoadMoreItem`) mirror React Aria's own API; `DataTable` keeps the previous columns/rows convenience layer. Wide tables scroll inside `TableContainer` rather than breaking page reflow at 320px (WCAG 1.4.10), and `<Table stacked>` collapses to labelled cards below a 40rem container width.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

/* ------------------------------------------------------------- 1. basics */

export const Playground: Story = {
  render: () => (
    <TableContainer>
      <Table aria-label="Applicants">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
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
  ),
};

export const StripedAndCompact: Story = {
  name: "Striped + compact density",
  render: () => (
    <TableContainer>
      <Table aria-label="Applicants" striped density="compact">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
          <Column id="role">Role</Column>
          <Column id="score" align="end">Score</Column>
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
  ),
};

/* ------------------------------------------------------------ 2. sorting */

export const Sorting: Story = {
  render: function SortingStory() {
    function Demo() {
      const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "score", direction: "descending" });
      const sorted = [...applicants].sort((a, b) => {
        const first = a[sortDescriptor.column as keyof Applicant];
        const second = b[sortDescriptor.column as keyof Applicant];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
      return (
        <TableContainer>
          <Table aria-label="Applicants" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
            <TableHeader>
              <Column id="name" isRowHeader allowsSorting>Name</Column>
              <Column id="role" allowsSorting>Role</Column>
              <Column id="score" align="end" allowsSorting>Score</Column>
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
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // React Aria wires aria-sort itself; clicking the header flips direction.
    const score = canvas.getByRole("columnheader", { name: /Score/ });
    await expect(score).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(within(score).getByText("Score"));
    await expect(score).toHaveAttribute("aria-sort", "ascending");
  },
};

/* ---------------------------------------------------------- 3. selection */

export const SelectionAndActions: Story = {
  name: "Selection, disabled rows + row actions",
  render: function SelectionStory() {
    function Demo() {
      const [selected, setSelected] = useState<Selection>(new Set());
      const [lastAction, setLastAction] = useState<Key | null>(null);
      return (
        <div style={{ display: "grid", gap: "var(--wsu-space-2)" }}>
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
                <Column id="name" isRowHeader>Name</Column>
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
          <p role="status" style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-meta)", margin: 0 }}>
            {selected === "all" ? "All rows selected" : `${selected.size} selected`}
            {lastAction ? ` — opened ${applicants.find((a) => a.id === lastAction)?.name}` : ""}
          </p>
        </div>
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: /select all/i }));
    // The disabled row is skipped by select-all, so it reports "all" minus it.
    await expect(canvas.getByRole("status")).toHaveTextContent(/All rows selected/);
  },
};

/* -------------------------------------------------------------- 4. links */

export const RowLinks: Story = {
  name: "Rows as links",
  render: () => (
    <TableContainer>
      <Table aria-label="Saved job boards">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
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
  ),
};

/* -------------------------------------------------------- 5. empty state */

export const EmptyState: Story = {
  render: () => (
    <TableContainer>
      <Table aria-label="Search results">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
          <Column id="role">Role</Column>
        </TableHeader>
        <TableBody renderEmptyState={() => <span style={{ display: "block", padding: "var(--wsu-space-8)" }}>No results found.</span>}>
          {[]}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

/* --------------------------------------- 6. dynamic columns/rows + footer */

const invoiceColumns = [
  { name: "Title", id: "title", isRowHeader: true },
  { name: "Status", id: "status" },
  { name: "Payment method", id: "paymentMethod" },
  { name: "Price", id: "price" },
];

interface Invoice {
  id: number;
  title: string;
  status: string;
  paymentMethod: string;
  price: number;
  [key: string]: unknown;
}

const initialInvoices: Invoice[] = [
  { id: 1, title: "Resume rewrite", status: "Paid", paymentMethod: "Credit card", price: 1200 },
  { id: 2, title: "Portfolio review", status: "Pending", paymentMethod: "PayPal", price: 350 },
  { id: 3, title: "Mock interview", status: "Overdue", paymentMethod: "Bank transfer", price: 800 },
  { id: 4, title: "LinkedIn audit", status: "Paid", paymentMethod: "Debit card", price: 450 },
];

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const DynamicContent: Story = {
  name: "Dynamic columns, rows + footer totals",
  render: function DynamicStory() {
    function Demo() {
      const [showColumns, setShowColumns] = useState(["title", "status", "paymentMethod", "price"]);
      const visibleColumns = invoiceColumns.filter((column) => showColumns.includes(column.id));
      const [rows, setRows] = useState(initialInvoices);
      const addRow = () =>
        setRows((prev) => [
          ...prev,
          { id: prev.length + 1, title: "New invoice", status: "Pending", paymentMethod: "Credit card", price: 250 },
        ]);

      return (
        <div style={{ display: "grid", gap: "var(--wsu-space-3)", justifyItems: "start" }}>
          <CheckboxGroup label="Show columns" value={showColumns} onChange={setShowColumns} orientation="horizontal">
            <Checkbox label="Status" value="status" />
            <Checkbox label="Payment method" value="paymentMethod" />
          </CheckboxGroup>
          <TableContainer style={{ width: "100%" }}>
            <Table aria-label="Invoices">
              <TableHeader columns={visibleColumns}>
                {(column) => (
                  <Column id={column.id} isRowHeader={column.isRowHeader} align={column.id === "price" ? "end" : "start"}>
                    {column.name}
                  </Column>
                )}
              </TableHeader>
              {/* `dependencies` invalidates the memoized rows when the visible columns change. */}
              <TableBody items={rows} dependencies={[visibleColumns]}>
                {(item) => (
                  <Row columns={visibleColumns}>
                    {(column) => (
                      <Cell align={column.id === "price" ? "end" : "start"}>
                        {column.id === "price" ? usd(item.price) : String(item[column.id])}
                      </Cell>
                    )}
                  </Row>
                )}
              </TableBody>
              <TableFooter>
                <Row>
                  <Cell colSpan={visibleColumns.length - 1}>Total</Cell>
                  <Cell align="end">{usd(rows.reduce((sum, row) => sum + row.price, 0))}</Cell>
                </Row>
              </TableFooter>
            </Table>
          </TableContainer>
          <Button size="sm" variant="secondary" onClick={addRow}>
            Add row
          </Button>
        </div>
      );
    }
    return <Demo />;
  },
};

/* ---------------------------------------------------- 7. expandable rows */

interface FileNode {
  id: string;
  title: string;
  type: string;
  date: string;
  children: FileNode[];
}

const fileTree: FileNode[] = [
  {
    id: "1",
    title: "Application materials",
    type: "Folder",
    date: "Mar 2, 2026",
    children: [
      {
        id: "2",
        title: "Acme Corp",
        type: "Folder",
        date: "Feb 20, 2026",
        children: [
          { id: "3", title: "Tailored resume", type: "PDF", date: "Feb 19, 2026", children: [] },
          { id: "4", title: "Cover letter", type: "Document", date: "Feb 20, 2026", children: [] },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Interview prep",
    type: "Folder",
    date: "Mar 9, 2026",
    children: [
      { id: "6", title: "System design notes", type: "Document", date: "Mar 5, 2026", children: [] },
      { id: "7", title: "Behavioral answers", type: "Document", date: "Mar 9, 2026", children: [] },
    ],
  },
];

export const ExpandableRows: Story = {
  name: "Expandable (tree) rows",
  render: function ExpandableStory() {
    function Demo() {
      const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(["1"]));
      return (
        <TableContainer>
          {/* `treeColumn` upgrades the grid to a treegrid; the chevron button
              in that column's cells is rendered by `Cell` automatically. */}
          <Table aria-label="Documents" treeColumn="name" expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
            <TableHeader>
              <Column id="name" isRowHeader>Name</Column>
              <Column id="type">Type</Column>
              <Column id="date">Modified</Column>
            </TableHeader>
            <TableBody items={fileTree}>
              {function renderItem(item: FileNode) {
                return (
                  <Row id={item.id}>
                    <Cell>{item.title}</Cell>
                    <Cell>{item.type}</Cell>
                    <Cell>{item.date}</Cell>
                    <Collection items={item.children}>{renderItem}</Collection>
                  </Row>
                );
              }}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    return <Demo />;
  },
};

/* ------------------------------------- 8. async loading + infinite scroll */

function makeCandidates(page: number): Applicant[] {
  const roles = ["Frontend Engineer", "Product Designer", "Backend Engineer", "Data Analyst", "QA Engineer", "DevOps Engineer"];
  const stages = ["Applied", "Screening", "Interview", "Offer"];
  return Array.from({ length: 10 }, (_, i) => {
    const n = page * 10 + i + 1;
    return {
      id: `c${n}`,
      name: `Candidate ${n}`,
      role: roles[n % roles.length]!,
      stage: stages[n % stages.length]!,
      score: 60 + ((n * 7) % 40),
      applied: `Mar ${(n % 28) + 1}, 2026`,
    };
  });
}

export const AsyncLoading: Story = {
  name: "Async loading + infinite scroll",
  render: function AsyncStory() {
    function Demo() {
      const [items, setItems] = useState<Applicant[]>([]);
      const [loadingState, setLoadingState] = useState<"loading" | "loadingMore" | "idle">("loading");
      const pageRef = useRef(0);
      const pendingRef = useRef(false);
      const load = () => {
        if (pendingRef.current || pageRef.current >= 4) return; // pretend the data set has 4 pages
        pendingRef.current = true;
        setLoadingState(pageRef.current === 0 ? "loading" : "loadingMore");
        setTimeout(() => {
          setItems((prev) => [...prev, ...makeCandidates(pageRef.current)]);
          pageRef.current += 1;
          pendingRef.current = false;
          setLoadingState("idle");
        }, 700);
      };
      // initial page — the sentinel only fires once there are rows to scroll past
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(() => load(), []);
      return (
        <TableContainer maxHeight="18rem">
          <Table aria-label="Candidates">
            <TableHeader>
              <Column id="name" isRowHeader>Name</Column>
              <Column id="role">Role</Column>
              <Column id="stage">Stage</Column>
            </TableHeader>
            <TableBody
              renderEmptyState={() => (
                <span style={{ display: "flex", justifyContent: "center", padding: "var(--wsu-space-8)" }}>
                  <Spinner label="Loading candidates" />
                </span>
              )}
            >
              <Collection items={items}>
                {(item) => (
                  <Row>
                    <Cell>{item.name}</Cell>
                    <Cell>{item.role}</Cell>
                    <Cell>{item.stage}</Cell>
                  </Row>
                )}
              </Collection>
              {/* Sentinel row: fires onLoadMore as it scrolls into view. */}
              <TableLoadMoreItem onLoadMore={load} isLoading={loadingState === "loadingMore"} />
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    return <Demo />;
  },
};

/* ----------------------------------------------------- 9. column resizing */

const resizeRows = [
  { id: 1, name: "2026 job search strategy and target company research (long file name)", date: "Feb 27, 2026 at 4:56 PM", size: "214 KB" },
  { id: 2, name: "Salary benchmarks", date: "Jan 27, 2026 at 1:56 AM", size: "14 MB" },
  { id: 3, name: "Referral email template", date: "Feb 24, 2026 at 2:48 PM", size: "20 KB" },
  { id: 4, name: "Offer comparison", date: "Mar 30, 2026", size: "139 KB" },
];

export const ColumnResizing: Story = {
  render: () => (
    <TableContainer resizable>
      <Table aria-label="Files with resizable columns">
        <TableHeader>
          <Column id="file" isRowHeader allowsResizing maxWidth={500}>File name</Column>
          <Column id="size" allowsResizing defaultWidth={90}>Size</Column>
          <Column id="date" minWidth={120}>Date modified</Column>
        </TableHeader>
        <TableBody items={resizeRows}>
          {(item) => (
            <Row>
              <Cell>{item.name}</Cell>
              <Cell>{item.size}</Cell>
              <Cell>{item.date}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

const WIDTHS_STORAGE_KEY = "wsu-table-story-widths";
const resizeColumns = [
  { id: "file", name: "File name" },
  { id: "size", name: "Size" },
  { id: "date", name: "Date modified" },
];

export const PersistedColumnWidths: Story = {
  name: "Column resizing (widths persisted)",
  render: function PersistedStory() {
    function Demo() {
      const [widths, setWidths] = useState<Map<Key, ColumnSize>>(() => {
        try {
          const raw = localStorage.getItem(WIDTHS_STORAGE_KEY);
          if (raw) return new Map(JSON.parse(raw));
        } catch {
          /* corrupted storage — fall back to defaults */
        }
        return new Map<Key, ColumnSize>([
          ["file", "2fr"],
          ["size", 90],
          ["date", "1fr"],
        ]);
      });
      return (
        <TableContainer
          resizable
          onResize={(next) => setWidths(new Map(next))}
          onResizeEnd={(next) => localStorage.setItem(WIDTHS_STORAGE_KEY, JSON.stringify([...next]))}
        >
          <Table aria-label="Files with persisted column widths">
            <TableHeader columns={resizeColumns} dependencies={[widths]}>
              {(column) => (
                <Column id={column.id} isRowHeader={column.id === "file"} allowsResizing width={widths.get(column.id)}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={resizeRows}>
              {(item) => (
                <Row>
                  <Cell>{item.name}</Cell>
                  <Cell>{item.size}</Cell>
                  <Cell>{item.date}</Cell>
                </Row>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    return <Demo />;
  },
};

/* -------------------------------------------- 10. tab keyboard navigation */

export const TabKeyboardNavigation: Story = {
  name: 'keyboardNavigationBehavior="tab"',
  render: () => (
    <TableContainer>
      {/* Tab moves focus in and out of cells; arrow keys stay free for the
          text fields, so typing/caret movement never triggers grid
          navigation or selection. */}
      <Table aria-label="Shared files" keyboardNavigationBehavior="tab" selectionMode="multiple">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
          <Column id="stage">Stage</Column>
          <Column id="notes">Notes</Column>
        </TableHeader>
        <TableBody items={applicants.slice(0, 3)}>
          {(item) => (
            <Row>
              <Cell>{item.name}</Cell>
              <Cell>{item.stage}</Cell>
              <Cell>
                <Input
                  unstyled
                  aria-label={`${item.name} notes`}
                  placeholder="Add a note"
                  style={{
                    boxSizing: "border-box",
                    width: "100%",
                    font: "var(--wsu-font-body-sm)",
                    padding: "var(--wsu-space-1) var(--wsu-space-2)",
                    border: "1px solid var(--wsu-color-field-border)",
                    borderRadius: "var(--wsu-radius-sm)",
                  }}
                />
              </Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

/* ------------------------------------------------------ 11. drag and drop */

export const DragAndDropReordering: Story = {
  name: "Drag and drop reordering",
  render: function DndStory() {
    function Demo() {
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
          {/* Reorder via mouse/touch, or keyboard + screen reader: focus a
              drag handle, press Enter, move with arrows, Enter to drop. */}
          <Table aria-label="Interview schedule" selectionMode="multiple" dragAndDropHooks={dragAndDropHooks}>
            <TableHeader>
              <Column id="name" isRowHeader>Name</Column>
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
    return <Demo />;
  },
};

/* ------------------------------------------------- 12. responsive stacked */

export const StackedResponsive: Story = {
  name: "Responsive stacked layout",
  render: () => (
    <div style={{ maxWidth: "22rem" }}>
      {/* Below a 40rem container width, `stacked` collapses each row into a
          labelled card (a container query on TableContainer — no page
          breakpoint). `stackLabel` repeats the column name per cell; screen
          readers keep the real column headers either way. */}
      <TableContainer>
        <Table aria-label="Applicants" stacked>
          <TableHeader>
            <Column id="name" isRowHeader>Name</Column>
            <Column id="role">Role</Column>
            <Column id="stage">Stage</Column>
            <Column id="score">Score</Column>
          </TableHeader>
          <TableBody items={applicants.slice(0, 3)}>
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
  ),
};

/* --------------------------------------------------- 13. advanced showcase */

interface Candidate extends Applicant {
  location: string;
  salary: number;
}

const showcaseCandidates: Candidate[] = [
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

const showcaseColumns = [
  { id: "name", name: "Candidate", always: true },
  { id: "role", name: "Role" },
  { id: "location", name: "Location" },
  { id: "stage", name: "Stage" },
  { id: "score", name: "Match" },
  { id: "salary", name: "Expected salary" },
];

export const AdvancedShowcase: Story = {
  name: "Advanced responsive data grid",
  parameters: {
    docs: {
      description: {
        story:
          "Everything together: global search, column visibility, sortable columns, multi-selection with a bulk-action toolbar, status badges, sticky header + footer inside a capped-height scroll container, right-aligned tabular numerals, a live result count (WCAG 4.1.3), and the `stacked` card layout when the container drops under 40rem — resize the canvas to see it.",
      },
    },
  },
  render: function ShowcaseStory() {
    function Demo() {
      const [rows, setRows] = useState(showcaseCandidates);
      const [query, setQuery] = useState("");
      const [visible, setVisible] = useState(showcaseColumns.map((c) => c.id));
      const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "score", direction: "descending" });
      const [selected, setSelected] = useState<Selection>(new Set());

      const visibleColumns = showcaseColumns.filter((c) => visible.includes(c.id));
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
        setRows((prev) => prev.filter((r) => (selected === "all" ? !filtered.some((f) => f.id === r.id) : !(selected as Set<Key>).has(r.id))));
        setSelected(new Set());
      };

      const cellFor = (column: (typeof showcaseColumns)[number], item: Candidate) => {
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
            <CheckboxGroup label="Columns" value={visible} onChange={(next) => setVisible(["name", ...next.filter((v) => v !== "name")])} orientation="horizontal">
              {showcaseColumns
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
    return <Demo />;
  },
};

/* ----------------------------------------------------------- 14. DataTable */

const dataTableColumns: TableColumn<Applicant>[] = [
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

export const DataTableRecipe: StoryObj<typeof DataTable> = {
  name: "DataTable (columns/rows convenience API)",
  parameters: {
    docs: {
      description: {
        story:
          "The previous `Table` columns/rows API, now exported as `DataTable` and built on the composable parts. `searchable` wires a `SearchField` through React Aria's `Autocomplete` to filter rows in place.",
      },
    },
  },
  render: () => (
    <DataTable
      aria-label="Applicants"
      columns={dataTableColumns}
      rows={applicants}
      searchable
      searchLabel="Search applicants"
      renderEmptyState={() => "No results found."}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole("searchbox", { name: "Search applicants" });
    await userEvent.type(search, "Jordan");
    await expect(canvas.getByRole("rowheader", { name: "Jordan Lee" })).toBeInTheDocument();
    await expect(canvas.queryByRole("rowheader", { name: "Alex Chen" })).not.toBeInTheDocument();
  },
};
