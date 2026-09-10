/**
 * The UI/UX and accessibility standing rules, hand-authored like
 * rules.ts (not extracted). They govern how the approved components are
 * assembled into screens -- layout, spacing, responsiveness, zoom,
 * keyboard, ARIA, colour, forms, states, flow, and a pre-delivery
 * checklist -- so generated UI is correct by default, without the user
 * correcting it afterwards.
 *
 * Adapted from the source document "MCP UI/UX and Accessibility Standing
 * Rules" for this design system: where the source cites raw HTML/CSS
 * patterns, the rules below phrase them in terms of the published
 * package's components (which are built on React Aria and render the
 * correct native elements) and token-backed Tailwind classes, because
 * those are the only building blocks consumers may use. Rule IDs, the
 * precedence order, "Source conflict" resolutions, and the checklist are
 * preserved verbatim in substance so deviations can cite a stable ID.
 */
import type { UxRuleSection } from "../schema.js";
import { UI_PACKAGE_NAME } from "../schema.js";

export function buildUxPreamble(): string[] {
    return [
        `Purpose: these standing rules govern how components from ${UI_PACKAGE_NAME} are assembled into screens so the output has correct layout, spacing, responsiveness, and accessibility by default. The registry tools return correct components; these rules make the composition correct too. They apply to every screen, view, dialog, and fragment built with this library.`,
        "Precedence order: (1) An explicit user request wins over any rule here. When a user request conflicts with a rule, follow the user request AND add a code comment citing the overridden rule ID and the reason, e.g. {/* Overrides LAY-11 per user request: fixed 320px sidebar required for embedded widget */}. (2) Where two rules conflict, the more specific rule and the stricter accessibility requirement win. (3) WCAG 2.2 Level A and AA success criteria are mandatory. AAA items are targets; apply them where practical and note where not met.",
        'Rule ID prefixes: LAY (layout/spacing/grid), RES (responsiveness), ZOOM (zoom/reflow), KEY (keyboard/focus), ARIA (ARIA/screen readers), COL (colour/contrast), FORM (forms), STATE (interaction states/feedback), FLOW (UX flow/placement), CODE (code quality), CHK (checklist). Conflicts between sources are resolved inline in "Source conflict" rules, with the adopted convention and reason.',
        "Many KEY/ARIA behaviours below (focus traps, roving tabindex, ARIA states) are already implemented by the library components via React Aria. The rules still bind: use them to pick the right component and props, to handle what the library cannot do for you (focus after deletion or route change, heading order, landmarks, live regions, error flows), and to verify the assembled screen.",
    ];
}

export function buildUxSections(): UxRuleSection[] {
    return [
        {
            id: "LAY",
            title: "Layout, spacing, and grid",
            intro: [
                "The primary defect these rules exist to prevent: a section, panel, or container with content rendering collapsed, clipped, or at zero height (LAY-09..12).",
                "All spacing must come from token-backed Tailwind classes (Tailwind unit 1 = 4px, so gap-2 = 8px, gap-3 = 12px, gap-4 = 16px, gap-6 = 24px, p-8 = 32px, etc.). Never arbitrary values.",
            ],
            rules: [
                "LAY-01: Use a 4px base unit and an 8px rhythm. All spacing values (margin, padding, gap) must be multiples of 4px; preferred multiples are 8, 16, 24, 32, 40, 48, 64px. Use 4px and 12px only for micro-adjustments (icon padding, tight inline gaps). Source: Material Design baseline grid. Verify: every computed margin/padding is divisible by 4, and section-level spacing by 8.",
                "LAY-02 (Source conflict, spacing base): Material uses a 4dp/8dp grid; Apple HIG aligns to 8pt in practice. Adopt the 8px rhythm with a 4px sub-unit because it satisfies both and is exactly Tailwind's spacing scale (0.25rem = 4px steps).",
                "LAY-03: Exact gaps between siblings. List rows: 8px vertical (gap-2, dense) or 12px (gap-3, comfortable). Cards in a grid: 16px (gap-4) mobile and 24px (gap-6) desktop gutters. Stacked form fields: 16px between field groups (the library's Input/Select/Checkbox already handle label-to-field spacing internally). Button group of related actions: 8px (gap-2). Toolbar items: 8px, with 16px between logical groups. Verify: gaps match the value for the component type and are uniform within a group.",
                "LAY-04: Container internal padding by size tier. Small container/chip/dense card: 8px (p-2). Medium card/panel: 16px (p-4). Large card/section/dialog body: 24px (p-6) mobile to 32px (p-8) desktop. Verify: padding matches the tier and is symmetric unless intentionally asymmetric.",
                "LAY-05: Vertical rhythm between major sections: 32px mobile, 48px desktop. Between a section heading and its content: 16px. Verify: measure inter-section spacing.",
                "LAY-06: Use a 12-column grid on desktop. Mobile (< 600px): 4 columns, 16px outer margin, 16px gutter. Tablet (600-1023px): 8 columns, 24px margin/gutter. Desktop (>= 1024px): 12 columns, 24px margin/gutter. Large desktop (>= 1440px): 12 columns, centered with max content width 1440px (e.g. max-w-(--breakpoint-2xl) equivalent token, mx-auto). Source: Material responsive layout grid. Verify: overlay the grid; count columns and measure margins/gutters at each breakpoint.",
                "LAY-07: An element spans multiple columns only when its content needs the width; otherwise it stacks. Below the tablet breakpoint, multi-column groupings must collapse to a single column. Verify: at 375px width every multi-column block is stacked to one column.",
                "LAY-08: Keep body text line length between 40 and 60 characters (max-width in ch or a max-w token). Source: Material breakpoints guidance. Verify: measure characters per line on wide viewports.",
                "LAY-09: No section, panel, or container that has content may render with collapsed or zero height. Containers size to their content by default. Verify: every content container's rendered height >= its content height; nothing is clipped.",
                "LAY-10: Do not set h-0, a fixed pixel height, or a max-height smaller than the content on any container with visible children. Use intrinsic sizing (height auto), min-height only as a floor, and let content determine height. Verify: lengthen the content and confirm the container grows.",
                "LAY-11: Any fixed height is forbidden unless justified in a code comment citing this rule ID and the reason, and even then the container must scroll or wrap (overflow-auto) rather than clip. Never use overflow-hidden on a content container without a justifying comment. Verify: search for h- fixed heights and overflow-hidden; each occurrence on a content container has a justifying comment and a scroll/wrap fallback.",
                "LAY-12: Collapse causes to avoid: (a) flex children with min-h-0 where content then clips -- use min-h-0 only to allow a scroll area to shrink, paired with overflow-auto; (b) absolutely positioned children inside a parent with no set size leaving the parent at zero height -- give the parent relative positioning and intrinsic or min height; (c) empty flex/grid containers given a fixed 0 height; (d) h-full on a child whose parent has no resolved height -- use flex growth or min-height on the ancestor chain instead; (e) collapsed margins producing an apparently empty region -- use padding or flex/grid gap; (f) a container missing a display value after conditional rendering; (g) accordion/collapsible panels whose open state was never rendered -- render the open panel's content. Verify: for each pattern present, content is visible and the container has non-zero height.",
                "LAY-13: For long single-line text that must not wrap (table cells, chips), truncate with the truncate utility AND expose the full text via a title attribute or the library Tooltip. Prefer wrapping over truncation for body content. Verify: truncated text has a title or tooltip carrying the full string.",
                "LAY-14: For long words, URLs, and unbroken strings, use overflow-wrap anywhere (Tailwind wrap-anywhere / break-words as appropriate) on text containers -- prefer anywhere because it is considered in min-content sizing and lets flex/grid items actually shrink. Use break-all only for non-prose codes. Source: MDN overflow-wrap. Verify: paste a 200-character unbroken string; it wraps with no horizontal scroll.",
                "LAY-15: For long lists, cap height with a scroll region (max-height in vh/rem tokens plus overflow-auto) with a visible scroll affordance; paginate or virtualise beyond 100 rendered rows (the library provides Pagination and VirtualizedList). Do not render thousands of DOM nodes unvirtualised. Verify: a list over 100 items paginates or virtualises; a capped list scrolls and is keyboard-scrollable.",
            ],
        },
        {
            id: "RES",
            title: "Responsiveness",
            rules: [
                "RES-01: Use these breakpoints (min-width, mobile-first). Mobile: 0-599px. Tablet: 600-1023px. Desktop: 1024-1439px. Large desktop: >= 1440px. Verify: responsive behaviour changes at these thresholds, min-width-first.",
                "RES-02 (Source conflict, breakpoints): Material 3 window classes put the compact/medium boundary at 600dp; Tailwind defaults are sm 640, md 768, lg 1024, xl 1280, 2xl 1536; Bootstrap 5 differs again. Adopt the RES-01 set because 600px is the most defensible mobile/tablet content boundary and 1024/1440 match common laptop/desktop widths and Tailwind's lg. Because consumers style exclusively with Tailwind classes, map: mobile = unprefixed, tablet ~ md/lg, desktop ~ lg/xl, large desktop ~ 2xl -- and document the mapping in a code comment where the layout is defined.",
                "RES-03: Author mobile-first: base (unprefixed) styles target mobile; responsive prefixes (md:, lg:, ...) add complexity upward. Verify: no max-width-only responsive strategy for core layout.",
                "RES-04: Navigation reflow. Mobile: hamburger opening a drawer, or a bottom navigation bar for 3-5 primary destinations. Tablet: navigation rail. Desktop: persistent top bar and/or sidebar (use the library's application navigation components). Source: Material adaptive navigation. Verify: at each breakpoint the correct navigation pattern renders and is operable.",
                "RES-05: Tables. Mobile: either a horizontal-scroll container with the first column sticky, OR stacked cards (one card per row), OR column-priority hiding of non-essential columns. Never force a wide multi-column Table to overflow the page horizontally. Desktop: full Table. Verify: at 320px the table uses one of the three strategies with no page-level horizontal scroll.",
                "RES-06: Multi-column layouts collapse to one column at mobile and reflow to 2+ panes only at desktop widths. Verify: single column below tablet.",
                "RES-07: Modals. Mobile: full-screen or bottom sheet. Desktop: centered dialog with a max-width (e.g. 560px tier) and backdrop. Use the library Modal for both. Verify: dialog is a full-width sheet at mobile, centered at desktop.",
                "RES-08: Side panels become overlay drawers on mobile and inline panes on desktop. Verify: side panel overlays at mobile, is inline at desktop.",
                "RES-09: Forms. Mobile: single column, full-width inputs. Desktop: at most two columns, inputs sized to content type, related fields grouped. Verify: never more than two columns; single column at mobile.",
                "RES-10: No horizontal scrolling of the page at any viewport width from 320px upward. Source: WCAG 2.2 SC 1.4.10 Reflow (AA). Verify: at 320px there is no horizontal scrollbar on the document.",
                "RES-11: Use fluid widths (%, fr, flex, w-full) not fixed pixel widths for layout regions. Typography and spacing tokens are already rem-based; never introduce fixed px font sizes. Source: WCAG 2.2 SC 1.4.4 Resize Text (AA). Verify: no fixed px font sizes; layout regions use relative/fluid widths.",
                "RES-12: Responsive images: max-w-full with auto height, srcSet/sizes where the framework supports them, and width/height attributes or aspect-ratio to reserve space and prevent layout shift. Use the library Avatar for user imagery. Verify: images never exceed their container and cause no CLS.",
                'RES-13: Notched/safe-area handling (app shell level): set <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"> and apply env(safe-area-inset-*) padding to fixed headers, footers, and full-bleed surfaces. Source: MDN env(). Verify: on a notched-device simulation, no content sits under the notch or home indicator.',
                "RES-14 (Source conflict, target size): WCAG 2.5.8 (AA) requires 24x24 CSS px minimum with a spacing exception; WCAG 2.5.5 (AAA) and Apple HIG require 44x44; Material requires 48x48dp with 8dp spacing. Adopt 44x44 CSS px as the default for primary/standalone interactive controls (it satisfies AAA and Apple and is within 4px of Material), with 24x24 as the absolute floor only where space is constrained and spacing compensates (a 24px-diameter circle centered on each target must not intersect another target's circle). Provide at least 8px between adjacent targets. In practice: do not use Button size xs/sm for standalone touch-primary actions. Verify: standalone controls >= 44px, none below 24px, spacing >= 8px.",
            ],
        },
        {
            id: "ZOOM",
            title: "Zoom and reflow",
            rules: [
                "ZOOM-01: The UI must remain fully usable with no loss of content or functionality at 150%, 200%, 300%, and 400% browser zoom, and at 200% text-only zoom. Source: WCAG 2.2 SC 1.4.4, 1.4.10 (AA). Verify: zoom to each level; all content and controls remain reachable and operable.",
                "ZOOM-02: At a 320 CSS px equivalent width (1280px viewport at 400% zoom), vertically-reading content must not require horizontal scrolling. Two-dimensional content (data tables, maps, diagrams) is exempt but must be contained in its own scroll region, not force the page to scroll in two directions. Source: WCAG 2.2 SC 1.4.10. Verify: 400% zoom at 1280px shows single-direction scrolling.",
                "ZOOM-03: No fixed pixel font sizes; use the rem-based text tokens so text scales with user and browser settings. Source: WCAG 2.2 SC 1.4.4. Verify: text scales at 200% text zoom.",
                "ZOOM-04: Layout must survive user text-spacing overrides with no clipping or overlap: line-height 1.5, paragraph spacing 2x font size, letter-spacing 0.12em, word-spacing 0.16em. Do not set fixed heights on text containers. Source: WCAG 2.2 SC 1.4.12 Text Spacing (AA). Verify: apply the text-spacing bookmarklet; nothing clips or overlaps.",
                "ZOOM-05: Sticky headers, fixed footers, and overlays must not cover the focused element at high zoom. Cap combined fixed chrome at 30% of viewport height; below 400px viewport height sticky elements un-stick or shrink; use scroll-padding equal to the fixed chrome height so scrolled-to and focused items are not hidden. Source: WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum, AA); technique C43. Verify: at 400% zoom, tab through the page; no focused control is hidden behind sticky chrome.",
            ],
        },
        {
            id: "KEY",
            title: "Keyboard accessibility and focus management",
            intro: [
                "The library's React Aria foundation implements the per-widget keyboard patterns (KEY-13..18) and the Modal focus lifecycle (KEY-06). Do not re-implement them; the rules below are what you must still get right at composition level, plus the behaviour to verify.",
            ],
            rules: [
                "KEY-01: Every interactive element is reachable and operable with the keyboard: Tab/Shift+Tab to move, Enter/Space to activate, Escape to dismiss, arrow keys per the widget's pattern. Source: WCAG 2.2 SC 2.1.1 (A). Verify: operate every control without a mouse.",
                "KEY-02: No keyboard trap: focus can always move away from any component using the keyboard alone (Escape or Tab). Source: WCAG 2.2 SC 2.1.2 (A). Verify: Tab through and out of every widget.",
                'KEY-03: Tab order follows the visual reading order and uses DOM order plus tabindex 0/-1 only. Never use a positive tabindex. Source: WCAG 2.2 SC 2.4.3 (A). Verify: tab order matches reading order; grep for tabindex="[1-9].',
                "KEY-04: Focus is never lost and never lands on a non-interactive element. Disabled controls do not receive focus. Verify: after every interaction, document.activeElement is a sensible visible interactive element.",
                'KEY-05: Do not put tabindex on non-interactive elements, except a container that must be programmatically focused with tabindex="-1" (e.g. a heading focused after route change). Verify: grep for tabindex on static elements.',
                "KEY-06: Modal/drawer focus lifecycle: on open, focus moves into the dialog to a sensible first element; focus is trapped inside while open; on close, focus returns to the trigger; Escape closes. The library Modal implements this -- never build a dialog from divs. Source: WAI-ARIA APG Dialog (Modal) pattern. Verify: open/close a dialog; focus enters, is trapped, and returns.",
                "KEY-07: A visible focus indicator on every focusable element. Never remove it (outline-none) unless an equally visible replacement is provided; the library components ship compliant focus rings -- do not override them. Ring spec: 2px solid with >= 3:1 contrast against both the component and adjacent background, offset 2px, applied on :focus-visible. Source: WCAG 2.2 SC 2.4.7 (AA). Verify: every control shows a clear ring on keyboard focus.",
                "KEY-08: Focus appearance target (AAA where practical): indicator area at least a 2 CSS px thick perimeter of the control, with >= 3:1 contrast between focused and unfocused states. Source: WCAG 2.2 SC 2.4.13. Verify: measure ring thickness and state-change contrast.",
                "KEY-09: Focus must not be entirely hidden by author content when received (see ZOOM-05). Source: WCAG 2.2 SC 2.4.11 (AA); target 2.4.12 (AAA). Verify: tab through with sticky chrome present; the focused element stays visible.",
                'KEY-10: Provide a "Skip to main content" link as the first focusable element, targeting the <main> landmark (use Button with href="#main-content" and a link color variant, visually hidden until focused). Source: WCAG 2.2 SC 2.4.1 (A). Verify: one Tab from page load reveals a working skip link.',
                "KEY-11: Composite widgets (menus, tabs, listboxes, grids, toolbars, trees) are a single Tab stop and use arrow keys internally (roving tabindex, or aria-activedescendant where DOM focus must stay on an input). The library widgets already implement this -- pick the real widget component instead of composing one from primitives. Source: WAI-ARIA APG. Verify: Tab reaches the widget once; arrows navigate within.",
                'KEY-12: After dynamic content changes, manage focus deliberately. On item deletion, move focus to the next item, or the previous if last, or the list container if empty. On client-side route change, move focus to the new page\'s h1 or main (tabindex="-1") and update document.title. Verify: delete a row and change routes; focus lands correctly and the title updates.',
                "KEY-13 Dialog: Tab/Shift+Tab cycle within; Escape closes; focus returns to the trigger.",
                "KEY-14 Tabs: Left/Right (horizontal) or Up/Down (vertical) move between tabs; Home/End jump to first/last; Tab moves from the selected tab into the panel. Use automatic activation when panels are cheap to render, manual activation (Enter/Space) when switching is expensive.",
                "KEY-15 Menu/menu button: Enter/Space/Down opens and focuses the first item; Up/Down move; Escape closes and returns focus to the button; typing moves to a matching item.",
                "KEY-16 Listbox/combobox: Up/Down move option focus; Enter selects; Escape closes the popup; the combobox input keeps DOM focus via aria-activedescendant.",
                "KEY-17 Accordion/disclosure: Enter/Space toggles the trigger; aria-expanded reflects state.",
                "KEY-18 Toolbar: a single Tab stop; Left/Right (or Up/Down when vertical, with aria-orientation) move among controls.",
            ],
        },
        {
            id: "ARIA",
            title: "ARIA and screen readers",
            intro: [
                "The library components render the correct roles, states, and native elements (ARIA-12..23 describe the behaviour they implement and what a screen reader announces). Your job at composition level: accessible names, alt text, landmarks, heading order, live regions, and never breaking the semantics with wrapper markup.",
            ],
            rules: [
                'ARIA-01: First rule of ARIA: prefer the semantics the library gives you. In this system the library component IS the native element -- Button renders <button>, Input renders a labelled <input>, Table renders <table> -- so never re-implement a control\'s semantics with role attributes on div/span, and never add redundant roles on top of library components. Verify: no role="button" (or similar) on a primitive where a library component exists.',
                "ARIA-02: Every control has an accessible name. Icon-only Buttons get aria-label. The visible label text must be contained in the accessible name. Source: WCAG 2.2 SC 4.1.2 (A), 2.5.3 (A). Verify: in the accessibility tree, every control has a non-empty name matching its visible label.",
                'ARIA-03: Images have alt text; decorative images use alt="" ; decorative icons get aria-hidden="true". Source: WCAG 2.2 SC 1.1.1 (A). Verify: every image has an alt attribute; decorative ones are empty.',
                "ARIA-04: Every form input has a visible programmatic label -- always pass the label prop to Input/Select/Checkbox/etc.; the library wires the for/id association. Placeholder is never the only label. Source: WCAG 2.2 SC 1.3.1 (A), 3.3.2 (A). Verify: each input's label resolves programmatically.",
                'ARIA-05: Use aria-hidden="true" only on purely decorative or duplicated content; never on a focusable element or one containing focusable elements. Verify: no focusable element inside an aria-hidden subtree.',
                'ARIA-06: State and relationship attributes reflect live state: aria-expanded on disclosure/menu triggers; aria-controls pointing to an existing id; aria-selected on tabs/options; aria-current for the current page/step; aria-describedby for help/error text; aria-invalid on fields in error; aria-required/required; aria-busy on regions being updated; aria-pressed on toggle buttons. The library sets these on its own widgets -- supply them yourself only on composition-level structures (e.g. aria-current="page" on navigation). Verify: each attribute reflects live state and every IDREF resolves.',
                "ARIA-07: Landmarks: use header (banner), nav, main (exactly one per page), aside (complementary), footer (contentinfo) -- these structural elements are allowed primitives. Source: WCAG 2.2 SC 1.3.1. Verify: one main; all major regions inside a landmark.",
                "ARIA-08: One h1 per page; heading levels never skip (no h2 to h4). Source: WCAG 2.2 SC 1.3.1, 2.4.6 (AA). Verify: run a heading-order check (validate_jsx warns on skips).",
                'ARIA-09: Live regions: aria-live="polite" (or role="status") for non-urgent updates -- toasts, success messages, result counts, save states. aria-live="assertive" (or role="alert") only for urgent messages such as submission errors or connection loss. Default to polite. Source: WCAG 2.2 SC 4.1.3 (AA). Verify: with a screen reader, updates are announced without stealing focus.',
                'ARIA-10: The live region container must exist in the DOM before content is injected into it; inject text into the existing empty region rather than creating the node at announcement time. role="alert" is the one exception that can be inserted at fire time. Never move focus to a live region. Source: WCAG technique ARIA19. Verify: the role="status"/aria-live container is present on first paint.',
                'ARIA-11 (Source conflict, live-region politeness): some sources mark form errors assertive, others polite. Adopt: role="alert"/assertive for the on-submit error summary and connection failures; polite for inline field validation appearing as the user progresses, to avoid interrupting typing. Reason: assertive interrupts mid-sentence and is reserved for information the user must act on immediately.',
                'ARIA-12 Dialog (library Modal): role="dialog" (alertdialog for confirmations), aria-modal="true", labelled by its heading, described by its body; a JS focus trap is provided because not all older screen readers honour aria-modal. Give every Modal a heading so it has a name.',
                'ARIA-13 Button: a toggle Button uses aria-pressed and keeps its label stable, flipping the pressed state rather than the label text. NVDA announces "[name] toggle button pressed/not pressed" and announces the change while focused.',
                'ARIA-14 Disclosure/accordion: a button with aria-expanded and aria-controls; NVDA announces "[name] button collapsed" then "expanded" after activation.',
                'ARIA-15 Tabs: tablist > tab (aria-selected, aria-controls) and tabpanel (aria-labelledby); screen readers announce name, role, selected state, and position ("2 of 3", browser-dependent).',
                'ARIA-16 Menu/menu button: role="menu"/menuitem only for application action menus -- never for site navigation. Navigation is a nav landmark with links (Button with href).',
                "ARIA-17 Combobox/listbox (Select.ComboBox): combobox input with aria-expanded/aria-controls/aria-activedescendant; options carry aria-selected true/false.",
                'ARIA-18 Tooltip: role="tooltip" referenced by aria-describedby; must be hoverable and dismissible per WCAG 1.4.13 (AA); never put essential actions only in a tooltip.',
                'ARIA-19 Toast/status: a role="status" (polite) container present on load; errors use role="alert".',
                "ARIA-20 Table/data grid: the library Table renders a real <table> with header scopes; use grid semantics only for interactive arrow-key grids. Never fake a table out of divs.",
                'ARIA-21 Tree: role="tree"/treeitem with aria-expanded; a single Tab stop; arrows navigate; Right expands, Left collapses.',
                'ARIA-22 Switch (Toggle): role="switch" with aria-checked; NVDA announces "[name] switch on/off".',
                'ARIA-23 Breadcrumb: use the library Breadcrumbs component (a nav labelled "Breadcrumb" with an ordered list; current page marked aria-current="page").',
                'ARIA-24: Build screens so NVDA\'s browse/focus mode switching works: widgets reachable in browse mode, interactive in focus mode (NVDA switches automatically on controls that require it; Escape returns to browse mode). Never set role="application" broadly -- it forces focus mode and disables browse-mode reading. Verify: NVDA + Firefox/Chrome walkthrough.',
                'ARIA-25 Forbidden ARIA mistakes: redundant roles on native semantics; role="button" on a div; aria-label on non-interactive elements with no role; aria-hidden on focusable content; placeholder as the only label; live regions created at announcement time (except role="alert"); nested interactive elements (a button inside a link); invalid role/attribute combinations; tabindex on static elements; aria-controls/labelledby/describedby pointing to missing ids; title as the only accessible name; role="menu" for site navigation. Verify: axe-core reports zero ARIA violations.',
            ],
        },
        {
            id: "COL",
            title: "Colour and contrast",
            intro: [
                "Colour always comes from the semantic token classes (text-primary, bg-secondary, border-brand, ...), which are contrast-managed across light and dark mode. These rules govern which token you pick and what you must still verify in composition.",
            ],
            rules: [
                "COL-01: Normal text contrast at least 4.5:1 against its background. Source: WCAG 2.2 SC 1.4.3 (AA). Verify: contrast-check every text/background token pairing you compose (e.g. never tertiary text on a tinted background without checking).",
                "COL-02: Large text (>= 24 CSS px, or >= 18.66 CSS px bold) may use 3:1. Source: WCAG 2.2 SC 1.4.3. Verify: confirm the computed size before relying on 3:1.",
                "COL-03: UI component boundaries, state indicators, focus indicators, and meaningful graphics require at least 3:1 against adjacent colours. Source: WCAG 2.2 SC 1.4.11 (AA). Verify: input borders, toggles, icons meet 3:1.",
                "COL-04: AAA targets where practical: 7:1 normal text, 4.5:1 large text. Source: WCAG 2.2 SC 1.4.6. Apply to body-heavy or low-vision-sensitive content.",
                "COL-05: Never convey information by colour alone -- pair colour with an icon, text label, underline, weight, or pattern (e.g. BadgeWithDot or BadgeWithIcon plus a text label, not a bare coloured dot). Source: WCAG 2.2 SC 1.4.1 (A). Verify: view in greyscale; all meaning survives.",
                "COL-06: Interactive states (hover, focus, active, disabled, error, selected) must be distinguishable without colour, via a second cue (icon, text, underline, weight, border, shape). Verify: greyscale check of each state.",
                "COL-07: Disabled controls are exempt from 1.4.3 but must stay legible (~3:1 practical minimum). The library uses opacity-50 for disabled states -- keep labels readable and the state programmatically exposed via isDisabled. Verify: disabled labels remain readable; state is exposed.",
                "COL-08: Dark mode has contrast parity: same ratios, same state visibility, tested separately. The token system adapts automatically via the dark-mode class -- verify composed screens in both themes and respect prefers-color-scheme at the app level. Verify: run the contrast checks in both themes.",
                "COL-09: Links within body text must be distinguishable from surrounding text by more than colour (underline, or >= 3:1 against the body text plus a non-colour hover/focus cue). Text over images or gradients must meet its ratio at the worst-case pixel; add a scrim/overlay if needed. Source: WCAG 2.2 SC 1.4.1, 1.4.3. Verify: check link vs body, and text over the lightest/darkest part of the image.",
            ],
        },
        {
            id: "FORM",
            title: "Forms, validation, and submission",
            rules: [
                "FORM-01: Labels sit above the field, left-aligned, always visible; never placeholder-only. Always pass the label prop. Source: WCAG 2.2 SC 3.3.2 (A), 1.3.1 (A). Verify: every field has a visible persistent label.",
                "FORM-02: Help text goes below the label or field via the hint prop, which the library links with aria-describedby. Verify: the description resolves programmatically.",
                "FORM-03: Error messages appear directly below the field (hint + isInvalid), linked via aria-describedby with aria-invalid on the field, with an icon plus text (not colour alone), and are announced via a live region. Source: WCAG 2.2 SC 3.3.1 (A), 1.4.1, 4.1.3. Verify: trigger an error; the message is linked, marked invalid, and announced.",
                "FORM-04: Validation timing: validate on blur and on submit; never on every keystroke for a first entry; once a field is marked invalid, re-validate on input so the user sees the error clear. Verify: no error until blur on first entry; fixing an invalid field clears the error as you type.",
                "FORM-05: Error wording states what is wrong and how to fix it, in plain language. Source: WCAG 2.2 SC 3.3.1 (A), 3.3.3 (AA). Verify: each message names the problem and the correction.",
                'FORM-06: On submit with errors, move focus to the first invalid field; with more than one error, show an error summary at the top of the form (role="alert" or a focusable container) with in-page links to each invalid field. Source: WCAG 2.2 SC 3.3.1; APG. Verify: submit an invalid multi-error form; focus and summary behave as specified.',
                'FORM-07: Prevent double submission: put the submit Button into isLoading (with showTextWhileLoading and a label like "Saving...") on first submit, and mark the form busy. Preserve entered data on failure. Verify: double-click triggers one request; data survives a failed submit.',
                "FORM-08: Handle network errors, server-side validation errors, timeouts, and session expiry with clear, recoverable messages and a retry path. Warn before a timeout expires and allow extension. Source: WCAG 2.2 SC 3.3.4 (AA), 3.3.7 (A), 2.2.6 (AAA). Verify: simulate each failure; the user recovers without losing data.",
                'FORM-09: Required fields are indicated visibly (asterisk plus a legend, or "(required)" in the label) and programmatically via isRequired. Verify: required state is both visible and programmatic.',
                "FORM-10: Use correct input types (email, tel, url, number, date -- prefer the DatePicker for dates) and valid WHATWG autocomplete tokens (name, given-name, family-name, email, tel, street-address, postal-code, cc-number, new-password, current-password, ...), passed through to the Input. Only apply autocomplete to fields collecting the user's own data. Source: WCAG 2.2 SC 1.3.5 (AA). Verify: tokens match the WHATWG list and the field purpose.",
                "FORM-11: A password visibility toggle has an accessible name, exposes state via aria-pressed, and never loses the entered text. Verify: toggle has a name and pressed state; text persists.",
                "FORM-12: Destructive actions require confirmation via an alert dialog (Modal in alertdialog form, see ARIA-12) with the destructive intent clearly labelled and default focus on the safe/cancel action. Source: WCAG 2.2 SC 3.3.4. Verify: destructive action opens a confirmation; cancel holds default focus.",
                "FORM-13: Never require a cognitive function test (memorising, transcribing, puzzles/CAPTCHA) as the only way to authenticate. Support password managers (never block paste), allow copy/paste of one-time codes, and provide an accessible alternative to any CAPTCHA. Source: WCAG 2.2 SC 3.3.8 (AA). Verify: paste works in password and OTP fields; an accessible CAPTCHA alternative exists.",
            ],
        },
        {
            id: "STATE",
            title: "Interaction states and feedback",
            rules: [
                "STATE-01: Every data-driven view defines four states: loading, empty, error, and success/content. Each of loading/empty/error contains a heading, a one-line explanation, and a primary action (or retry) -- use EmptyState/FeaturedIcon patterns from the library. Verify: force each state; the required content is present.",
                "STATE-02: Loading indicators by wait length (NN/g response-time limits: ~0.1s feels instantaneous, ~1s keeps flow of thought, ~10s is the attention limit). Under ~100ms: no indicator. ~100ms-1s: keep the control responsive with a subtle state. ~1-10s: a determinate or indeterminate indicator (Button isLoading, ProgressBar). Over 10s: a percent-done indicator plus a clearly signposted way to cancel. Verify: the indicator matches the measured wait.",
                "STATE-03: Use a skeleton for known layouts on loads expected to exceed ~1s; a spinner for short indeterminate waits. Never flash a skeleton for sub-100ms loads. Verify: skeletons appear only past the 1s threshold.",
                "STATE-04: Feedback timing: toasts auto-dismiss no sooner than 4s (longer for longer messages) so screen readers can announce them; error toasts never auto-dismiss and require manual close. Any auto-updating/moving/time-limited content provides a pause/stop/hide control or an extendable timer. Source: WCAG 2.2 SC 2.2.1 (A), 2.2.2 (A). Verify: measure dismiss timing; error toasts persist.",
                'STATE-05: Provide undo for destructive actions where feasible (e.g. an "Undo" action in the confirmation toast) as an alternative or complement to a confirmation dialog. Verify: destructive actions offer undo or confirmation.',
                "STATE-06: Motion respects prefers-reduced-motion: under the reduce query, remove or replace non-essential motion (parallax, large slides, zoom) with an instant change or short opacity fade; never trigger vestibular-risk motion. Use the motion-safe/motion-reduce variants. Source: WCAG 2.2 SC 2.3.3 (AAA), 2.2.2 (A). Verify: enable reduce-motion; animations are removed or simplified.",
                "STATE-07: No content flashes more than three times per second. Source: WCAG 2.2 SC 2.3.1 (A). Verify: check for flashing content.",
                'STATE-08: Micro-interaction transitions are 100-300ms (enter slightly longer than exit); avoid over 400ms for routine UI. The house default for small state changes is "transition duration-100 ease-linear". Source: Material 3 duration tokens. Verify: measure transition durations.',
            ],
        },
        {
            id: "FLOW",
            title: "UI/UX flow and placement conventions",
            rules: [
                "FLOW-01 (Source conflict, primary button placement): Apple HIG places the default button trailing; Material places the confirming action on the right with the dismissive action to its left; historical Windows/Java conventions placed the affirmative first. Adopt trailing-edge primary placement (primary/confirming action on the right, secondary/cancel to its left) for web, matching both Apple and Material. Apply it everywhere. Verify: in every dialog/form, the primary action is right/trailing.",
                "FLOW-02: Button group order: primary (most emphasis), then secondary, then tertiary; destructive actions are visually separated (spacing or position) and never immediately adjacent to the primary action. Verify: inspect button order and destructive separation.",
                "FLOW-03: Destructive actions always require confirmation (FORM-12) and are consistently placed; never make a destructive action the unguarded default. Verify: destructive actions are guarded and consistent.",
                "FLOW-04: Placement conventions: page title top-left of the content area; primary page actions top-right; global navigation in a consistent location (per RES-04); search near the top of the content it searches; filters in a left rail (desktop) or a filter sheet (mobile). Verify: placement is identical across screens.",
                "FLOW-05: Breadcrumbs sit above the page title and reflect hierarchy; the browser Back button and in-app back never lose user state. Verify: back navigation preserves state.",
                'FLOW-06 (Source conflict, pagination vs infinite scroll): adopt pagination as the default for finite, navigable result sets (it keeps the footer and total count reachable); use infinite scroll only for exploratory feeds, and then always provide a visible "Load more" fallback, keep the footer reachable, and never trap keyboard/screen-reader users before the footer. Verify: keyboard users can reach the footer; a Load more control exists.',
                "FLOW-07: Consistency: the same pattern does the same job on every screen; components doing the same thing are labelled and placed the same way; help mechanisms appear in a consistent location. Source: WCAG 2.2 SC 3.2.3 (AA), 3.2.4 (AA), 3.2.6 (A). Verify: cross-screen audit.",
            ],
        },
        {
            id: "CODE",
            title: "Code quality",
            rules: [
                "CODE-01: Production-quality code with comments that explain intent (why), not restate the code (what). Verify: comments add rationale.",
                "CODE-02: Use semantic structure for meaning: the allowed structural landmarks (main, header, footer, nav, section, article, aside) and heading elements where they apply, and library components everywhere else -- no div/span where a semantic option exists. Verify: review the markup.",
                "CODE-03: No inline styles for layout; classes/tokens only (validate_jsx rejects the style prop). Verify: no style attributes.",
                "CODE-04: All colour and spacing comes from the design tokens via the documented Tailwind classes; no hard-coded hex values, no arbitrary Tailwind values, no off-scale magic numbers. Verify: grep for raw hex and arbitrary-value classes.",
                "CODE-05: Reuse the registry's components; never re-implement or duplicate a component that already exists (search_components first). Verify: no duplicate component definitions.",
                "CODE-06: Consistent naming across files and components (kebab-case files, PascalCase components). Verify: review naming.",
                "CODE-07: No console errors and no accessibility-linter warnings in the output. Verify: load the page; the console is clean.",
                "CODE-08: The output must pass: axe-core with zero violations; Lighthouse accessibility 100; eslint-plugin-jsx-a11y (or framework equivalent) with zero warnings; valid HTML; a keyboard-only walkthrough; an NVDA + Firefox/Chrome walkthrough; a 320px viewport check with no horizontal scroll; and a 400% zoom check. Automated tools cover only ~57% of accessibility issues (Deque's coverage report), so the manual keyboard, screen-reader, 320px, and 400% checks are mandatory, not optional. Verify: run the checks; all pass.",
                "CODE-09: Any deviation from a rule is commented inline with the rule ID and the reason (see the precedence order in the preamble). Verify: each deviation has a citing comment.",
            ],
        },
        {
            id: "CHK",
            title: "Pre-delivery checklist",
            intro: [
                "Run before returning any UI. All Blockers must pass; a failure of any Blocker means the UI is not returned. Fix Majors before delivery unless explicitly deferred; address Minors for polish.",
            ],
            rules: [
                "CHK-B1 [Blocker] (LAY-09..12): No section or container with content renders collapsed or at zero height; nothing is clipped. Pass: every content container height >= content height.",
                "CHK-B2 [Blocker] (RES-10, ZOOM-02): No horizontal page scroll at 320px width. Pass: no document-level horizontal scrollbar at 320px.",
                "CHK-B3 [Blocker] (KEY-01..06): No lost or trapped focus; all controls keyboard-operable; modal focus enters, traps, and returns. Pass: keyboard-only walkthrough succeeds.",
                "CHK-B4 [Blocker] (ARIA-02..04): Every control, image, and input has an accessible name/label. Pass: axe-core reports no missing-name violations.",
                "CHK-B5 [Blocker] (COL-01..03): Text and UI contrast meet 4.5:1 / 3:1. Pass: contrast checks pass on all pairs.",
                "CHK-B6 [Blocker] (ZOOM-01..02): Layout works at 400% zoom / 320px reflow with single-direction scrolling. Pass: 400% zoom walkthrough succeeds.",
                "CHK-B7 [Blocker] (KEY-01, ARIA-01): No keyboard-inoperable custom controls (no div buttons). Pass: axe-core plus manual check.",
                "CHK-B8 [Blocker] (FORM-01, FORM-04): Every input has a visible persistent label (not placeholder-only). Pass: visual and programmatic check.",
                "CHK-M1 [Major] (KEY-07, KEY-08): Visible focus indicator on every focusable element meeting the ring spec.",
                "CHK-M2 [Major] (ARIA-09..11): Live regions present on load with correct politeness; toasts/errors announced.",
                "CHK-M3 [Major] (FORM-03, FORM-05, FORM-06): Errors linked, worded with a fix, focus moves to the first error, summary for multiple errors.",
                "CHK-M4 [Major] (RES-04..09): Navigation, tables, modals, and forms reflow correctly at each breakpoint.",
                "CHK-M5 [Major] (ARIA-07, ARIA-08): One main landmark; one h1; no skipped heading levels.",
                "CHK-M6 [Major] (STATE-01): Loading, empty, and error states present for every data view.",
                "CHK-M7 [Major] (RES-14): Touch targets >= 44px default (never < 24px) with >= 8px spacing.",
                "CHK-M8 [Major] (COL-05, COL-06): No information by colour alone; states distinguishable without colour.",
                "CHK-M9 [Major] (CODE-08): axe-core zero violations; Lighthouse a11y 100; jsx-a11y zero warnings.",
                "CHK-m1 [Minor] (LAY-01..05): Spacing on the 4/8px scale; gaps and padding per tier.",
                "CHK-m2 [Minor] (ZOOM-04): Survives text-spacing overrides without clipping.",
                "CHK-m3 [Minor] (STATE-06, STATE-08): Reduced motion respected; transitions 100-300ms.",
                "CHK-m4 [Minor] (FLOW-01, FLOW-02): Primary action trailing; button order and destructive separation correct.",
                "CHK-m5 [Minor] (CODE-01..06): Semantic structure, tokens, no inline layout styles, no duplicated components, intent comments.",
            ],
        },
    ];
}
