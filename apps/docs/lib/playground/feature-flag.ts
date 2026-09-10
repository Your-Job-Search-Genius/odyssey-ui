/**
 * Kill switch for the AI playground (pages under app/playground and the
 * /api/playground/* routes). Disabled by default: the playground only
 * runs when the server is started with PLAYGROUND_ENABLED=true, so a
 * plain deploy exposes nothing -- no sessions, no model calls, no
 * MongoDB access. The docs component demos (lib/playgrounds,
 * components/component-playground.tsx) are a separate feature and are
 * NOT affected by this flag.
 *
 * Note this is deliberately a server-only env var (not NEXT_PUBLIC_*):
 * every gated entry point is a server route or server component, and
 * keeping it server-only means the flag can be flipped per-deployment
 * without a rebuild.
 */
export function isPlaygroundEnabled(): boolean {
    return process.env.PLAYGROUND_ENABLED === "true";
}

/** The uniform 404 JSON response every /api/playground/* handler returns while the playground is disabled. */
export function playgroundDisabledResponse(): Response {
    return new Response(JSON.stringify({ error: "The playground is currently disabled." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
    });
}
