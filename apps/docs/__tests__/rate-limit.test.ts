import { describe, expect, it } from "vitest";
import { createInMemoryRateLimiter } from "../lib/playground/rate-limit.js";

describe("createInMemoryRateLimiter", () => {
    it("allows requests up to maxRequests within the window", () => {
        let now = 0;
        const limiter = createInMemoryRateLimiter({ maxRequests: 3, windowMs: 1000, now: () => now });
        expect(limiter.check("a").allowed).toBe(true);
        expect(limiter.check("a").allowed).toBe(true);
        expect(limiter.check("a").allowed).toBe(true);
    });

    it("rejects the request that exceeds maxRequests within the window", () => {
        let now = 0;
        const limiter = createInMemoryRateLimiter({ maxRequests: 2, windowMs: 1000, now: () => now });
        limiter.check("a");
        limiter.check("a");
        const result = limiter.check("a");
        expect(result.allowed).toBe(false);
        expect(result.retryAfterMs).toBeGreaterThan(0);
    });

    it("allows again once the oldest hit falls outside the window", () => {
        let now = 0;
        const limiter = createInMemoryRateLimiter({ maxRequests: 2, windowMs: 1000, now: () => now });
        limiter.check("a"); // t=0
        now = 500;
        limiter.check("a"); // t=500
        now = 999;
        expect(limiter.check("a").allowed).toBe(false); // both hits still within the 1000ms window
        now = 1001; // the t=0 hit is now outside the window
        expect(limiter.check("a").allowed).toBe(true);
    });

    it("tracks separate keys independently", () => {
        let now = 0;
        const limiter = createInMemoryRateLimiter({ maxRequests: 1, windowMs: 1000, now: () => now });
        expect(limiter.check("a").allowed).toBe(true);
        expect(limiter.check("b").allowed).toBe(true); // different key, own budget
        expect(limiter.check("a").allowed).toBe(false); // "a" is now exhausted
    });

    it("defaults to the real clock when now is not provided", () => {
        const limiter = createInMemoryRateLimiter({ maxRequests: 1, windowMs: 60_000 });
        expect(limiter.check("a").allowed).toBe(true);
        expect(limiter.check("a").allowed).toBe(false);
    });
});
