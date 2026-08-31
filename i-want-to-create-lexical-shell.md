# Odyssey UI Docs Site — Component Showcase on GitHub Pages

## Context

The repo is `@writesea/odyssey-ui` (yjsg-ui), a React component library: 55 component dirs, 54 exported from `src/index.ts`, built on react-aria-components, styled with `--wsu-*` tokens, currently documented only via Storybook. The user wants a **custom, polished showcase website** (shadcn/ui-style) where every component can be browsed by category, previewed live, and copied — exact import statement + full demo source code — deployed to **GitHub Pages** via GitHub Actions.

Decisions made with the user:
- **Custom docs site** (not Storybook deployment), new `docs-site/` app in this repo, library build untouched.
- **All 54 exported components** get pages at launch; ~15 high-traffic ones get 3–5 demos, rest get 1–2 (adapted from existing `.stories.tsx`).
- **Dark/light toggle for site chrome only**; component preview canvases stay light (library ships no dark tokens).

Verified facts that shape the plan:
- `pnpm-workspace.yaml` has no `packages:` key (only `allowBuilds`, `minimumReleaseAgeExclude`) — keep those, add `packages: ["docs-site"]`.
- Private dep `@your-job-search-genius/icons` (npm.pkg.github.com) is imported by component **source** — CI needs registry auth; `.npmrc` reads `${NODE_AUTH_TOKEN}`.
- Git remote: `Your-Job-Search-Genius/yjsg-ui` → Pages base path **`/yjsg-ui/`**, URL `https://your-job-search-genius.github.io/yjsg-ui/`.
- Exports map: root `.`, `./styles.css`, `./components/*`, `./components/*/styles.css` — feeds ImportSnippet.
- `CommandPalette` (src/components/CommandPalette/CommandPalette.tsx) has `items`, `onAction`, `renderEmptyState`, `enableShortcut` (default ⌘J) — dogfood it for docs search with `enableShortcut={false}` + docs-owned ⌘K.
- `Toast` uses a module-singleton `toastQueue` + `ToastRegion` → exactly **one** Toast demo block per page.
- No `.github/` dir exists; no `packageManager` field (CI must pin pnpm 11, node 22); root `.gitignore` has unanchored `dist` (covers `docs-site/dist`).
- Storybook decorator (`.storybook/preview.tsx`) = ThemeProvider + padding + fonts — the template for `PreviewCanvas`.

## Structure

```
pnpm-workspace.yaml                  # MODIFY: add packages: ["docs-site"], keep existing keys
.github/workflows/deploy-docs.yml    # NEW: build + Pages deploy
docs-site/
  package.json                       # "odyssey-docs", private; deps: react/react-dom ^18.3.1 (mirror root),
                                     #   react-router-dom, shiki, @internationalized/date, @your-job-search-genius/icons
  tsconfig.json                      # STANDALONE (not extends root); Bundler resolution, strict + noUncheckedIndexedAccess,
                                     #   types:["vite/client"], paths: "@writesea/odyssey-ui" -> ../src/index.ts (+ /components/*)
  vite.config.ts                     # base "/yjsg-ui/", react plugin, aliases, dedupe, 404-copy plugin, server.fs.allow [".."]
  index.html                         # lang=en, Geist <link> (same URL as src/theme/fonts.css), inline pre-paint theme script (no FOUC)
  public/.nojekyll
  src/
    main.tsx                         # import "@writesea/odyssey-ui" (pulls all library CSS), then ./styles/site.css (last, wins ties)
    App.tsx                          # routes: Layout > Home | GettingStarted | Theming | ComponentsIndex | ComponentPage(:slug) | NotFound
    registry/{types,categories,registry}.ts   # typed registry of 54 entries + dev-only registry↔glob consistency check
    demos/loader.ts                  # import.meta.glob machinery (below)
    demos/<slug>/<demo-id>.tsx       # ~110 demo files, one default-exported component each
    components/                      # docs chrome, `docs-` class prefix, co-located CSS:
      Layout, Header, SidebarNav, MobileDrawer, SearchPalette, ThemeToggle,
      DemoBlock, PreviewCanvas, CodeBlock, CopyButton, ImportSnippet, DemoErrorBoundary, Prose
    pages/{Home,GettingStarted,Theming,ComponentsIndex,ComponentPage,NotFound}.tsx
    lib/{highlighter,theme}.ts       # lazy shiki singleton; docs theme persistence helpers
    styles/site.css                  # --docs-* vars for :root and [data-theme="dark"], layout, responsive
```

## Key mechanisms

### Demo loading (code can never drift from preview)
Demos are real `.tsx` modules imported twice via two **lazy** globs in `demos/loader.ts`:
```ts
const demoModules = import.meta.glob<{ default: ComponentType }>("./*/*.tsx");
const demoSources = import.meta.glob<string>("./*/*.tsx", { query: "?raw", import: "default" });
```
- Key contract: `./${slug}/${demoId}.tsx`; registry `slug` + `demos[].id` are the single source of truth.
- `getDemoComponent(slug, id)`: **memoize `React.lazy` in a Map** (recreating per render remounts demos); missing key → null → DemoBlock error card.
- `getDemoSource(slug, id)`: promise of raw text; CodeBlock loads it independently of preview (one side failing never blanks the other).
- Both globs lazy → each demo (and its source) is its own chunk; nothing lands in the entry bundle.
- Demo file rules: default-export one component, self-contained state, imports only `@writesea/odyssey-ui` (+ `@internationalized/date` / icons when the story used them), inline `style` for layout — displayed code has no hidden deps.

### Vite config (critical bits)
```ts
base: "/yjsg-ui/",
resolve: {
  alias: [
    { find: /^@writesea\/odyssey-ui$/, replacement: resolve(__dirname, "../src/index.ts") },
    { find: /^@writesea\/odyssey-ui\/components\/([^/]+)$/, replacement: resolve(__dirname, "../src/components/$1/index.ts") },
  ],
  dedupe: ["react", "react-dom", "react-aria-components", "react-aria", "react-stately"],
},
plugins: [react(), { name: "spa-404", closeBundle: () => copyFileSync("dist/index.html", "dist/404.html") }]
```
- Alias to source (no `workspace:*` dep — an alias miss should fail loudly, not silently hit stale `dist/`). Library CSS side-effect imports resolve naturally; token/reset CSS precedes component CSS via barrel order.
- `dedupe` is the guard against two React copies / RAC context mismatch (RAC contexts are module singletons).
- Routing: `BrowserRouter basename={import.meta.env.BASE_URL}` + 404.html copy → clean URLs that survive GH Pages refresh. Never hardcode `/yjsg-ui/` outside vite.config.
- Shiki: `createHighlighterCore` + JS regex engine + tsx grammar + github-light/github-dark dual themes, one lazy shared chunk; plain `<pre>` fallback while loading.

### Page layout
`ComponentPage`: h1 + category badge + description → `ImportSnippet` (both forms: root barrel; per-component subpath + `styles.css`, generated from registry `importNames`/`subpath`) → one `DemoBlock` per demo (anchor ids, "On this page" rail ≥1200px) → prev/next links.
`DemoBlock`: Preview/Code tabs (plain docs-chrome tabs, NOT library Tabs) + always-visible CopyButton; Preview = ErrorBoundary > Suspense > PreviewCanvas > Demo.
`PreviewCanvas`: forced-light — `background:#fff; color-scheme:light`, padding, centered flex-wrap, wraps children in library `ThemeProvider` (mirrors Storybook decorator). Portalled overlays escaping to body are fine (library CSS is global).
`SidebarNav`: category-grouped links + filter input; zero matches → "No components match" + clear button. Mobile <900px: `MobileDrawer` (scrim, Esc, focus containment, closes on navigate).
Theme: `data-theme` on `<html>`, light/dark/system cycle, `localStorage["odyssey-docs-theme"]`, inline pre-paint script in index.html.

## Categories (all 54)

| Category | Components |
|---|---|
| Actions (2) | Button, ToggleButton |
| Forms (16) | Form, Input, Textarea, Checkbox, Radio, Switch, Select, ComboBox, Autocomplete, NumberField, Slider, SearchField, OtpInput, TagsInput, FileInput, DropZone |
| Pickers (11) | DatePicker, DateRangePicker, DateField, Calendar, RangeCalendar, ColorPicker, ColorArea, ColorField, ColorSlider, ColorSwatch, ColorSwatchPicker |
| Overlays (5) | Modal, Popover, Tooltip, Menu, CommandPalette |
| Navigation (4) | Tabs, Breadcrumbs, Sidebar, Link |
| Data Display (7) | Table, Card, Badge, BadgeGroup, TagGroup, ListBox, GridList |
| Feedback (4) | Toast, Spinner, ProgressBar, Meter |
| Layout (3) | Group, Separator, Disclosure |
| AI / Chat (1) | Alice (6 sub-components: AliceIcon, ChatBubble, QuestionCard, RewriteCard, Suggestion, ContributionRef) |
| Utilities (1) | Virtualizer |

(PreviewTrigger excluded — not exported from the barrel.)

## Demo scope (~110 files, mined from .stories.tsx)

- **3–5 demos**: Button (variants/sizes/with-icons/states/full-width), Input, Select, ComboBox, Modal, Table (incl. DataTable), Tabs, Menu, Checkbox (incl. group/indeterminate), Radio, DatePicker, ColorPicker, Sidebar, Alice (icon-states/chat-bubbles/suggestion-cards).
- **Toast: exactly ONE combined demo** (variant buttons + single `<ToastRegion/>`) — singleton queue renders duplicates otherwise.
- **2 demos**: Textarea, Switch, Tooltip, Popover, TagGroup, TagsInput, Slider, Breadcrumbs, Card, Badge, GridList, ListBox, Virtualizer, Calendar, DateRangePicker.
- **1 solid demo** for the remaining ~24, adapted from each component's best story.
- Conversion recipe: take story `render` body, inline `args` as literal props, rewrite `./X` imports to `@writesea/odyssey-ui`, keep icon imports, drop `play` fns and Storybook types.

## CI / Deploy (.github/workflows/deploy-docs.yml)

- Trigger: push to `master` + `workflow_dispatch`. Permissions: `contents: read, pages: write, id-token: write, packages: read`. Concurrency group `github-pages`.
- Build job: checkout → `pnpm/action-setup@v4` (version 11) → `setup-node@v4` (node 22, cache pnpm) → `pnpm install --frozen-lockfile` with `NODE_AUTH_TOKEN: ${{ secrets.NPM_PACKAGES_TOKEN || secrets.GITHUB_TOKEN }}` → `pnpm -C docs-site build` → `configure-pages@v5` → `upload-pages-artifact@v3` (path `docs-site/dist`). Deploy job: `deploy-pages@v4` with `github-pages` environment.
- **Manual steps for the user (surface in final report):** (1) repo Settings → Pages → Source: **GitHub Actions**; (2) if `GITHUB_TOKEN` can't read the icons package (published from another repo), either grant this repo Read on the package's "Manage Actions access" or add a `read:packages` PAT as secret `NPM_PACKAGES_TOKEN`.
- Commit the regenerated `pnpm-lock.yaml` (workspace importer added) or `--frozen-lockfile` fails.

## Implementation phases

1. **Workspace scaffold (gate: library stays green).** Edit pnpm-workspace.yaml; create docs-site package/tsconfig/vite config/index.html; minimal App rendering one `<Button>` from `@writesea/odyssey-ui`. `pnpm install`, then run library `pnpm build` + `pnpm test` to prove workspace conversion broke nothing; `pnpm -C docs-site dev` proves alias/CSS/dedupe/icons end-to-end.
2. **Chrome & routing.** site.css tokens, Layout/Header/SidebarNav/MobileDrawer/ThemeToggle + pre-paint script, route table, NotFound. Full 54-entry registry with empty `demos: []` (sidebar + search work before demos exist).
3. **Demo infrastructure.** loader.ts, DemoBlock, PreviewCanvas, DemoErrorBoundary, CodeBlock + highlighter, CopyButton, ImportSnippet, ComponentPage. Prove with `button/variants` + `select/basic` (RAC dedupe canary). Dev-only registry↔glob check.
4. **Demos in category batches**: (a) Actions+Forms, (b) Pickers, (c) Overlays+Feedback, (d) Data Display+Navigation, (e) Layout+AI+Utilities. Fill registry per batch, eyeball in dev.
5. **Content & polish.** Home/GettingStarted/Theming (seed from README), ComponentsIndex, SearchPalette (⌘K, `enableShortcut={false}`), responsive + a11y + dark-mode sweep, prev/next, "On this page" rail.
6. **Build & deploy.** Production build checks, workflow file, commit lockfile.

## Verification

- `pnpm -C docs-site typecheck` clean; library `pnpm build` + `pnpm test` still green after workspace change.
- Dev: `http://localhost:5173/yjsg-ui/` — sidebar lists 54, ⌘K navigates, theme persists without FOUC, filter empty state, mobile drawer, Modal/Toast overlay over dark chrome, HMR on a library CSS file (proves `../src` in graph).
- Build: `dist/404.html` exists and equals index.html; demo chunks split (many small assets); shiki not in entry chunk; `--wsu-` tokens precede component rules in CSS.
- `pnpm -C docs-site preview` → click through, hard-refresh a deep link.
- Post-deploy: direct-load `https://your-job-search-genius.github.io/yjsg-ui/components/table`, assets 200, both themes, mobile.

## Risks (top ones)

- **Two React copies / RAC context breakage** → identical `^18.3.1` specs + `resolve.dedupe`; Select demo is the canary in Phase 3.
- **Private icons auth fails in CI** → loud failure at install; PAT fallback wired via `||`.
- **Eager `?raw` glob bloating entry** → both globs lazy; verify chunking in build output.
- **GH Pages deep links** → 404.html copy; if a proxy ever caches 404s badly, switching to HashRouter is a one-line change.
- **Library reset.css restyles chrome** → accept it; chrome uses `--docs-*`/`docs-` namespace, site.css imported last.
