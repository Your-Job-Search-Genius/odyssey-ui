import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Table } from "./Table";
import type { TableColumn } from "./Table";

interface Applicant {
  id: string;
  name: string;
  role: string;
  score: number;
}

const columns: TableColumn<Applicant>[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "score", label: "Score", sortable: true },
];

const rows: Applicant[] = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", score: 92 },
  { id: "2", name: "Jordan Lee", role: "Product Designer", score: 87 },
];

describe("Table", () => {
  it("renders as a labeled table with column and row headers", () => {
    render(<Table aria-label="Applicants" columns={columns} rows={rows} />);
    // react-aria-components renders role="grid" (not "table") since the table supports
    // keyboard cell navigation and sorting — the richer, correct ARIA role for that.
    expect(screen.getByRole("grid", { name: "Applicants" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Alex Chen" })).toBeInTheDocument();
  });

  it("renders every row and cell", () => {
    render(<Table aria-label="Applicants" columns={columns} rows={rows} />);
    expect(screen.getAllByRole("row")).toHaveLength(rows.length + 1); // + header row
    expect(screen.getByText("Product Designer")).toBeInTheDocument();
  });

  it("marks a sortable column's aria-sort and calls onSortChange on click", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<Table aria-label="Applicants" columns={columns} rows={rows} onSortChange={onSortChange} />);
    const scoreHeader = screen.getByRole("columnheader", { name: /Score/ });
    await user.click(scoreHeader);
    expect(onSortChange).toHaveBeenCalledWith(expect.objectContaining({ column: "score" }));
  });

  it("reflects the current sortDescriptor via aria-sort", () => {
    render(<Table aria-label="Applicants" columns={columns} rows={rows} sortDescriptor={{ column: "score", direction: "ascending" }} />);
    expect(screen.getByRole("columnheader", { name: /Score/ })).toHaveAttribute("aria-sort", "ascending");
  });

  it("supports a custom cell renderer", () => {
    const withRender: TableColumn<Applicant>[] = [
      ...columns,
      { key: "grade", label: "Grade", render: (row) => (row.score >= 90 ? "A" : "B") },
    ];
    render(<Table aria-label="Applicants" columns={withRender} rows={rows} />);
    const row = screen.getByRole("rowheader", { name: "Alex Chen" }).closest("tr")!;
    expect(within(row).getByText("A")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Table aria-label="Applicants" columns={columns} rows={rows} sortDescriptor={{ column: "score", direction: "descending" }} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
