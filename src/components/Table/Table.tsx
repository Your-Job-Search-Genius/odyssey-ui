import type { CSSProperties, ReactNode } from "react";
import {
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  TableBody as AriaTableBody,
  TableFooter as AriaTableFooter,
  TableLoadMoreItem as AriaTableLoadMoreItem,
  Column as AriaColumn,
  Row as AriaRow,
  Cell as AriaCell,
  Checkbox as AriaCheckbox,
  Button as AriaButton,
  Autocomplete as AriaAutocomplete,
  Collection,
  Group,
  ColumnResizer,
  ResizableTableContainer,
  composeRenderProps,
  useTableOptions,
  useFilter,
} from "react-aria-components";
import type {
  TableProps as AriaTableProps,
  TableHeaderProps as AriaTableHeaderProps,
  TableBodyProps as AriaTableBodyProps,
  TableFooterProps as AriaTableFooterProps,
  TableLoadMoreItemProps as AriaTableLoadMoreItemProps,
  ColumnProps as AriaColumnProps,
  RowProps as AriaRowProps,
  CellProps as AriaCellProps,
  ResizableTableContainerProps,
  Key,
  Selection,
  SelectionMode,
  SortDescriptor,
} from "react-aria-components";

/** A column width: pixels, or a `"1fr"` / `"50%"`-style string (react-aria doesn't re-export this type). */
export type ColumnSize = NonNullable<AriaColumnProps["width"]>;
import {
  ArrowDown01SharpIcon,
  ArrowRight01SharpIcon,
  MinusSignIcon,
  Tick01Icon,
  VerticalDragDropIcon,
} from "@your-job-search-genius/icons";
import { SearchField } from "../SearchField/SearchField";
import { Spinner } from "../Spinner/Spinner";
import "../Checkbox/Checkbox.css";
import "./Table.css";

/*
 * Table — composable data table built on `react-aria-components`' Table
 * family (WCAG doc §6: grid semantics, `aria-sort`, roving cell focus,
 * select-all wiring and drag-and-drop announcements are the error-prone
 * parts to hand-roll). Not present in the source Figma file at all
 * (design-inventory.md §2.14) — chrome reuses this system's existing
 * radius/spacing/colour/focus tokens.
 *
 * Two API layers:
 *  - Composable parts (`Table`, `TableHeader`, `Column`, `TableBody`,
 *    `Row`, `Cell`, `TableFooter`, `TableLoadMoreItem`, `TableContainer`)
 *    mirroring React Aria's own composition, for sorting, selection,
 *    tree rows, resizing, infinite scroll and drag-and-drop.
 *  - `DataTable`, the previous columns/rows convenience API, now built on
 *    the parts above (the old `Table` columns/rows props moved here).
 */

// ---------------------------------------------------------------------------
// TableContainer
// ---------------------------------------------------------------------------

export interface TableContainerProps
  extends Pick<ResizableTableContainerProps, "onResize" | "onResizeStart" | "onResizeEnd"> {
  children: ReactNode;
  /**
   * Wraps the table in React Aria's `ResizableTableContainer` so columns
   * with `allowsResizing` can be resized. Without it the container is a
   * plain scroll region and column width props are ignored.
   */
  resizable?: boolean;
  /** Constrains height so the body scrolls under the sticky header (e.g. `"20rem"`). */
  maxHeight?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Scroll + border chrome for a table. A wide table scrolls inside this
 * container instead of breaking page reflow at 320px (WCAG 1.4.10), and the
 * `TableHeader` sticks to its top edge while the body scrolls.
 */
export function TableContainer({
  children,
  resizable,
  maxHeight,
  className,
  style,
  onResize,
  onResizeStart,
  onResizeEnd,
}: TableContainerProps) {
  const classes = ["wsu-TableContainer", resizable ? "wsu-TableContainer--resizable" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  const mergedStyle = maxHeight ? ({ ...style, "--wsu-table-max-height": maxHeight } as CSSProperties) : style;

  if (resizable) {
    return (
      <ResizableTableContainer
        className={classes}
        style={mergedStyle}
        onResize={onResize}
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
      >
        {children}
      </ResizableTableContainer>
    );
  }
  return (
    <div className={classes} style={mergedStyle}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

export interface TableProps extends AriaTableProps {
  /** Zebra-stripes the body rows for easier horizontal scanning of wide tables. */
  striped?: boolean;
  /** Tighter cell padding for dense data screens. */
  density?: "comfortable" | "compact";
  /**
   * Collapses rows into labelled card-style blocks when the surrounding
   * `TableContainer` is narrower than 40rem (a container query — no page
   * breakpoint needed). Give each `Cell` a `stackLabel` naming its column,
   * since the visual header row is hidden in that layout (screen-reader
   * users keep the real column headers either way).
   */
  stacked?: boolean;
}

/** Root table. Compose with `TableHeader`, `TableBody`, `TableFooter`; usually inside a `TableContainer`. */
export function Table({ striped, density = "comfortable", stacked, ...props }: TableProps) {
  return (
    <AriaTable
      {...props}
      className={composeRenderProps(props.className, (className) =>
        [
          "wsu-Table",
          striped ? "wsu-Table--striped" : "",
          density === "compact" ? "wsu-Table--compact" : "",
          stacked ? "wsu-Table--stacked" : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" "),
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Column
// ---------------------------------------------------------------------------

export interface ColumnProps extends Omit<AriaColumnProps, "children"> {
  /**
   * Renders a keyboard-operable `ColumnResizer` in the header. Only takes
   * effect inside `<TableContainer resizable>`.
   */
  allowsResizing?: boolean;
  /** Right-aligns the header and (by convention) its cells — for numeric columns. */
  align?: "start" | "end";
  children?: ReactNode;
}

/**
 * Column header. `isRowHeader` marks the column whose cells name each row
 * for assistive tech; `allowsSorting` renders an arrow indicator wired to
 * the table's `sortDescriptor` (React Aria applies `aria-sort` itself, so
 * the arrow stays `aria-hidden`).
 */
export function Column({ allowsResizing, align = "start", children, ...props }: ColumnProps) {
  // Same textValue restoration as Cell — the render function below hides
  // string children from React Aria's automatic derivation.
  const textValue = props.textValue ?? (typeof children === "string" ? children : undefined);
  return (
    <AriaColumn
      {...props}
      textValue={textValue}
      className={composeRenderProps(props.className, (className) =>
        ["wsu-Table__column", align === "end" ? "wsu-Table__column--end" : "", className ?? ""].filter(Boolean).join(" "),
      )}
    >
      {({ allowsSorting, sortDirection }) => (
        <div className="wsu-Table__columnContent">
          {/* Focusable child for the column's default focusMode="child" in
              arrow-navigation mode — keyboard users land here to sort, and
              can reach the resizer separately. */}
          <Group role="presentation" tabIndex={-1} className="wsu-Table__columnName">
            {children}
          </Group>
          {allowsSorting ? (
            <span aria-hidden="true" className="wsu-Table__sortIndicator" data-direction={sortDirection}>
              <ArrowDown01SharpIcon size="0.75rem" />
            </span>
          ) : null}
          {allowsResizing ? <ColumnResizer className="wsu-Table__resizer" /> : null}
        </div>
      )}
    </AriaColumn>
  );
}

// ---------------------------------------------------------------------------
// TableHeader / Row — selection + drag columns injected automatically
// ---------------------------------------------------------------------------

/** Checkbox wired to the table's selection state via `slot="selection"` (React Aria names it "Select"/"Select All"). */
function SelectionCheckbox() {
  return (
    <AriaCheckbox slot="selection" className="wsu-Checkbox wsu-Table__selectionCheckbox">
      {({ isSelected, isIndeterminate }) => (
        <span className="wsu-Checkbox__box" aria-hidden="true">
          {isIndeterminate ? <MinusSignIcon size="0.75rem" /> : isSelected ? <Tick01Icon size="0.75rem" /> : null}
        </span>
      )}
    </AriaCheckbox>
  );
}

export type TableHeaderProps<T> = AriaTableHeaderProps<T>;

/**
 * Header row group. When the table enables selection or drag-and-drop this
 * automatically prepends the select-all checkbox / drag-handle columns, so
 * row markup stays in sync with `Row` (which prepends the matching cells).
 */
export function TableHeader<T extends object>({ columns, children, ...props }: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

  return (
    <AriaTableHeader
      {...props}
      className={composeRenderProps(props.className, (className) =>
        className ? `wsu-Table__header ${className}` : "wsu-Table__header",
      )}
    >
      {allowsDragging ? (
        <AriaColumn width={36} minWidth={36} className="wsu-Table__column wsu-Table__column--drag" textValue="Drag">
          <span className="wsu-Table__visuallyHidden">Drag</span>
        </AriaColumn>
      ) : null}
      {selectionBehavior === "toggle" ? (
        <AriaColumn
          width={44}
          minWidth={44}
          focusMode="child"
          allowsArrowNavigation
          className="wsu-Table__column wsu-Table__column--selection"
          textValue="Selection"
        >
          {selectionMode === "multiple" ? <SelectionCheckbox /> : <span className="wsu-Table__visuallyHidden">Selection</span>}
        </AriaColumn>
      ) : null}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

export type RowProps<T> = AriaRowProps<T>;

/**
 * Body row. Prepends the drag-handle / selection-checkbox cells to match
 * the columns `TableHeader` injects. Use `href` for link rows and
 * `isDisabled` to take a row out of selection/action.
 */
export function Row<T extends object>({ id, columns, children, ...props }: RowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <AriaRow
      id={id}
      {...props}
      className={composeRenderProps(props.className, (className) =>
        className ? `wsu-Table__row ${className}` : "wsu-Table__row",
      )}
    >
      {allowsDragging ? (
        <AriaCell className="wsu-Table__cell wsu-Table__cell--drag">
          <AriaButton slot="drag" className="wsu-Table__dragButton">
            <VerticalDragDropIcon size="1rem" />
          </AriaButton>
        </AriaCell>
      ) : null}
      {selectionBehavior === "toggle" ? (
        <AriaCell focusMode="child" allowsArrowNavigation className="wsu-Table__cell wsu-Table__cell--selection">
          <SelectionCheckbox />
        </AriaCell>
      ) : null}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

// ---------------------------------------------------------------------------
// Cell
// ---------------------------------------------------------------------------

export interface CellProps extends AriaCellProps {
  /** Right-aligns the cell — pair with `Column align="end"` for numeric columns. */
  align?: "start" | "end";
  /**
   * Column name repeated inside the cell for `<Table stacked>`'s narrow
   * card layout, where the header row is visually hidden. Hidden (and
   * `aria-hidden`, since the real column header still names the cell)
   * in the regular table layout.
   */
  stackLabel?: string;
}

/**
 * Body cell. In the table's `treeColumn`, cells of rows that have children
 * automatically render the expand/collapse chevron button.
 */
export function Cell({ align = "start", stackLabel, ...props }: CellProps) {
  // Wrapping children in a render function below hides string content from
  // React Aria's automatic textValue derivation (used for typeahead and
  // Autocomplete filtering) — restore it for plain text/number cells.
  const textValue =
    props.textValue ??
    (typeof props.children === "string"
      ? props.children
      : typeof props.children === "number"
        ? String(props.children)
        : undefined);
  return (
    <AriaCell
      {...props}
      textValue={textValue}
      className={composeRenderProps(props.className, (className) =>
        ["wsu-Table__cell", align === "end" ? "wsu-Table__cell--end" : "", className ?? ""].filter(Boolean).join(" "),
      )}
    >
      {composeRenderProps(props.children, (children, { isTreeColumn, hasChildItems }) => (
        <>
          {stackLabel ? (
            <span className="wsu-Table__stackLabel" aria-hidden="true">
              {stackLabel}
            </span>
          ) : null}
          {isTreeColumn && hasChildItems ? (
            <AriaButton slot="chevron" className="wsu-Table__chevronButton">
              <ArrowRight01SharpIcon size="0.875rem" />
            </AriaButton>
          ) : null}
          {children}
        </>
      ))}
    </AriaCell>
  );
}

// ---------------------------------------------------------------------------
// TableBody / TableFooter / TableLoadMoreItem
// ---------------------------------------------------------------------------

export type TableBodyProps<T> = AriaTableBodyProps<T>;

/** Body row group. `renderEmptyState` renders centred inside the table when there are no rows. */
export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return (
    <AriaTableBody
      {...props}
      className={composeRenderProps(props.className, (className) =>
        className ? `wsu-Table__body ${className}` : "wsu-Table__body",
      )}
    />
  );
}

export type TableFooterProps<T> = AriaTableFooterProps<T>;

/** Footer row group for totals/summaries — use `Cell colSpan` to span label cells. */
export function TableFooter<T extends object>(props: TableFooterProps<T>) {
  return (
    <AriaTableFooter
      {...props}
      className={props.className ? `wsu-Table__footer ${props.className}` : "wsu-Table__footer"}
    />
  );
}

export interface TableLoadMoreItemProps extends Omit<AriaTableLoadMoreItemProps, "children"> {
  /** Accessible label for the loading spinner. */
  loadingLabel?: string;
}

/**
 * Infinite-scroll sentinel row: place last in `TableBody`; `onLoadMore`
 * fires as it scrolls into view and the spinner shows while `isLoading`.
 */
export function TableLoadMoreItem({ loadingLabel = "Loading more", ...props }: TableLoadMoreItemProps) {
  return (
    <AriaTableLoadMoreItem
      {...props}
      className={props.className ? `wsu-Table__loadMore ${props.className}` : "wsu-Table__loadMore"}
    >
      <span className="wsu-Table__loadMoreContent">
        <Spinner size="sm" label={loadingLabel} />
      </span>
    </AriaTableLoadMoreItem>
  );
}

// ---------------------------------------------------------------------------
// DataTable — the previous high-level columns/rows API, kept as a recipe
// ---------------------------------------------------------------------------

export interface TableColumn<T> {
  key: string;
  label: ReactNode;
  sortable?: boolean;
  /** Right-align a numeric column (header and cells). */
  align?: "start" | "end";
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T extends { id: Key }> {
  /** Accessible name for the table (WCAG 4.1.2 — a table needs a name distinguishing it from any other on the page). */
  "aria-label": string;
  columns: TableColumn<T>[];
  rows: T[];
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  selectionMode?: SelectionMode;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  disabledKeys?: Iterable<Key>;
  onRowAction?: (key: Key) => void;
  striped?: boolean;
  density?: "comfortable" | "compact";
  /**
   * Renders a `SearchField` above the table, wired to
   * `react-aria-components`' `Autocomplete` so typing filters the visible
   * rows in place — this library's own "filterable table" recipe
   * (docs/design-inventory.md §2.14).
   */
  searchable?: boolean;
  /** Accessible name for the search field when `searchable` is set. */
  searchLabel?: string;
  searchPlaceholder?: string;
  renderEmptyState?: () => ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * DataTable — declarative columns/rows convenience layer over the
 * composable parts (this was previously exported as `Table`). The first
 * column is the row header. Reach for the composable API instead when you
 * need tree rows, resizing, infinite scroll, footers or drag-and-drop.
 */
export function DataTable<T extends { id: Key }>({
  "aria-label": ariaLabel,
  columns,
  rows,
  sortDescriptor,
  onSortChange,
  selectionMode,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  onRowAction,
  striped,
  density,
  searchable,
  searchLabel = "Search",
  searchPlaceholder,
  renderEmptyState,
  className,
  style,
}: DataTableProps<T>) {
  const { contains } = useFilter({ sensitivity: "base" });

  const table = (
    <TableContainer className={className} style={style}>
      <Table
        aria-label={ariaLabel}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        disabledKeys={disabledKeys}
        onRowAction={onRowAction}
        striped={striped}
        density={density}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column
              id={column.key}
              isRowHeader={columns[0]?.key === column.key}
              allowsSorting={column.sortable}
              align={column.align}
            >
              {column.label}
            </Column>
          )}
        </TableHeader>
        <TableBody items={rows} dependencies={[columns]} renderEmptyState={renderEmptyState}>
          {(row) => (
            <Row columns={columns} dependencies={[columns]}>
              {(column) => (
                <Cell align={column.align}>
                  {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (!searchable) {
    return table;
  }

  return (
    <AriaAutocomplete filter={contains}>
      <SearchField label={searchLabel} hideLabel placeholder={searchPlaceholder ?? searchLabel} className="wsu-Table__search" />
      {table}
    </AriaAutocomplete>
  );
}
