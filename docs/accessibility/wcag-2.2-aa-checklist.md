# WCAG 2.2 Level AA Checklist

Every component in this library must pass every applicable item below before it ships. This was
compiled from the WCAG 2.2 success criteria as documented in current, stable training knowledge —
`www.w3.org` and `react-aria.adobe.com` are both blocked by this environment's network egress
policy, so nothing here was re-verified against a live fetch this session. Re-check against
https://www.w3.org/WAI/WCAG22/quickref/?levels=aa before a real release if that matters to you.

Criteria that are purely page-level (skip links, page titles, multiple ways to find a page,
language of page) are noted but not gated on per-component, since a component library doesn't
own a page. Everything else is a hard gate.

## 1. Perceivable

| SC | Requirement | Component-level test |
|---|---|---|
| 1.1.1 Non-text Content (A) | Every image/icon/graphic conveys its purpose in text | Icon component: `aria-hidden="true"` by default, `role="img"` + accessible name only when given a `label` prop. Decorative images get `alt=""`. |
| 1.3.1 Info and Relationships (A) | Structure/relationships conveyed in code, not just visually | Use real `<label>`/`<fieldset>`/`<table>`/heading levels; ARIA only where no native semantic exists |
| 1.3.2 Meaningful Sequence (A) | DOM order matches reading order | No CSS-only reordering that breaks reading/tab order |
| 1.3.3 Sensory Characteristics (A) | Instructions don't rely on shape/color/position alone | e.g. never "click the green button" as the only cue |
| 1.3.4 Orientation (AA) | Not restricted to one screen orientation | N/A at component level; don't lock orientation in any component |
| 1.3.5 Identify Input Purpose (AA) | Common inputs expose their purpose | `autocomplete` attribute wired through on Input for name/email/tel/etc. |
| 1.4.1 Use of Color (A) | Color is never the only means of conveying info | Error state = icon + text + color, never color alone; badge "grading" colors also carry a text label |
| 1.4.3 Contrast (Minimum) (AA) | Text ≥ 4.5:1; large text (≥24px, or ≥19px bold) ≥ 3:1 | Every text/background token pair is computed and unit-tested (see `packages/*/src/theme/contrast.ts`) |
| 1.4.4 Resize Text (AA) | Text can zoom to 200% without loss of content/function | No `font-size` in px on text that should scale; test at 200% browser zoom |
| 1.4.5 Images of Text (AA) | Prefer real text over text-in-images | No component renders a label as a raster/SVG image of text |
| 1.4.10 Reflow (AA) | No loss of content/function at 320px width, no 2-D scroll (except data tables/toolbars) | Every component tested at 320px viewport; wide content (tables) scrolls in its own container |
| 1.4.11 Non-text Contrast (AA) | UI component boundaries & state indicators ≥ 3:1 against adjacent color | Borders, focus rings, checkbox/radio outlines, icon-only button boundaries all computed ≥ 3:1 |
| 1.4.12 Text Spacing (AA) | No loss of content when user overrides: line-height ≥1.5×, paragraph spacing ≥2×, letter-spacing ≥0.12×, word-spacing ≥0.16× | No fixed-height text containers that clip; test with a text-spacing bookmarklet/override |
| 1.4.13 Content on Hover or Focus (AA) | Hover/focus-triggered content is dismissible (Esc), hoverable (pointer can move onto it), persistent (stays until dismissed/no longer hovered/focused) | Tooltip, Popover: all three apply |

## 2. Operable

| SC | Requirement | Component-level test |
|---|---|---|
| 2.1.1 Keyboard (A) | All functionality via keyboard alone | Every interactive component keyboard-tested in Storybook interaction tests |
| 2.1.2 No Keyboard Trap (A) | Focus can always move away | Modal/Dialog/Popover: Tab cycles within while open, Esc/close always available, no dead-ends |
| 2.1.4 Character Key Shortcuts (A) | Single-character shortcuts are remappable/disable-able or require focus | We ship none globally; combobox/menu typeahead is focus-scoped, which is exempt |
| 2.2.1 Timing Adjustable (A) | No component-imposed time limit without control | Toast/notification auto-dismiss is pausable on hover/focus and has a minimum duration |
| 2.2.2 Pause, Stop, Hide (A) | Auto-updating/moving content can be paused | Any carousel/auto-advancing content (none planned yet) must have a pause control |
| 2.3.1 Three Flashes (A) | Nothing flashes >3×/sec | N/A — no flashing content planned |
| 2.4.3 Focus Order (A) | Focus order preserves meaning/operability | DOM order = visual order; overlays move focus in, restore focus out |
| 2.4.6 Headings and Labels (AA) | Headings/labels are descriptive | Component docs specify real label content, not "Label" placeholders |
| 2.4.7 Focus Visible (AA) | Keyboard focus indicator is visible | Every focusable element has a visible `:focus-visible` style — never `outline: none` without a replacement |
| 2.4.11 Focus Not Obscured (Minimum) (AA) — new in 2.2 | Focused element not entirely hidden by author content (sticky headers etc.) | Overlay z-index tokens + scroll-margin so focus never lands under a sticky bar |
| 2.5.1 Pointer Gestures (A) | Multipoint/path gestures have a single-pointer alternative | N/A — no gesture-based components |
| 2.5.2 Pointer Cancellation (A) | Down-event doesn't trigger the action; up-event (or abort) does | Buttons/menu items fire on pointerup/click, not pointerdown |
| 2.5.3 Label in Name (A) | Accessible name contains the visible label text | Icon-only buttons: visible tooltip text (if any) is a substring of `aria-label` |
| 2.5.4 Motion Actuation (A) | No device-motion-only triggers | N/A |
| 2.5.7 Dragging Movements (AA) — new in 2.2 | Drag-based function has a non-drag alternative | N/A for v1 (no drag components); revisit if Drag-and-Drop File Input ships |
| 2.5.8 Target Size (Minimum) (AA) — new in 2.2 | Pointer targets ≥ 24×24 CSS px, or spaced so a 24px circle around it doesn't overlap neighbors (exceptions: inline text links, essential size, native controls with an OS-defined size, equivalent alternative available) | Icon-only buttons/checkboxes/close buttons: hit area padded to 24×24 even when the visible glyph is smaller (Button `small` visual is 28px tall, already clears it; icon-only variants get explicit min hit-area) |

## 3. Understandable

| SC | Requirement | Component-level test |
|---|---|---|
| 3.1.2 Language of Parts (AA) | `lang` set on content in a different language than the page | N/A at component level; pass-through if ever needed |
| 3.2.1 On Focus (A) | Focusing an element never triggers a context change | Input focus never auto-submits/navigates |
| 3.2.2 On Input (A) | Changing a value never triggers an unexpected context change without warning | Select/Combobox: selecting an option updates value, doesn't auto-navigate |
| 3.2.4 Consistent Identification (AA) | Same icon/label used for the same function everywhere | One close ("X") icon, one pattern for "required", one pattern for errors, reused across all components |
| 3.2.6 Consistent Help (A) — new in 2.2 | Help mechanism in the same relative order across pages | N/A at component level (app-level concern) |
| 3.3.1 Error Identification (A) | Errors identified in text, not color alone | Input/Select/Checkbox error state: text message + icon, `aria-invalid="true"`, `aria-describedby` pointing at the message |
| 3.3.2 Labels or Instructions (A) | Every input has a programmatic label | Input/Textarea/Select/Checkbox/Radio all require (TS-enforced) a `label` prop or explicit `aria-label`/`aria-labelledby` |
| 3.3.3 Error Suggestion (AA) | Suggest a fix when an error is known | `errorMessage` prop supports actionable text; components don't swallow it |
| 3.3.4 Error Prevention (AA) | Reversible/checked/confirmed for legal/financial/data-deleting actions | N/A — app-level concern; Modal supports a confirm pattern for when it's needed |
| 3.3.7 Redundant Entry (A) — new in 2.2 | Don't force re-entry of info already given in the same process | N/A — app-level (form-flow) concern |
| 3.3.8 Accessible Authentication (Minimum) (AA) — new in 2.2 | No cognitive-function test for auth (unless an exception applies) | N/A — no auth components in this library |

## 4. Robust

| SC | Requirement | Component-level test |
|---|---|---|
| 4.1.2 Name, Role, Value (A) | Every UI component has a correct programmatic name, role, value/state, and state changes are exposed | Verified per component via Testing Library + `jest-axe`/`vitest-axe`; interactive widgets use React Aria, which owns this contract |
| 4.1.3 Status Messages (AA) | Status messages are announced without moving focus | Toast/inline-validation/loading-state changes go through an `aria-live="polite"` (or `role="alert"`/`assertive` for errors) live region |

## 5. Criteria the user explicitly called out (cross-reference)

- **Text contrast 4.5:1 / large text 3:1** → 1.4.3, computed for every semantic token pair, unit-tested.
- **Non-text 3:1 for boundaries/state indicators** → 1.4.11, computed for every border/focus-ring/control-outline token pair.
- **Full keyboard operability, no traps** → 2.1.1 + 2.1.2.
- **Visible focus indicators** → 2.4.7 (+ 2.4.11 for obscuring).
- **Logical focus order** → 2.4.3.
- **Pointer targets ≥ 24×24px** → 2.5.8.
- **Name/role/value via semantic HTML or ARIA** → 4.1.2.
- **Programmatic label for every form control** → 3.3.2.
- **Error identification in text, never color alone** → 3.3.1 + 1.4.1.
- **Reflow at 320px** → 1.4.10.
- **Usable at 200% zoom** → 1.4.4.
- **Tolerance for user text-spacing overrides** → 1.4.12.
- **Status messages via live regions** → 4.1.3.
- **`prefers-reduced-motion` respected** → not a numbered SC by itself, but required to avoid triggering 2.3.1/2.2.2 issues and is an explicit project requirement: every transition/animation in the theme is wrapped in `@media (prefers-reduced-motion: no-preference)`, with an instant/no-motion fallback as the default.

## 6. Behavior layer: React Aria vs. plain semantic HTML

Per-component decision, following the rule: **plain semantic HTML for simple components,
`react-aria-components` for complex interactive widgets** (dialogs, popovers, menus, selects,
comboboxes, tabs, tooltips, sliders, date pickers). `react-aria.adobe.com` is blocked in this
environment, so the API shapes below (hooks, render props, `Provider`/`Context` composition,
`data-*` state attributes for styling) are drawn from existing knowledge of `react-aria-components`
current at last training update, not re-verified live — flagged as a residual gap to double check
against the live docs before publishing.

| Component | Behavior layer | Why |
|---|---|---|
| Button | Plain HTML `<button>` | Native semantics/keyboard/focus are already correct |
| Badge | Plain HTML `<span>` | Static, non-interactive |
| Icon | Plain HTML `<svg>` wrapper | Static, non-interactive |
| Checkbox / Radio | `react-aria-components` (`Checkbox`, `RadioGroup`/`Radio`) | Indeterminate state, group semantics, and visual-hidden-native-input pattern are error-prone to hand-roll correctly |
| Input / Textarea | Plain HTML `<input>`/`<textarea>` + our own label/error wiring | Native semantics are correct; we only need consistent label/describedby wiring |
| Select (native-feeling) | `react-aria-components` (`Select`) | Custom-styled listbox popup needs correct `combobox`/`listbox` roles, typeahead, and keyboard nav that native `<select>` can't be restyled to match |
| Combobox | `react-aria-components` (`ComboBox`) | Same as Select plus free-text filtering — high-complexity a11y surface |
| Dropdown menu | `react-aria-components` (`Menu`, `MenuTrigger`) | Roving tabindex, typeahead, submenu handling |
| Tabs | `react-aria-components` (`Tabs`, `TabList`, `Tab`, `TabPanel`) | Arrow-key navigation + `aria-selected`/`tabpanel` wiring |
| Modal / Dialog | `react-aria-components` (`Modal`, `Dialog`, `DialogTrigger`) via `overlays` | Focus trap, restore focus, `aria-modal`, portal, Esc-to-close |
| Popover (dropdown menu chrome, option menu) | `react-aria-components` (`Popover`) | Positioning + dismiss-on-outside-click + focus management |
| Tooltip | `react-aria-components` (`Tooltip`, `TooltipTrigger`) | Hover/focus delay timing, `Escape`-dismiss, `aria-describedby` wiring (1.4.13 compliance) |
| Toast / status message | Plain HTML region with `aria-live` | Simple enough to hand-roll on top of a live-region primitive; no complex focus management needed |
| Meter | `react-aria-components` (`Meter`) | `meter`/`progressbar` role fallback and `aria-valuenow`/`-min`/`-max`/`-text` wiring are error-prone to hand-roll correctly |
| Sidebar nav item | Plain HTML `<a>`/`<button>` in a `<nav>`/`<ul>` | Native link/nav semantics suffice |
