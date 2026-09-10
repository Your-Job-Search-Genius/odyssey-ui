# @your-job-search-genius/ui-tree

The playground's model never writes raw JSX -- it only ever emits a JSON
tree from this package's schema, which is validated against the
registry, rendered, and turned into a `.tsx` file. This is what makes
the plan's hard constraints (Section 1) unbypassable by construction
instead of by convention: there is no code path from "agent intent" to
"rendered UI" that does not pass through `validateTree`.

```
TreeOp[]  --applyOps-->  UITree  --validateTree-->  ok?
                             |
              +--------------+--------------+
              |                             |
        renderTree()                  treeToTsx()
        (live preview)              (.tsx to copy/download)
```

## Modules

- **`schema.ts`** -- `UITree` / `UINode` (`component` | `primitive` |
  `text` | `icon`) / `PropValue`, as Zod schemas. A `PropValue` of type
  `"node"` is how a slot prop (e.g. a render-prop, or an icon passed as a
  JSX element rather than a bare reference) points at another node in
  the same tree by id.
- **`ops.ts`** -- `TreeOp` (`insert` / `remove` / `replace` / `setProp` /
  `setClasses` / `move` / `wrap` / `setText`) and `applyOps(tree, ops)`.
  Pure and atomic: a batch with any structural problem (a reference to a
  node that doesn't exist, wrapping with a non-container, moving a node
  into its own subtree, ...) returns the _original_ tree untouched, plus
  the errors -- never a partially-applied tree.
- **`validate.ts`** -- `validateTree(tree, registry)`. Checks tree shape
  (single root, no cycles, no orphans, no node with two parents) and
  every registry rule (component exists, required props present, enum
  values valid, `allowedParents` / `allowedChildren` respected,
  className is token-backed, icons exist). Run this after every
  `applyOps()` call; reject the ops as a batch if it fails, exactly like
  `ops.ts`'s own atomicity.
- **`render.tsx`** -- `renderTree(tree, { componentMap, iconMap })`.
  Takes a component/icon map built from the _real_
  `@your-job-search-genius/odyssey-ui` exports (this package
  deliberately does not import `packages/ui` itself -- see "Why no
  direct dependency on packages/ui" below). A compound name like
  `"Select.Item"` resolves via the real compound-component runtime shape
  (`Select.Item = SelectItem`), not a pre-flattened map key. Every
  rendered node carries `data-node-id` for click-to-select in a host
  page.
- **`codegen.ts`** -- `treeToTsx(tree, registry, options?)`. Produces a
  single `.tsx` file: deduplicated imports (compound children import via
  their root component's real path, not their own file), props in
  registry declaration order, sorted classNames, long text (>80 chars)
  extracted to a top-level const, formatted with the repo's own Prettier
  config. **Deterministic** -- the same tree always produces
  byte-identical output (see `codegen.test.ts`'s determinism tests) and
  never touches `Date.now()` / `Math.random()`.

## The round-trip contract

`codegen.test.ts` round-trips every fixture through
`@your-job-search-genius/ds-mcp`'s real `validateJsx()`, not a mock of
it. If `treeToTsx` ever produces something the validator rejects, that
is a codegen bug -- the entire reason to build UI through this tree
instead of raw JSX is that generated code is correct by construction.

## Why no direct dependency on `packages/ui`

`render.tsx` takes `componentMap` / `iconMap` as parameters rather than
importing `@/components/...` itself, so this package stays agnostic to
_which_ build of the library it's rendering against -- today that's
`apps/docs`'s live source tree (via its existing `@/` alias), but the
same renderer would work unchanged against a published package later if
that ever becomes necessary. The test suite builds a real componentMap
via a Vite alias (see `vitest.config.ts`) so `render.test.tsx` still
exercises actual `packages/ui` components, not stand-ins.

## Known gaps (tracked, not silent)

- `render.test.tsx`'s Select.Item test only asserts the trigger renders
  without throwing -- React Aria Components only mounts the listbox
  (and therefore `Select.Item`) once open, and simulating that
  interaction is deferred to Phase 4's playground end-to-end tests,
  where a real browser-driven test is the right tool for it.
- `codegen.ts`'s long-text extraction only fires for plain text values;
  it does not attempt to detect or extract long string prop values the
  same way.
- There is no `unwrap` op (the inverse of `wrap`) yet -- removing a
  wrapper today means `remove` on the wrapper plus re-inserting its
  children, in two ops rather than one.
