# @your-job-search-genius/ds-registry

Machine-readable registry of the Writesea Odyssey component library:
components, design tokens, icons, and composition rules -- extracted from
`packages/ui` and consumed by `@your-job-search-genius/ds-mcp` and the
docs site's AI playground. This is the single source of truth those
consumers read from; nothing about the library's shape is hand-duplicated
into either of them.

## What it does

```
packages/ui source
      |
      v
  extractors (src/extract/*.ts)
      |
      v
  dist/registry.json  (+ dist/tokens.json, dist/icons.json)
```

- **Components** -- walks `packages/ui/components/<category>/<group>/<file>.tsx`
  (the same convention documented in the root `CONTRIBUTING.md` and
  already used by `apps/docs/scripts/sync-content.ts`), runs
  `react-docgen-typescript` once in a single batched pass, and layers any
  colocated `<file>.meta.ts` override on top. The `internal` category
  (Storybook-only decorators) and icon-set barrels (`icons`,
  `payment-icons`, `integration-icons`, `social-icons`) are excluded --
  they are not UI components an agent should build with.
- **Tokens** -- parses `packages/ui/styles/theme.css`'s `@theme { ... }`
  block and `.dark-mode { ... }` override block with a real CSS parser
  (`postcss`), then enriches every semantic color class's `usage`
  description straight out of the root `CLAUDE.md`'s own "Text Color" /
  "Border Color" / "Foreground Color" / "Background Color" tables --
  parsed at build time, not re-transcribed by hand, so the two can never
  drift.
- **Icons** -- parses `packages/ui/components/foundations/icons/index.ts`'s
  barrel export list. Scope note: the payment/social/integration/file
  icon sets are separate, more specialized asset barrels (brand marks,
  file-type glyphs), not general-purpose swappable UI icons, and are not
  included here.
- **Rules** -- hand-authored in `src/extract/rules.ts`, not extracted. It
  encodes the plan's hard constraints (approved primitives, forbidden
  elements, style rules, composition rules) as data, so `get_rules`
  (ds-mcp) and the docs `/agent-rules` page render the exact same text.

## `<component>.meta.ts` overrides

Any extracted component can be curated by adding a sibling file, e.g.
`packages/ui/components/base/buttons/button.tsx` ->
`packages/ui/components/base/buttons/button.meta.ts`, exporting:

```ts
export const componentMeta = {
    description: "...",
    allowedChildren: "text",
    doNot: ["..."],
    examples: [{ title: "Basic", code: "..." }],
    // ...any other ComponentMetaOverride field
};
```

`id`, `name`, `importName`, `importPath`, `props`, and `isExtracted` can
never be overridden this way -- they are facts about the source file, not
curation. The override is validated against `ComponentMetaOverrideSchema`
at build time (`registry:build` fails loudly on a malformed override, it
does not silently ignore it). See `button.meta.ts` (simple, icon-accepting),
`select.meta.ts` (compound parent), and `select-item.meta.ts` (compound
child, accessed as `Select.Item`) for worked examples.

Meta files are deliberately untyped (no import from this package) so that
`packages/ui` does not gain a dependency on `packages/registry` -- the
Zod schema at build time is the real enforcement.

## Usage

```bash
pnpm run registry:build   # regenerate dist/registry.json from packages/ui
pnpm --filter @your-job-search-genius/ds-registry run test
```

```ts
import { findComponent, loadRegistry } from "@your-job-search-genius/ds-registry";

const registry = loadRegistry();
const button = findComponent(registry, "base/buttons/button");
```

## Drift protection

`dist/registry.json` (and its `tokens.json` / `icons.json` siblings) are
committed to git, not gitignored -- CI (`.github/workflows/ci.yml`)
rebuilds the registry on every push and fails if the rebuilt output
differs from what's checked in. The registry can never silently fall out
of sync with the library it describes.

## Known gaps (tracked, not silent)

- `slots` on `ComponentEntry` is always `[]` today -- slot-shaped props
  (e.g. a `footer` render-prop) are not yet distinguished from ordinary
  props. Deferred to a follow-up pass.
- `variants` is only populated where a `.meta.ts` override sets it by
  hand (see `button.meta.ts`); it is not yet derived automatically from
  a component's `sortCx` style object.
- Illustrations and background patterns (`shared-assets/illustrations`,
  `shared-assets/background-patterns`) are extracted as ordinary
  components today, the same as any other `shared-assets` group -- they
  are real JSX components, just not yet curated with `.meta.ts` files.
