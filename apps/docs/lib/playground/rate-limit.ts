/**
 * A basic per-session sliding-window rate limiter for the chat endpoint
 * (design system plan, Section 8 "M6 Hardening"). Sessions are
 * anonymous (this project's decision), so sessionId -- not an
 * authenticated user id -- is the natural rate-limit key: it already
 * identifies "one canvas, one conversation" the same way a user id
 * would.
 *
 * Known limitation, not silent: this is in-memory, per Node process.
 * It resets on redeploy/restart and does not coordinate across multiple
 * server instances behind a load balancer. That's an acceptable
 * starting point for abuse prevention on a single instance; a real
 * multi-instance deployment would need a shared store (Redis, or
 * MongoDB itself, since it's already a dependency here) instead.
 */
export interface RateLimitResult {
    allowed: boolean;
    /** Only set when allowed is false. */
    retryAfterMs?: number;
}

export interface RateLimiter {
    check(key: string): RateLimitResult;
}

export interface CreateRateLimiterOptions {
    maxRequests: number;
    windowMs: number;
    /** Injectable for deterministic tests -- defaults to the real clock. */
    now?: () => number;
}

export function createInMemoryRateLimiter({ maxRequests, windowMs, now = Date.now }: CreateRateLimiterOptions): RateLimiter {
    const hitsByKey = new Map<string, number[]>();

    return {
        check(key: string): RateLimitResult {
            const current = now();
            const recent = (hitsByKey.get(key) ?? []).filter((t) => current - t < windowMs);

            if (recent.length >= maxRequests) {
                const oldest = recent[0] ?? current;
                hitsByKey.set(key, recent);
                return { allowed: false, retryAfterMs: Math.max(0, windowMs - (current - oldest)) };
            }

            recent.push(current);
            hitsByKey.set(key, recent);
            return { allowed: true };
        },
    };
}

/** One shared limiter for the whole process, matching db.ts's own module-level singleton pattern. 20 messages/minute per session -- generous for real use, tight enough to blunt a naive hammering loop. */
let sharedChatLimiter: RateLimiter | undefined;
export function getChatRateLimiter(): RateLimiter {
    if (!sharedChatLimiter) sharedChatLimiter = createInMemoryRateLimiter({ maxRequests: 20, windowMs: 60_000 });
    return sharedChatLimiter;
}

/** Test-only: drops the shared limiter's state. Never called from application code. */
export function resetChatRateLimiterForTests() {
    sharedChatLimiter = undefined;
}
