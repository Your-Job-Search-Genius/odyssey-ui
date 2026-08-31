# @your-job-search-genius/odyssey-ui

A production React component library built from the **Writesea Odyssey** Figma design
system, with [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) accessibility built in
from the ground up rather than bolted on.

- 20 components, each with full variant/size/state coverage, `forwardRef`, controlled
  and uncontrolled input support, and `className`/`style` passthrough
- A two-layer design token system (raw palette → semantic tokens) exposed as CSS custom
  properties and a typed theme object, with a `createTheme()` API for reskinning
  without forking
- Complex interactive widgets (Select, ComboBox, Menu, Tabs, Modal, Tooltip, Table,
  FileInput, Checkbox, Radio) are built on [`react-aria-components`](https://react-spectrum.adobe.com/react-aria/)
  for its behavior contract — focus management, keyboard navigation, and ARIA wiring.
  Simple components (Button, Input, Badge, Card, Sidebar, Spinner, OTP input) are plain
  semantic HTML, since native browser behavior is already correct for them
- Documented in Storybook with a11y-addon and interaction tests; every component ships
  with its own unit tests (Testing Library + `vitest-axe`)
- ESM + CJS builds, full type declarations, tree-shakeable per-component entry points,
  SSR-safe (no `window`/`document` access at module scope anywhere in the library)

See [`docs/design-inventory.md`](./docs/design-inventory.md) for the full token/component
inventory pulled from Figma (including every documented AA contrast fix and assumption),
and [`docs/accessibility/wcag-2.2-aa-checklist.md`](./docs/accessibility/wcag-2.2-aa-checklist.md)
for the accessibility checklist this library is built against.

## Installation

```sh
npm install @your-job-search-genius/odyssey-ui react react-dom
```

`react` and `react-dom` (`^18.0.0 || ^19.0.0`) are peer dependencies — bring your own.
`react-aria-components` is bundled as a regular dependency; you don't need to install it
yourself.

Import the base stylesheet once, near the root of your app (it carries the design
tokens as CSS custom properties, a small reset, and every component's styles):

```ts
import "@your-job-search-genius/odyssey-ui/styles.css";
```

Then use components as you would any other React library:

```tsx
import { Button, Input, ThemeProvider } from "@your-job-search-genius/odyssey-ui";

function App() {
  return (
    <ThemeProvider>
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Button variant="primary">Continue</Button>
    </ThemeProvider>
  );
}
```

`ThemeProvider` is optional if you're happy with the default theme — every component
falls back to it automatically. Wrap your app in it when you want to override colors
(see [Theming](#theming) below) or scope a second theme to part of the tree.

### Tree-shaking / per-component imports

Every component also has its own entry point with its own stylesheet, so a bundler (or
you, manually) can pull in only what's used:

```tsx
import { Button } from "@your-job-search-genius/odyssey-ui/components/Button";
import "@your-job-search-genius/odyssey-ui/components/Button/styles.css";
```

The package sets `"sideEffects": ["**/*.css"]`, so bundlers can safely drop unused
component JS while still keeping every CSS import you actually wrote.

## Theming

There are two ways to reskin the library, and you can mix them.

### 1. `createTheme()` + `ThemeProvider`

```tsx
import { createTheme, ThemeProvider } from "@your-job-search-genius/odyssey-ui";

const oceanTheme = createTheme({
  colors: {
    "primary-bg": "#0B5FFF",
    "primary-bg-hover": "#0A50D9",
    "primary-text": "#FFFFFF",
    "border-focus": "#0B5FFF",
  },
});

function App() {
  return (
    <ThemeProvider theme={oceanTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

`createTheme(overrides)` starts from the shipped Writesea Odyssey theme and merges in
whatever semantic color tokens you override — you only need to specify what's changing.
In development (`NODE_ENV !== "production"`), every text/background and non-text
boundary/background pairing the library depends on is **re-audited for WCAG AA contrast
and logged via `console.warn` on failure** — including pairings your override
introduces, not just the shipped defaults. This check is stripped in production builds.

Nest a second `ThemeProvider` anywhere inside the tree to scope a different theme (e.g.
a themed section, a dark panel) to just that subtree — it doesn't leak upward or affect
siblings.

### 2. CSS custom property overrides

Every token is also a plain `--wsu-*` CSS custom property (see
[`src/theme/tokens.css`](./src/theme/tokens.css) for the full list), so you can override
them with plain CSS and skip the JS API entirely:

```css
.my-app {
  --wsu-color-primary-bg: #0b5fff;
  --wsu-color-primary-bg-hover: #0a50d9;
  --wsu-color-primary-text: #ffffff;
}
```

This gets you reskinning without `createTheme()`, but you lose the dev-mode contrast
audit — that check only runs for themes built with `createTheme()`.

### Dark mode

The token structure (raw palette in [`src/theme/palette.ts`](./src/theme/palette.ts),
semantic layer in [`src/theme/semantic.ts`](./src/theme/semantic.ts)) is deliberately
split so a dark palette can be added later as an alternate semantic mapping over the
same raw colors — the source Figma file has no dark mode today, so none is shipped, but
nothing in the component layer assumes light-mode-only values.

## Fonts

Components reference a `Geist` / system-sans-serif font stack (see
[`src/theme/typography.ts`](./src/theme/typography.ts)); `Geist` is freely licensed
(SIL Open Font License) and hosted on Google Fonts. Loading it is opt-in — the library
never injects a remote `@import` for you:

```ts
import "@your-job-search-genius/odyssey-ui/fonts.css";
```

Skip this import (or supply your own self-hosted `Geist`, or omit the font entirely) and
every component still renders correctly, falling back through
`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

## Accessibility

This library is built to [WCAG 2.2 Level AA](./docs/accessibility/wcag-2.2-aa-checklist.md),
not just spot-checked against it:

- **Contrast** — every shipped text and non-text color pairing is independently computed
  (relative luminance, not trusted from Figma's own badges) against the 4.5:1 (text) /
  3:1 (large text, UI boundaries) floors. Pairings that failed in the source design were
  substituted with the nearest passing shade of the same palette color and documented in
  [`src/theme/semantic.ts`](./src/theme/semantic.ts) and
  [`docs/design-inventory.md`](./docs/design-inventory.md).
- **Keyboard** — every interactive component is fully operable by keyboard alone, with
  no traps, a visible focus indicator (`--wsu-shadow-focus-ring`), and a logical tab
  order. At least one keyboard-interaction Storybook `play` test exists per interactive
  component.
- **Screen readers** — every form control has a programmatic label (no icon-only
  controls without `aria-label`, enforced by TypeScript on `Button` and `Icon`); complex
  widgets (Select, ComboBox, Menu, Tabs, Modal, Tooltip, Table, FileInput, Checkbox,
  Radio) get their name/role/value contract from `react-aria-components`.
- **Errors** — form validation errors are identified in text (never color alone) and
  announced via `role="alert"` (`Input`, `Textarea`, `OtpInput`).
- **Overlays** — `Modal` traps focus, restores it to the trigger on close, closes on
  <kbd>Escape</kbd>, locks body scroll, and renders through a portal above
  `--wsu-z-*`-scoped z-index tokens.
- **Motion** — animations respect `prefers-reduced-motion`.
- **Zoom / reflow / text spacing** — layouts use relative units and are tested to remain
  usable at 320px width, 200% zoom, and under the WCAG 1.4.12 text-spacing override.

Every component ships a `<Component>.test.tsx` asserting zero `axe` violations across
its variants/states, and every Storybook story runs through the
[`@storybook/addon-a11y`](https://storybook.js.org/addons/@storybook/addon-a11y) panel.

## Components

| Component | Behavior layer |
|---|---|
| `Button` | Semantic `<button>` |
| `Icon` | Semantic `<svg>` wrapper (inherits `currentColor`, sized from tokens, hidden from screen readers unless labeled) |
| `Input`, `Textarea` | Semantic `<input>`/`<textarea>` with our own label/helper/error wiring |
| `OtpInput` | Semantic `<input>` group with hand-rolled arrow-key/paste navigation |
| `Badge` | Semantic `<span>` |
| `Card` | Semantic `<details>`/`<summary>` for the collapsible variant |
| `Sidebar` | Semantic `<nav>`/`<details>` |
| `Spinner` | Semantic `role="status"` |
| `Checkbox`, `Radio` | `react-aria-components` |
| `Select`, `ComboBox`, `Autocomplete` (a ComboBox preset) | `react-aria-components` |
| `Menu` | `react-aria-components` |
| `Tabs` | `react-aria-components` |
| `Modal` | `react-aria-components` |
| `Tooltip` | `react-aria-components` |
| `Table` | `react-aria-components` (`role="grid"`, or `treegrid` with expandable rows) |
| `FileInput` | `react-aria-components` (drag-and-drop + native file picker) |
| `Meter` | `react-aria-components` (`meter`/`progressbar` role fallback) |

Every component has a matching Storybook story set (`npm run storybook`) covering every
variant, size, and state with interactive controls and usage guidance.

## Local development

```sh
npm install
npm run typecheck      # tsc --noEmit
npm test                # vitest run — unit tests + axe checks
npm run build            # tsup — ESM + CJS + .d.ts, per component and bundled
npm run storybook        # Storybook dev server on :6006
npm run build-storybook  # static Storybook build
```

All four commands run clean from a fresh `npm install` on this repository.

## Browser support / SSR

No `window`, `document`, or other browser-only global is accessed at module scope
anywhere in the library — `ThemeProvider` applies theme tokens as inline styles (no
stylesheet injection, no effects), so server and first client render are byte-identical.
The one component that needs a real DOM overlay (`Modal`'s portal) delegates entirely to
`react-aria-components`, which handles that lazily and safely under SSR.

## License

MIT
