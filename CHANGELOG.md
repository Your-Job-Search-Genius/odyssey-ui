# Changelog

Notable changes to the published packages. Versions are bumped by hand in each package's
`package.json`; the publish workflow releases any version not yet on GitHub Packages.

## odyssey-ui 2.4.0 · ds-registry 0.5.0 · ds-mcp 0.5.0

Foundations, `Button`, `Modal`, `Accordion` and `Tooltip` now follow the YJSG client app's design. Behaviour changes are listed first.

### Behaviour changes

- **Font is Geist, not Inter.** `--font-body` / `--font-display` use `var(--font-geist, "Geist")`. Apps must load Geist (Google Fonts, or `next/font/google` `Geist` with variable `--font-geist`); without it the UI falls back to system fonts.
- **Light-mode text and border colors.** `text-primary` `#10244F`, `text-secondary` `#3F4E72`, `text-tertiary` `#535862`, `text-quaternary` / `text-placeholder` `#717680`, `border-secondary` `#EAEDEF`, `focus-ring` brand-600. Dark mode is unchanged.
- **`Button` sizes and look.** 12px radius; heights 24 / 32 / 40 / 48 / 64px for `xs`-`xl` (`md` 16px text with a 120px min width, `lg` 18px text, `xl` 150px min width); flat (no skeuomorphic shadow, inner border or press scale); focus outline 3px offset. `secondary` / `tertiary` use `text-primary` with a `bg-quaternary` hover. The default size is still `sm`.
- **`Modal`.** Centered on every viewport (no bottom-pinned panel on phones), 16px radius, `md` max width 456px (was 480px), lighter brand-tinted overlay with a 5px blur, `shadow-lg`, 24px horizontal padding on every viewport.
- **`Accordion` `className` sizes the whole accordion.** It now sits on the outer wrapper (which is `w-full`), so width utilities such as `max-w-md` hold whether items are open or closed.
- **`Tooltip`.** Medium-weight title, `shadow-md`, default `offset` 8px (was 6), sharp arrow, new `--color-tooltip-bg` token (`#101419` in light mode). `SidebarLayout`'s collapsed-nav tooltips show the arrow.
- **ds-registry rule set 4.2.0.** The font rule names Geist. Rule set 4.1.0 (also new in this release): after a build, agents list any UI issues they hit and ask permission before logging them to the consuming project's `docs/ui-issues.md`.

### New

- **`Accordion` variants** via `variant`: `card` (separate bordered cards), `filled` (rounded cards with a brand-tinted header bar), `badge` (rounded sections with an icon + uppercase label pill header), `issue` (tinted error cards with a +/- toggle) and `suggestion` (compact brand-tinted block). `Accordion.Trigger` takes `badgeColor` (`gray` | `brand` | `error`) for `badge`; `Accordion.Item` takes `isActive` (red border on `issue`). Default `divider` is unchanged.

### Fixes

- **Nested accordions track their own state.** A collapsed item inside an open one no longer shows the open chevron / minus icon, and its panel no longer stays fully opaque while collapsing.
- **No dark border flash when an `Accordion` item opens.** The header divider of `card` / `filled` items no longer animates in from the text color.

## odyssey-ui 2.3.2

### Fixes

- **`ModalFooter` buttons keep their natural width.** They are right-aligned on every viewport and wrap when they don't fit, instead of stretching to fill the row (and stacking full-width on phones).
- **`DatePicker` / `DateRangePicker` fit small screens.** The popover is capped to the viewport width and scrolls when React Aria limits its height (e.g. a trigger near the bottom of a short screen), instead of spilling off-screen. On phones the range start/end inputs stack, presets wrap, padding is tighter and day cells are 36px, so a month fits a 320px viewport. Placement is `bottom end` (RTL-aware). The two months of the desktop range calendar now line up.
- **Toast close button stays inside the toast.** The card was missing `relative`, so once the entry animation finished the dismiss button jumped to the corner of the whole toast stack.

## odyssey-ui 2.3.1 · ds-registry 0.4.1 · ds-mcp 0.4.1

### Fixes

- **Combobox chevrons are real buttons** (`ComboBox`, `Select.ComboBox`, `TagSelect`). Clicking the chevron opens the list; it is a keyboard tab stop named "Show suggestions" (plus the field label), and Enter / Space opens the list and moves focus to the input with the first option highlighted. React Aria keeps this button out of the tab order by default; it is now included.
- **Focus is no longer lost when a focused control becomes disabled.** `Button`, `ButtonUtility`, `Input` and pagination's fallback button move focus to the next focusable element (or the previous one if there is no next) instead of letting it fall to `<body>` -- e.g. pressing Previous on page 2 of `Pagination` now lands on page 1's button. Shared hook: `hooks/use-focus-next-when-disabled.ts`.
- **Pagination at high zoom / narrow widths (400%, 320px reflow).** `PaginationButtonGroup` page cells no longer render the selected check mark, which had no room in the fixed square cell (it was squeezed to 0px and pushed the number off-center); the current page is still shown by its selected styling and `aria-current`. The mobile row of `PaginationCardMinimal` gets a minimum gap, so the arrow buttons no longer touch "Page N of M".

## odyssey-ui 2.3.0 · ds-registry 0.4.0 · ds-mcp 0.4.0

The MCP server now drives agents through a guidelines workflow (plan, checklists, build, re-check, validate), every component was audited for the NVDA screen reader, and the docs site moved to the "Spatial Layers" design. Behaviour changes are listed first.

### Behaviour changes

- **`Drawer`, `SlideoutMenu` and `BottomSheet` no longer carry a fixed name** ("Drawer", "Slideout menu", "Bottom sheet"). They are named by their `Heading slot="title"`, or by the trigger; pass the new `aria-label` / `aria-labelledby` props when there is neither. Their `Content` no longer defaults to `role="main"`, and `Header` / `Footer` no longer create banner / contentinfo landmarks.
- **`PaginationButtonGroup` is no longer a radio group.** Pages are plain buttons with `aria-current="page"`; the ellipsis is text. Visuals are unchanged.
- **Loading `Button`s keep their label in the accessible name** (the text fades with `opacity-0` instead of `invisible`), and the spinner is a named progress bar.
- **`Slider`'s default value format** reads the same in the visible output and in `aria-valuetext` ("50%", not "5,000%"). Custom `formatOptions` are unchanged.
- **`Checkbox`, `Radio` and `Toggle` hints are descriptions**, no longer part of the accessible name.
- **Brand, payment, social and integration icons default to `aria-hidden="true"`.** Pass `aria-hidden={false}` with `role="img"` and `aria-label` for a meaningful icon.
- **ds-registry rule set 4.0.0:** the standing UX rules `FORM-*` and `STATE-*` are now `FIELD-*` and `ISTATE-*` (the UI agent guidelines own `FORM-*` / `STATE-*`). Rules that prescribed fixed pixel values, breakpoints or durations now give direction instead.

### Accessibility (NVDA audit)

76 findings across `base`, `application` and `foundations`; 69 fixed, 2 partly fixed, 2 deferred. Highlights: named icon-only controls (input help tooltips, table header help, social buttons, tag and badge remove buttons); linked labels, hints and errors (`InputTags`, `MultiSelect`, `ColorPicker`, file upload); announced async feedback (tag rejection, upload status, combobox loading, loading indicator, carousel slide changes); `aria-current` / `aria-pressed` state (header nav, pagination, account switcher, cards, calendar presets); avatars default to `alt=""`; rating stars read "N out of M stars". Details, deferrals and a manual NVDA script: `docs/superpowers/reports/2026-10-09-nvda-audit.md`. A real NVDA walkthrough is still outstanding.

### New

- **ds-mcp `plan_ui_task`**: call before writing UI. It routes the request to the guideline categories that apply (Color contrast and Screen readers (NVDA) always), lists candidate components, and returns a plan template, the rules, and a completion record to fill in.
- **Server `instructions`** state the mandatory workflow; `validate_jsx` returns `nextSteps` (re-check, compile, completion record); new resource `ds://guidelines`; the `build-ui` prompt follows the new sequence.
- **ds-registry `guidelines`**: the UI agent guidelines (`src/policy/ui-agent-guidelines.md`, including the new Screen readers (NVDA) category SR-01..SR-12) parsed into categories, the mandatory list and keyword routes.
- New optional props from the audit: `Slider` `label`, progress indicators `aria-label` / `aria-labelledby`, overlay `aria-label` / `aria-labelledby`.

### Docs site

- "Spatial Layers" design across home, docs, component pages, MCP / agent rules and playground; light/dark switch in the navbar, which every component viewer follows.
- Component viewers: Fullscreen, Open in new tab (a chrome-free `/preview/...` page), Copy, Preview/Code, and wide components scale to fit instead of scrolling.

## odyssey-ui 2.1.0 · ds-registry 0.3.0 · ds-mcp 0.3.0 · eslint-plugin-ds 0.1.3

Fixes the issues logged while migrating the CRM client onto odyssey-ui 2.0.0 (IDs refer to that
app's `YJSG_MCP_ISSUES.md`). Everything is additive except the behaviour changes listed first.

### Behaviour changes

- **Toasts no longer take focus by default** (V9). `toast()` defaults to `autoFocus: false`; pass `{ autoFocus: true }` for a toast the user should act on. Hovering or keyboard-focusing a toast still pauses it, but focus placed by `autoFocus` no longer stops it from timing out.
- **The ⌘K hint is off by default** on `ComboBox` and `Select.ComboBox` (V10). Nothing was bound to it; pass `shortcut` if your app wires the key itself.
- **Comboboxes open on click, typing or ↓ / Alt+↓, not on focus** (`ComboBox`, `Select.ComboBox`, `TagSelect`; V17). Tabbing through a form or auto-focusing a dialog's first field no longer pops a menu over the page. Pass `menuTrigger="focus"` for the old behaviour.
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
- `FlowCanvas`: `FlowEdge.data` with a `TEdgeData` generic, per-node `width`/`height`, node `tooltip`, keyboard-focusable edges (Tab after nodes, Enter selects, Delete removes) (M5, M15, M16).
- `FlowCanvas` named ports: `inputs` / `outputs` on nodes and `sourcePort` / `targetPort` on edges and `onConnect` (M5). `allowSelfLoops` and `allowDuplicateEdges` (drawn as an arc and as fanned-out parallel edges), and `createEdgeId` / `createNodeId` for app-controlled ids (V23, V24).
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

### Docs site

The production build (`next build`) hung in local builds; three separate causes, all fixed:

- `ui-tree` imported `ICONS_IMPORT_PATH` from the `ds-registry` root, whose `loadRegistry` pulls `node:fs` into the client-side playground preview (Turbopack panic). It now imports from the fs-free `ds-registry/schema` entry. CI never hit this because the deploy job deletes the playground routes before building.
- Inter and Kalam are self-hosted with `next/font/local` (docs and Storybook) instead of `next/font/google`, so builds never wait on Google Fonts. Storybook's `<body>` now actually uses the loaded Inter (it previously named a literal "Inter" family that only resolved if installed locally).
- An unquoted `description:` containing `: ` in `select.mdx` frontmatter (from this release) failed webpack and silently stalled Turbopack. A new docs test parses every page's frontmatter so this fails fast in `pnpm run test`.

### MCP / validator (ds-registry, ds-mcp)

- `validate_jsx` accepts stacked variants (`md:hover:`, `max-md:`, `motion-safe:`, `group-hover:` ...) and the utilities the library itself uses: `sr-only`, `not-sr-only`, `line-clamp-*`, `wrap-*`, `border-dashed`, `align-*`, `font-mono`, `text-display-*`, `ring-<token>` / `outline-<token>`, `scrollbar-hide` (V3, V2, V25).
- `RouterProvider` and `I18nProvider` from `react-aria-components` are accepted as app setup providers (V1).
- `<pre>`/`<code>`, `<dl>`/`<dt>`/`<dd>` and `<iframe>` are still rejected, now with a pointer to `CodeBlock`, `DescriptionList` and `HtmlPreview`.
- Compound members of object-literal namespaces (`Dropdown.Item`, ...) are recognised.
- Rules 3.2.0: Vite per-importer `@/` alias (V5), loading Inter (D3), toggling `.dark-mode` before first paint (D2), `<Toaster />` / `RouterProvider` setup (V4, V1), library internals vs consumer rules (V6).
- Curated examples and notes for Modal, Table, Dropdown, Tabs, Alert/toast, EmptyState, ButtonGroup and Tags (D1, D4, V13, V15, V17).
