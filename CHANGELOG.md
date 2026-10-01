# Changelog

Notable changes to the published packages. Versions are bumped by hand in each package's
`package.json`; the publish workflow releases any version not yet on GitHub Packages.

## odyssey-ui 2.1.0 · ds-registry 0.3.0 · ds-mcp 0.3.0 · eslint-plugin-ds 0.1.3

Fixes the issues logged while migrating the CRM client onto odyssey-ui 2.0.0 (IDs refer to that
app's `YJSG_MCP_ISSUES.md`). Everything is additive except the behaviour changes listed first.

### Behaviour changes

- **Toasts no longer take focus by default** (V9). `toast()` defaults to `autoFocus: false`; pass `{ autoFocus: true }` for a toast the user should act on. Hovering or keyboard-focusing a toast still pauses it, but focus placed by `autoFocus` no longer stops it from timing out.
- **The ⌘K hint is off by default** on `ComboBox` and `Select.ComboBox` (V10). Nothing was bound to it; pass `shortcut` if your app wires the key itself.
- **`DatePicker` / `DateRangePicker` Cancel restores the value from when the picker opened** (V11), firing `onChange` with it.
- **`ButtonGroup` selected items** use `bg-active text-primary` and show a leading check on text items (V19). Opt out with `showSelectedIndicator={false}`.
- **Dark-mode `Alert`** uses the subtle `bg-*-primary` surfaces (V29). Light mode is unchanged.
- Link-style `Button`s (`link-color`, `link-gray`, `link-destructive`) can wrap (V16).

### Fixes

- `MultiSelect`: Escape closes the popover without clearing the selection; the trigger shows the count in uncontrolled mode too (V12). Same Escape fix in `TagSelect`.
- `Dropdown.DotsButton` accepts a custom `aria-label` (V8).
- `NativeSelect` reserves room for its chevron (V14).
- `Toggle` hint wraps inside narrow containers (V28).
- `Alert` and toast `title`/`description` render in `div`s, so block content is valid (V20).
- `TableCard.Header` no longer squeezes the description; new `filters` row slot (V21).
- `FlowCanvas` fits the view again when nodes first arrive after mount, and refits when `fitViewKey` changes (V22); deleting a node that wasn't selected deletes that node; read-only nodes are selectable by click.
- The theme sets `color-scheme` (`light` / `dark`), so native controls follow dark mode (V26).
- `@types/d3-*` are dependencies of odyssey-ui, so strict consumers type-check without adding them (V27). Unused `React` imports removed and now caught by lint (V7).
- `EmptyState` lazy-loads illustrations, file-type icons and non-default background patterns (P1).

### New

- `CodeBlock` (M2), `DescriptionList` (M3), `HtmlPreview` (M1).
- `Modal` sizes `2xl` (960px) and `full` (M4).
- `FlowCanvas`: `FlowEdge.data` with a `TEdgeData` generic, per-node `width`/`height`, node `tooltip`, keyboard-focusable edges (Tab after nodes, Enter selects, Delete removes) (M5, M15, M16). Ports are not supported yet.
- `Dropdown.Item variant="destructive"` (M6).
- `Avatar imageFit="contain"` (M7).
- `StatTile` `icon` and `description` (M8).
- `MultiSelect` `inputValue` / `defaultInputValue` / `onInputChange`, `filter` (`null` for server search), `isLoading` (M9).
- `TagSelect` reacts to new `items` and accepts controlled `selectedKeys` / `defaultSelectedKeys` / `onSelectionChange` (M10).
- `ComboBox` `onLoadMore` + `loadingState` (infinite scroll) (M11).
- `LineChart` treats `null` as a gap (M12). `BarChart colorBy="index"` (M13).
- `Table.Row isDetail` + `Table.Cell colSpan` for expandable rows; `Table.Body` documents `dependencies` (M14, V15).
- `SidebarMenuItem` `section` and `isSelected` for single-choice groups such as a theme picker (M17).
- `Badge type="modern"` accepts every color (V18).

### MCP / validator (ds-registry, ds-mcp)

- `validate_jsx` accepts stacked variants (`md:hover:`, `max-md:`, `motion-safe:`, `group-hover:` ...) and the utilities the library itself uses: `sr-only`, `not-sr-only`, `line-clamp-*`, `wrap-*`, `border-dashed`, `align-*`, `font-mono`, `text-display-*`, `ring-<token>` / `outline-<token>`, `scrollbar-hide` (V3, V2, V25).
- `RouterProvider` and `I18nProvider` from `react-aria-components` are accepted as app setup providers (V1).
- `<pre>`/`<code>`, `<dl>`/`<dt>`/`<dd>` and `<iframe>` are still rejected, now with a pointer to `CodeBlock`, `DescriptionList` and `HtmlPreview`.
- Compound members of object-literal namespaces (`Dropdown.Item`, ...) are recognised.
- Rules 3.2.0: Vite per-importer `@/` alias (V5), loading Inter (D3), toggling `.dark-mode` before first paint (D2), `<Toaster />` / `RouterProvider` setup (V4, V1), library internals vs consumer rules (V6).
- Curated examples and notes for Modal, Table, Dropdown, Tabs, Alert/toast, EmptyState, ButtonGroup and Tags (D1, D4, V13, V15, V17).
