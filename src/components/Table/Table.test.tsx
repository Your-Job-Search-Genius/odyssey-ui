import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { Collection } from "react-aria-components";
import type { Key } from "react-aria-components";
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  Column,
  Row,
  Cell,
  DataTable,
} from "./Table";
import type { TableColumn } from "./Table";

interface Applicant {
  id: string;
  name: string;
  role: string;
  score: number;
}

const rows: Applicant[] = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", score: 92 },
  { id: "2", name: "Jordan Lee", role: "Product Designer", score: 87 },
];

function BasicTable(props: Partial<React.ComponentProps<typeof Table>>) {
  return (
    <TableContainer>
      <Table aria-label="Applicants" {...props}>
        <TableHeader>
          <Column id="name" isRowHeader allowsSorting>
            Name
          </Column>
          <Column id="role">Role</Column>
          <Column id="score" align="end">
            Score
          </Column>
        </TableHeader>
        <TableBody items={rows}>
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

describe("Table (composable)", () => {
  it("renders as a labeled grid with column and row headers", () => {
    render(<BasicTable />);
    // react-aria-components renders role="grid" (not "table") since the table
    // supports keyboard cell navigation and sorting.
    expect(screen.getByRole("grid", { name: "Applicants" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Alex Chen" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(rows.length + 1); // + header row
  });

  it("reflects the sortDescriptor via aria-sort and calls onSortChange", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<BasicTable sortDescriptor={{ column: "name", direction: "ascending" }} onSortChange={onSortChange} />);
    const header = screen.getByRole("columnheader", { name: "Name" });
    expect(header).toHaveAttribute("aria-sort", "ascending");
    await user.click(header);
    expect(onSortChange).toHaveBeenCalledWith(expect.objectContaining({ column: "name" }));
  });

  it("wires multiple selection with an accessible select-all checkbox", async () => {
    const user = userEvent.setup();
    render(<BasicTable selectionMode="multiple" />);
    // React Aria names the injected checkboxes itself.
    const selectAll = screen.getByRole("checkbox", { name: /select all/i });
    await user.click(selectAll);
    for (const row of screen.getAllByRole("row").slice(1)) {
      expect(row).toHaveAttribute("aria-selected", "true");
    }
  });

  it("disables rows via disabledKeys", () => {
    render(<BasicTable selectionMode="multiple" disabledKeys={["2"]} />);
    const row = screen.getByRole("rowheader", { name: "Jordan Lee" }).closest("tr")!;
    expect(row).toHaveAttribute("aria-disabled", "true");
  });

  it("renders an empty state when there are no rows", () => {
    render(
      <TableContainer>
        <Table aria-label="Empty">
          <TableHeader>
            <Column isRowHeader>Name</Column>
          </TableHeader>
          <TableBody renderEmptyState={() => "No results found."}>{[]}</TableBody>
        </Table>
      </TableContainer>,
    );
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("renders a footer with spanned cells", () => {
    render(
      <TableContainer>
        <Table aria-label="Invoices">
          <TableHeader>
            <Column id="title" isRowHeader>
              Title
            </Column>
            <Column id="price">Price</Column>
          </TableHeader>
          <TableBody>
            <Row id="1">
              <Cell>Resume rewrite</Cell>
              <Cell>$1,200</Cell>
            </Row>
          </TableBody>
          <TableFooter>
            <Row>
              <Cell colSpan={2}>Total $1,200</Cell>
            </Row>
          </TableFooter>
        </Table>
      </TableContainer>,
    );
    expect(screen.getByText("Total $1,200")).toHaveAttribute("colspan", "2");
  });

  it("marks link rows", () => {
    render(
      <TableContainer>
        <Table aria-label="Boards">
          <TableHeader>
            <Column isRowHeader>Name</Column>
          </TableHeader>
          <TableBody>
            <Row id="w" href="https://wellfound.com/">
              <Cell>Wellfound</Cell>
            </Row>
          </TableBody>
        </Table>
      </TableContainer>,
    );
    const row = screen.getByRole("rowheader", { name: "Wellfound" }).closest("tr")!;
    expect(row).toHaveAttribute("data-href");
  });

  it("expands and collapses tree rows via the chevron button", async () => {
    const user = userEvent.setup();
    interface Node {
      id: string;
      title: string;
      children: Node[];
    }
    const tree: Node[] = [
      { id: "1", title: "Folder", children: [{ id: "2", title: "Nested file", children: [] }] },
    ];
    function TreeDemo() {
      const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set());
      return (
        <TableContainer>
          <Table aria-label="Documents" treeColumn="name" expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
            <TableHeader>
              <Column id="name" isRowHeader>
                Name
              </Column>
            </TableHeader>
            <TableBody items={tree}>
              {function renderItem(item: Node) {
                return (
                  <Row id={item.id}>
                    <Cell>{item.title}</Cell>
                    <Collection items={item.children}>{renderItem}</Collection>
                  </Row>
                );
              }}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    render(<TreeDemo />);
    expect(screen.getByRole("treegrid", { name: "Documents" })).toBeInTheDocument();
    expect(screen.queryByText("Nested file")).not.toBeInTheDocument();
    const parent = screen.getByRole("rowheader", { name: /Folder/ }).closest("tr")!;
    expect(parent).toHaveAttribute("aria-expanded", "false");
    await user.click(within(parent).getByRole("button"));
    expect(parent).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Nested file")).toBeInTheDocument();
  });

  it("has no axe violations with sorting and selection enabled", async () => {
    const { container } = render(
      <BasicTable selectionMode="multiple" sortDescriptor={{ column: "name", direction: "descending" }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

const dataTableColumns: TableColumn<Applicant>[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "score", label: "Score", sortable: true },
];

describe("DataTable", () => {
  it("renders the columns/rows API as a labeled grid", () => {
    render(<DataTable aria-label="Applicants" columns={dataTableColumns} rows={rows} />);
    expect(screen.getByRole("grid", { name: "Applicants" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Alex Chen" })).toBeInTheDocument();
    expect(screen.getByText("Product Designer")).toBeInTheDocument();
  });

  it("supports a custom cell renderer", () => {
    const withRender: TableColumn<Applicant>[] = [
      ...dataTableColumns,
      { key: "grade", label: "Grade", render: (row) => (row.score >= 90 ? "A" : "B") },
    ];
    render(<DataTable aria-label="Applicants" columns={withRender} rows={rows} />);
    const row = screen.getByRole("rowheader", { name: "Alex Chen" }).closest("tr")!;
    expect(within(row).getByText("A")).toBeInTheDocument();
  });

  it("sorts via aria-sort and onSortChange", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable
        aria-label="Applicants"
        columns={dataTableColumns}
        rows={rows}
        sortDescriptor={{ column: "score", direction: "ascending" }}
        onSortChange={onSortChange}
      />,
    );
    const header = screen.getByRole("columnheader", { name: /Score/ });
    expect(header).toHaveAttribute("aria-sort", "ascending");
    await user.click(header);
    expect(onSortChange).toHaveBeenCalledWith(expect.objectContaining({ column: "score" }));
  });

  it("filters rows as the user types when searchable", async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Applicants" columns={dataTableColumns} rows={rows} searchable searchLabel="Search applicants" />);
    const search = screen.getByRole("searchbox", { name: "Search applicants" });
    await user.type(search, "Jordan");
    expect(await screen.findByRole("rowheader", { name: "Jordan Lee" })).toBeInTheDocument();
    expect(screen.queryByRole("rowheader", { name: "Alex Chen" })).not.toBeInTheDocument();
  });

  it("shows an empty state when filtering matches nothing", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        aria-label="Applicants"
        columns={dataTableColumns}
        rows={rows}
        searchable
        searchLabel="Search applicants"
        renderEmptyState={() => "No results found."}
      />,
    );
    const search = screen.getByRole("searchbox", { name: "Search applicants" });
    await user.type(search, "zzz-no-match");
    expect(await screen.findByText("No results found.")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DataTable
        aria-label="Applicants"
        columns={dataTableColumns}
        rows={rows}
        selectionMode="multiple"
        sortDescriptor={{ column: "score", direction: "descending" }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
