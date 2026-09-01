# Design mode (admin / client / generic)

This library is used by two teams — **Admin** and **Client** — who sometimes want
different visual designs for the same component. `ThemeProvider` exposes a `mode` prop
for declaring which team's design a subtree should render, and any component that
implements a `designMode` prop can override that for a single instance.

This document describes the API and the pattern a component author follows when a
component actually gets a second design. It is not a mandate to retrofit every
component — see [Current status](#current-status) below.

## Root registration

```tsx
import { ThemeProvider } from "@your-job-search-genius/odyssey-ui";

function App() {
  return (
    <ThemeProvider theme={clientTheme} mode="client">
      <YourApp />
    </ThemeProvider>
  );
}
```

`mode` defaults to `"generic"` — mounting a `ThemeProvider` with no `mode` (or not
setting `mode` at all, since `ThemeProvider` itself is optional) preserves today's
behavior exactly, for every component, with no changes required.

Like `theme`, nesting a second `ThemeProvider` scopes a different `mode` to just that
subtree — and like `theme`, `mode` does **not** inherit from an outer `ThemeProvider`
when omitted on a nested one; it resets to `"generic"`.

## Per-instance override

Regardless of the ambient `mode`, an individual component instance can force its own
mode via a `designMode` prop, on any component that implements one — `Badge` is the
first:

```tsx
<Badge designMode="admin">…</Badge>
```

## Opt-in pattern for component authors

Once a component actually has more than one design to switch between, add mode support
by following the same convention already used for `variant`/`severity`/`type` props
(BEM-ish modifier class, driven by `--wsu-*` tokens). `Badge` (`src/components/Badge/Badge.tsx`)
is the reference implementation:

```tsx
import { useDesignMode } from "@your-job-search-genius/odyssey-ui";
import type { DesignMode } from "@your-job-search-genius/odyssey-ui";

export interface BadgeProps {
  // ...existing props
  /** Force a specific team's design for this instance, overriding the ambient ThemeProvider mode. */
  designMode?: DesignMode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { designMode, /* ...existing props */ },
  ref,
) {
  const resolvedMode = useDesignMode(designMode);
  const classes = ["wsu-Badge", `wsu-Badge--${type}`, `wsu-Badge--${severity}`, `wsu-Badge--${resolvedMode}`, className ?? ""]
    .filter(Boolean)
    .join(" ");
  // ...
});
```

Then add CSS only for the modifier(s) that actually have distinct styling, e.g.
`.wsu-Badge--admin { ... }` in `Badge.css`. No `.wsu-Badge--generic`/`.wsu-Badge--client`
block exists yet for `Badge` — both currently fall through to the unscoped styling
(today's one and only design), so the class is present on every render as a hook for a
future admin redesign, with zero visual effect until CSS actually targets it.

## Current status

**Badge** (`src/components/Badge/Badge.tsx`) implements `designMode` — `"generic"` and
`"client"` currently render identically (no distinct designs exist yet), and no
`"admin"` design exists either.

**Alice** (`src/components/Alice/`) is still Client-only with no `designMode` support —
it hardcodes one-off colors rather than drawing from shared semantic tokens, so
"generic" doesn't yet have a real design to fall back to there. Don't add a
`designMode` prop to it until that changes.

Every other component in this library is Generic-only (i.e. team-agnostic — the same
design serves every consumer) and doesn't implement `designMode`.

This status is reflected in the docs site's Generic/Client/Admin tabs, driven by the
`audiences` field in `docs-site/src/registry/registry.ts` — it's a cataloging concern,
independent of whether a component implements runtime `designMode` switching.
