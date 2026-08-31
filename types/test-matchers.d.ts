/// <reference types="@testing-library/jest-dom" />

// vitest-axe@0.1.0 ships its type augmentation against a newer `Vi.Assertion`
// global-namespace convention that our pinned vitest@2 doesn't use (vitest 2
// augments the `vitest` module's `Assertion` interface directly, the same
// way @testing-library/jest-dom/vitest.d.ts above does) — so its bundled
// `vitest-axe/extend-expect` types don't actually attach. Re-declared here
// against the interface vitest@2 really exposes.
import "vitest";
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  interface Assertion<T = any> extends AxeMatchers {}
}
