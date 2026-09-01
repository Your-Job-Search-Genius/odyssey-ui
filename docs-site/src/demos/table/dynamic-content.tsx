import { useState } from "react";
import {
  Button,
  Cell,
  Checkbox,
  CheckboxGroup,
  Column,
  Row,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@your-job-search-genius/odyssey-ui";

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

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function TableDynamicContent() {
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
