import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRefreshableRegistryHolder, createStaticRegistryHolder, startRegistryAutoRefresh, toRegistryHolder } from "../src/registry-holder.js";

const registry = loadRegistry();

describe("createStaticRegistryHolder", () => {
    it("always returns the same registry it was created with", () => {
        const holder = createStaticRegistryHolder(registry);
        expect(holder.get()).toBe(registry);
        expect(holder.get()).toBe(registry);
    });
});

describe("createRefreshableRegistryHolder", () => {
    it("returns the initial registry until set() is called", () => {
        const holder = createRefreshableRegistryHolder(registry);
        expect(holder.get()).toBe(registry);
    });

    it("returns the new registry after set()", () => {
        const holder = createRefreshableRegistryHolder(registry);
        const fresh: Registry = { ...registry, version: "9.9.9" };
        holder.set(fresh);
        expect(holder.get()).toBe(fresh);
        expect(holder.get().version).toBe("9.9.9");
    });
});

describe("toRegistryHolder", () => {
    it("wraps a plain Registry in a static holder", () => {
        const holder = toRegistryHolder(registry);
        expect(holder.get()).toBe(registry);
    });

    it("passes an already-a-holder through unchanged", () => {
        const original = createRefreshableRegistryHolder(registry);
        expect(toRegistryHolder(original)).toBe(original);
    });
});

describe("startRegistryAutoRefresh", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("updates the holder on a successful poll", async () => {
        const holder = createRefreshableRegistryHolder(registry);
        const fresh: Registry = { ...registry, version: "2.0.0" };
        const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => fresh });
        const onRefreshed = vi.fn();

        const stop = startRegistryAutoRefresh(holder, { url: "https://example.com/registry.json", intervalMs: 1000, fetchImpl, onRefreshed });

        await vi.advanceTimersByTimeAsync(1000);
        expect(holder.get().version).toBe("2.0.0");
        expect(onRefreshed).toHaveBeenCalledWith(expect.objectContaining({ version: "2.0.0" }));

        stop();
    });

    it("keeps the last-known-good registry and reports an error when the fetch fails", async () => {
        const holder = createRefreshableRegistryHolder(registry);
        const fetchImpl = vi.fn().mockRejectedValue(new Error("network down"));
        const onError = vi.fn();

        const stop = startRegistryAutoRefresh(holder, { url: "https://example.com/registry.json", intervalMs: 1000, fetchImpl, onError });

        await vi.advanceTimersByTimeAsync(1000);
        expect(holder.get()).toBe(registry); // unchanged
        expect(onError).toHaveBeenCalledTimes(1);

        stop();
    });

    it("keeps the last-known-good registry and reports an error on a non-ok HTTP response", async () => {
        const holder = createRefreshableRegistryHolder(registry);
        const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
        const onError = vi.fn();

        const stop = startRegistryAutoRefresh(holder, { url: "https://example.com/registry.json", intervalMs: 1000, fetchImpl, onError });

        await vi.advanceTimersByTimeAsync(1000);
        expect(holder.get()).toBe(registry);
        expect(onError).toHaveBeenCalledTimes(1);

        stop();
    });

    it("keeps the last-known-good registry and reports an error when the payload fails schema validation", async () => {
        const holder = createRefreshableRegistryHolder(registry);
        const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ not: "a valid registry" }) });
        const onError = vi.fn();

        const stop = startRegistryAutoRefresh(holder, { url: "https://example.com/registry.json", intervalMs: 1000, fetchImpl, onError });

        await vi.advanceTimersByTimeAsync(1000);
        expect(holder.get()).toBe(registry);
        expect(onError).toHaveBeenCalledTimes(1);

        stop();
    });

    it("polls repeatedly on the given interval", async () => {
        const holder = createRefreshableRegistryHolder(registry);
        const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => registry });

        const stop = startRegistryAutoRefresh(holder, { url: "https://example.com/registry.json", intervalMs: 1000, fetchImpl });

        await vi.advanceTimersByTimeAsync(3500);
        expect(fetchImpl).toHaveBeenCalledTimes(3);

        stop();
    });

    it("stops polling once the returned stop function is called", async () => {
        const holder = createRefreshableRegistryHolder(registry);
        const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => registry });

        const stop = startRegistryAutoRefresh(holder, { url: "https://example.com/registry.json", intervalMs: 1000, fetchImpl });
        await vi.advanceTimersByTimeAsync(1000);
        expect(fetchImpl).toHaveBeenCalledTimes(1);

        stop();
        await vi.advanceTimersByTimeAsync(5000);
        expect(fetchImpl).toHaveBeenCalledTimes(1); // no further calls after stop()
    });
});
