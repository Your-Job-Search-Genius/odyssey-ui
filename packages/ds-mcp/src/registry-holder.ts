/**
 * Registry hot reload (design system plan, Section 8 "M6 Hardening").
 * Without this, a long-running stdio server (Claude Code / Cursor stay
 * connected for the whole editor session) would only ever see the
 * registry snapshot it started with, even when DS_REGISTRY_URL points
 * at something that changes -- the only way to pick up a fresher
 * registry would be restarting the MCP connection.
 *
 * A RegistryHolder is the level of indirection that makes this
 * possible: tools call holder.get() at invocation time instead of
 * closing over a fixed Registry value at registration time.
 */
import { RegistrySchema } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";

export interface RegistryHolder {
    get(): Registry;
}

export function createStaticRegistryHolder(registry: Registry): RegistryHolder {
    return { get: () => registry };
}

export interface RefreshableRegistryHolder extends RegistryHolder {
    set(registry: Registry): void;
}

export function createRefreshableRegistryHolder(initial: Registry): RefreshableRegistryHolder {
    let current = initial;
    return {
        get: () => current,
        set: (registry: Registry) => {
            current = registry;
        },
    };
}

function isRegistryHolder(value: Registry | RegistryHolder): value is RegistryHolder {
    return typeof (value as Partial<RegistryHolder>).get === "function";
}

/** Normalizes either a plain Registry (wrapped in a holder that always returns the same value) or an already-a-holder into a RegistryHolder -- the one thing every tool/resource callback reads through. */
export function toRegistryHolder(registryOrHolder: Registry | RegistryHolder): RegistryHolder {
    return isRegistryHolder(registryOrHolder) ? registryOrHolder : createStaticRegistryHolder(registryOrHolder);
}

export interface AutoRefreshOptions {
    url: string;
    intervalMs: number;
    onRefreshed?: (registry: Registry) => void;
    onError?: (error: unknown) => void;
    /** Injectable for tests -- defaults to the real fetch. */
    fetchImpl?: typeof fetch;
}

/**
 * Polls `url` on an interval, validates the response against
 * RegistrySchema, and updates `holder` on success. A failed fetch or an
 * invalid payload is reported via onError and otherwise ignored -- the
 * holder keeps serving its last-known-good registry rather than ever
 * going stale-to-broken. Returns a stop function; the interval is also
 * unref'd so it never keeps a stdio process alive on its own.
 */
export function startRegistryAutoRefresh(holder: RefreshableRegistryHolder, options: AutoRefreshOptions): () => void {
    const doFetch = options.fetchImpl ?? fetch;

    const timer = setInterval(() => {
        void (async () => {
            try {
                const response = await doFetch(options.url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const raw = await response.json();
                const parsed = RegistrySchema.safeParse(raw);
                if (!parsed.success) throw new Error(`schema validation failed: ${parsed.error.message}`);
                holder.set(parsed.data);
                options.onRefreshed?.(parsed.data);
            } catch (error) {
                options.onError?.(error);
            }
        })();
    }, options.intervalMs);

    timer.unref?.();
    return () => clearInterval(timer);
}
