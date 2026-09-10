/**
 * Public API for @your-job-search-genius/ds-registry. The default (no
 * options) path is a *static* import of dist/registry.json -- not a
 * runtime fs read from a computed path. That matters beyond style: a
 * runtime `path.join(import.meta.dirname, ...)` + fs.readFileSync
 * resolves fine under plain Node/tsx, but breaks under Next.js/Turbopack
 * (import.meta.dirname is undefined there) and makes bundlers trace and
 * inline the entire project defensively. A static JSON import is just
 * another module dependency to every one of those tools -- Node, tsx,
 * Vitest, and Next/Turbopack all resolve it identically at bundle time,
 * with nothing to fail at request time.
 *
 * `dist/registry.json` must exist before this module is compiled (see
 * this package's `build` script: `tsx src/build.ts` runs before `tsc`,
 * not after) -- ds-mcp, the docs agent-rules page, and the playground
 * only ever import the compiled output, so this ordering is invisible to
 * them.
 */
import fs from "node:fs";
import bundledRegistry from "../dist/registry.json" with { type: "json" };
import { RegistrySchema } from "./schema.js";
import type { Registry } from "./schema.js";

export * from "./schema.js";

export interface LoadRegistryOptions {
    /** Load a registry from elsewhere instead of this package's own bundled dist/registry.json -- e.g. a DS_REGISTRY_URL-fetched copy. Uses a runtime fs read, so prefer this only outside bundled/edge runtimes (ds-mcp's Node CLI, not the docs site). */
    registryPath?: string;
}

let cachedDefault: Registry | undefined;

export function loadRegistry(options: LoadRegistryOptions = {}): Registry {
    if (!options.registryPath) {
        if (!cachedDefault) cachedDefault = RegistrySchema.parse(bundledRegistry);
        return cachedDefault;
    }

    if (!fs.existsSync(options.registryPath)) {
        throw new Error(`Registry not found at ${options.registryPath}.`);
    }
    const raw = JSON.parse(fs.readFileSync(options.registryPath, "utf8"));
    const parsed = RegistrySchema.safeParse(raw);
    if (!parsed.success) {
        throw new Error(`Registry at ${options.registryPath} failed schema validation: ${parsed.error.message}`);
    }
    return parsed.data;
}

export function findComponent(registry: Registry, id: string) {
    return registry.components.find((c) => c.id === id || c.name === id || c.importName === id);
}

export function findIcon(registry: Registry, name: string) {
    return registry.icons.find((i) => i.name.toLowerCase() === name.toLowerCase());
}
