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
      {
        id: "default-selected",
        title: "Default selected",
        description: "An uncontrolled toggle that starts pressed via defaultSelected, with no selected/onChange wiring needed.",
      },
      {
        id: "sizes",
        title: "Sizes",
        description: "Small, medium, and large sizes side by side.",
      },
      {
        id: "icon-only",
        title: "Icon-only",
        description: "Icon-only toggles omit children and require an aria-label instead, the same contract as Button.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A disabled toggle button — not focusable or actionable.",
      },
      {
        id: "controlled-selection",
        title: "Controlled selection",
        description: "selected and onChange mirror the pressed state into React state, shown here with a live on/off readout.",
      },
      {
        id: "stateful-icon-toggles",
        title: "Dark mode / mute toggles",
        description: "Two independent icon-only toggles — dark mode and mute — each swapping its own icon on selection.",
      },
      {
        id: "alignment-toolbar",
        title: "Alignment toolbar",
        description: "Single selection with disallowEmptySelection gives a horizontal icon row radio-group semantics, e.g. text alignment.",
      },
      {
        id: "view-switcher",
        title: "View switcher",
        description: "A two-option single-selection group labelled with icon and text — the same group doubles as a segmented control.",
      },
      {
        id: "segmented-control-animation",
        title: "Animated segmented control",
        description: "react-aria-components' SelectionIndicator slides an animated pill between items as selection changes.",
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
      {
        id: "server-validation-errors",
        title: "Server validation errors",
        description: "An errorMessage set after submit shows how a server-side validation error is surfaced, distinct from native required-field validation.",
      },
      {
        id: "focus-management",
        title: "Custom invalid-submit focus",
        description: "onInvalid intercepts the native focus-first-invalid-field behavior and instead focuses a summary alert above the fields.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "value and onChange are driven entirely from React state, rather than left uncontrolled.",
      },
      {
        id: "leading-icon",
        title: "Leading icon",
        description: "An icon inside the field via leadingIcon — distinct from prefix, which adds a divided slot instead.",
      },
      {
        id: "unstyled",
        title: "Unstyled",
        description: "The bare react-aria-components Input with no label or field chrome, for composing inside a container like Group that supplies its own box and focus ring.",
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
      {
        id: "inline-mentions",
        title: "Inline @mentions",
        description: "A composition recipe combining Textarea with react-aria-components' Autocomplete, Popover, and Menu for inline @mention completions.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "Track checked state externally with checked and onChange.",
      },
      {
        id: "group-horizontal",
        title: "Horizontal group",
        description: "Options laid out side by side instead of stacked vertically.",
      },
      {
        id: "group-disabled",
        title: "Disabled group",
        description: "An entire group disabled at once, overriding every option inside it.",
      },
      {
        id: "group-controlled",
        title: "Controlled group",
        description: "Track the selected values externally with value and onChange.",
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
      {
        id: "error",
        title: "Error state",
        description: "A required group showing a validation error message.",
      },
      {
        id: "disabled",
        title: "Disabled group",
        description: "An entire group disabled at once, overriding every option inside it.",
      },
      {
        id: "disabled-option",
        title: "Disabled option",
        description: "A single option disabled while the rest of the group stays interactive.",
      },
      {
        id: "controlled",
        title: "Controlled",
        description: "Track the selected value externally with value and onChange.",
      },
      {
        id: "form",
        title: "Form submission",
        description: "A required RadioGroup wired into a native form, with name and a submit button.",
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
      {
        id: "error",
        title: "Error state",
        description: "A required switch showing a validation error message.",
      },
      {
        id: "controlled",
        title: "Controlled",
        description: "Track checked state externally with checked and onChange.",
      },
      {
        id: "form",
        title: "Form submission",
        description: "A required Switch wired into a native form, with name and a submit button.",
      },
    ],
  },
  {
    slug: "select",
    name: "Select",
    category: "forms",
    description:
      "Dropdown that lets users pick a single option from a list, with descriptions, disabled options, and a searchable recipe. For multi-select dropdowns, use Menu with selectionMode or ListBox.",
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
      {
        id: "multi-select-menu",
        title: "Multi-select dropdown",
        description:
          "Select is single-value only. For a checkable multi-select dropdown (Figma's Select Menu), use Menu with selectionMode=\"multiple\".",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "The whole field is inert, with a selected value still visible.",
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
        description: "Type to filter a known list. Opens on focus and shows an empty state when nothing matches.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "selectedKey and onSelectionChange keep the choice in React state.",
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
      {
        id: "controlled",
        title: "Controlled value",
        description: "value and onChange keep the quantity in React state.",
      },
      {
        id: "percent",
        title: "Format options (percent)",
        description: "formatOptions with style: \"percent\" turns a fractional value like 0.05 into 5%.",
      },
      {
        id: "numbering-system",
        title: "Numbering system",
        description: "I18nProvider drives locale-aware digit rendering, e.g. Arabic-Indic numerals via ar-AE-u-nu-arab.",
      },
      {
        id: "in-form",
        title: "In a form",
        description: "A required NumberField inside Form, submitted with Button.",
      },
      {
        id: "helper",
        title: "Helper text",
        description: "Supporting copy under the field.",
      },
      {
        id: "error",
        title: "Error",
        description: "Invalid state with an error message.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "The whole field is inert, including the stepper buttons.",
      },
      {
        id: "required",
        title: "Required",
        description: "Marks the field as required with the visible asterisk.",
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
      {
        id: "controlled",
        title: "Controlled value",
        description: "Value and onChange keep the slider in React state, with onChangeEnd firing only once dragging stops.",
      },
      {
        id: "value-scale",
        title: "Min, max, step",
        description: "Custom minValue, maxValue, and step define a coarser value scale.",
      },
      {
        id: "vertical",
        title: "Vertical",
        description: "Vertical orientation for the single-thumb slider.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A disabled slider that cannot be focused or dragged.",
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
      {
        id: "hidden-label",
        title: "Hidden label",
        description: "Label stays in the accessibility tree while hidden visually, for use beside a placeholder or trigger that already conveys purpose.",
      },
      {
        id: "error",
        title: "Error",
        description: "Error message state, announced alongside the search input.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A disabled search field with a preset, read-only value.",
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
      {
        id: "four-digits",
        title: "Four digits",
        description: "A shorter code length, still with auto-advance and paste support.",
      },
      {
        id: "error",
        title: "Error",
        description: "Error message state after an incorrect code.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A disabled code input with a partially filled value.",
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
      {
        id: "empty",
        title: "Empty",
        description: "The field's default state — no tags yet, with helper text.",
      },
      {
        id: "wrapping",
        title: "Wrapping past one line",
        description: "Enough tags to wrap onto multiple lines within the field.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A disabled tags input with existing tags and no remove buttons.",
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
      {
        id: "accept-pdf-only",
        title: "Accept PDF only",
        description: "Restricts the OS file picker and drop target to a single file type.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A disabled file input that rejects drops and clicks.",
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
      {
        id: "with-file-trigger",
        title: "With FileTrigger",
        description: "Pairs the drop target with a FileTrigger button as a keyboard- and touch-accessible fallback.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A disabled drop zone that rejects drops and paste.",
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
      {
        id: "disabled",
        title: "Disabled",
        description: "The field and its trigger are inert, with a selected date still visible.",
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
      {
        id: "min-max",
        title: "Min, max, unavailable",
        description: "The next two months only, with weekends blocked.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "The whole field is inert, with a selected range still visible.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "Value and onChange keep the selected date in React state.",
      },
      {
        id: "with-time",
        title: "With time",
        description: "A ZonedDateTime value adds an hour/minute segment pair (granularity=minute).",
      },
      {
        id: "required",
        title: "Required",
        description: "Required with a minimum value of today.",
      },
      {
        id: "helper-text",
        title: "Helper text",
        description: "A format hint shown below the segmented field.",
      },
      {
        id: "error",
        title: "Error",
        description: "Invalid state with an error message below the field.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "The whole field is inert, with a selected date still visible.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "Value and onChange keep the selected date in React state.",
      },
      {
        id: "multi-month",
        title: "Multi-month",
        description: "Two months shown side by side via visibleDuration.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "The whole grid is inert, with a selected date still visible.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "The selected start/end range is held in React state instead of using defaultValue.",
      },
      {
        id: "validation",
        title: "Validation",
        description: "Min/max date window with weekends marked unavailable and a custom error message.",
      },
      {
        id: "multi-month",
        title: "Multi-month",
        description: "Displays two months side by side via visibleDuration.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A fully disabled range calendar with a preset value.",
      },
      {
        id: "non-contiguous-ranges",
        title: "Non-contiguous ranges",
        description: "allowsNonContiguousRanges plus a per-anchor max-stay validation rule and blocked date intervals.",
      },
      {
        id: "international-calendar",
        title: "International calendar",
        description: "Wrapping in I18nProvider switches the calendar system to the Hebrew calendar.",
      },
      {
        id: "custom-calendar-system",
        title: "Custom calendar system",
        description: "createCalendar accepts any @internationalized/date Calendar — here, a fiscal 4-5-4 year.",
      },
      {
        id: "display-options",
        title: "Display options",
        description: "Two visible months with single-page navigation and the week starting on Monday.",
      },
      {
        id: "controlled-focused-date",
        title: "Controlling the focused date",
        description: "focusedValue/onFocusChange drive keyboard focus programmatically, e.g. via a Today button.",
      },
      {
        id: "month-year-pickers",
        title: "Month and year pickers",
        description: "Composes the raw react-aria-components primitives with CalendarMonthPicker/CalendarYearPicker header dropdowns.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "The selected Color is held in React state instead of using defaultValue.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A fully disabled color area.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "The selected Color is held in React state instead of using defaultValue.",
      },
      {
        id: "channel",
        title: "Single channel",
        description: "Edits just the hue channel, e.g. paired with a ColorArea for saturation/lightness.",
      },
      {
        id: "helper-text",
        title: "Helper text",
        description: "Adds supporting helperText below the field.",
      },
      {
        id: "error",
        title: "Error",
        description: "An errorMessage renders the field in its invalid state.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A fully disabled color field.",
      },
      {
        id: "required",
        title: "Required",
        description: "Marks the field as required with a visible indicator.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "The selected Color is held in React state instead of using defaultValue.",
      },
      {
        id: "alpha-channel",
        title: "Alpha channel",
        description: "Adjusts the alpha channel against a checkerboard transparency backdrop.",
      },
      {
        id: "vertical",
        title: "Vertical",
        description: "Renders the track top-to-bottom via orientation=\"vertical\".",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A fully disabled color slider.",
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
      {
        id: "accessible-name",
        title: "Accessible name",
        description: "Combining colorName and aria-label produces a concatenated accessible name for screen readers.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "The selected Color is held in React state and printed below.",
      },
      {
        id: "stack",
        title: "Stack layout",
        description: "layout=\"stack\" arranges the swatches vertically instead of in a row.",
      },
      {
        id: "with-disabled-swatch",
        title: "Disabled swatch",
        description: "One ColorSwatchPickerItem is disabled and unselectable.",
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
      {
        id: "non-dismissable",
        title: "Non-dismissable",
        description: "isDismissable={false} disables Escape and outside-click — only an explicit footer button can close the dialog.",
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
      {
        id: "custom-trigger",
        title: "Custom trigger",
        description: "Any focusable element with an interactive ARIA role can open the popover — here a plain <span role=\"button\">, not the library's Button.",
      },
      {
        id: "custom-anchor",
        title: "Custom anchor",
        description: "Omitting trigger and supplying triggerRef + isOpen/onOpenChange instead anchors the popover to an element other than its own open control.",
      },
      {
        id: "without-arrow",
        title: "Without arrow",
        description: "hideArrow drops the pointer arrow and tightens the offset, for a popover anchored to a wide region rather than a single point.",
      },
      {
        id: "icon-only-trigger",
        title: "Icon-only trigger",
        description: "An icon-only trigger still needs an accessible name (WCAG 4.1.2) — enforced here via aria-label on a text-variant Button.",
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
        description:
          "Resume actions with a leading icon on every row, ending in a danger Delete.",
      },
      {
        id: "user-menu",
        title: "User menu",
        description:
          "A MenuHeader profile block with initials, name, and email above the menu items.",
      },
      {
        id: "selection-multiple",
        title: "Multi-select",
        description:
          "selectionMode=\"multiple\" turns rows into checkable menuitemcheckbox options.",
      },
      {
        id: "selection-single",
        title: "Single-select card",
        description:
          "Card variant with selectionMode=\"single\" for choosing one detailed option.",
      },
      {
        id: "disabled-items",
        title: "Disabled items",
        description: "Individual rows can be disabled independently of the trigger — only Edit is interactive here.",
      },
      {
        id: "placements",
        title: "Placements",
        description: "The menu's four anchor placements — bottom start, bottom end, top start, and top end.",
      },
      {
        id: "searchable",
        title: "Searchable",
        description: "searchable adds a filterable search field above the items, built on Autocomplete (a designed pattern, not in the source Figma file).",
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
  {
    slug: "preview-trigger",
    name: "PreviewTrigger",
    category: "overlays",
    description:
      "Non-modal popover that opens on hover, focus, or long press — unlike Tooltip, its content may be interactive.",
    importNames: ["PreviewTrigger"],
    subpath: "PreviewTrigger",
    keywords: ["hover card", "rich tooltip", "preview"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description:
          "Hovering or focusing an inline Link opens a richer, interactive preview than a Tooltip could hold — a profile card with its own Button.",
      },
      {
        id: "interactions",
        title: "Interactions",
        description:
          "Previews open after a warmup delay (default 600ms); once one is open, others appear immediately. Tab moves focus into an open preview, and Escape closes it and returns focus to the trigger.",
      },
      {
        id: "custom-trigger",
        title: "Custom trigger",
        description:
          "Wrap a plain or third-party element in Focusable (from react-aria-components) and give it an explicit role to make it a valid trigger.",
      },
      {
        id: "placements",
        title: "Placements",
        description:
          "The four base placements — top, right, bottom, and left — each with its pointer arrow rotated to match.",
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
      {
        id: "controlled",
        title: "Controlled",
        description: "selectedKey and onSelectionChange keep the active tab in React state.",
      },
      {
        id: "settings-panels",
        title: "Settings panels (composed forms)",
        description: "Each panel composes this library's own form primitives — Input, Checkbox, RadioGroup, CheckboxGroup — and only the selected panel is mounted.",
      },
      {
        id: "dynamic",
        title: "Dynamic collection (add / remove tabs)",
        description: "Tabs driven from React state; add/remove buttons keep at least one tab so selection always has somewhere to land.",
      },
      {
        id: "vertical",
        title: "Vertical orientation",
        description: "orientation=\"vertical\" puts the track beside the panels and switches arrow-key navigation to Up/Down.",
      },
      {
        id: "manual-activation",
        title: "Manual keyboard activation",
        description: "keyboardActivation=\"manual\": arrow keys move focus without selecting; Enter or Space commits.",
      },
      {
        id: "as-links",
        title: "Tabs as links",
        description: "href on an item renders that tab as a real <a>, so it supports open-in-new-tab and copy-link.",
      },
      {
        id: "all-disabled",
        title: "All tabs disabled",
        description: "isDisabled on Tabs disables every tab in the list at once.",
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
      {
        id: "disabled-crumb",
        title: "Disabled crumb",
        description: "A single crumb can be disabled without affecting the rest of the trail; it renders as inert text instead of a link.",
      },
      {
        id: "all-disabled",
        title: "All crumbs disabled",
        description: "isDisabled on Breadcrumbs disables every crumb in the trail at once.",
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
      {
        id: "no-active-item",
        title: "No active item",
        description: "Sidebar with no activeId set — nothing is marked current.",
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
      {
        id: "press-handler",
        title: "onPress (no href)",
        description: "Without an href, Link renders a <span role=\"link\"> driven entirely by onPress instead of native navigation.",
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
        wide: true,
      },
      {
        id: "sorting",
        title: "Sorting",
        description: "allowsSorting on columns plus sortDescriptor / onSortChange.",
        wide: true,
      },
      {
        id: "data-table",
        title: "DataTable",
        description: "Columns/rows convenience API with a searchable filter field.",
        wide: true,
      },
      {
        id: "selection",
        title: "Row selection",
        description:
          "Multiple selection with select-all, a disabled row, and onRowAction.",
        wide: true,
      },
      {
        id: "striped-compact",
        title: "Striped + compact density",
        description: "Zebra-striped rows with the compact density option for scanning dense data.",
        wide: true,
      },
      {
        id: "row-links",
        title: "Rows as links",
        description: "Rows rendered as navigable links via href, target, and rel instead of row actions.",
        wide: true,
      },
      {
        id: "empty-state",
        title: "Empty state",
        description: "Custom renderEmptyState content shown when a table has no rows to display.",
        wide: true,
      },
      {
        id: "dynamic-content",
        title: "Dynamic columns, rows + footer totals",
        description: "Toggleable columns, appendable rows, and a computed footer total driven by TableHeader/TableBody render functions.",
        wide: true,
      },
      {
        id: "expandable-rows",
        title: "Expandable (tree) rows",
        description: "treeColumn upgrades the grid to a treegrid with expandedKeys-driven nested rows.",
        wide: true,
      },
      {
        id: "async-loading",
        title: "Async loading + infinite scroll",
        description: "TableLoadMoreItem as a scroll sentinel that fetches additional pages with a loading spinner empty state.",
        wide: true,
      },
      {
        id: "column-resizing",
        title: "Column resizing (widths persisted)",
        description: "Keyboard- and pointer-operable column resizing inside a resizable TableContainer, with widths persisted to localStorage.",
        wide: true,
      },
      {
        id: "drag-and-drop",
        title: "Drag and drop reordering",
        description: "Pointer, touch, and keyboard-operable row reordering via useDragAndDrop and useListData.",
        wide: true,
      },
      {
        id: "stacked-responsive",
        title: "Responsive stacked layout",
        description: "The stacked prop collapses rows into labelled cards below a 40rem container width via a container query.",
        wide: true,
      },
      {
        id: "advanced-showcase",
        title: "Advanced responsive data grid",
        description: "Search, column visibility, sortable columns, multi-selection with a bulk-action toolbar, status badges, and sticky header/footer combined into one realistic candidate pipeline table.",
        wide: true,
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
      {
        id: "default-expanded",
        title: "Default expanded",
        description: "defaultExpanded opens the card on first render instead of starting collapsed.",
      },
      {
        id: "non-collapsible",
        title: "Non-collapsible",
        description: "collapsible={false} renders a static div instead of a <details> disclosure, for content that should always be visible.",
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    category: "data-display",
    audiences: ["generic", "client"],
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
      {
        id: "with-icon",
        title: "With icon",
        description: "A leading icon can accompany the badge's text label.",
      },
      {
        id: "design-modes",
        title: "Design modes",
        description:
          "designMode forces the generic/client/admin design for one instance. Generic and client render identically today — this is the hook a future admin-specific redesign would target.",
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
      {
        id: "content-types",
        title: "Content types",
        description: "The same BadgeGroup composed for three different real-world patterns: a voice quote, a rating, and a section header.",
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
      {
        id: "searchable",
        title: "Searchable",
        description: "Filter chips in place while keeping multiple selection.",
      },
      {
        id: "error-state",
        title: "Error state",
        description: "errorMessage renders validation feedback below the tag list.",
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
      {
        id: "multiple",
        title: "Multiple selection",
        description: "selectionMode=\"multiple\" with defaultSelectedKeys.",
      },
      {
        id: "searchable",
        title: "Searchable multi-select",
        description: "Filter a longer list in place while selecting several options.",
      },
      {
        id: "empty-state",
        title: "Empty search results",
        description: "A searchable list with no items, showing the built-in \"No results found.\" empty state.",
      },
      {
        id: "async-loading",
        title: "Async loading (controlled inputValue)",
        description: "The react-aria-components fully-controlled Autocomplete recipe: inputValue/onInputChange drives an async data source instead of client-side filtering.",
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
      {
        id: "multiple",
        title: "Multiple selection",
        description: "Select several people at once with selectionMode=\"multiple\".",
      },
      {
        id: "searchable",
        title: "Searchable (filterable via Autocomplete)",
        description: "A SearchField wired to Autocomplete filters the rows in place.",
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
      {
        id: "title-only",
        title: "Title only",
        description: "A toast with no description line.",
      },
      {
        id: "auto-dismiss",
        title: "Auto-dismiss after 5s",
        description: "timeout: 5000 auto-closes the toast; the timer pauses while hovered or focused.",
      },
      {
        id: "stacked",
        title: "Multiple toasts stack",
        description: "Repeated clicks enqueue several toasts that stack in the region.",
      },
      {
        id: "programmatic-dismissal",
        title: "Programmatic dismissal",
        description: "queue.add returns a key that a later queue.close(key) call can dismiss without user interaction.",
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
      {
        id: "custom-range",
        title: "Custom range",
        description: "minValue/maxValue set a range other than the default 0-100.",
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
      {
        id: "with-inline-button",
        title: "Input paired with an inline button",
        description: "A text input and an inline Apply button sharing one field box.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "Group and its child input rendered in the disabled state.",
      },
      {
        id: "invalid",
        title: "Invalid",
        description: "Group rendered in the invalid state (designed, not in Figma).",
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
        id: "single",
        title: "Single section",
        description:
          "A standalone collapsible section — header toggles the panel.",
      },
      {
        id: "basic",
        title: "Accordion",
        description: "DisclosureGroup with exclusive-open sections.",
      },
      {
        id: "default-expanded",
        title: "Default expanded",
        description: "A single Disclosure that starts open via defaultExpanded.",
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "A Disclosure rendered in the disabled state.",
      },
      {
        id: "controlled",
        title: "Controlled",
        description: "Expanded state driven from outside the component via expanded/onExpandedChange.",
      },
      {
        id: "group-multiple",
        title: "Accordion (multiple expanded)",
        description: "DisclosureGroup with allowsMultipleExpanded, several sections open at once.",
      },
    ],
  },

  // ── AI & Chat ───────────────────────────────────────────────
  {
    slug: "alice",
    name: "Alice",
    category: "ai",
    audiences: ["client"],
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
      {
        id: "rewrite-single",
        title: "Single rewrite",
        description: "A minimal rewrite suggestion without the multi-item title, count, or dismiss chrome.",
      },
      {
        id: "question-flow",
        title: "Interactive question flow",
        description: "Type an answer, navigate with Prev/Next, and reach the completed state.",
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
        wide: true,
      },
      {
        id: "grid",
        title: "Grid layout",
        description: "A thousand cards in a virtualized CSS grid.",
        wide: true,
      },
      {
        id: "table",
        title: "Table layout",
        description: "Two thousand rows in a virtualized table with fixed column headers.",
        wide: true,
      },
    ],
  },


  // ── React Aria Hooks ────────────────────────────────────────
  {
    slug: "use-press",
    name: "usePress",
    category: "hooks",
    description:
      "Normalizes press across mouse, touch, keyboard (Enter/Space), and screen-reader virtual clicks — the primitive behind Button.",
    importNames: ["usePress"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["press", "click", "pointer"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Press start/end/press events with pointerType, plus an isPressed highlight.",
      },
    ],
  },
  {
    slug: "use-hover",
    name: "useHover",
    category: "hooks",
    description:
      "Pointer hover that ignores emulated mouse events on touch — unlike CSS :hover, which can stick after a tap.",
    importNames: ["useHover"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["hover", "pointer"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Hover start/end with pointerType.",
      },
    ],
  },
  {
    slug: "use-long-press",
    name: "useLongPress",
    category: "hooks",
    description:
      "Fires after a held press (500ms by default) and cancels competing usePress handlers once it wins.",
    importNames: ["useLongPress", "usePress", "mergeProps"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["long press", "hold"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Short press vs long press on the same button.",
      },
    ],
  },
  {
    slug: "use-keyboard",
    name: "useKeyboard",
    category: "hooks",
    description:
      "Keyboard handlers with stopped propagation by default, plus a Mod+/Arrow shortcuts map.",
    importNames: ["useKeyboard"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["keyboard", "shortcuts"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Parent/child handlers and Mod+S / arrow shortcuts.",
      },
    ],
  },
  {
    slug: "use-move",
    name: "useMove",
    category: "hooks",
    description:
      "Relative move deltas from pointer drag and from arrow keys after focus — for custom sliders and free dragging.",
    importNames: ["useMove"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["drag", "move", "arrows"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Drag a ball with pointer or arrow keys.",
      },
    ],
  },
  {
    slug: "use-focus",
    name: "useFocus",
    category: "hooks",
    description:
      "Focus events for the immediate target only — never when a descendant gains focus.",
    importNames: ["useFocus"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["focus", "blur"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "focus, blur, and focus change on a single input.",
      },
    ],
  },
  {
    slug: "use-focus-within",
    name: "useFocusWithin",
    category: "hooks",
    description:
      "Focus for an element and its descendants — the JS equivalent of :focus-within.",
    importNames: ["useFocusWithin"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["focus-within", "group"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A field group that highlights while focus is anywhere inside.",
      },
    ],
  },
  {
    slug: "use-focus-ring",
    name: "useFocusRing",
    category: "hooks",
    description:
      "Keyboard-only focus visibility as a boolean — style with inline styles or a data attribute.",
    importNames: ["useFocusRing"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["focus-visible", "ring"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "isFocusVisible drives an inline box-shadow.",
      },
    ],
  },
  {
    slug: "use-focus-visible",
    name: "useFocusVisible",
    category: "hooks",
    description:
      "Page-level keyboard focus visibility — the primitive behind useFocusRing and FocusRing.",
    importNames: ["useFocusVisible"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["focus-visible", "global"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A global isFocusVisible readout.",
      },
    ],
  },
  {
    slug: "focus-ring",
    name: "FocusRing",
    category: "hooks",
    description:
      "Applies a CSS class only while the user navigates with the keyboard — never on mouse or touch.",
    importNames: ["FocusRing"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["focus-visible", "class"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "focusRingClass on a plain button.",
      },
    ],
  },
  {
    slug: "focus-scope",
    name: "FocusScope",
    category: "hooks",
    description:
      "Contains Tab, auto-focuses on mount, and restores focus on unmount — the contract Modal relies on.",
    importNames: ["FocusScope"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["focus trap", "modal", "dialog"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Open a contained dialog that restores focus on close.",
      },
      {
        id: "roving-focus-toolbar",
        title: "Roving focus toolbar",
        description: "useFocusManager reads FocusScope's focus-movement API for arrow-key roving tabindex, instead of each button tracking its own index.",
      },
    ],
  },
  {
    slug: "use-clipboard",
    name: "useClipboard",
    category: "hooks",
    description:
      "Copy/cut/paste via the OS clipboard with multiple formats — the keyboard-accessible alternative to drag-and-drop.",
    importNames: ["useClipboard"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["copy", "paste", "clipboard"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Mod+C from one box, Mod+V into another.",
      },
    ],
  },
  {
    slug: "use-drag",
    name: "useDrag",
    category: "hooks",
    description:
      "Draggable elements with mouse/touch and keyboard/screen-reader parity, plus a custom DragPreview.",
    importNames: ["useDrag", "useDrop", "DragPreview"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["drag", "drop", "dnd"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Drag a chip onto a drop target (pointer or keyboard).",
      },
    ],
  },
  {
    slug: "use-drop",
    name: "useDrop",
    category: "hooks",
    description:
      "Drop targets that accept dragged items, including keyboard-accessible drop.",
    importNames: ["useDrop", "useDrag", "DragPreview"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["drop", "dnd"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "A droppable region paired with a draggable source.",
      },
    ],
  },
  {
    slug: "use-context-menu",
    name: "useContextMenu",
    category: "hooks",
    description:
      "Normalizes right-click, Control+click, long-press, and Shift+F10 into one onContextMenu callback.",
    importNames: ["useContextMenu"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["context menu", "right click"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Logs coordinates from the normalized context menu event.",
      },
    ],
  },
  {
    slug: "use-landmark",
    name: "useLandmark",
    category: "hooks",
    description:
      "Registers navigable landmarks and enables F6 / Shift+F6 cycling (Alt+F6 jumps to main).",
    importNames: ["useLandmark"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["landmark", "F6", "navigation"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Navigation, search, and region landmarks.",
      },
    ],
  },
  {
    slug: "use-draggable-collection",
    name: "useDraggableCollection",
    category: "hooks",
    description:
      "Extends useDrag's mouse/touch/keyboard parity to an entire collection (list box, grid, table) at once — each item becomes individually draggable, and a multi-selection drags every selected item together.",
    importNames: ["useDraggableCollection", "useDraggableItem", "useDrop"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["drag", "collection", "reorder", "dnd"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Select and drag categories from a list box onto a drop target (pointer or keyboard).",
      },
    ],
  },
  {
    slug: "use-droppable-collection",
    name: "useDroppableCollection",
    category: "hooks",
    description:
      "The collection-level counterpart to useDrop: an entire list, grid, or table becomes droppable, with per-item and between-item drop positions reported through a DropIndicator, plus keyboard/screen-reader parity via ListKeyboardDelegate and ListDropTargetDelegate.",
    importNames: ["useDroppableCollection", "useDroppableItem", "useDropIndicator", "useDrag"],
    subpath: "",
    importPackage: "react-aria",
    skipTreeShake: true,
    keywords: ["drop", "collection", "reorder", "dnd"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Drag a file chip onto a list box — a drop indicator shows above, below, or on the hovered row.",
      },
    ],
  },

];

export const bySlug: ReadonlyMap<string, ComponentEntry> = new Map(
  registry.map((entry) => [entry.slug, entry]),
);
