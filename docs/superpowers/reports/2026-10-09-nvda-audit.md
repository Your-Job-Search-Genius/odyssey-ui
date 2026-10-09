# NVDA audit — packages/ui components (2026-10-09)

Scope: every component source file under `packages/ui/components/{base,application,foundations}` (431 files; demos and stories excluded), reviewed against the **Screen readers (NVDA)** rules SR-01..SR-12 in `packages/registry/src/policy/ui-agent-guidelines.md`.

## Evidence levels

| Check                                                                                   | Result                                                                                                 |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Static code review (two reviewers, then each finding re-verified in code before fixing) | Done                                                                                                   |
| Automated axe-core                                                                      | **Not run** — `packages/ui` has no axe / testing-library setup; adding dev dependencies needs approval |
| Real NVDA walkthrough (Windows, Firefox/Chrome)                                         | **Not verified** — requires Windows + NVDA; this audit ran on macOS                                    |

Per SR-12, every component's NVDA status stays **Not verified** until someone runs the script at the end of this report.

## Summary

- 76 findings raised. 69 fixed, 2 partly fixed, 2 deferred, 1 false positive, 2 harmless tidy-ups where the reported defect was not real.
- Every fix keeps visual output identical and props backward-compatible (only new optional props were added).
- `type-check`, `lint:check` (0 errors) and all unit tests pass after the fixes.

## Fixed (by area)

- **Names on icon-only controls (SR-08/SR-01):** input help tooltips, table header help, social buttons, badge remove buttons, tag-select remove buttons ("Remove {label}"), nav account trigger, carousel indicators ("Go to slide N").
- **Field relationships (SR-03):** required asterisk hidden; input-tags and input-tags-outer labels, hints, invalid and required states linked; multi-select trigger labelled and described; checkbox, radio and toggle hints are descriptions instead of part of the name; slider labels and value text match what is shown; color picker announces its current value; file upload hint linked and errors announced.
- **Announcements (SR-04):** tag rejection reasons, file upload progress and status, combobox loading, loading indicator, chat typing indicator, carousel slide changes.
- **State (SR-07):** password visibility ("Show/Hide password"), current page (`aria-current`) in header nav and pagination, selected account, selected card, selected calendar preset.
- **Overlays and landmarks (SR-05/SR-06):** drawer, slideout menu and bottom sheet are now named by their title heading (no fixed "Drawer" label), and no longer add extra main, banner or contentinfo landmarks; mobile header dialog named and its close button reachable; floating AI chatbox is a named dialog; unlabelled `<nav>` elements labelled; calendar headers no longer banners.
- **Semantics (SR-02):** invalid `role="description"` removed; pagination buttons no longer announced as list items; pagination group no longer a radio group; separator label text readable; redundant `role="figure"` removed; minimap hidden.
- **Images (SR-08):** avatars default to `alt=""` and avoid repeating adjacent text; online/offline and verified indicators have text; rating stars read "N out of M stars"; 97 brand, payment and social icon SVGs hidden by default (still overridable); empty-state illustrations hidden; stat-tile deltas say "Increased" or "Decreased".
- **Buttons in loading state (SR-01):** the label stays in the accessible name and the spinner is a named progress bar that React Aria's `isPending` points at.

## Partly fixed / deferred (follow-ups)

| Component                          | Status       | Follow-up                                                                                                                                                                                                 |
| ---------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `combobox/combobox.tsx` footer     | Deferred     | Footer actions sit in a non-modal popover and are unreachable by Tab. Render them outside the popover or as a list option ("Create…").                                                                    |
| `combobox/combobox-item.tsx`       | Partly fixed | `supportingText` is now the description; `badgeLabel` is still not announced. Fold the badge text into the description.                                                                                   |
| `flow-canvas/flow-canvas.tsx`      | Partly fixed | Name and instructions fixed, and the live region moved out. The legend, zoom controls and minimap still sit inside `role="application"`; add an inner wrapper so only the diagram is in application mode. |
| `flow-canvas/flow-canvas-node.tsx` | Deferred     | No keyboard or screen-reader way to connect nodes. Add a "Connect to…" control in the node inspector (new feature).                                                                                       |

## Needs a visual check

- `header-navigation/base-components/mobile-header.tsx`: the close button moved inside the dialog, and `will-change-transform` was removed so it stays positioned against the viewport. Check the mobile menu's close button position in a browser.

## Manual NVDA script (Windows, NVDA + Firefox or Chrome, Speech Viewer on)

1. **Buttons** page: Tab to "Primary", which should be announced as "Primary, button". Trigger a loading button: the name stays and NVDA says it is busy.
2. **Input** with a hint and an error: Tab in. Expected: label, "required", "invalid entry", and the error text. The help icon is announced by its tooltip text.
3. **Select / Combobox**: open with Alt+Down. Options announce name and supporting text. Combobox loading says "Loading".
4. **Checkbox / Toggle** with a hint: the name is the label only, and the hint is read as the description.
5. **Modal / Drawer / Bottom sheet**: open it. NVDA says "<title>, dialog". Escape closes it and focus returns to the trigger.
6. **Table**: Ctrl+Alt+Arrow keys announce column headers. Header help icons are named.
7. **Pagination**: the current page is announced as "current page". Previous and Next are buttons, not radios.
8. **Toast / Alert**: trigger one. It is announced once, without moving focus.
9. **Carousel**: "Go to slide 2" works, and the slide change is announced (not during autoplay).
10. **Date picker**: the trigger announces the selected date ("Choose date" when empty).

Record the NVDA version, browser and what was heard in the completion record (SR-12).
