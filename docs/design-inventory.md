# Writesea Odyssey — Design Inventory

Source: Figma file `Writesea-Odyssey` (`L1Tjy8S8lUAbQNQnvr4bJN`), pages listed below. The file's
whole-document page-list endpoint only ever returns the "Cover" page (a tooling quirk, not a real
file limitation) — every page below was reached via a direct node ID instead, most supplied by the
user. Icon extraction was explicitly deprioritized by the user ("skip icons for now") — the Icon
*component* (wrapper) is still built, just not a full glyph inventory.

## 0. Known access gaps

- **Semantic button color hex values** (`Semantic/Buttons/button-primary-bg` etc.) exist as named
  Figma variables but never resolved to hex on the Colors or Typography pages directly — resolved
  instead from `get_design_context` on actual Button instances (see §3 Buttons), so covered, but
  the raw variable→hex mapping was never independently cross-checked against a "semantic tokens"
  page (none exists in the file).
- **Alice AI page** (`461:54`) only yielded its header ("Alice — serves as your AI assistant coach…").
  The actual Chat Bubble / Resume Interactions / Alice Icon component content (confirmed to exist
  via library search) was not pixel-inventoried. These three composites are deferred to a later
  build wave; see §7.
- **Card family is very large** (resume-review product cards: Issues, Review, Inline Review, plus
  template-preview marketing thumbnails). Only representative nodes were sampled per severity type;
  Expanded/Focus sub-states for every Issue type were not all sampled.
- **Dropdown "Select Menu" / "User Menu" / composed-card variants** (Column 3 on the Dropdown page)
  were inventoried structurally (metadata) but not pixel-resolved individually — the base `List
  Default` items (which they're built from) were.
- **Icon glyph set**: partial only (24 names found via search, not exhaustive), per user direction.

## 1. Design tokens

### 1.1 Color — raw palette (primitives)

Six scales, resolved from the Colors page. Contrast column is this file's own self-reported badge
value and its reference basis could not be confirmed — **do not treat it as authoritative**; §1.3
below has independently computed, verified ratios for every pair we actually use.

| Scale | 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | Base/900 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Gray | #FDFDFD | #FAFAFA | #F6F6F6 | #E9EAEB | #D5D7DA | #A4A7AE | #717680 | #535862 | #414651 | #252B37 | #101419 (Base) |
| Primary (violet) | #F5F4FF | #ECEAFF | #DBD8FF | #BEB4FF | #A091FF | #7F6DF7 | #6E5CF4 | #4731B5 | #6941C6 | #53389E | #563BDB (Base) |
| Error (red) | #FEF6F7 | #FDEDEF | #FCD4D9 | #FBADB6 | #FA7A89 | #FA4C61 | #FA1D37 | #D30D25 | #9E1020 | #6C0F1A | #FA1D37 (Base = 500) |
| Warning (yellow) | #FDFBF7 | #FCF8EE | #FBF3DA | #FAE8B2 | #FBDF8E | #FDD663 | #FABB00 | #C79605 | #967208 | #674F09 | #FABB00 (Base = 500) |
| Success (green) | #F6FEF9 | #ECFDF3 | #D1FADF | #A6F4C5 | #6CE9A6 | #32D583 | #12B76A | #039855 | #027A48 | #05603A | #054F31 (900) |
| Blue | #F7F9FD | #EDF3FC | #D5E5FC | #ACCDFB | #7DB2FC | #529AFE | #3488FF | #0668F4 | #0C52B6 | #0D3D82 | #3488FF (Base = 500) |

Note: `Primary`/`600` (#4731B5) is darker than `700` (#6941C6) — the file's own numbering is
non-monotonic at that one step. Preserved as-is (following the main definition per the task's own
"follow the main component" rule) rather than silently reordered.

### 1.2 Color — badge/severity "grading" scale (separate system)

Distinct from the primitives above — used by Badge, the Cards "Issues" family, and the Misc
grading page. Names only carry semantic meaning (Excellent→Fail), not hue names:

| Grade | Approx. hue | Confirmed swatch(es) |
|---|---|---|
| Excellent | green | Badge solid bg `#19f958` / text `#066c23` |
| Good | blue | Badge soft bg `#dbf6ff` / text `#27a4ff` (⚠️ fails AA as-is, see §1.3) |
| Fair | yellow | not independently resolved |
| Poor | brown | not independently resolved |
| Bad | orange | not independently resolved; Cards "Critical" tint `#fff1e6` is the closest confirmed |
| Fail | red | Badge solid bg `#f9191d` / text `white` |

This scale needs a dedicated Figma pass before it's treated as final — flagged as a gap, not guessed.

### 1.3 Semantic color tokens (what components will actually reference)

Two-layer token model per the brief: **raw palette** (above) is never referenced directly by
component code — everything goes through a **semantic layer**. Values marked "AA FIX" replace the
literal Figma value with the nearest passing shade from the same scale; the swap is documented here
and must ship, not the original.

| Semantic token | Value | Source | Contrast check |
|---|---|---|---|
| `color.surface.default` | `#FFFFFF` | Foundations/White | — |
| `color.surface.subtle` | `#FAFAFA` (Gray/50) | Sidebar/panel bg | — |
| `color.text.heading` | `#101419` (Gray/Base) | `semantic/text/text-heading` | 18.5:1 on white — pass |
| `color.text.body` | `#535862` (Gray/600) | `semantic/text/text-body` | 7.1:1 on white — pass |
| `color.text.subtle` | `#717680` (Gray/500) | placeholder/helper text | 4.56:1 on white — pass (barely; do not go lighter) |
| `color.text.disabled` | `#A4A7AE` (Gray/400) | disabled text | 2.4:1 — fails AA, but disabled content is exempt from 1.4.3 |
| `color.text.danger` | **`#D30D25`** (Error/600) | **AA FIX** — file uses Error/Base `#FA1D37` (3.97:1, fails normal text) for error text & the required-field asterisk | 5.45:1 on white — pass |
| `color.text.success` | **`#027A48`** (Success/700) | **AA FIX** — Success/500 `#12B76A` (2.62:1) is not currently used as text anywhere we found, but reserved as a token; using it as text would fail, so the token points at 700 instead | 5.41:1 on white — pass |
| `color.text.warning` | **`#674F09`** (Warning/800) | **AA FIX** — Warning/500 (1.73:1) and even /700 (4.46:1, large-text-only) fail for normal-size text | ~7:1 on white — pass (exact value to confirm at implementation time) |
| `color.primary.bg` | `#563BDB` | `semantic/buttons/button-primary-bg` | white text on it: 6.9:1 — pass |
| `color.primary.bg.hover` | `#6941C6` | `semantic/buttons/button-primary-hover` | — |
| `color.primary.bg.active` | `#563BDB` (same as default per extraction) | `semantic/buttons/button-primary-active` | — |
| `color.primary.bg.disabled` | `#BEB4FF` @ 60% opacity (double-dimmed in file) | `semantic/buttons/button-primary-disabled` | exempt (disabled) |
| `color.border.default` | `#E9EAEB` (Gray/200) | `semantic/border/border-default` | 1.2:1 vs white — fails 1.4.11 non-text 3:1 as a standalone boundary; acceptable only because these components (Input, Card) also carry a shape/shadow cue, but flagged — see §1.3.1 |
| `color.border.focus` | `#6E5CF4` (Primary/500) | Input focus border | 4.67:1 vs white — passes non-text 3:1 comfortably |
| `color.focus.ring` | **`rgba(105,65,198,0.55)` (Primary/700 based) or equivalent solid `#6941C6` at increased opacity** | **AA FIX** — file's `#D8D2FF` @ 47% opacity ring measures 1.44:1 solid (before opacity is even applied, so effective contrast is worse) against a white page, failing 1.4.11's 3:1 non-text requirement for a focus indicator | must independently verify ≥3:1 once implemented; do not ship the literal `#D8D2FF` ring as the *only* focus cue — pair with the border-color change (`border-focus` above), which already passes on its own |

#### 1.3.1 Full AA failure log (flag → fix, per task instructions)

| Pairing as found in Figma | Ratio | Verdict | Fix shipped |
|---|---|---|---|
| Error/Base `#FA1D37` text on white | 3.97:1 | Fails normal-text AA (needs 4.5) | Use Error/600 `#D30D25` (5.45:1) for any text/icon use; Error/Base stays available for large-text-only or non-text (backgrounds, 3:1 contexts) |
| Success/500 `#12B76A` as text on white | 2.62:1 | Fails | Success/700 `#027A48` (5.41:1) is the text-safe token |
| Warning/500 `#FABB00` as text on white | 1.73:1 | Fails badly | Warning/800 `#674F09` for text; keep /500 for non-text (icons/backgrounds at large size) |
| Badge "Soft/Blue-Good" text `#27a4ff` on its own bg `#dbf6ff` | 2.38:1 | Fails — this is a shipped-looking pairing in the file, not a hypothetical | Darken text to Blue/700 `#0C52B6` (verify ≥4.5:1 against `#dbf6ff` before shipping) or lighten bg — text-color fix is planned since bg is shared across other badge types |
| Focus ring `#D8D2FF` @ 47% opacity vs white | 1.44:1 (solid, worse with opacity) | Fails 1.4.11 non-text 3:1 | See `color.focus.ring` fix above; focus state also changes border color independently, which does pass |
| `border-default` `#E9EAEB` vs white | 1.2:1 | Technically fails 1.4.11 if the border is the *only* way to perceive the control boundary | Inputs/Cards also carry a shadow or fill-change cue; still flagging, and will lean on `shadow-xs` (which has enough perceptual weight in practice) — revisit with design if a stress test shows real users missing the boundary |
| Gray/300 `#D5D7DA` border vs white | 1.44:1 | Same category as above | Same reasoning; Secondary button's border is this exact pairing — low risk since the button also has visible padding/label, not purely border-dependent |

### 1.4 Typography

Typeface: **Geist** only (confirmed — no secondary/mono face anywhere in the file). Geist is
released under the SIL Open Font License 1.1 (free, commercial-use-safe) — **needs a final license
check at implementation time**, flagged rather than assumed. Fallback stack:
`"Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

| Style token | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|
| `type.display.lg` | Bold 700 | 96px | 112px | 0 |
| `type.display.md` | Bold 700 | 64px | 76px | 0 |
| `type.display.sm` | Bold 700 | 40px | 48px | 0 |
| `type.display.title` | Bold 700 | 30px | 38px | −0.3px |
| `type.heading.lg` | SemiBold 600 | 24px | 32px | 0 |
| `type.heading.md` | SemiBold 600 | 20px | 28px | 0 |
| `type.heading.sm` | SemiBold 600 | 18px | 26px | 0 |
| `type.body.lg` | SemiBold 600 | 18px | 28px | 0 |
| `type.body.md` (default) | Medium 500 | 16px | 24px | 0 |
| `type.body.sm` | Medium 500 | 14px | 20px | 0 |

Gap: the file's own printed weight labels disagree with the rendered/resolved weight on 3 of the 10
styles (Heading Large, Body Large, Display Title all show one weight in the on-canvas badge and
render with another) — resolved styles above trust the **rendered font class**, not the badge text,
and this is called out per the task's "flag discrepancies" instruction.

Button text sizes (`Button/button-large|medium|small` string variables) were never resolved to a
type-scale name — inferred at implementation time as `body.md`/`body.sm`/`body.sm` respectively
based on the actual measured button font sizes (16/14/14px) found while extracting Button styles.

### 1.5 Spacing

| Token | rem | px |
|---|---|---|
| `space.1` | 0.25rem | 4px |
| `space.2` | 0.5rem | 8px |
| `space.3` | 0.75rem | 12px |
| `space.4` | 1rem | 16px |
| `space.6` | 1.5rem | 24px |
| `space.8` | 2rem | 32px |
| `space.10` | 2.5rem | 40px |
| `space.12` | 3rem | 48px |
| `space.16` | 4rem | 64px |

### 1.6 Border radius

| Token | px |
|---|---|
| `radius.xs` | 4px |
| `radius.sm` | 8px |
| `radius.md` | 12px |
| `radius.lg` | 16px |
| `radius.xl` | 24px |
| `radius.full` | 100px (pill) |

### 1.7 Shadows

Full scale, confirmed with real values (not just names):

| Token | CSS |
|---|---|
| `shadow.xs` | `0px 1px 2px 0px rgba(0,0,0,0.05)` |
| `shadow.sm` | `0px 3px 6px 0px rgba(0,0,0,0.08)` |
| `shadow.md` | `0px 6px 12px 0px rgba(0,0,0,0.05)` |
| `shadow.lg` | `0px 15px 30px 0px rgba(0,0,0,0.07)` |
| `shadow.xl` | `0px 8px 24px 0px rgba(0,0,0,0.3)` |
| `shadow.2xl` | `0px 10px 30px 0px rgba(0,0,0,0.4)` |
| `shadow.3xl` | `0px 12px 40px 0px rgba(0,0,0,0.5)` |
| `shadow.focus-active` | 4px solid-spread halo, see §1.3 AA fix — do not ship literal color |
| `shadow.focus-secondary` | named in file, no description/value resolved — treat as an alias of `focus-active` until confirmed otherwise |

### 1.8 Layout & breakpoints

| Token | Value |
|---|---|
| `breakpoint.mobile` | 402px container (mockup labeled "Mobile 402px") |
| `breakpoint.desktop` | 1440px container (mockup labeled "Desktop 1,440px") |
| Side margin, desktop | 80px |
| Side margin, mobile | 39px (~40px) |

Gap: no tablet breakpoint or explicit column/gutter grid exists in the file. We'll add a
conventional `768px` tablet step and an 8px baseline gutter ourselves, documented as an assumption,
since the task requires reflow support at 320px regardless of what Figma defines.

### 1.9 Z-index

Not present in Figma at all (expected — stacking order is a code concern). Defining our own scale
now so overlay components have a documented, non-arbitrary source of truth:

| Token | Value | Use |
|---|---|---|
| `z.dropdown` | 1000 | Menu, Select/Combobox listbox popover |
| `z.sticky` | 1100 | Sticky headers/sidebars |
| `z.overlay` | 1200 | Modal/Dialog backdrop |
| `z.modal` | 1300 | Modal/Dialog content |
| `z.popover` | 1400 | Popover, Dropdown (Figma "Dropdown Actions" card menus) |
| `z.tooltip` | 1500 | Tooltip |
| `z.toast` | 1600 | Toast/status message |

## 2. Component inventory

For every component: variants/sizes/states found in Figma, behavior layer (per the WCAG doc §6),
and assumptions for anything missing. "Assumed" states follow WAI-ARIA APG conventions plus the
file's existing patterns (e.g. the `shadow.focus-active` ring + border-color change used everywhere
else).

### 2.1 Button — semantic HTML `<button>`
- **Style**: Primary, Secondary, Accent, Text
- **Size**: Small, Medium, Default(large)
- **State**: Active(default), Hover, Focus, Disabled — all present in Figma
- **Type**: Default (label only), Leading Icon, Trailing Icon, Icon-only, Loading
- Loading state exists in Figma structurally (symbol name) but its internal spinner treatment
  wasn't pixel-sampled — **assumed**: replace label with a spinner + `aria-busy="true"`, keep
  button's width stable, disable interaction while loading.
- Icon-only Button needs an explicit `aria-label` (TS-required prop when `type="icon"`) — 2.5.3/4.1.2.
- Medium size padding/font not sampled (only Small + Default were) — will interpolate from the
  Small→Default delta pattern and verify against a screenshot before shipping, not guess blindly.

### 2.2 Badge — semantic HTML `<span>`
- **Type**: Solid, Soft, Border, Filled, Tabs
- **Color**: Excellent/Good/Fair/Poor/Bad/Fail (grading scale, §1.2)
- No hover/focus/disabled states — badges are non-interactive by default; if used as a filter chip
  (interactive) anywhere downstream, that's a distinct composite, not this primitive.
- Border/Filled type values unresolved (gap) — will sample before final QA pass.

### 2.3 Checkbox / Radio — `react-aria-components`
- **Type**: Checkbox, Radio · **Checked**: true/false (+indeterminate for Checkbox, APG-assumed
  since Figma has no indeterminate swatch) · **State**: Default, Hover, Focused, Disabled
- Gap found: unchecked-Checkbox-specific Hover/Focused/Disabled weren't independently confirmed
  (extraction fell through to the Radio branch); square radius for unchecked Checkbox needs a
  direct re-check (10px "circular" value is almost certainly wrong for a square control) before
  pixel-perfect sign-off.
- Gap found: checked+Hover renders a minus/indeterminate glyph in the file, not a checkmark — flagged
  as a likely file inconsistency, will ship the checkmark (matching Default/Disabled) and note the
  deviation rather than reproduce what looks like a design-file bug.

### 2.4 Input (single-line) — semantic HTML `<input>` + our label/error wiring
- **Type**: Default, Leading Dropdown, Password, Trailing Icon, Web, Tags · **State**: Default,
  Focus, Disabled (Active not sampled yet) · **Size**: Base only found
- **No error/invalid state exists in the file at all** — fully assumed per APG: red border
  (`color.text.danger` family), error icon, error text below via `aria-describedby`,
  `aria-invalid="true"`. This is the single biggest "must design ourselves" item in the whole
  inventory.
- Required fields: red asterisk suffix only (no "(required)" text) — will keep the asterisk but
  also expose `aria-required="true"` programmatically, since color/glyph alone isn't a reliable a11y
  signal (1.3.1).
- Label token color inconsistency found (Default state uses one gray, Focus/Disabled another) —
  will pick one (`color.text.heading`, the more common of the two) and document the normalization.

### 2.5 Textarea — semantic HTML `<textarea>`, same label/error wiring as Input
- **Type**: Default, Rich Text · **State**: Default, Focus, Disabled, (Active unsampled)
- "Rich Text" variant implies a WYSIWYG surface — out of scope for a v1 primitive; will ship as a
  plain multi-line Textarea and flag Rich Text as a future composite, not fake it as rich text now.

### 2.6 Select / Dropdown / Menu — `react-aria-components`
**Audited against node `134:675` (page "↳ Dropdown", frame `433:8970`).** The page is three
columns: *Items* (`433:8991`) — six row layouts, each in Default/Hover/Disabled — *Menu Headers*
(`433:9117`), and *Menus* (`433:9129`) — six assemblies of those rows. The original read was
right: it is one popover-list primitive with several consumers, so the chrome lives in
`src/components/Select/popover-menu.css` and is shared by `Select`, `ComboBox` and `Menu`.

**Container geometry, measured from the menu nodes and verified in Chromium:**

| Menu | Figma | Shipped |
|---|---|---|
| Default `433:9130` | 209 wide, r12, p10, gap 7, `shadow/lg`, 0.75px `border-default` | ✓ (`min-width` 209 rather than a fixed 209, so a longer label can't clip) |
| Select Menu `433:9136` | same, but `shadow/md` | ✓ (`Menu selectionMode` + `default` variant; `Select`/`ComboBox` already take `shadow/md`) |
| User Menu `433:9139` | + profile header over a 189px rule | ✓ `header` prop; the rule is inset by the container's own 10px |
| Variant3 `433:9148` / Job Menu `433:9151` | 372 wide, r16, p4, gap 0 | ✓ `variant="detailed"` |
| Dropdown Actions Card `433:9154` | 396 wide, r15, p10, gap 5 | ✓ `variant="card"` |

**Row geometry:** Default `px8 py6 r8 gap4`, 24px icon, Body/Small-Medium → 36px tall (verified
36.00). Right-Icon / Select Menu `p8 r8` with a trailing 20px mark → 36px. With-description
`px23 py14 r12 gap21`, 32px icon, Body/Base-Semibold title over a 264px description → 97px
(verified 97.00, matching node `433:9016` exactly). Job `p8 r12 gap8` with a 44×43.48 logo tile
(9.942px radius, 0.66px inside stroke, 2.2px inner shadow) → 59.48px (verified 59.47). Dropdown
Actions `px8 py6 r13`, 10px column → 104px (verified 104.00).

**Fixes this audit produced**
- Rows were 16px Body/Base at `px12 py8`, radius 8, 1px gap between them, on a 4px-padded
  container: every container and row measurement above was wrong. All corrected.
- Hover/focus fill was `surface-subtle` `#fafafa`; the file uses `button-secondary-hover` `#f6f6f6`.
- Selected listbox rows were `primary-bg` with white text; the file keeps the row on `#f6f6f6` and
  carries the state in the mark. Corrected — 1.4.1 is still satisfied by the mark, not by fill.
- Row icons were `text-subtle`; the file's glyphs are its "Dark" style, now the new
  `--wsu-color-icon-default` (#141b34). Danger and disabled rows tint the glyph with the label, as
  the file does at `433:9135`.
- **Cross-component:** every overlay renders through a React Aria portal, i.e. as a child of
  `document.body` and *outside* the `.wsu-theme-root` that `reset.css` scopes itself to, so the
  global `box-sizing: border-box` never reached Popover, Modal or Tooltip. A 28px `min-height`
  plus 6px padding was rendering a 40px row against the file's 36px. Each of the three stylesheets
  now carries its own scoped box-sizing rule.

**New tokens**
- `--wsu-color-icon-default` `#141b34` — the file's "Dark" icon style, deliberately distinct from
  the text grays.
- `--wsu-color-text-meta` `#666970` — Figma "Grayscale/Base", the menu header's second line.
- `--wsu-font-body-md-semibold` — the file's named "Body/Base-Semibold" (16/24 at weight 600),
  which was missing from the type scale extracted from the Typography page.

**Deviations, and why**
| The file says | Shipped | Reason |
|---|---|---|
| Delete row `#fa1d37` (Foundations/Error/500) | `text-danger` `#d30d25` | 3.97:1 on white and 3.67:1 on the hover fill, against the 4.5:1 WCAG 1.4.3 requires of 14px text. The substitute is 5.45:1 / 5.04:1. |
| Description `#a4a7ae` under a `text-subtle` variable | `text-subtle` `#717680` | 2.41:1 — the value of `text-disabled` sitting on a `text-subtle` variable, so this reads as a stale value rather than an intent. 4.56:1 after. |
| Menus are a fixed width | `min-width` | A fixed 209/372/396 clips any label longer than the file's own examples; the file's rows are `whitespace-nowrap`, so they would overflow rather than wrap. |
| Select Menu shows an unchecked square on every row | kept | It is a multi-select list. `Menu selectionMode` renders it, and React Aria gives the rows `menuitemcheckbox` roles. `Select` (single-select, and not on this page at all) keeps a plain 20px tick instead — a checkbox square there would advertise multi-select. |
| "View" button at `433:9051`: `#e2e2e2` border, 10px radius, 8px padding, 16px icon | system `Button size="sm"` | A Button *instance* with local overrides that match no value on the Buttons page. Logged, not propagated. |

**Figma inconsistencies flagged, not resolved**
- The Default menu spaces its rows 7px apart; the User Menu wraps the identical rows in a column
  at 4px. 7px ships (the Default menu is the base). 
- The Select Menu is visually identical to the Default menu but takes `shadow/md` where the others
  take `shadow/lg`.
- `MenuHeader`'s avatar radius (6.095px) and initials size (15.448px) are the file's literals and
  read as artifacts of a scaled instance (of ~6.25px and 16px). Reproduced rather than rounded,
  since nothing in the file confirms the unscaled intent.
- The `MenuHeader` name/detail lines and the Job row's eyebrow are ad-hoc weights and leadings that
  match no named text style; both use the file's own 5px negative margin to overlap their lines.

**Sub-pixel tolerances** — the only measured misses. Chromium rounds the 0.75px container stroke up
to 1 device pixel, so a content-driven menu lands 1px wide of the file (Variant3: 373 against
372.5). The Job row's 43.48px logo tile measures 43.47px.

**Not extractable** — the row glyphs (`file-star`, `search-list-01`, `edit-02`, `repeat`,
`delete-02`, `file-upload`, `plus-sign`, `checkmark-square-02`, `checkmark-circle-02`) and the
Snapchat brand mark in the Job rows are vectors on `figma.com`, which this environment's egress
proxy blocks (see §0). House-style stand-ins drawn from the rendered nodes ship in `glyphs.tsx`;
the checkbox and check-circle carry the nodes' own insets, and only their corner radii are read off
the render. The brand mark is a third-party logo the library would not ship regardless — the Job
story keeps the tile's exact geometry around a neutral glyph.

### 2.7 Modal / Dialog — `react-aria-components` (`Modal`, `Dialog`, `DialogTrigger`)
**Audited against the Modals page (`144:33142`).** The panel comes from the file's only real modal
panel, "Type=Info, State=With Icon" (`433:9598`): white, 12px radius, **14px padding all round**, a
10px gap under the header, no border. The "Option Menu Modal" (`433:9607`) is not a second panel —
`433:9608` is the scrim and `433:9609` is a Create Resume menu floating on it. The scrim is that
node: `rgba(78,78,78,0.76)` under an 8px blur.

**Header set (`433:9554`)** — six variants, all one row:

| Variant | Figma | Shipped |
|---|---|---|
| Default `433:9555` | title Body/Base-Medium, close at the far end, 24px tall | `titleSize="md"` (the default) |
| Variant5 `433:9559` | centered Heading/Large, no close, 32px | `titleSize="lg" align="center" showCloseButton={false}` |
| With Badge `433:9562` | title + `Badge`, 36px | `badge` prop |
| With Icon `433:9567` | 20px glyph + 4px + title | `icon` prop |
| With Description `433:9572` | icon+title over a 14/20 `text-subheading` line, top-aligned, 46px (verified 46.00) | `description` prop; the row switches to `flex-start` on its own |
| With Tabs `458:946` | Body/Small-Semibold title beside a grouped Tabs, no close | `titleSize="sm"` + `headerAction` |

**Footer set (`433:9582`)** — Single CTA (one full-width button), Horizontal (two, space-between),
Stacked and Stacked Inverted (two full-width, 8px apart). Shipped as
`footerLayout: "single" | "horizontal" | "stacked"`: "Stacked Inverted" is the same layout with the
buttons in the other order, expressed by the order the children are passed rather than by a
`column-reverse` that would leave the visual order out of step with the DOM and focus order
(WCAG 1.3.2). The file gives the footer **no rule above it and no padding of its own** — the
`border-top` an earlier pass added is gone.

**Fixes this audit produced**
- The title was `heading-md` (20/28 SemiBold), this library's own; the file's is Body/Base-Medium
  (16/24) in four of six variants. All three of the file's title styles now ship.
- Panel padding was 24px/16px; the file's is a uniform 14px with a 10px header gap.
- The description was `text-body`; the file's is `text-subheading` (#414651).
- The header text column gapped 4px; the file's is 2px.
- The header row top-aligned always; the file centers except in "With Description".
- The close control was a `CloseGlyph` in a text Button; the file's is the filled
  `multiplication-sign-square`, now `CloseSquareGlyph`.

**New tokens** — `--wsu-font-body-sm-semibold`, the file's named "Body/Small-Semibold" (14/20 at
weight 600), which was missing from the type scale extracted from the Typography page.

**Deviations, and why**
| The file says | Shipped | Reason |
|---|---|---|
| The close control is a bare 20px glyph | 20px glyph inside a 28x28 button | 20px is under the 24x24 floor WCAG 2.5.8 sets for a pointer target. The glyph is unchanged; only the hit area grows, which also makes the Default header 28px rather than the file's 24px. |
| The "With Badge" header's badge is 36px tall, its text 16px | the Badge page's own 32px chip | That instance overrides the size to 16px while keeping the `text-sm` variable attached — a detached override. The Badge page is the component's definition, so it wins. |
| "With Tabs" hugs its content at a 13px gap | the shared header's space-between | The file's frame is 281px wide and hug-sized; a real panel is wider, and nothing in the file says what fills the difference. |

**A structural constraint worth recording.** `Tabs` cannot wrap `<Modal>`: react-aria renders a
collection's children a second time to build the collection, and the dialog's portal escapes that
pass, so the whole dialog mounts twice (verified — two elements with `role="dialog"`). But the
"With Tabs" header needs its `TabList` and the body's `TabPanel`s in one `Tabs` subtree, or the
selected tab's `aria-controls` points at nothing. `Modal` therefore takes a `contentWrapper` render
prop, which puts the provider inside the portal instead.

### 2.8 Tabs — `react-aria-components` (`Tabs`)
- Only a single "Grouped" 3-tab instance exists in the file: selected (white pill, inset shadow) vs.
  unselected (transparent, muted text) — **no Hover, Disabled, or Focus-visible treatment exists in
  Figma at all**, confirmed structurally, not a sampling miss.
- Assumed (APG + file's own focus-ring pattern): Hover = subtle bg tint consistent with
  Button/Checkbox hover treatment; Focus-visible = the same halo-ring pattern (fixed per §1.3) around
  the focused tab; Disabled = `color.text.disabled` + `aria-disabled`, non-interactive.

### 2.9 Tooltip — `react-aria-components` (`Tooltip`, `TooltipTrigger`)
- Not found as a distinct page in this file at all (matches the user's "Missing components" list) —
  fully assumed from APG: appears on hover/focus after a short delay, dismissible via Escape,
  `role="tooltip"`, referenced by `aria-describedby` on the trigger, respects 1.4.13 (hoverable,
  dismissible, persistent).
- Visual treatment: will reuse `color.text.heading` inverted (dark bg/white text) + `shadow.sm` +
  `radius.sm`, consistent with the rest of the system, and flagged in docs as "assumed, not
  Figma-sourced."

### 2.10 Card (Issues / Review / Inline Review families) — semantic HTML, `<button>`/`<details>`
for the expand/collapse affordance depending on final interaction design
- Shared chrome: `radius.sm`–`radius.lg` depending on nesting depth, `shadow.xs` on inner panels,
  `shadow.md` on the Inline Review floating annotation card
- Severity color-coding is a **separate token set** from Badge's grading colors per §1.2 — will
  ship as its own `severity.*` token group rather than force-fit onto Badge's tokens, and flag the
  mismatch to design rather than silently unify two systems that may be intentionally different.
- "General" severity duplicating "Urgent"'s exact tint is flagged as a likely file inconsistency,
  not reproduced as a 4th red-toned severity without confirmation.

### 2.11 Sidebar — semantic HTML `<nav>`/`<a>`
- Item states: Default, Hover, Active (rail indicator `2×22px`/`radius.xs`/primary, rendered as a
  real inline flex child — not an absolutely-positioned pseudo-element — inside a `primary/25`
  full-row pill at `radius.sm`; text stays medium/500, never bold, in every state), With-Children
  Expanded/Collapsed (chevron rotation + indented submenu). Re-verified against node 433:11097
  after an initial ship had drifted from these values (rail mis-positioned, active text
  incorrectly bolded, item radius/padding off) — corrected in place, documented in Sidebar.css.
- Submenu (node 433:11036, "With Children, Expanded"): child rows have **no icon and no
  rail slot at all** — plain text pills, `22px` tall, `radius.xs`, connected to the parent by a
  single curved connector near the top (not a continuous rail down the full list, which the
  first implementation had fabricated). The active child gets a `primary/25` pill + primary text,
  a distinct treatment from the top-level rail+tint active state. The connector itself is a small
  Figma vector asset that couldn't be extracted (see below) — approximated with a CSS
  border-radius corner rather than an SVG.
- Icons: every top-level item has one in Figma (18×18px — a size that doesn't land on the
  shared icon-size token scale, given its own component-local `--wsu-sidebar-icon-size` token
  rather than force-fit onto 16/20px). **The glyphs themselves could not be extracted**: Figma's
  vector asset host (`www.figma.com`, used by the MCP server's SVG export) is blocked by this
  environment's egress policy — confirmed via repeated, consistent 403s at the proxy level, not
  a transient failure. Shipped hand-authored stand-in glyphs instead (`src/components/Icon/
  glyphs.tsx`, "Sidebar nav glyphs" section) matching each item's icon *identity* (confirmed by
  name for 3 of them via Figma's own component descriptions: home-01/"house" for Dashboard,
  invoice-03/"bill" for Offer Negotiation, help-circle and notification-02 for the two utility
  items) — not pixel-exact vector data. Swap the `icon` prop for real exports once the asset
  host is reachable, or a designer exports them directly; the component itself is icon-agnostic.
- Container: Default/Expanded/Minimized properties exist in Figma but render pixel-identical in
  every sample pulled (217px wide in all three) — **the "Minimized" icon-only collapsed-rail
  treatment other design systems typically have does not appear to exist here**; flagged rather
  than invented. Will ship Default/Expanded behavior only for v1 and treat a true icon-rail
  "Minimized" mode as a follow-up if design confirms it should exist.

### 2.12 Tag/Chip-style dropdown items, Job cards, etc. (Dropdown page "Job", "Job with Actions")
- Confirmed by the §2.6 audit: content patterns over the same row primitive, not new components.
  They ship as `MenuAction.content` + `MenuAction.actions`, with the tile/eyebrow/heading
  measurements exposed as `.wsu-MenuItem__logo` / `__stack` / `__eyebrow` / `__heading` so the
  pattern can be rebuilt without re-deriving them, and as Figma-parity Storybook stories.

### 2.13 Icon — semantic HTML `<svg>` wrapper
- Per user direction, **glyph extraction is deferred**. The `Icon` component itself (inherits
  `currentColor`, sizes from `space`/dedicated icon-size tokens, `aria-hidden` by default, opt-in
  `label` prop for an accessible name) ships in the foundation wave regardless, so every other
  component that needs an icon slot has a stable contract to code against. Actual glyph set
  (looks like Hugeicons-style numbered outline icons — `alert-02`, `dashboard-square-02`,
  `checkmark-square-02`, `arrow-right`, `info-circle`, `cancel-01`, `plus-sign`, `star`, and ~15
  more found, not exhaustive) gets pulled in a later pass.

### 2.14 Components with no Figma presence at all (user-confirmed "Missing components")
OTP, Autocomplete, Table, Menu, Drag-and-Drop File Input, Tooltips, Loading Spinner. All will be
designed from WAI-ARIA APG patterns + this file's existing visual language (radius/shadow/spacing/
color tokens, the same focus-ring and error-text conventions used elsewhere) and explicitly marked
"Not in source Figma — designed to match system" in their Storybook docs. Tooltip is detailed in
§2.9 since React Aria owns its behavior; the rest are lower priority (see build order, §3).

### 2.15 Cross-cutting: inside strokes and box-sizing

Figma draws a stroke **inside** a frame's bounds; CSS adds a `border` **around** the content box.
Wherever a node's measured size was reproduced as a fixed height/width *and* its stroke as a real
border, the rendered box came out 2px larger than the file. The pattern that matches Figma is
`box-shadow: inset 0 0 0 Npx <color>` with `border: none`, and it composes with a focus ring by
stacking layers.

A full sweep of every `border`/`border-*` declaration against every pinned dimension found:

| Where | Was | Now |
|---|---|---|
| `Select` trigger | 42px tall, 12px radius, 8px block padding, real border | the Inputs page's audited field: 44px, 10px radius, 10px padding, inset stroke |
| `ComboBox` field | same 42px/12px | same fix |
| Alice panel, chat bubble, `Input` field, `Badge --border`, `Card` neutral, the Job logo tile | real borders inflating measured frames | inset strokes (fixed as each page was audited) |
| `Checkbox`, `Radio`, `Table`, `Spinner`, `FileInput`, `Tabs`, `ComboBox` toggle | relied on reset.css for `border-box` | each declares it locally |
| `Popover`, `Modal`, `Tooltip` | same, but **unreachable** by the reset | each stylesheet carries a scoped rule |

That last row is the one that was actually broken rather than merely fragile: overlays render
through a React Aria portal, as children of `document.body` and outside the `.wsu-theme-root` that
`reset.css` scopes itself to, so the global `box-sizing: border-box` never applied to them at all.
A 28px `min-height` plus 6px padding was rendering a 40px menu row against the file's 36px.

Left alone deliberately: borders that *are* the drawn shape rather than a frame's stroke — the
`Spinner` ring, the `Button` loading ring, the `Sidebar` submenu connector elbow, and the
divider rules in `Card`, `Table`, `Input`'s prefix and the menu header.

`Textarea` keeps its own 12px radius and 10px inline padding rather than the field's 10px/13px:
it already uses the inset-stroke pattern, and nothing in the file confirms that a multi-line box
shares the single-line field's values.

## 3. Proposed build order

1. **Foundations** — CSS custom properties + typed theme object (raw palette → semantic layer),
   `ThemeProvider`/`createTheme`, dev-mode contrast warning, global reset, `prefers-reduced-motion`
   handling, the `Icon` wrapper contract (no glyphs yet).
2. **Primitives (semantic-HTML-driven)** — Button, Badge, Input, Textarea, Checkbox, Radio (the
   latter two via React Aria per §6 of the WCAG doc, but simple enough to build alongside the pure-
   HTML primitives).
3. **Primitives (React-Aria-driven, standalone)** — Tabs, Tooltip.
4. **Overlay/portal infrastructure** — shared portal + focus-trap + z-index wiring used by Modal,
   Popover, and the Select/Menu popover base.
5. **Composite: Popover-menu primitive** — generic listbox/menu popover (backs Select, Combobox,
   and the Dropdown page's various list-item content patterns).
6. **Composites built on the popover primitive** — Select, Combobox, Menu.
7. **Composite: Modal/Dialog.**
8. **Composite: Card family** (Issues/Review/Inline Review) + Sidebar.
9. **Gap-filling components with no Figma source** — Loading Spinner, Table, Menu (if not already
   covered by #6), Autocomplete (on top of Combobox), OTP input, Drag-and-Drop File Input.
10. **Deferred**: Alice AI composites (Chat Bubble, Resume Interactions, Alice Icon) and full icon
    glyph set — revisit once the user wants that page inventoried and icons unblocked.

Storybook docs + accessibility tests + unit tests + axe assertions are written alongside each
component as it's built (not as a separate pass at the end), per the task's own ordering.
