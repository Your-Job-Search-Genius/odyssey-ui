import type { ReactNode } from "react";
import {
  Table as AriaTable,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
} from "react-aria-components";
import type { Key, SortDescriptor } from "react-aria-components";
import { ChevronDownGlyph } from "../Icon/glyphs";
import "./Table.css";

export interface TableColumn<T> {
  key: string;
  label: ReactNode;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface TableProps<T extends { id: Key }> {
  /** Accessible name for the table (WCAG 4.1.2 — a table needs a name distinguishing it from any other on the page). */
  "aria-label": string;
  columns: TableColumn<T>[];
  rows: T[];
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Table — built on `react-aria-components`' `Table`: correct
 * row/columnheader semantics and `aria-sort` wiring on sortable columns
 * are the error-prone part to hand-roll (WCAG doc §6 treats this the same
 * as Select/Menu — a native `<table>` can't be restyled this much while
 * keeping it accessible). Not present in the source Figma file at all
 * (on the "missing components" list) — column sizing/typography reuse
 * this system's existing tokens rather than inventing a new look.
 * Renders inside its own horizontally-scrolling container so a wide
 * table never breaks reflow at 320px (WCAG 1.4.10).
 */
export function Table<T extends { id: Key }>({
  "aria-label": ariaLabel,
  columns,
  rows,
  sortDescriptor,
  onSortChange,
  className,
  style,
}: TableProps<T>) {
  return (
    <div className="wsu-Table__scroll">
      <AriaTable
        aria-label={ariaLabel}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        className={className ? `wsu-Table ${className}` : "wsu-Table"}
        style={style}
      >
        <TableHeader columns={columns} className="wsu-Table__header">
          {(column) => (
            <Column isRowHeader={columns[0]?.key === column.key} allowsSorting={column.sortable} className="wsu-Table__th">
              {({ sortDirection }) => (
                <span className="wsu-Table__thContent">
                  {column.label}
                  {column.sortable ? (
                    <ChevronDownGlyph
                      size="xs"
                      className={`wsu-Table__sortIcon ${sortDirection ? "wsu-Table__sortIcon--active" : ""}`}
                      style={sortDirection === "descending" ? { transform: "rotate(180deg)" } : undefined}
                    />
                  ) : null}
                </span>
              )}
            </Column>
          )}
        </TableHeader>
        <TableBody items={rows} className="wsu-Table__body">
          {(row) => (
            <Row columns={columns} className="wsu-Table__tr">
              {(column) => <Cell className="wsu-Table__td">{column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}</Cell>}
            </Row>
          )}
        </TableBody>
      </AriaTable>
    </div>
  );
}
