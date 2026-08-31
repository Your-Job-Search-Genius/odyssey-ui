import {
  Virtualizer as AriaVirtualizer,
  ListLayout,
  GridLayout,
  WaterfallLayout,
  TableLayout,
} from "react-aria-components/Virtualizer";
import type {
  VirtualizerProps as AriaVirtualizerProps,
  ListLayoutOptions,
  GridLayoutOptions,
  WaterfallLayoutOptions,
  TableLayoutProps,
} from "react-aria-components/Virtualizer";

export type VirtualizerProps<O> = AriaVirtualizerProps<O>;
export type { ListLayoutOptions, GridLayoutOptions, WaterfallLayoutOptions, TableLayoutProps };
export { ListLayout, GridLayout, WaterfallLayout, TableLayout };

/**
 * Virtualizer — built on `react-aria-components`' `Virtualizer`: a
 * behavior-only wrapper with no visual style or DOM chrome of its own (like
 * `Group`, but without even a container element — it renders only its child
 * collection, positioned by a `Layout` object instead of CSS flexbox/grid).
 * Not in the source Figma file (design-inventory.md §2.14 pattern). It
 * composes with, rather than replaces, the collection components already in
 * this library — `ListBox` under `ListLayout`, `GridList` under `GridLayout`
 * or `WaterfallLayout` (`layout="grid"` either way), `Table` under
 * `TableLayout` — swapping only how a large collection's items are
 * positioned and windowed to the viewport, so a 5,000-row list costs the
 * same DOM size as a 50-row one. The wrapped collection still needs an
 * explicit scrollable size (`style={{height, overflow: 'auto'}}` or
 * equivalent) — `Virtualizer` windows what's rendered, it doesn't size the
 * viewport. `shouldObserveItemSize` is the one opt-in escape hatch for rows
 * whose height isn't knowable up front (e.g. an expandable row), at the
 * cost of a `ResizeObserver` per item.
 */
export function Virtualizer<O>(props: VirtualizerProps<O>) {
  return <AriaVirtualizer {...props} />;
}
