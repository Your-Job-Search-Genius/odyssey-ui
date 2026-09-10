/**
 * Streamable HTTP entry points: for mounting inside a host app's own
 * `/api/mcp` route (apps/docs's playground, Phase 4). Same tool/
 * resource/prompt set as the stdio server via createServer() -- only the
 * transport differs.
 *
 * Two variants, because "Streamable HTTP" isn't one API surface:
 * - handleMcpWebRequest: Web Standard Request/Response (fetch API) --
 *   what Next.js App Router route handlers, Cloudflare Workers, Deno,
 *   and Bun all use. This is the one apps/docs's /api/mcp route calls.
 * - handleMcpNodeRequest: Node's IncomingMessage/ServerResponse -- for a
 *   raw Node HTTP server or an Express-style app, kept for completeness
 *   since it's a one-line difference in which SDK transport class gets
 *   constructed.
 *
 * Stateless mode (sessionIdGenerator: undefined) in both: each request
 * gets a fresh server+transport pair, matching how a serverless/edge
 * route handler is invoked (no long-lived process to hold session state
 * in-memory across requests without an external store).
 */
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { Registry } from "@your-job-search-genius/ds-registry";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer } from "./server.js";

export async function handleMcpWebRequest(registry: Registry, request: Request): Promise<Response> {
    const server = createServer(registry);
    const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    // Deliberately not closing `server`/`transport` here: handleRequest's
    // returned Response can carry a still-streaming SSE body, and the
    // SDK's own documented Cloudflare Workers usage (this class's doc
    // comment) returns the Response directly with no explicit close
    // either. Each request gets its own fresh pair in stateless mode, so
    // there is no cross-request state to worry about leaking.
    return transport.handleRequest(request);
}

export async function handleMcpNodeRequest(registry: Registry, req: IncomingMessage, res: ServerResponse, parsedBody?: unknown): Promise<void> {
    const server = createServer(registry);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => {
        transport.close();
        server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, parsedBody);
}
