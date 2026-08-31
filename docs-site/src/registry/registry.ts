import type { ComponentEntry } from "./types";

/**
 * Single source of truth for the docs: sidebar, search, routing, and demo
 * loading all derive from this list. `slug` + `demos[].id` map to
 * `src/demos/<slug>/<id>.tsx`.
 */
export const registry: ComponentEntry[] = [
  // ── Actions ─────────────────────────────────────────────────
  {
    slug: "button",
    name: "Button",
    category: "actions",
    description:
      "Accessible button with primary, secondary, accent, and text variants, three sizes, loading and icon-only modes.",
    importNames: ["Button"],
    subpath: "Button",
    keywords: ["cta", "submit", "action"],
    demos: [
      {
        id: "variants",
        title: "Variants",
        description:
          "Four visual weights: primary for the main action, secondary and accent for supporting actions, text for low-emphasis ones.",
      },
      {
        id: "sizes",
        title: "Sizes",
        description: "Small, medium, and large — medium is the default.",
      },
      {
        id: "with-icons",
        title: "With icons",
        description:
          "Leading or trailing icons, plus an icon-only button that needs an accessible name.",
      },
      {
        id: "states",
        title: "States",
        description: "Disabled and loading sit alongside the default resting state.",
      },
      {
        id: "full-width",
        title: "Full width",
        description: "Stretch to fill the container for stacked mobile actions.",
      },
    ],
  },
  {
    slug: "toggle-button",
    name: "ToggleButton",
    category: "actions",
    description:
      "A two-state button that can be toggled on and off, alone or inside a ToggleButtonGroup.",
    importNames: ["ToggleButton", "ToggleButtonGroup"],
    subpath: "ToggleButton",
    keywords: ["toggle", "pressed", "segmented"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A two-state button that flips between Saved and Save job.",
      },
      {
        id: "group",
        title: "Toggle group",
        description: "Multiple selection inside a ToggleButtonGroup — a formatting toolbar.",
      },
    ],
  },

  // ── Forms ───────────────────────────────────────────────────
  {
    slug: "form",
    name: "Form",
    category: "forms",
    description:
      "Form wrapper providing validation behavior and submission handling for field components.",
    importNames: ["Form"],
    subpath: "Form",
    keywords: ["validation", "submit"],
    demos: [
      {
        id: "validation",
        title: "Submit and reset",
        description:
          "Native required fields, submit reads FormData, and reset clears both the fields and the greeting.",
      },
    ],
  },
  {
    slug: "input",
    name: "Input",
    category: "forms",
    description:
      "Single-line text field with label, help text, validation states, and leading/trailing add-ons.",
    importNames: ["Input"],
    subpath: "Input",
    keywords: ["text field", "form"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description:
          "A labelled field with helper text. The label is always visible — there is no aria-label-only escape hatch.",
      },
      {
        id: "addons",
        title: "Add-ons",
        description: "Prefix slot, trailing action button, and trailing icon — the Figma input types.",
      },
      {
        id: "states",
        title: "States",
        description: "Required, disabled, read-only, and invalid.",
      },
      {
        id: "password",
        title: "Password",
        description: "Type password adds a show/hide toggle that is keyboard reachable.",
      },
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "forms",
    description: "Multi-line text field with auto-resize support and the same states as Input.",
    importNames: ["Textarea"],
    subpath: "Textarea",
    keywords: ["multiline", "text"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Multi-line text with the same label and helper wiring as Input.",
      },
      {
        id: "states",
        title: "States",
        description: "Required, invalid, and disabled.",
      },
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "forms",
    description:
      "Checkbox and CheckboxGroup with indeterminate state, descriptions, and validation.",
    importNames: ["Checkbox", "CheckboxGroup"],
    subpath: "Checkbox",
    keywords: ["check", "multi-select"],
    demos: [
      {
        id: "states",
        title: "States",
        description: "Unchecked, checked, indeterminate, and disabled combinations.",
      },
      {
        id: "group",
        title: "Checkbox group",
        description:
          "Independently selectable options sharing one group label, with per-option descriptions.",
      },
      {
        id: "indeterminate",
        title: "Select all",
        description: "A parent checkbox that is indeterminate when only some children are checked.",
      },
    ],
  },
  {
    slug: "radio",
    name: "Radio",
    category: "forms",
    description:
      "RadioGroup for choosing exactly one option, with horizontal and vertical orientations.",
    importNames: ["RadioGroup", "Radio"],
    subpath: "Radio",
    keywords: ["radio group", "single choice"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Exactly one option from a small visible set.",
      },
      {
        id: "descriptions",
        title: "With descriptions",
        description: "Per-option supporting text for shipping methods.",
      },
      {
        id: "orientations",
        title: "Orientation",
        description: "Horizontal plans next to a vertical group with helper text.",
      },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    category: "forms",
    description: "On/off toggle for immediate settings changes.",
    importNames: ["Switch"],
    subpath: "Switch",
    keywords: ["toggle", "setting"],
    demos: [
      {
        id: "basic",
        title: "With description",
        description: "An immediate on/off setting with supporting copy.",
      },
      {
        id: "states",
        title: "States",
        description: "Off, on, and disabled combinations.",
      },
    ],
  },
  {
    slug: "select",
    name: "Select",
    category: "forms",
    description:
      "Dropdown that lets users pick a single option from a list, with descriptions, disabled options, and a searchable recipe.",
    importNames: ["Select"],
    subpath: "Select",
    keywords: ["dropdown", "picker", "listbox"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Pass items with id and label; selection can be controlled or uncontrolled.",
      },
      {
        id: "helper",
        title: "Helper text",
        description: "Supporting copy under the field, plus a disabled option in the list.",
      },
      {
        id: "error",
        title: "Error",
        description: "Invalid state with an error message.",
      },
      {
        id: "searchable",
        title: "Searchable",
        description: "Filter the list in place with a search field inside the popover.",
      },
    ],
  },
  {
    slug: "combo-box",
    name: "ComboBox",
    category: "forms",
    description: "Text input combined with a filterable listbox for typeahead selection.",
    importNames: ["ComboBox"],
    subpath: "ComboBox",
    keywords: ["autocomplete", "typeahead", "dropdown"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description:
          "Type to filter a known list. Opens on focus and shows an empty state when nothing matches.",
      },
      {
        id: "error",
        title: "Error",
        description: "Invalid state with an error message.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "The whole field is inert, with a selected value still visible.",
      },
    ],
  },
  {
    slug: "autocomplete",
    name: "Autocomplete",
    category: "forms",
    description: "Search-driven suggestion list that filters as the user types.",
    importNames: ["Autocomplete"],
    subpath: "Autocomplete",
    keywords: ["suggestions", "search"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Suggestions filter as you type, but any free-text value is accepted.",
      },
    ],
  },
  {
    slug: "number-field",
    name: "NumberField",
    category: "forms",
    description:
      "Numeric input with stepper buttons, min/max clamping, and locale-aware formatting.",
    importNames: ["NumberField"],
    subpath: "NumberField",
    keywords: ["number", "stepper", "currency"],
    demos: [
      {
        id: "basic",
        title: "Formats and scale",
        description: "Plain quantity, currency formatting, and min/max/step clamping.",
      },
    ],
  },
  {
    slug: "slider",
    name: "Slider",
    category: "forms",
    description: "Single-thumb and range sliders for selecting a value within a range.",
    importNames: ["Slider"],
    subpath: "Slider",
    keywords: ["range", "thumb"],
    demos: [
      {
        id: "basic",
        title: "Single thumb",
        description: "Pick one numeric value in a range.",
      },
      {
        id: "range",
        title: "Range",
        description: "Two thumbs with named start and end labels.",
      },
    ],
  },
  {
    slug: "search-field",
    name: "SearchField",
    category: "forms",
    description: "Text field specialized for search, with a clear button and submit handling.",
    importNames: ["SearchField"],
    subpath: "SearchField",
    keywords: ["search", "filter"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A search input with Escape-to-clear and a clear button once there is a value.",
      },
    ],
  },
  {
    slug: "otp-input",
    name: "OtpInput",
    category: "forms",
    description: "Segmented one-time-passcode input with paste support and auto-advance.",
    importNames: ["OtpInput"],
    subpath: "OtpInput",
    keywords: ["otp", "code", "verification", "pin"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Six boxes that auto-advance, support paste, and announce each digit.",
      },
    ],
  },
  {
    slug: "tags-input",
    name: "TagsInput",
    category: "forms",
    description:
      "Free-text input that turns entries into removable tags, with validation and max-count rules.",
    importNames: ["TagsInput"],
    subpath: "TagsInput",
    keywords: ["tags", "chips", "multi value"],
    demos: [
      {
        id: "basic",
        title: "With tags",
        description: "Enter commits a tag; Backspace on an empty field removes the last one.",
      },
      {
        id: "invalid",
        title: "Invalid",
        description: "Error message when the set does not meet a rule.",
      },
    ],
  },
  {
    slug: "file-input",
    name: "FileInput",
    category: "forms",
    description: "Button-style file picker with file-type and size constraints.",
    importNames: ["FileInput"],
    subpath: "FileInput",
    keywords: ["upload", "file"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Browse files with a labelled trigger. Drag-and-drop is never the only way in.",
      },
    ],
  },
  {
    slug: "drop-zone",
    name: "DropZone",
    category: "forms",
    description: "Drag-and-drop target for files, composable with FileInput for click-to-browse.",
    importNames: ["DropZone", "Text"],
    subpath: "DropZone",
    keywords: ["drag and drop", "upload"],
    demos: [
      {
        id: "basic",
        title: "Drop or paste",
        description: "Accepts text or images via drop or paste; cancelled for other types.",
      },
    ],
  },

  // ── Pickers ─────────────────────────────────────────────────
  {
    slug: "date-picker",
    name: "DatePicker",
    category: "pickers",
    description: "Date field with a calendar popover, min/max limits, and unavailable dates.",
    importNames: ["DatePicker"],
    subpath: "DatePicker",
    keywords: ["date", "calendar"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A labelled date field with a calendar popover and helper text.",
      },
      {
        id: "controlled",
        title: "Controlled",
        description: "Value and onChange keep the selected date in React state.",
      },
      {
        id: "min-max",
        title: "Min, max, unavailable",
        description: "The next two months only, with weekends blocked.",
      },
    ],
  },
  {
    slug: "date-range-picker",
    name: "DateRangePicker",
    category: "pickers",
    description: "Paired start/end date fields with a range calendar popover.",
    importNames: ["DateRangePicker"],
    subpath: "DateRangePicker",
    keywords: ["date range", "calendar"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Paired start and end fields with a range calendar popover.",
      },
      {
        id: "controlled",
        title: "Controlled",
        description: "A start/end CalendarDate pair held in React state.",
      },
    ],
  },
  {
    slug: "date-field",
    name: "DateField",
    category: "pickers",
    description: "Keyboard-editable date field with per-segment navigation, no popover.",
    importNames: ["DateField"],
    subpath: "DateField",
    keywords: ["date", "segments"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Keyboard-editable segments with no popover.",
      },
    ],
  },
  {
    slug: "calendar",
    name: "Calendar",
    category: "pickers",
    description: "Standalone month calendar for choosing a single date.",
    importNames: ["Calendar"],
    subpath: "Calendar",
    keywords: ["date", "month"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Standalone month grid for a single date.",
      },
      {
        id: "unavailable",
        title: "Unavailable dates",
        description: "Min/max window with weekends marked unavailable.",
      },
    ],
  },
  {
    slug: "range-calendar",
    name: "RangeCalendar",
    category: "pickers",
    description: "Standalone calendar for choosing a start and end date.",
    importNames: ["RangeCalendar"],
    subpath: "RangeCalendar",
    keywords: ["date range", "month"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Standalone calendar for choosing a start and end date.",
      },
    ],
  },
  {
    slug: "color-picker",
    name: "ColorPicker",
    category: "pickers",
    description: "Complete color picking popover combining area, sliders, and swatches.",
    importNames: ["ColorPicker"],
    subpath: "ColorPicker",
    keywords: ["color", "hue", "swatch"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Swatch trigger opening the default composed picker.",
      },
      {
        id: "controlled",
        title: "Controlled",
        description: "The selected Color is held in React state and printed below.",
      },
      {
        id: "custom",
        title: "Custom popover",
        description: "Compose ColorArea and ColorField as the popover contents.",
      },
    ],
  },
  {
    slug: "color-area",
    name: "ColorArea",
    category: "pickers",
    description: "Two-dimensional saturation/brightness surface for color selection.",
    importNames: ["ColorArea", "ColorThumb"],
    subpath: "ColorArea",
    keywords: ["color", "saturation"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Two-dimensional saturation and lightness surface.",
      },
    ],
  },
  {
    slug: "color-field",
    name: "ColorField",
    category: "pickers",
    description: "Text field for entering and validating color values.",
    importNames: ["ColorField"],
    subpath: "ColorField",
    keywords: ["color", "hex"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Text field for entering and validating a hex color.",
      },
    ],
  },
  {
    slug: "color-slider",
    name: "ColorSlider",
    category: "pickers",
    description: "Single-channel slider for hue, alpha, or any color channel.",
    importNames: ["ColorSlider"],
    subpath: "ColorSlider",
    keywords: ["color", "hue", "alpha"],
    demos: [
      {
        id: "basic",
        title: "Hue",
        description: "Single-channel slider for hue.",
      },
    ],
  },
  {
    slug: "color-swatch",
    name: "ColorSwatch",
    category: "pickers",
    description: "A single color preview tile.",
    importNames: ["ColorSwatch"],
    subpath: "ColorSwatch",
    keywords: ["color", "preview"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Preview tiles, including a named color and a transparent swatch.",
      },
    ],
  },
  {
    slug: "color-swatch-picker",
    name: "ColorSwatchPicker",
    category: "pickers",
    description: "Grid of selectable color swatches.",
    importNames: ["ColorSwatchPicker", "ColorSwatchPickerItem"],
    subpath: "ColorSwatchPicker",
    keywords: ["color", "palette"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A fixed palette of unique colors with single selection.",
      },
    ],
  },

  // ── Overlays ────────────────────────────────────────────────
  {
    slug: "modal",
    name: "Modal",
    category: "overlays",
    description:
      "Dialog overlay with sizes, footer layouts, header extras, and focus management built in.",
    importNames: ["Modal"],
    subpath: "Modal",
    keywords: ["dialog", "overlay", "popup"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description:
          "A confirmation dialog with a title, supporting description, and Cancel/Delete footer actions, opened from a trigger button.",
      },
      {
        id: "sizes",
        title: "Sizes",
        description: "The sm, md, and lg panel widths, each opened from its own trigger.",
      },
      {
        id: "footer-layouts",
        title: "Footer layouts",
        description:
          "The three footer arrangements — horizontal, single CTA, and stacked — selected per open.",
      },
      {
        id: "header-extras",
        title: "Header extras",
        description:
          "Header variations: a leading icon with description, a trailing badge, and a centered large title without a close button.",
      },
    ],
  },
  {
    slug: "popover",
    name: "Popover",
    category: "overlays",
    description: "Anchored floating panel for lightweight contextual content.",
    importNames: ["Popover"],
    subpath: "Popover",
    keywords: ["overlay", "anchored", "flyout"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description:
          "An icon-button trigger opening a small settings panel of checkboxes anchored to it.",
      },
      {
        id: "placements",
        title: "Placements",
        description:
          "The four base placements — top, right, bottom, and left — each with its pointer arrow rotated to match.",
      },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "overlays",
    description: "Short label shown on hover or focus, with configurable placement.",
    importNames: ["Tooltip"],
    subpath: "Tooltip",
    keywords: ["hint", "hover"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description:
          "A short hint on an icon-only button whose aria-label already names it — the tooltip is a visual bonus.",
      },
      {
        id: "placements",
        title: "Placements",
        description:
          "The tooltip positioned on each side of its trigger: top, right, bottom, and left.",
      },
    ],
  },
  {
    slug: "menu",
    name: "Menu",
    category: "overlays",
    description: "Dropdown menu with sections, keyboard shortcuts, icons, and submenus.",
    importNames: ["Menu", "MenuHeader"],
    subpath: "Menu",
    keywords: ["dropdown", "context menu", "actions"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A simple action menu with a danger-styled Delete item.",
      },
      {
        id: "with-icons",
        title: "With icons",
        description: "Resume actions with a leading icon on every row, ending in a danger Delete.",
      },
      {
        id: "user-menu",
        title: "User menu",
        description: "A MenuHeader profile block with initials, name, and email above the menu items.",
      },
    ],
  },
  {
    slug: "command-palette",
    name: "CommandPalette",
    category: "overlays",
    description:
      "Keyboard-first command launcher (⌘J) with fuzzy filtering — the same component powering this site's search.",
    importNames: ["CommandPalette"],
    subpath: "CommandPalette",
    keywords: ["cmdk", "search", "launcher"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description:
          "A button-triggered palette over a realistic command list — type to filter, or open it from anywhere with ⌘J / Ctrl+J.",
      },
    ],
  },

  // ── Navigation ──────────────────────────────────────────────
  {
    slug: "tabs",
    name: "Tabs",
    category: "navigation",
    description: "Tabbed interface with keyboard navigation, icons, and controlled selection.",
    importNames: ["Tabs", "TabList", "TabPanel"],
    subpath: "Tabs",
    keywords: ["tab", "panel", "switcher"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Three panels behind a labelled tablist.",
      },
      {
        id: "with-icons",
        title: "With icons",
        description: "Icons accompany the visible label rather than replacing it.",
      },
      {
        id: "disabled",
        title: "Disabled tab",
        description: "A tab can be disabled without disabling the whole tablist.",
      },
    ],
  },
  {
    slug: "breadcrumbs",
    name: "Breadcrumbs",
    category: "navigation",
    description: "Hierarchical trail of links showing the user's location.",
    importNames: ["Breadcrumbs", "Breadcrumb"],
    subpath: "Breadcrumbs",
    keywords: ["trail", "hierarchy"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "The last crumb is current and non-interactive.",
      },
      {
        id: "dynamic",
        title: "Dynamic",
        description: "Clicking a crumb truncates the trail via onAction.",
      },
    ],
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    category: "navigation",
    description: "Collapsible application sidebar with nested items, sections, and badges.",
    importNames: ["Sidebar"],
    subpath: "Sidebar",
    keywords: ["nav", "drawer", "menu"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Primary app navigation with icons and a nested Interview section.",
      },
      {
        id: "nested",
        title: "Expanded submenu",
        description: "The active item is a child, so its parent submenu opens.",
      },
      {
        id: "without-icons",
        title: "Without icons",
        description: "The icon prop is optional — labels alone still work.",
      },
    ],
  },
  {
    slug: "link",
    name: "Link",
    category: "navigation",
    description:
      "Styled anchor with standalone and inline variants, external-link handling included.",
    importNames: ["Link"],
    subpath: "Link",
    keywords: ["anchor", "href"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Standalone links in a sentence, including a disabled one.",
      },
    ],
  },

  // ── Data Display ────────────────────────────────────────────
  {
    slug: "table",
    name: "Table",
    category: "data-display",
    description:
      "Data table with sorting, row selection, sticky headers, and a convenience DataTable API.",
    importNames: [
      "Table",
      "TableContainer",
      "TableHeader",
      "TableBody",
      "Column",
      "Row",
      "Cell",
      "DataTable",
    ],
    subpath: "Table",
    keywords: ["grid", "rows", "columns", "data"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Composable TableHeader/Column/TableBody/Row/Cell inside a scrolling container.",
      },
      {
        id: "sorting",
        title: "Sorting",
        description: "allowsSorting on columns plus sortDescriptor / onSortChange.",
      },
      {
        id: "data-table",
        title: "DataTable",
        description: "Columns/rows convenience API with a searchable filter field.",
      },
    ],
  },
  {
    slug: "card",
    name: "Card",
    category: "data-display",
    description: "Surface container for grouping related content, composable with any children.",
    importNames: ["Card"],
    subpath: "Card",
    keywords: ["panel", "surface", "container"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A severity-tinted expandable finding.",
      },
      {
        id: "severities",
        title: "Severities",
        description: "Urgent through neutral, each with a text label so color is never the only cue.",
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    category: "data-display",
    description: "Compact status label with semantic color variants and optional icons.",
    importNames: ["Badge"],
    subpath: "Badge",
    keywords: ["tag", "label", "status", "pill"],
    demos: [
      {
        id: "severities",
        title: "Severities",
        description: "The six semantic grades on the default soft type.",
      },
      {
        id: "types",
        title: "Types",
        description: "Solid, soft, and border treatments across every severity.",
      },
    ],
  },
  {
    slug: "badge-group",
    name: "BadgeGroup",
    category: "data-display",
    description: "Announcement-style badge pairing a highlighted label with a message.",
    importNames: ["BadgeGroup"],
    subpath: "BadgeGroup",
    keywords: ["announcement", "banner"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Inline with an icon, and stacked with a leading badge.",
      },
    ],
  },
  {
    slug: "tag-group",
    name: "TagGroup",
    category: "data-display",
    description: "Set of selectable or removable tags with keyboard support.",
    importNames: ["TagGroup"],
    subpath: "TagGroup",
    keywords: ["chips", "filter", "removable"],
    demos: [
      {
        id: "basic",
        title: "Selectable",
        description: "Multiple-select filter chips from a fixed set.",
      },
      {
        id: "removable",
        title: "Removable",
        description: "onRemove adds a delete button and Backspace shortcut to every tag.",
      },
    ],
  },
  {
    slug: "list-box",
    name: "ListBox",
    category: "data-display",
    description:
      "Standalone selectable list with sections, descriptions, and multiple selection modes.",
    importNames: ["ListBox"],
    subpath: "ListBox",
    keywords: ["list", "options", "selection"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A standalone list with a disabled option.",
      },
      {
        id: "descriptions",
        title: "Descriptions",
        description: "Secondary lines and multiple selection.",
      },
    ],
  },
  {
    slug: "grid-list",
    name: "GridList",
    category: "data-display",
    description:
      "Interactive list with grid semantics: selection, actions, and drag handles per row.",
    importNames: ["GridList"],
    subpath: "GridList",
    keywords: ["list", "rows", "selection"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Rows with a thumbnail, title, and description.",
      },
      {
        id: "actions",
        title: "With actions",
        description: "Trailing controls sit in their own grid cell, reachable with Tab.",
      },
    ],
  },

  // ── Feedback ────────────────────────────────────────────────
  {
    slug: "toast",
    name: "Toast",
    category: "feedback",
    description: "Queue-based transient notifications with variants, actions, and auto-dismiss.",
    importNames: ["ToastRegion", "toastQueue"],
    subpath: "Toast",
    keywords: ["notification", "snackbar", "alert"],
    demos: [
      {
        id: "basic",
        title: "Variants",
        description:
          "One ToastRegion mounted once; buttons enqueue neutral, success, warning, and error toasts through the shared toastQueue.",
      },
    ],
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "feedback",
    description: "Indeterminate loading indicator in multiple sizes.",
    importNames: ["Spinner"],
    subpath: "Spinner",
    keywords: ["loading", "busy"],
    demos: [
      {
        id: "sizes",
        title: "Sizes",
        description: "All five icon-scale sizes from xs to xl, each with its own accessible label.",
      },
    ],
  },
  {
    slug: "progress-bar",
    name: "ProgressBar",
    category: "feedback",
    description: "Determinate and indeterminate progress, as a bar or a circle.",
    importNames: ["ProgressBar", "ProgressCircle"],
    subpath: "ProgressBar",
    keywords: ["loading", "percent"],
    demos: [
      {
        id: "states",
        title: "Bar states",
        description: "A determinate value, a custom min/max range, and an indeterminate loading bar.",
      },
      {
        id: "circle",
        title: "Progress circle",
        description: "ProgressCircle rendered at every icon-scale size plus an indeterminate ring.",
      },
    ],
  },
  {
    slug: "meter",
    name: "Meter",
    category: "feedback",
    description: "Gauge showing a measurement within a known range, with severity coloring.",
    importNames: ["Meter"],
    subpath: "Meter",
    keywords: ["gauge", "usage", "capacity"],
    demos: [
      {
        id: "severity",
        title: "Severity levels",
        description:
          "The fill color grades by value — excellent below 70%, fair to 89%, fail at 90% and above.",
      },
    ],
  },

  // ── Layout ──────────────────────────────────────────────────
  {
    slug: "group",
    name: "Group",
    category: "layout",
    description: "Associates related controls under a shared label for assistive technology.",
    importNames: ["Group"],
    subpath: "Group",
    keywords: ["fieldset", "grouping"],
    demos: [
      {
        id: "basic",
        title: "Segmented input",
        description: "Unstyled Inputs sharing one field box for a split identifier.",
      },
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    category: "layout",
    description: "Horizontal or vertical rule separating content regions.",
    importNames: ["Separator"],
    subpath: "Separator",
    keywords: ["divider", "rule"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Horizontal rule between sections, and a vertical rule in a toolbar row.",
      },
    ],
  },
  {
    slug: "disclosure",
    name: "Disclosure",
    category: "layout",
    description: "Expandable section (accordion) with grouped, exclusive-open support.",
    importNames: ["Disclosure", "DisclosureHeader", "DisclosurePanel", "DisclosureGroup"],
    subpath: "Disclosure",
    keywords: ["accordion", "collapse", "expand"],
    demos: [
      {
        id: "basic",
        title: "Accordion",
        description: "DisclosureGroup with exclusive-open sections.",
      },
    ],
  },

  // ── AI & Chat ───────────────────────────────────────────────
  {
    slug: "alice",
    name: "Alice",
    category: "ai",
    description:
      "AI assistant primitives: animated icon, chat bubbles, and suggestion/rewrite/question cards.",
    importNames: [
      "AliceIcon",
      "ChatBubble",
      "AliceQuestionCard",
      "AliceRewriteCard",
      "AliceSuggestion",
      "AliceContributionRef",
    ],
    subpath: "Alice",
    keywords: ["assistant", "chat", "ai", "bubble"],
    demos: [
      {
        id: "icon-states",
        title: "Icon states",
        description: "Idle, action, and loading marks.",
      },
      {
        id: "chat-bubbles",
        title: "Chat bubbles",
        description: "User and Alice turns, including a quoted snippet.",
      },
      {
        id: "questions",
        title: "Questions",
        description: "An unanswered prompt and the completed count.",
      },
      {
        id: "rewrite",
        title: "Rewrite card",
        description: "Accept/dismiss a suggested rewrite with a next preview.",
      },
      {
        id: "suggestion-cards",
        title: "Suggestion cards",
        description: "A coaching suggestion and a contribution reference.",
      },
    ],
  },

  // ── Utilities ───────────────────────────────────────────────
  {
    slug: "virtualizer",
    name: "Virtualizer",
    category: "utilities",
    description:
      "Windowed rendering for large collections, with list, grid, waterfall, and table layouts.",
    importNames: ["Virtualizer", "ListLayout", "GridLayout"],
    subpath: "Virtualizer",
    keywords: ["virtual scroll", "performance", "large list"],
    demos: [
      {
        id: "list",
        title: "List layout",
        description: "Five thousand rows windowed to the viewport.",
      },
      {
        id: "grid",
        title: "Grid layout",
        description: "A thousand cards in a virtualized CSS grid.",
      },
    ],
  },

];

export const bySlug: ReadonlyMap<string, ComponentEntry> = new Map(
  registry.map((entry) => [entry.slug, entry]),
);
