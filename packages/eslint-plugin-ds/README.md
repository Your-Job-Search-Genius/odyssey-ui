# @your-job-search-genius/eslint-plugin-ds

The design system plan's Section 4.5, item 2: an ESLint plugin wrapping
`@your-job-search-genius/ds-mcp`'s `validate_jsx`, so a design-system
violation fails lint and CI even when an agent ignored the MCP server
entirely (or a human wrote the offending code by hand). No validation
logic lives in this package -- it is a thin adapter from
`ValidationIssue[]` to ESLint's `report()` shape, so this rule and the
`validate_jsx` MCP tool can never disagree about what counts as a
violation.

## Install

```js
// eslint.config.mjs
import ds from "@your-job-search-genius/eslint-plugin-ds";

export default [
    // ...your existing config...
    {
        files: ["playground-exports/**/*.tsx"], // scope this to agent-generated output, not your whole app -- see below
        ...ds.configs.recommended,
    },
];
```

Or register the rule manually for more control:

```js
import ds from "@your-job-search-genius/eslint-plugin-ds";

export default [
    {
        files: ["playground-exports/**/*.tsx"],
        plugins: { ds },
        rules: { "ds/validate-jsx": ["error", { strict: true }] },
    },
];
```

## Scope this to generated output, not your whole codebase

Almost any ordinary React file -- importing from `react`, using hooks,
rendering a component outside this library -- will fail this rule by
design, since that is exactly the constraint `validate_jsx` exists to
enforce (see the plan's Section 1: generated UI may only contain
approved library components, the allowed HTML primitives, and
token-backed classes). Point `files` at wherever agent-generated
`.tsx` actually lands (e.g. playground exports checked into the repo,
or a CI step that writes generated output to a temp directory before
linting it), not at an existing application's source tree.

## Options

- `strict` (boolean, default `true`) -- forwarded to `validate_jsx`'s
  own `strict` option. This plugin only ever surfaces the resulting
  `errors`, never `validate_jsx`'s optional `fixedCode` -- there's no
  ESLint `--fix` support here (the auto-fix, where it exists at all, is
  narrow and best applied deliberately, not blindly on every save; see
  `@your-job-search-genius/ds-mcp`'s own README's "Known gaps").

## Known gaps (tracked, not silent)

- No autofix (`--fix`) support, for the reason above.
- One rule, one shot per file: validates the whole file's source text
  in a single `validate_jsx` call rather than reporting through
  ESLint's own JSX AST node-by-node. This matches how `validate_jsx`
  already works (it parses a whole snippet, not a single element), so
  there's nothing to reconcile between the two -- but it does mean this
  rule can't be selectively disabled per-JSX-element the way a
  node-level rule could (only per-file, via a normal ESLint disable
  comment).
