import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/**
 * Both maps are lazy: each demo module (and its raw source) becomes its own
 * chunk, loaded only when the demo is shown. Keys are relative to this file,
 * e.g. "./button/variants.tsx".
 */
const demoModules = import.meta.glob<{ default: ComponentType }>("./*/*.tsx");
const demoSources = import.meta.glob<string>("./*/*.tsx", {
  query: "?raw",
  import: "default",
});

const demoKey = (slug: string, demoId: string) => `./${slug}/${demoId}.tsx`;

// Memoized: creating a fresh React.lazy per render would remount the demo
// (and retrigger Suspense) on every parent re-render.
const lazyCache = new Map<string, LazyExoticComponent<ComponentType>>();

export function getDemoComponent(
  slug: string,
  demoId: string,
): LazyExoticComponent<ComponentType> | null {
  const key = demoKey(slug, demoId);
  const load = demoModules[key];
  if (!load) return null;
  let cached = lazyCache.get(key);
  if (!cached) {
    cached = lazy(load as () => Promise<{ default: ComponentType }>);
    lazyCache.set(key, cached);
  }
  return cached;
}

export function getDemoSource(slug: string, demoId: string): Promise<string> {
  const load = demoSources[demoKey(slug, demoId)];
  return load
    ? load()
    : Promise.reject(new Error(`No source for ${slug}/${demoId}`));
}

/** Dev-only: warn when the registry and the demo files drift apart. */
export const demoFileKeys: ReadonlySet<string> = new Set(
  Object.keys(demoModules),
);
