# @your-job-search-genius/ds-mcp

MCP server exposing the Writesea Odyssey component library (via
`@your-job-search-genius/ds-registry`) to Claude Code, Cursor, and the
docs site's AI playground, plus the `validate_jsx` enforcement mechanism
that makes the constraints real rather than just prompted.

## Install (in a consuming repo)

```bash
npx @your-job-search-genius/ds-mcp init
```

This writes/updates, all idempotently:

- `.mcp.json` (Claude Code) and `.cursor/mcp.json` (Cursor) -- adds a
  `writesea-ds` entry running `npx -y @your-job-search-genius/ds-mcp`
  over stdio. Existing entries for other servers are preserved.
- A marked block in `CLAUDE.md` (created if it doesn't exist) with the
  tool-call workflow and the current rules, verbatim from the registry.
- `.cursor/rules/writesea-ds.mdc`, the same content in Cursor's rules
  format.

Restart the editor / reload MCP servers afterward.

## Connecting from Claude and ChatGPT

The package is published to **GitHub Packages**, which requires auth
even for reads. One-time setup on any machine that will run the server:

```ini
# ~/.npmrc
@your-job-search-genius:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<a GitHub token with read:packages>
```

**Claude Code** (per-project `.mcp.json`, or run `npx
@your-job-search-genius/ds-mcp init` to have it written for you):

```bash
claude mcp add writesea-ds -- npx -y @your-job-search-genius/ds-mcp
```

**Claude Desktop** (`claude_desktop_config.json` > `mcpServers`):

```json
{
    "mcpServers": {
        "writesea-ds": {
            "command": "npx",
            "args": ["-y", "@your-job-search-genius/ds-mcp"]
        }
    }
}
```

**Claude web (claude.ai) and ChatGPT**: both only connect to _remote_
MCP servers over HTTPS (claude.ai: Settings > Connectors > Add custom
connector; ChatGPT: Settings > Apps & Connectors > Developer mode >
Create), so they need a deployed URL, not a local stdio process -- see
"Deploying the HTTP server" below. Note the GitHub Pages deployment of
the docs site is a static export and **cannot** serve `/api/mcp`.

## Deploying the HTTP server

`ds-mcp serve` runs the same server over Streamable HTTP on a plain
Node HTTP listener -- `PORT` (default 3002) and `HOST` (default
0.0.0.0) env vars, MCP endpoint at `/mcp` (and `/`), liveness probe at
`/healthz`, graceful SIGTERM shutdown. Three ways to get it on a public
HTTPS URL:

1. **Any Node host / PaaS** (Railway, Render, Fly, a VPS): start
   command `npx -y @your-job-search-genius/ds-mcp serve`. The platform
   needs the GitHub Packages `.npmrc` auth (above) available at install
   time -- on most PaaS that's an `NPM_CONFIG_//npm.pkg.github.com/:_authToken`-style
   env var or a checked-in `.npmrc` that references `${NODE_AUTH_TOKEN}`.
2. **Docker**: `packages/ds-mcp/Dockerfile` builds a self-contained
   image (BuildKit secret keeps the registry token out of layers):

    ```bash
    docker build --secret id=npmrc,src=$HOME/.npmrc -t writesea-ds-mcp packages/ds-mcp
    docker run -p 3002:3002 writesea-ds-mcp
    ```

3. **Rancher / Kubernetes** (the YJSG production path): the repo ships
   `Dockerfile.ds-mcp` (source-built image, no registry auth needed),
   `helm-charts/ds-mcp` (probes on `/healthz`, DigitalOcean
   LoadBalancer with a named SSL certificate), and
   `.github/workflows/deploy-mcp.yml`, which builds, pushes to Docker
   Hub, and helm-upgrades the release -- same conventions as
   yjsg-client-app's deploy pipeline. Required GitHub secrets are
   listed at the top of that workflow.

4. **Local + tunnel** (quick demos only): `ds-mcp serve` plus
   `ngrok http 3002` / `cloudflared tunnel --url http://localhost:3002`;
   the tunnel URL changes on every restart.

Alternatively, deploying `apps/docs` to a Node host serves the same
thing at `/api/mcp` alongside the docs site.

The server is unauthenticated by design -- it exposes only read-only
registry data (components, tokens, icons, validation). Put a reverse
proxy with auth in front if that ever changes.

## Tools

| Tool                  | Purpose                                                                         |
| --------------------- | ------------------------------------------------------------------------------- |
| `get_rules`           | Hard constraints, as markdown. Call first.                                      |
| `list_components`     | Cheap listing, optional category/query filter.                                  |
| `get_component`       | Full entry for one component (props, slots, examples, doNot, a11y).             |
| `search_components`   | Natural-language intent -> ranked matches. Keyword-based, no LLM.               |
| `get_tokens`          | Design tokens, optionally scoped to one group.                                  |
| `search_icons`        | Icon lookup. Returns `{ found: false, suggestions }` rather than inventing one. |
| `validate_jsx`        | The enforcement mechanism -- see below. Call last.                              |
| `suggest_composition` | Rule-based recipe for a natural-language intent.                                |
| `get_example`         | Curated example code for one component.                                         |

Also exposes `ds://registry`, `ds://rules`, `ds://tokens`, and
`ds://component/<name>` as MCP resources, and a `build-ui` prompt that
walks an agent through the intended tool sequence.

## `validate_jsx`

The actual enforcement: parses the given TSX with the TypeScript
compiler API (not a second parser stack -- this codebase already uses
`typescript` for AST work) and checks, in one pass:

- Every JSX tag is either an approved primitive (`div`, `span`, `p`,
  `h1`-`h6`) or a real registry component, imported from the right path.
- Every required prop is present; enum props have a valid value.
- Props marked `acceptsIcon` are only given something imported from the
  icon set.
- Compound nesting (`allowedParents` / `allowedChildren`) is respected.
- Every `className` string is either token-backed (per
  `tokens.allowedTailwindPatterns`) or flagged -- arbitrary values
  (`bg-[#fff]`) are always rejected outright.
- No `style={{...}}`, no `dangerouslySetInnerHTML`, no `<style>` tag, no
  CSS imports.
- Warns (non-blocking) on icon-only buttons with no `aria-label`,
  heading levels that skip a step, and divs nested more than 6 deep.

With `strict: false`, attempts a conservative auto-fix: only renaming a
forbidden primitive to its 1:1 replacement tag (e.g. `input` ->
`Input`), leaving a `// TODO` marker for the import you still need to
add. It does not try to rewrite props or fabricate imports -- see
"Known gaps" below.

Exported standalone from `@your-job-search-genius/ds-mcp/validator` so
it can be reused outside an MCP context (a future ESLint rule, a CI
check) without pulling in the MCP SDK.

## Transports

- **stdio** (`src/cli/bin.ts`, the package's `bin`): for Claude Code /
  Cursor via `npx`.
- **Streamable HTTP** (`src/http.ts`, `handleMcpHttpRequest`): stateless,
  for mounting inside `apps/docs`'s `/api/mcp` route (Phase 4). A fresh
  server + transport per request -- there is no long-lived process to
  hold session state across requests without an external store.

Both share the exact same tool/resource/prompt set via `createServer()`.

## Registry freshness and hot reload

Bundles `@your-job-search-genius/ds-registry`'s `dist/registry.json` at
publish time. Set `DS_REGISTRY_URL` to fetch a newer one at startup
instead -- falls back to the bundled copy if the fetch or schema
validation fails, so a bad URL never crashes the server. Also warns
(does not fail) on startup if the consuming repo's installed
`@your-job-search-genius/odyssey-ui` version differs from the version
the registry was built from.

The stdio server also **hot reloads**: when `DS_REGISTRY_URL` is set,
it polls that URL every `DS_REGISTRY_REFRESH_MS` (default 5 minutes)
and swaps in the fresh registry without a restart -- useful since an
editor stays connected to the same stdio process for the whole
session. A failed poll (network error, bad schema) is logged to stderr
and the server keeps serving its last-known-good registry; it never
goes stale-to-broken. Built on `RegistryHolder` (see
`src/registry-holder.ts`), which `createServer()` accepts in place of a
plain `Registry` -- every tool/resource reads through
`registryHolder.get()` at call time, not a value captured once at
startup. The Streamable HTTP handlers (`handleMcpWebRequest` /
`handleMcpNodeRequest`) don't need this themselves -- they build a
fresh server from whatever registry the caller passes in on every
request, so "freshness" there is the caller's concern (e.g. how often
`apps/docs`'s own registry loading refreshes), not something baked into
those two functions.

## Known gaps (tracked, not silent)

- `validate_jsx`'s auto-fix (`strict: false`) only handles the
  forbidden-primitive-rename case. Arbitrary-value className violations
  and unknown components are reported but never auto-fixed -- guessing
  a replacement wrong would be worse than not guessing.
- Required-prop checking is skipped entirely on an element that uses a
  JSX spread attribute (`{...props}`), since a statically-unknown spread
  makes "is this prop actually present" unreliable to determine from
  source alone.
- Dynamic `className` expressions (`cx(...)`, template literals,
  ternaries) are not statically analyzed -- only string literals are
  checked against the token patterns.
- The ESLint plugin mentioned in the original plan (Section 4.5) now
  exists -- see `packages/eslint-plugin-ds`, which wraps this exact
  `validateJsx()` export (no separate validation logic).
